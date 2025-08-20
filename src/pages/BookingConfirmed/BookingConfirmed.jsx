// src/pages/CheckOut/BookingConfirmed.jsx
import styled from 'styled-components';
import Container_NoGradient from '../../components/Container_NoGradient';
import Header from '../../components/Header';
import FooterSection from '../Login/subcomponents/FooterSection';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import OrderDetail from './subComponents/orderDetail';
import { toast } from 'react-hot-toast'; // ✅ react-hot-toast named export

// ————— Styled Components —————
const TopBar = styled.div`
  width: 100%;
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
    color: inherit;
    text-decoration: none;
    margin: 0 0.5rem;
  }
`;

const LeftColumnCards = styled.div`
  display: flex;
  flex-direction: row;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.cardColor};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  justify-content: space-between;
  margin: 10px 0;

  h2 {
    color: #40a600;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const Container = styled.section`
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px 100px 0 100px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
`;

// ————— Helpers —————
// Robust parser for HashRouter URLs that may contain multiple '?'
function getSearchParams(location) {
  const hash = typeof window !== 'undefined' ? window.location.hash || '' : '';
  if (hash.includes('?')) {
    // "#/confirmed?booking=422...?tracker=..." -> "booking=422...&tracker=..."
    const qs = hash.split('?').slice(1).join('&');
    return new URLSearchParams(qs);
  }
  // Fallback if you're ever on BrowserRouter
  const search = location?.search || '';
  const cleaned = search.startsWith('?') ? search.slice(1) : search;
  const normalized = cleaned.replace(/\?/g, '&'); // normalize stray '?'
  return new URLSearchParams(normalized);
}

export default function BookingConfirmed() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = useMemo(() => getSearchParams(location), [location]);
  const bookingParam = params.get('booking')?.trim() || null;
  // const tracker = params.get('tracker'); // optional analytics

  const grandTotal =
    (() => {
      try {
        const raw = localStorage.getItem('grandTotal');
        return raw ? JSON.parse(raw) : 0;
      } catch {
        return 0;
      }
    })() || 0;

  const bookingConfirmationCode = useMemo(() => {
    const raw = localStorage.getItem('bookingConfirmationCode');
    if (!raw) return null;
    try {
      return JSON.parse(raw); // if stored as JSON (e.g., "42244896")
    } catch {
      return raw; // if stored as plain string
    }
  }, []);

  const [cart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [bookingData] = useState(() => {
    try {
      const raw = localStorage.getItem('booking data'); // your existing key (with space)
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // StrictMode-safe: dedupe toast + dev-only "run once" guard
  const INVALID_LINK_TOAST_ID = 'invalid-link';
  const ranOnceRef = useRef(false);

  useEffect(() => {
    // Dev-only: prevent double-run caused by React.StrictMode intentionally re-mounting
    if (import.meta?.env?.MODE !== 'production') {
      if (ranOnceRef.current) return;
      ranOnceRef.current = true;
    }

    const matches =
      bookingParam &&
      bookingConfirmationCode &&
      String(bookingParam) === String(bookingConfirmationCode);

    if (!matches) {
      toast.error('Invalid or expired confirmation link.', {
        id: INVALID_LINK_TOAST_ID, // prevents duplicate toasts
      });
      navigate('/', { replace: true });
      return;
    }

    // Single-use: remove the token immediately so refresh won't show again
    localStorage.removeItem('bookingConfirmationCode');

    // Warn on refresh/close
    const onBeforeUnload = (e) => {
      e.preventDefault();
      // Most browsers ignore custom text but this triggers the dialog
      e.returnValue =
        'This confirmation page is single-use. Your booking is already recorded.';
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [bookingParam, bookingConfirmationCode, navigate]);

  return (
    <>
      <Container>
        <Header />
      </Container>

      <Container_NoGradient>
        <TopBar>
          <Breadcrumb>
            <Link to="/">Main Page</Link> &gt;
            <span> Booking Confirmed</span>
          </Breadcrumb>
        </TopBar>

        <>
          <LeftColumnCards>
            <h2>Booking Confirmed!</h2>
            {/* Show confirmed reference from bookingData if present, else fall back to URL param */}
            <h2>
              Reference No: {bookingData?.confirmationCode ?? bookingParam}
            </h2>
          </LeftColumnCards>

          <div style={{ height: 'auto', overflowY: 'auto' }}>
            <OrderDetail cart={cart} grandTotal={grandTotal} isCheckOut />
          </div>
        </>
      </Container_NoGradient>

      <FooterSection />
    </>
  );
}
