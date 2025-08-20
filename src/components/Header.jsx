// Header.jsx
import styled from 'styled-components';
import logoSrc from '../assets/StayoViaLogo.png';
import SwitchThemeBtn from './SwitchThemeBtn';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const HeaderRow = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  margin-bottom: 1.5rem;
  padding: 0 1rem;
`;

const NavActions = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
`;

const StyledLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: #fff;
  border-radius: 0.5rem;
  text-decoration: none;
  &:hover {
    opacity: 0.9;
  }
`;

const Logo = styled.img`
  max-height: 40px;
  max-width: 120px;
  cursor: pointer;
`;

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // normalize to avoid trailing slash mismatches
  const path = location.pathname.replace(/\/+$/, '');
  const isOnView = path === '#/view-bookings';

  // If already on /view-bookings -> intentionally go to a non-existent nested route (404)
  // Else -> go to the normal /view-bookings page
  const linkTo = isOnView ? '/view-bookings/view-bookings' : '/view-bookings';

  return (
    <HeaderRow>
      <Logo src={logoSrc} onClick={() => navigate('/')} alt="Logo" />
      <NavActions>
        <StyledLink to={linkTo}>Modify/Cancel Booking</StyledLink>
      </NavActions>
    </HeaderRow>
  );
}
