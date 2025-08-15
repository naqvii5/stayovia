// src/routes/AppRoutes.jsx
import React from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeProvider'; // ← your custom provider
import { GlobalStyles } from '../theme/GlobalStyle';
import { Toaster } from 'react-hot-toast';
import { createGlobalStyle } from 'styled-components';
import { AppProviders } from '../context/AppContext';
import ScrollToTop from '../utils/scrollToTop';

// pages…
import FilterPage from '../pages/FilterPage/FilterPage';
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage';
import HotelDetails from '../pages/HotelDetails/HotelDetails';
import CheckOut from '../pages/CheckOut/CheckOut';
import BookingConfirmed from '../pages/BookingConfirmed/BookingConfirmed';
import BookingFailed from '../pages/BookingFailed/BookingFailed';
import LoadingPageScreen from '../pages/LoadingPageScreen';
import NotFoundPage from '../pages/NotFoundPage';
import { ModifyBooking } from '../pages/ModifyBooking/ModifyBooking';

// style the internal progress bar
const GlobalToastStyles = createGlobalStyle`
  .custom-toast {
    /* text in white */
    color: #fff !important;

    /* existing rules */
    padding: 8px 16px !important;
    border-radius: 20px !important;
    background: rgba(255, 255, 255, 0.25) !important;
    backdrop-filter: saturate(180%) blur(10px) !important;
    -webkit-backdrop-filter: saturate(180%) blur(10px) !important;
    box-shadow: 0 8px 16px ${({ theme }) =>
      theme.colors.secondary}33 !important;
  }

  /* progress-bar stays primary-colored */
  .custom-toast .rht-toastprogressbar {
    background: ${({ theme }) => theme.colors.primary} !important;
  }
`;

function AppInner() {
  // const theme = useTheme(); // now reads from your custom ThemeProvider
  return (
    <>
      <GlobalStyles />
      <GlobalToastStyles />

      <AppProviders>
        <ScrollToTop />

        <Toaster
          position="top-center"
          toastOptions={{ className: 'custom-toast' }}
        />

        <Routes>
          <Route path="/" element={<FilterPage />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
          <Route path="/hotel-details" element={<HotelDetails />} />
          <Route path="/check-out" element={<CheckOut />} />
          <Route path="/confirmed" element={<BookingConfirmed />} />
          <Route path="/failed" element={<BookingFailed />} />
          <Route path="/view-bookings" element={<ModifyBooking />} />
          <Route path="/load" element={<LoadingPageScreen />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppProviders>
    </>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </Router>
  );
}
