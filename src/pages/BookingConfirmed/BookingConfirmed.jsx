import styled from 'styled-components';
import Container_NoGradient from '../../components/Container_NoGradient';
import Header from '../../components/Header';
import FooterSection from '../Login/subcomponents/FooterSection';
// import { useTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';
// import RightColumnSection from "../HotelDetails/subcomponents/RightColumnSection";
import OrderDetail from './subComponents/orderDetail';
import RightColumnSection from '../HotelDetails/subcomponents/RightColumnSection';
import { useHotelSearch } from '../../context/HotelSearchContext';
// ————— Styled Components —————
const TopBar = styled.div`
  width: max-content;
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
    // color: ${({ theme }) => theme.colors.primary};
    color: #40a600;
  }
`;
const Container = styled.section`
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px 100px 0 100px;
  background: ${({ theme }) => theme.colors.primary};
  // background: linear-gradient(
  //   to top,
  //   ${({ theme }) => theme.colors.primary} 0%,
  //   ${({ theme }) => theme.colors.secondary} 100%
  // );
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
`;
export default function BookingConfirmed() {
  // const styledTheme = useTheme();
  const {
    grandTotal,
    // grandTotalWithBuyersGroup
  } = useHotelSearch();

  const [cart] = useState(() => {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  });
  // const [grandTotal] = useState(
  //   Number(localStorage.getItem("grandTotal") || 0)
  // );
  const [bookingData] = useState(() => {
    const raw = localStorage.getItem('booking data');
    return raw ? JSON.parse(raw) : [];
  });
  return (
    <>
      <Container>
        <Header />
      </Container>

      <Container_NoGradient>
        <TopBar>
          <Breadcrumb>
            <Link to="/">Main Page</Link> &gt;
            {/* <Link to="/#/search"> Search</Link> */}
          </Breadcrumb>
        </TopBar>
        <>
          {/* <div style={{ margin: "auto" }}></div> */}
          <LeftColumnCards>
            <h2>Booking Confirmed!</h2>
            {/* <h2>Booking Pin: {bookingData?.bookingPin}</h2> */}
            <h2>Reference No: {bookingData?.confirmationCode}</h2>
          </LeftColumnCards>
          <div style={{ height: 'auto', overflowY: 'auto' }}>
            {/* <OrderDetail
              cart={cart}
              grandTotal={grandTotal}
              isCheckOut={true}
            /> */}
            <OrderDetail
              cart={cart}
              grandTotal={grandTotal}
              // grandTotalWithBuyersGroup={grandTotalWithBuyersGroup}
              isCheckOut={true}
            />
          </div>
          {/* <LeftColumnCards>
            <h2>Grand Total: {grandTotal}</h2>
          </LeftColumnCards> */}
        </>
      </Container_NoGradient>
      <FooterSection />
    </>
  );
}
