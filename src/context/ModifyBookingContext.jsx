import { useState, createContext, useContext } from 'react';

const ModifyBookingContext = createContext();

export const ModifyBookingProvider = ({ children }) => {
  const [loginToken, setLoginToken] = useState('');

  const loginWithToken = (token) => {
    localStorage.setItem('token', token);
    setLoginToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setLoginToken('');
  };

  return (
    <ModifyBookingContext.Provider
      value={{
        loginToken,
        setLoginToken,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </ModifyBookingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModifyBooking = () => useContext(ModifyBookingContext);
