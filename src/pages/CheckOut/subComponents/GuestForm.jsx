import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { MyButton } from "../../../components/MyButton";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTheme } from "styled-components";
import { usePermissions } from "../../../context/PermissionsContext";

function GuestForm({ numberOfGuests, submitForm }) {
    const theme = useTheme();
    const { permissions, hasPermission } = usePermissions();

    const [paymentMethod, setPaymentMethod] = useState("credits");

    // ————— Validation Schemas —————
    const bookingSchema = z.object({
        title: z.enum(["Mr", "Ms", "Mrs"], { message: "Please select a title" }),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        // DOB: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Enter a valid date" }),
    });

    const multiBookingSchema = z.object({
        applyAll: z.boolean(),
        email: z.string().email("Enter a valid email"),
        phone: z.string().min(1, "Phone number is required"),
        guests: z.array(bookingSchema).min(1, "At least one guest is required"),
    });

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(multiBookingSchema),
        defaultValues: {
            applyAll: false,
            email: "",
            phone: "",
            guests: Array(numberOfGuests).fill({ title: "", firstName: "", lastName: "", DOB: "" }),
        },
    });

    const { fields } = useFieldArray({ control, name: "guests" });
    const applyAll = watch("applyAll");
    const guests = watch("guests");

    useEffect(() => {
        if (applyAll) {
            fields.slice(1).forEach((_, idx) => {
                setValue(`guests.${idx + 1}`, guests[0]);
            });
        }
    }, [applyAll, guests[0], fields, setValue]);

    return (
        <Form onSubmit={handleSubmit((data) => submitForm({ ...data, paymentMethod }))}>
            <LeftColumnCards>
                <h2>Guest Contact</h2>

                <Row>
                    <Field>
                        <h4>Email</h4>
                        <Input type="email" {...register("email")} />
                        {errors.email && <Error>{errors.email.message}</Error>}
                    </Field>

                    <Controller
                        name="phone"
                        control={control}
                        rules={{ required: "Phone number is required" }}
                        render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <div style={{ width: "50%" }}>
                                <h3>Phone</h3>
                                <PhoneInput
                                    country="pk"
                                    value={value}
                                    onChange={onChange}
                                    inputProps={{
                                        name: "phone",
                                        required: true,
                                    }}
                                    inputStyle={{
                                        width: "100%",
                                        backgroundColor: theme.colors.mainBackground,
                                        color: theme.colors.primaryText,
                                        border: `2px solid ${theme.colors.cardColor2}`,
                                    }}
                                    dropdownStyle={{
                                        backgroundColor: theme.colors.mainBackground,
                                        color: theme.colors.primaryText,
                                        border: `2px solid ${theme.colors.cardColor2}`,
                                    }}
                                    buttonStyle={{
                                        backgroundColor: theme.colors.mainBackground,
                                        border:
                                            theme.mode === "light"
                                                ? `2px solid ${theme.colors.cardColor2}`
                                                : `2px solid ${theme.colors.cardColor}`,
                                    }}
                                    searchStyle={{
                                        backgroundColor: theme.colors.mainBackground,
                                        color: theme.colors.primaryText,
                                        border:
                                            theme.mode === "light"
                                                ? `2px solid ${theme.colors.cardColor2}`
                                                : `2px solid ${theme.colors.cardColor}`,
                                    }}
                                />
                                {error && <Error>{error.message}</Error>}
                            </div>
                        )}
                    />
                </Row>
            </LeftColumnCards>

            <LeftColumnCards>
                <h2>Guest Information</h2>

                <CheckboxWrapper>
                    <input type="checkbox" id="applyAll" {...register("applyAll")} />
                    <label htmlFor="applyAll">Same details for all guests</label>
                </CheckboxWrapper>

                <GuestsWrapper guestCount={fields.length}>
                    {fields.map((field, idx) => (
                        <GuestRow key={field.id}>
                            <Field>
                                <div>
                                    <h2>Guest {idx + 1}</h2>
                                </div>
                                <h3>Title</h3>
                                <Select {...register(`guests.${idx}.title`)}>
                                    <option value="">Select…</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Ms">Ms</option>
                                    <option value="Mrs">Mrs</option>
                                </Select>
                                {errors.guests?.[idx]?.title && <Error>{errors.guests[idx].title.message}</Error>}
                            </Field>

                            <Field>
                                <h3>First Name</h3>
                                <Input type="text" {...register(`guests.${idx}.firstName`)} />
                                {errors.guests?.[idx]?.firstName && <Error>{errors.guests[idx].firstName.message}</Error>}
                            </Field>

                            <Field>
                                <h3>Last Name</h3>
                                <Input type="text" {...register(`guests.${idx}.lastName`)} />
                                {errors.guests?.[idx]?.lastName && <Error>{errors.guests[idx].lastName.message}</Error>}
                            </Field>

                            <Field>
                                <h3>Date of Birth</h3>
                                <Input type="date" {...register(`guests.${idx}.DOB`)} />
                                {errors.guests?.[idx]?.DOB && <Error>{errors.guests[idx].DOB.message}</Error>}
                            </Field>
                        </GuestRow>
                    ))}
                </GuestsWrapper>
            </LeftColumnCards>

            {/* Payment Method Toggle */}
            <ToggleWrapper>
                <ToggleButton
                    type="button"
                    isActive={paymentMethod === "card"}
                    onClick={() => setPaymentMethod("card")}
                >
                    Card
                </ToggleButton>
                <ToggleButton
                    type="button"
                    isActive={paymentMethod === "credits"}
                    onClick={() => setPaymentMethod("credits")}
                >
                    Credit
                </ToggleButton>
            </ToggleWrapper>

            {
                paymentMethod == 'card' ? (

                    <MyButton
                        type="submit"
                        bgColor={({ theme }) => theme.colors.primary}
                        fontSize={({ theme }) => theme.fontSizes.xsmall}
                        padding="10px"
                        borderRadius="10px"
                        width="100%"
                        disabled={!hasPermission("booking.create")}
                    >
                        {hasPermission("booking.create") ? "Proceed to Confirmation" : "You do not have permission to book"}
                    </MyButton>
                ) : (
                    <MyButton
                        type="submit"
                        bgColor={({ theme }) => theme.colors.primary}
                        fontSize={({ theme }) => theme.fontSizes.xsmall}
                        padding="10px"
                        borderRadius="10px"
                        width="100%"
                        disabled={!hasPermission("booking.create")}
                    >
                        {hasPermission("booking.create") ? "Proceed to Confirmation" : "You do not have permission to book"}
                    </MyButton>)

            }
        </Form>
    );
}

export default GuestForm;

// ————— styled-components —————

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const LeftColumnCards = styled.div`
  padding: 2rem;
  background: ${({ theme }) => theme.colors.cardColor};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;

  & > label {
    flex: 1;
  }
`;

const GuestsWrapper = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: ${({ guestCount }) => (guestCount === 1 ? "1fr" : "repeat(2, 1fr)")};
`;

const GuestRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.mainBackground};
  border-radius: 1rem;
  padding: 2rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.cardColor2};
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;

  ${({ fullWidth }) => fullWidth && `width: 100%;`}
`;

const sharedInputStyles = css`
  padding: 0.5rem;
  border: 2px solid ${({ theme }) => (theme.mode === "light" ? theme.colors.cardColor2 : theme.colors.cardColor)};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.mainBackground};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.base};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Input = styled.input`
  ${sharedInputStyles}
  width: 100%;
`;

const Select = styled.select`
  ${sharedInputStyles}
  width: 100%;
`;

const Error = styled.small`
  color: ${({ theme }) => theme.colors.error || "red"};
  font-size: 0.85rem;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  input {
    width: auto;
    margin-right: 0.5rem;
  }
`;
const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.cardColor2};
  padding: 0.25rem;
  border-radius: 999px;
  margin: 1rem auto;
  width: fit-content;
`;

const ToggleButton = styled.button`
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 999px;
  background-color: ${({ isActive, theme }) =>
        isActive ? theme.colors.primary : "transparent"};
  color: ${({ isActive, theme }) =>
        isActive ? "#fff" : theme.colors.primaryText};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ isActive, theme }) =>
        isActive ? theme.colors.primary : theme.colors.cardColor};
  }
`;

