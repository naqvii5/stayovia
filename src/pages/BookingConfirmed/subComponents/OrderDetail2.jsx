import React, { useState } from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { useTheme } from 'styled-components';
import { MyButton } from '../../../components/MyButton';
import { useNavigate } from 'react-router-dom';

function OrderDetail2({
  cart,
  grandTotal,
  grandTotalWithBuyersGroup,
  isCheckOut = false,
  cartDetails,
}) {
  const navigate = useNavigate();
  const styledTheme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  function confirmOrder() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartDetails', JSON.stringify(cartDetails));
    navigate('/check-out', {
      state: {
        cameFromHotelDetails: true,
      },
    });
  }

  return (
    <>
      <RightColumn>
        <CartBox>
          <HeaderBox>
            <h1>Confirmation View</h1>
          </HeaderBox>

          <ItemBoxHeader theme={styledTheme}>
            <h2>Room</h2>
            <h2>Quantity</h2>
            <h2>Price + Tax </h2>
            <h2>Sub Total</h2>
          </ItemBoxHeader>
          {cart.map((item, idx) => (
            <ItemBox key={idx} theme={styledTheme}>
              <div>
                <h2>
                  {idx + 1}
                  {':'}
                  {item.roomTypeName}
                </h2>
              </div>
              <div>
                <h3>Room(s) x {item.rooms}</h3>
              </div>
              <h3>
                PKR {(item.priceWithBuyersGroup - item.tax).toLocaleString()} +
                PKR {item.tax.toLocaleString()} Tax
              </h3>
              <div>
                <h3 style={{ color: styledTheme.colors.secondary }}>
                  PKR{' '}
                  {(item.priceWithBuyersGroup * item.rooms).toLocaleString()}{' '}
                  (Sub Total)
                </h3>
              </div>
            </ItemBox>
          ))}

          <TotalBox theme={styledTheme}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <h2 style={{ color: styledTheme.colors.primary }}>GRAND TOTAL</h2>
              <h2 style={{ color: styledTheme.colors.secondary }}>
                PKR {grandTotalWithBuyersGroup.toLocaleString()}
              </h2>
            </div>
          </TotalBox>
        </CartBox>
      </RightColumn>

      {/* Mobile Bottom Bar */}
      {cart.length > 0 && (
        <>
          <BottomBar>
            <MyButton
              bgColor={styledTheme.colors.primary}
              fontSize={styledTheme.fontSizes.xsmall}
              padding="10px"
              borderRadius="10px"
              width="90%"
              disabled={cart.length <= 0}
              onClick={() => setModalOpen(true)}
            >
              View Reservations
            </MyButton>
          </BottomBar>

          <BottomBar>
            <MyButton
              bgColor={styledTheme.colors.primary}
              fontSize={styledTheme.fontSizes.xsmall}
              padding="10px"
              borderRadius="10px"
              width="90%"
              disabled={cart.length <= 0}
              onClick={() => setModalOpen(true)}
            >
              View Reservations
            </MyButton>
            {!isCheckOut && (
              <MyButton
                bgColor={styledTheme.colors.primary}
                fontSize={styledTheme.fontSizes.xsmall}
                padding="10px"
                borderRadius="10px"
                width="100%"
                onClick={confirmOrder}
                textColor="#fff"
              >
                Confirm
              </MyButton>
            )}
          </BottomBar>
        </>
      )}
    </>
  );
}

export default OrderDetail2;

// Styled Components
const RightColumn = styled.div`
  flex: 0 0 20%;
  height: fit-content;
  background: ${({ theme }) => theme.colors.cardColor};
  padding: 0px 0px;
  border-radius: 0.8rem;
  //   height:80vh;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    // display: none;
  }
`;

const CartBox = styled(Box)`
  flex: 1;
  // height:80vh;

  // padding: 1rem 0rem;
  width: 100%;
  border-radius: 0.8rem;

  background: ${({ theme }) => theme.colors.cardColor};
  // border-radius: 0.8rem;
  h2 {
    margin: 10px 0;
  }
`;

const HeaderBox = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.whiteText};
  padding: 0.8rem;
  border-radius: 0.8rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const ItemBox = styled(Box)`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  // background: ${({ theme }) => theme.colors.cardColor2};
  padding: 10px 50px;
  gap: 10px;
  h2 {
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;
const ItemBoxHeader = styled(Box)`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  //   border-top: 1px solid ${({ theme }) => theme.colors.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary};
  // background: ${({ theme }) => theme.colors.cardColor2};
  padding: 10px 50px;
  gap: 10px;
  h2 {
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const TotalBox = styled(Box)`
  margin-top: 1.5rem;
  // padding-top: 1rem;
  border-radius: 0.8rem;
  border: double ${({ theme }) => theme.colors.primary};
`;

const BottomBar = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    justify-content: center;
    background: ${({ theme }) => theme.colors.cardColor};
    padding: 1rem;
    z-index: 100;
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const MobileContent = styled(Box)`
  background: ${({ theme }) => theme.colors.mainBackground};
  margin: 5% auto;
  padding: 2rem;
  width: 90%;
  max-height: 90%;
  overflow-y: auto;
  position: relative;
  border-radius: 0.8rem;
`;

const CloseModal = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.large};
  cursor: pointer;
`;
