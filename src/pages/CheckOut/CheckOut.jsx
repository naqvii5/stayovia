// src/pages/CheckOut/CheckOut.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MyButton } from '../../components/MyButton';
import Container_NoGradient from '../../components/Container_NoGradient';
import Header from '../../components/Header';
import FooterSection from '../Login/subcomponents/FooterSection';
import RightColumnSection from '../HotelDetails/subcomponents/RightColumnSection';
// import { useTheme } from 'styled-components';
import { useHotelSearch } from '../../context/HotelSearchContext';
import { createBooking } from '../../api/createBooking';
import toast from 'react-hot-toast';
import GuestForm from './subComponents/GuestForm';

// ————— Validation Schemas —————
const bookingSchema = z.object({
  title: z.enum(['Mr', 'Ms', 'Mrs'], { message: 'Please select a title' }),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  DOB: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), { message: 'Enter a valid date' }),
});

const multiBookingSchema = z.object({
  applyAll: z.boolean(),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  guests: z.array(bookingSchema).min(1, 'At least one guest is required'),
});

// ————— Component —————
export default function CheckOut() {
  // const styledTheme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { grandTotal, grandTotalWithBuyersGroup } = useHotelSearch();

  useEffect(() => {
    // If someone didn’t legitimately come from HotelDetails, bounce to /search
    if (!location.state?.cameFromHotelDetails) {
      navigate('/search', { replace: true });
    }
  }, [location.state, navigate]);

  const [cart] = useState(() => {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  });
  const [cartDetails] = useState(() => {
    const raw = localStorage.getItem('cartDetails');
    return raw ? JSON.parse(raw) : [];
  });
  const [bookingData] = useState(() => {
    const raw = localStorage.getItem('payload');
    return raw ? JSON.parse(raw) : [];
  });
  // const [grandTotal] = useState(
  //   Number(localStorage.getItem("grandTotal") || 0)
  // );
  // const { filteringData } = useHotelSearch();
  const numberOfGuests = bookingData.totalGuests;
  // console.log("bookingData", bookingData);

  const {
    // register,
    control,
    // handleSubmit,
    watch,
    setValue,
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
  } = useForm({
    resolver: zodResolver(multiBookingSchema),
    defaultValues: {
      applyAll: false,
      email: '',
      phone: '',
      country: '',
      guests: Array(numberOfGuests).fill({
        title: '',
        firstName: '',
        lastName: '',
        DOB: '',
      }),
    },
  });

  const { fields } = useFieldArray({ control, name: 'guests' });
  const applyAll = watch('applyAll');
  const guests = watch('guests');

  // copy first guest into all others when applyAll is toggled
  useEffect(() => {
    if (applyAll) {
      fields.slice(1).forEach((_, idx) => {
        setValue(`guests.${idx + 1}`, guests[0]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyAll, guests[0], fields, setValue]);

  // — inside CheckOut.jsx
  const submitForm = ({ firstName, lastName, email, phone, paymentMethod }) => {
    const payload = {
      accommodationId: bookingData.AccommodationId,
      checkIn: bookingData.CheckIn,
      checkOut: bookingData.CheckOut,

      // ⬇️ Use GuestForm data in required keys
      FirstName: firstName?.trim(),
      LastName: lastName?.trim(),
      Email: email?.trim(),
      PhoneNo: phone,

      country: 'pakistan',
      bookingSource: 'bedandbeds',
      grandTotal,
      grandTotalWithBuyersGroup,
      rooms: cart,

      // extra context you were already sending
      buyerGroupId: cartDetails?.buyerGroupId ?? null,
      marginApplied: cartDetails?.marginApplied ?? false,
      isRefundable: cartDetails?.isRefundable ?? null,
      cancellationDeadline: cartDetails?.cancellationDeadline ?? null,

      paymentMethod: paymentMethod ?? 'credits',
    };

    createBookingAPI(payload);
  };

  const createBookingAPI = (payload) => {
    // 1) validate
    if (
      !payload.FirstName ||
      !payload.LastName ||
      !payload.Email ||
      !payload.PhoneNo
    ) {
      toast.error('Please fill in First Name, Last Name, Email, and Phone.', {
        style: { fontSize: '1.25rem', padding: '16px 24px' },
      });
      return;
    }

    const toastId = toast.loading('Confirming....!', {
      style: { fontSize: '1.25rem', padding: '16px 24px' },
    });

    createBooking(payload)
      .then((response) => {
        localStorage.setItem('booking data', JSON.stringify(response));
        localStorage.setItem('grandTotal', JSON.stringify(grandTotal));
        toast.dismiss(toastId);
        // eslint-disable-next-line no-unused-vars
        const { status, message, paymentUrl, bookingPin, confirmationCode } =
          response;

        if (status) {
          localStorage.setItem(
            'bookingConfirmationCode',
            JSON.stringify(confirmationCode)
          );
          if (paymentUrl) {
            // Optional tiny toast so users know what's happening
            toast.success('Redirecting to secure payment…', {
              style: { fontSize: '1.1rem', padding: '12px 18px' },
              autoClose: 1200,
            });
            console.log('response', response);
            // Same-tab redirect to the gateway
            window.location.assign(paymentUrl);
            return; // stop here
          }
        } else {
          toast.error(response.message, {
            style: { fontSize: '1.25rem', padding: '16px 24px' },
          });
        }
      })
      .catch((err) => {
        console.error('Search API failed:', err);
        toast.dismiss(toastId);
        toast.error('Error', {
          style: { fontSize: '1.25rem', padding: '16px 24px' },
        });
      });
  };

  return (
    <>
      <Container>
        <Header />
      </Container>
      <Container_NoGradient>
        <TopBar>
          <Breadcrumb>
            <Link to="/">Main Page</Link> &gt;
            <Link to=""> Search</Link> &gt;
            <Link to=""> Checkout</Link>
          </Breadcrumb>
        </TopBar>

        <ContentArea>
          <LeftColumn>
            <GuestForm
              numberOfGuests={numberOfGuests}
              submitForm={submitForm}
            />
          </LeftColumn>

          <RightColumnSection
            cart={cart}
            grandTotal={grandTotal}
            grandTotalWithBuyersGroup={grandTotalWithBuyersGroup}
            isCheckOut={true}
          />
        </ContentArea>
      </Container_NoGradient>
      <FooterSection />
    </>
  );
}

// ————— Styled Components —————
const Container = styled.section`
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px 100px 0 100px;
  background: ${({ theme }) => theme.colors.primary};
  // background: linear-gradient(
  //   to top,
  //   ${({ theme }) => theme.colors.primary} 0%,
  //   ${({ theme }) => theme.colors.secondary} 100%
  // );
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
`;
const TopBar = styled.div`
  width: max-content;
  background: ${({ theme }) => theme.colors.primary};
  padding: 1rem 2rem;
  border-radius: 0.8rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.primary};
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;
const Breadcrumb = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.colors.whiteText};
  a {
    text-decoration: none;
    margin: 0 0.5rem;
  }
`;
const ContentArea = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;
const LeftColumn = styled.main`
  flex: 0 0 80%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1 1 100%;
  }
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
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const GuestRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.mainBackground};
  border-radius: 1rem;
  padding: 2rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.cardColor2};
  width: 100%;
  border-bottom: 3px solid ${({ theme }) => theme.colors.cardColor2};
`;
const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.base};
  input {
    width: auto;
    margin: 0;
  }
`;
const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
  font-size: ${({ theme }) => theme.fontSizes.base};
`;
const sharedInputStyles = `
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.secondaryText};
  border-radius: 0.8rem;
  background: ${({ theme }) => theme.colors.mainBackground};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.small};
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const Input = styled.input`
  ${sharedInputStyles} width: 100%;
`;
const Select = styled.select`
  ${sharedInputStyles} width: 100%;
`;
const Error = styled.small`
  color: ${({ theme }) => theme.colors.error || 'red'};
  font-size: 0.85rem;
`;
