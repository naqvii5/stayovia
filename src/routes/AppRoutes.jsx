// src/routes/AppRoutes.jsx
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeProvider';
import { GlobalStyles } from '../theme/GlobalStyle';
import { Toaster } from 'react-hot-toast';
import { AppProviders } from '../context/AppContext';

import LoginPage from '../pages/Login/LoginPage';
import FilterPage from '../pages/FilterPage/FilterPage';
import SearchResultsPage from '../pages/SearchResultsPage/SearchResultsPage';
import HotelDetails from '../pages/HotelDetails/HotelDetails';
import CheckOut from '../pages/CheckOut/CheckOut';
import BookingConfirmed from '../pages/BookingConfirmed/BookingConfirmed';
import BookingFailed from '../pages/BookingFailed/BookingFailed';
import LoadingPageScreen from '../pages/LoadingPageScreen';
import NotFoundPage from '../pages/NotFoundPage';
import ScrollToTop from '../utils/scrollToTop';
// import { useAuthContext } from "../context/AuthContext";

const AppRoutes = () => {
  // const { token } = useAuthContext();

  return (
    <Router>
      <ThemeProvider>
        <GlobalStyles />
        <Toaster position="top-center" reverseOrder={false} />
        <ScrollToTop />
        <Routes>
          <>
            <Route path="*" element={<Navigate to="/" replace />} />
            <Route path="/" element={<FilterPage />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/hotel-details/" element={<HotelDetails />} />
            <Route path="/check-out" element={<CheckOut />} />
            <Route path="/confirmed" element={<BookingConfirmed />} />
            <Route path="/failed" element={<BookingFailed />} />
            <Route path="/load" element={<LoadingPageScreen />} />
            <Route path="*" element={<NotFoundPage />} />
          </>
        </Routes>
      </ThemeProvider>
    </Router>
  );
};

export default AppRoutes;
