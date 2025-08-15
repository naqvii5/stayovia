import { AuthProvider } from './AuthContext';
import { HotelSearchProvider } from './HotelSearchContext';
import { ModifyBookingProvider } from './ModifyBookingContext';
import { PermissionsProvider } from './PermissionsContext';

export const AppProviders = ({ children }) => {
  return (
    <HotelSearchProvider>
      <PermissionsProvider>
        <AuthProvider>
          <ModifyBookingProvider>{children}</ModifyBookingProvider>
        </AuthProvider>
      </PermissionsProvider>
    </HotelSearchProvider>
  );
};
