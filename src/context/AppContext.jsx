import { AuthProvider } from "./AuthContext";
import { HotelSearchProvider } from "./HotelSearchContext";
import { PermissionsProvider } from "./PermissionsContext";

export const AppProviders = ({ children }) => {
  return <HotelSearchProvider>
    <PermissionsProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </PermissionsProvider>
  </HotelSearchProvider>;
};