// LoginSection.jsx
import styled from 'styled-components';
import logoSrc from '../assets/StayoViaLogo.png';
import SwitchThemeBtn from './SwitchThemeBtn';
import {
  Link,
  useNavigate,
  // useNavigate
} from 'react-router-dom';
// import { clearAuthToken } from '../utils/authCookies';
// import { useAuthContext } from '../context/AuthContext';
// import toast from 'react-hot-toast';
// import { adminLogin } from '../api/adminLogin';
// import { logout } from '../api/logout';
// import SwitchThemeBtn from "../../../components/SwitchThemeBtn";

const Container = styled.section`
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px 100px 0 100px;
  background: ${({ theme }) => theme.colors.primary}
  // background: linear-gradient(
  //   to top,
  //   ${({ theme }) => theme.colors.primary} 0%
  //     ${({ theme }) => theme.colors.secondary} 100%
  // );
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
`;

const HeaderRow = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between; /* space between logo and nav */
  align-items: center;
  height: 60px; /* smaller overall height */
  margin-bottom: 1.5rem; /* reduce spacing below */
  padding: 0 1rem; /* small horizontal padding */
`;

const NavActions = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto; /* Keeps nav items to the right */
`;

const StyledLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  // color: ${({ theme }) => theme.colors.primaryHeadingRevert};
  color: #ffff;
  // background: ${({ theme }) => theme.colors.primary};
  // padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  &:hover {
    opacity: 0.9;
  }
`;

const Logo = styled.img`
  max-height: 40px; /* small logo */
  max-width: 120px;
  cursor: pointer;
`;

export default function Header() {
  // const { token, setToken } = useAuthContext();
  const navigate = useNavigate();

  // ——— onSubmit handler (using the commented logic from handleLogin) ———
  // const adminLoginFunc = async () => {
  //   // Show loading toast
  //   const toastId = toast.loading("Redirecting……", {
  //     style: { fontSize: "1.25rem", padding: "16px 24px" },
  //   });

  //   try {
  //     const data = await adminLogin();
  //     // console.log("results", data);

  //     toast.dismiss(toastId);

  //     if (data.status) {
  //       toast.success("Logged in successfully!", {
  //         style: { fontSize: "1.25rem", padding: "16px 24px" },
  //       });
  //       window.open(`${data.url}`, "_blank");

  //     } else {
  //       toast.error("Failed to login!", {
  //         style: { fontSize: "1.25rem", padding: "16px 24px" },
  //       });
  //     }
  //   } catch (err) {
  //     toast.dismiss(toastId);
  //     toast.error("Error!", {
  //       style: { fontSize: "1.25rem", padding: "16px 24px" },
  //     });
  //     console.error("Login error:", err);
  //   }
  // };

  // const logOutFunc = async () => {
  //   try {
  //     const data = await logout();
  //     if (data.status) {
  //       toast.success('Logged out successfully!', {
  //         style: { fontSize: '1.25rem', padding: '16px 24px' },
  //       });
  //       clearAuthToken(), setToken();
  //     } else {
  //       toast.error('Failed to logout!', {
  //         style: { fontSize: '1.25rem', padding: '16px 24px' },
  //       });
  //     }
  //   } catch (err) {
  //     // toast.dismiss(toastId);
  //     toast.error('Error!', {
  //       style: { fontSize: '1.25rem', padding: '16px 24px' },
  //     });
  //     console.error('Login error:', err);
  //   }
  // };
  return (
    // <Container>
    <HeaderRow>
      <Logo src={logoSrc} onClick={() => navigate('/')} alt="Logo" />
      <NavActions>
        <StyledLink to="view-bookings">Modify/Cancel Booking</StyledLink>
      </NavActions>
    </HeaderRow>

    // </Container>
  );
}
