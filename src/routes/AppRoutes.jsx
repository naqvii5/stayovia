// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "../theme/ThemeProvider";
import { GlobalStyles } from "../theme/GlobalStyle";
import { Toaster } from "react-hot-toast";
import { AppProviders } from "../context/AppContext";

import LoginPage from "../pages/Login/LoginPage";
import FilterPage from "../pages/FilterPage/FilterPage";
import SearchResultsPage from "../pages/SearchResultsPage/SearchResultsPage";
import HotelDetails from "../pages/HotelDetails/HotelDetails";
import CheckOut from "../pages/CheckOut/CheckOut";
import BookingConfirmed from "../pages/BookingConfirmed/BookingConfirmed";
import BookingFailed from "../pages/BookingFailed/BookingFailed";
import LoadingPageScreen from "../pages/LoadingPageScreen";
import NotFoundPage from "../pages/NotFoundPage";
import { useAuthContext } from "../context/AuthContext";
import { getAuthToken } from "../utils/authCookies";
import { useState } from "react";
import { useEffect } from "react";

const AppRoutes = () => {
  const { token } = useAuthContext();
  // const token = getAuthToken()

  // const [isTokenReloaded, setIsTokenReloaded] = useState(false);
  // const [token, setToken] = useState(getAuthToken())
  return (
    <BrowserRouter>
      <ThemeProvider>
        <GlobalStyles />
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {/** No token → only "/" is LoginPage; everything else → 404 **/}
          {/* {!token ? ( */}
          {/* <> */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
          {/* </> */}
          {/* ) : ( */}
          {/* / Token exists → "/" → redirect to "/search", and all protected routes / */}
          <>
            {/* <Route path="/" element={<LoginPage />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* <Route path="/" element={<Navigate to="/search" replace />} /> */}
            <Route path="/" element={<FilterPage />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/hotel-details/" element={<HotelDetails />} />
            <Route path="/check-out" element={<CheckOut />} />
            <Route path="/confirmed" element={<BookingConfirmed />} />
            <Route path="/failed" element={<BookingFailed />} />
            <Route path="load" element={<LoadingPageScreen />} />
            <Route path="*" element={<NotFoundPage />} />
          </>
          {/* )} */}
        </Routes>
      </ThemeProvider>
      {/* </AppProviders> */}
    </BrowserRouter>
  );
};

export default AppRoutes;
