// LoginSection.jsx
import styled from "styled-components";
import logoSrc from "../assets/StayoViaLogo.png";
import SwitchThemeBtn from "./SwitchThemeBtn";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthToken } from "../utils/authCookies";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { adminLogin } from "../api/adminLogin";
import { logout } from "../api/logout";
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
  position: relative; /* So logo can be absolutely positioned inside */
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  height: 10px; /* Keep your header small and fixed */
  margin-bottom: 3rem;
  overflow: visible;
`;

const NavActions = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  // color: ${({ theme }) => theme.colors.primaryHeadingRevert};
  color: #FFFF;
  // background: ${({ theme }) => theme.colors.primary};
  // padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  &:hover {
    opacity: 0.9;
  }
`;
const Logo = styled.img`
  height: 140px; /* Large logo */
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%); /* Vertically center within the small header */
  z-index: 1;
  pointer-events: auto;
  cursor: pointer;
`;



export default function Header() {
  const { token, setToken } = useAuthContext()
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

  const logOutFunc = async () => {

    try {
      const data = await logout();
      if (data.status) {
        toast.success("Logged out successfully!", {
          style: { fontSize: "1.25rem", padding: "16px 24px" },
        });
        clearAuthToken(),
          setToken()

      } else {
        toast.error("Failed to logout!", {
          style: { fontSize: "1.25rem", padding: "16px 24px" },
        });
      }
    } catch (err) {
      // toast.dismiss(toastId);
      toast.error("Error!", {
        style: { fontSize: "1.25rem", padding: "16px 24px" },
      });
      console.error("Login error:", err);
    }
  };
  return (
    // <Container>
    <HeaderRow>
      {/* <Logo src={logoSrc} alt="Logo" onClick={() => navigate("/")} /> */}
      {/* <Logo src={logoSrc} alt="Logo" onClick={() => window.open(`https://bedandbeds.com/`, "_blank")} /> */}
      <Logo src={logoSrc} alt="Logo" />
      <NavActions>
        {/* <Link to="/booking_details">
            <h3>
              Modify/Cancel Booking
            </h3>
          </Link> */}
        <StyledLink to="#">Modify/Cancel Booking</StyledLink>
        {
          // token && (
          //   <>
          //     <StyledLink onClick={logOutFunc}>Log out</StyledLink>
          //   </>
          // )
        }
        <SwitchThemeBtn />
      </NavActions>
    </HeaderRow>

    // </Container>
  );
}
