import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MyButton } from '../../../components/MyButton';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useTheme } from 'styled-components';
import { usePermissions } from '../../../context/PermissionsContext';

function GuestForm({ numberOfGuests, submitForm }) {
  const theme = useTheme();
  const { permissions, hasPermission } = usePermissions();

  const [paymentMethod, setPaymentMethod] = useState('credits');
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    if (modalType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalType]);
  const getModalText = (type) => {
    switch (type) {
      case 'Terms & Conditions':
        return (
          <>
            <SectionTitle>Introduction</SectionTitle>
            <SectionText>
              Welcome to Stayovia, a trevel tech brand of Purple Technologies
              Pvt Ltd. By accessing or using our travel portal, you agree to
              comply with and be bound by these Terms and Conditions. Please
              review them carefully before making a booking.
            </SectionText>
            <SectionTitle>Definitions</SectionTitle>
            <BulletList>
              <li>
                <strong>Stayovia:</strong> The travel portal developed by Purple
                Technologies Pvt Ltd.
              </li>
              <li>
                <strong>Hotel:</strong> The accommodation provider using
                Stayovia for direct bookings.
              </li>
              <li>
                <strong>Guest:</strong>The person making a booking through
                Stayovia.
              </li>
            </BulletList>
            <SectionTitle>Booking Process</SectionTitle>
            <BulletList>
              <li>
                <strong>Availability and Pricing:</strong>
                All bookings are subject to availability and the hotel’s terms
                and conditions. Prices are subject to change without prior
                notice until a booking is confirmed.
              </li>
              <li>
                <strong>Confirmation: </strong> A booking is confirmed when you
                receive an email confirmation with a reservation voucher.
              </li>
              <li>
                <strong>Payment:</strong> Full payment or a deposit, as
                specified during the booking process, must be made to secure a
                reservation.
              </li>
            </BulletList>
            <SectionTitle>Cancellation and Refund</SectionTitle>
            <BulletList>
              <li>
                <strong>Refundable Rates:</strong>
                Bookings made under refundable rates can be canceled as per the
                hotel’s cancellation policy, and the applicable refund will be
                processed.
              </li>
              <li>
                <strong>Non-Refundable Rates: </strong> Bookings made under
                non-refundable rates cannot be canceled or refunded.
              </li>
              <li>
                <strong>No-Shows:</strong> Failure to arrive at the hotel on the
                scheduled check-in date will be treated as a no-show, and no
                refund will be issued.
              </li>
            </BulletList>

            <SectionTitle>Amendments</SectionTitle>
            <BulletList>
              <li>
                {/* <strong>Refundable Rates:</strong> */}
                Changes to bookings are subject to availability and the hotel’s
                amendment policies. Additional charges may apply.
              </li>
            </BulletList>
            <SectionTitle>Liability</SectionTitle>
            <BulletList>
              <li>
                {/* <strong>Refundable Rates:</strong> */}
                Purple Technologies Pvt Ltd is not responsible for any loss or
                damage incurred by the guest due to circumstances beyond our
                control, including but not limited to, natural disasters,
                strikes, or governmental actions.
              </li>
            </BulletList>
            <SectionTitle>Governing Law</SectionTitle>
            <BulletList>
              <li>
                {/* <strong>Refundable Rates:</strong> */}
                These terms and conditions are governed by the laws of Pakistan.
                Any disputes arising from these terms and conditions will be
                subject to the exclusive jurisdiction of the courts in Pakistan.
              </li>
            </BulletList>
          </>
        );

      default:
        return '';
    }
  };
  // ————— Validation Schemas —————
  const bookingSchema = z.object({
    title: z.enum(['Mr', 'Ms', 'Mrs'], { message: 'Please select a title' }),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),

    // DOB: z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Enter a valid date" }),
  });
  const multiBookingSchema = z.object({
    applyAll: z.boolean(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().min(1, 'Phone number is required'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the Terms & Conditions' }),
    }),
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
      acceptTerms: false,
      email: '',
      phone: '',
      // guests: Array(numberOfGuests).fill({
      // title: '',
      // firstName: '',
      // lastName: '',
      // DOB: '',
      // }),
    },
  });

  // const { fields } = useFieldArray({ control, name: 'guests' });
  // const applyAll = watch('applyAll');
  // const guests = watch('guests');

  // useEffect(() => {
  //   if (applyAll) {
  //     fields.slice(1).forEach((_, idx) => {
  //       setValue(`guests.${idx + 1}`, guests[0]);
  //     });
  //   }
  // }, [applyAll, guests[0], fields, setValue]);

  return (
    <Form
      onSubmit={handleSubmit((data) => submitForm({ ...data, paymentMethod }))}
    >
      <LeftColumnCards>
        <h2>Guest Contact</h2>

        <Row>
          <Field>
            <h4>First Name</h4>
            <Input type="input" {...register('firstName')} />
            {errors.firstName && <Error>{errors.firstName.message}</Error>}
            {/* {errors.email && <Error>{errors.email.message}</Error>} */}
          </Field>
          <Field>
            <h4>Last Name</h4>
            <Input type="input" {...register('lastName')} />
            {errors.lastName && <Error>{errors.lastName.message}</Error>}
            {/* {errors.email && <Error>{errors.email.message}</Error>} */}
          </Field>
        </Row>
        <Row>
          <Field>
            <h4>Email</h4>
            <Input type="email" {...register('email')} />
            {errors.email && <Error>{errors.email.message}</Error>}
          </Field>

          <Controller
            name="phone"
            control={control}
            rules={{ required: 'Phone number is required' }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <div style={{ width: '50%' }}>
                <h3>Phone</h3>
                <PhoneInput
                  country="pk"
                  value={value}
                  onChange={onChange}
                  inputProps={{
                    name: 'phone',
                    required: true,
                  }}
                  inputStyle={{
                    width: '100%',
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
                      theme.mode === 'light'
                        ? `2px solid ${theme.colors.cardColor2}`
                        : `2px solid ${theme.colors.cardColor}`,
                  }}
                  searchStyle={{
                    backgroundColor: theme.colors.mainBackground,
                    color: theme.colors.primaryText,
                    border:
                      theme.mode === 'light'
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

      {/* <LeftColumnCards>
        <h2>Guest Information</h2>

        <CheckboxWrapper>
          <input type="checkbox" id="applyAll" {...register('applyAll')} />
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
                {errors.guests?.[idx]?.title && (
                  <Error>{errors.guests[idx].title.message}</Error>
                )}
              </Field>

              <Field>
                <h3>First Name</h3>
                <Input type="text" {...register(`guests.${idx}.firstName`)} />
                {errors.guests?.[idx]?.firstName && (
                  <Error>{errors.guests[idx].firstName.message}</Error>
                )}
              </Field>

              <Field>
                <h3>Last Name</h3>
                <Input type="text" {...register(`guests.${idx}.lastName`)} />
                {errors.guests?.[idx]?.lastName && (
                  <Error>{errors.guests[idx].lastName.message}</Error>
                )}
              </Field>

              <Field>
                <h3>Date of Birth</h3>
                <Input type="date" {...register(`guests.${idx}.DOB`)} />
                {errors.guests?.[idx]?.DOB && (
                  <Error>{errors.guests[idx].DOB.message}</Error>
                )}
              </Field>
            </GuestRow>
          ))}
        </GuestsWrapper>
      </LeftColumnCards> */}
      <RowWrapper direction="column">
        {/* Terms link + Checkbox */}
        <ColumnWrapper>
          <LinkItem onClick={() => setModalType('Terms & Conditions')}>
            Terms & Conditions
          </LinkItem>

          <CheckboxWrapper style={{ margin: '0rem 0' }}>
            <input
              type="checkbox"
              id="acceptTerms"
              {...register('acceptTerms')}
            />
            <h3>
              {/* <label htmlFor="acceptTerms">I have read and accept</label>I have */}
              I have read and accept
              <LinkItem onClick={() => setModalType('Terms & Conditions')}>
                Terms & Conditions
              </LinkItem>
            </h3>
          </CheckboxWrapper>
          {errors.acceptTerms && <Error>{errors.acceptTerms.message}</Error>}
        </ColumnWrapper>
      </RowWrapper>
      {/* Payment Method Toggle */}
      {/* <ToggleWrapper>
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
            </ToggleWrapper> */}
      <RowWrapper>
        <MyButton
          type="submit"
          bgColor={({ theme }) => theme.colors.primary}
          // textColor={({ theme }) => theme.colors.primary}
          textColor="#FFFF"
          fontSize={({ theme }) => theme.fontSizes.xsmall}
          padding="10px"
          borderRadius="10px"
          width="100%"
          // disabled={!hasPermission('booking.create')}
        >
          Proceed to payment
        </MyButton>
      </RowWrapper>

      {/* {
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

            } */}

      {modalType && (
        <>
          <Backdrop onClick={() => setModalType(null)} />
          <Modal>
            <ModalHeading>
              {modalType.replace(/\b\w/g, (l) => l.toUpperCase())}
            </ModalHeading>
            <ModalContent>{getModalText(modalType)}</ModalContent>
          </Modal>
        </>
      )}
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
  padding: 5rem 2rem;
  background: ${({ theme }) => theme.colors.cardColor};
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);

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
  grid-template-columns: ${({ guestCount }) =>
    guestCount === 1 ? '1fr' : 'repeat(2, 1fr)'};
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
  border: 2px solid
    ${({ theme }) =>
      theme.mode === 'light'
        ? theme.colors.cardColor2
        : theme.colors.cardColor};
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
  color: ${({ theme }) => theme.colors.error || 'red'};
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
// const ToggleWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   background-color: ${({ theme }) => theme.colors.cardColor2};
//   padding: 0.25rem;
//   border-radius: 999px;
//   margin: 1rem auto;
//   width: fit-content;
// `;

const ToggleButton = styled.button`
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 999px;
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : 'transparent'};
  color: ${({ isActive, theme }) =>
    isActive ? '#fff' : theme.colors.primaryText};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ isActive, theme }) =>
      isActive ? theme.colors.primary : theme.colors.cardColor};
  }
`;

// Wrapper Row
const RowWrapper = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

// Button container (50%)
const ButtonWrapper = styled.div`
  width: 50%;
`;

// Toggle container (30%)
const ToggleWrapper = styled.div`
  width: 30%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

// Toggle Text
const ToggleText = styled.span`
  font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
`;
const ToggleTextGrey = styled.span`
  font-weight: 500;
  color: gray;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

// Switch Styles
const SwitchWrapper = styled.div`
  position: relative;
  width: 48px;
  height: 26px;
`;

const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;

  &::before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    transform: ${({ checked }) =>
      checked ? 'translateX(22px)' : 'translateX(0)'};
  }

  ${SwitchInput}:checked + & {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const LinkItem = styled.a`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  margin-left: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

const Modal = styled.div`
  position: fixed;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);

  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.cardColor};
  color: ${({ theme }) => theme.colors.primaryText};
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  padding: 2rem;
  border-radius: 16px;
  z-index: 999;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transform: translate(-50%, -20%);
  animation: fadeInModal 0.3s ease forwards;

  @keyframes fadeInModal {
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 998;
`;

const ModalHeading = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  margin-bottom: 1rem;
`;

const ModalContent = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.5;
  white-space: pre-line;
`;
// at top of file, alongside your other styled components
const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin: 1rem 0 0.5rem;
`;

const SectionText = styled.p`
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.5;
  margin: 0.5rem 0;
`;

const BulletList = styled.ul`
  margin: 0.5rem 0 1rem 1.5rem;
  list-style: disc;
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  li {
    margin-bottom: 0.25rem;
  }
`;

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;
