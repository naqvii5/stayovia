// src/components/RightColumnSection.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import { useTheme } from "styled-components";
import { MyButton } from "../../../components/MyButton";
import { useNavigate } from "react-router-dom";

function RightColumnSection({ cart, grandTotal, grandTotalWithBuyersGroup, isCheckOut = false, cartDetails }) {
  const navigate = useNavigate();
  const styledTheme = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  function confirmOrder() {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartDetails", JSON.stringify(cartDetails));
    // localStorage.setItem("grandTotal", grandTotal);
    // navigate("/check-out");
    navigate("/check-out", {
      state: {
        cameFromHotelDetails: true
      },
    });
  }

  return (
    <>
      <RightColumn>
        <CartBox>
          <h1>{isCheckOut ? 'Your Reservation' : 'Your Reservation'}</h1>
          {cart.map((item, idx) => (
            <ItemBox key={idx} theme={styledTheme}>
              <div><h2>{item.roomTypeName}</h2></div>
              {/* <div><h3>Rate Plan: {item.ratePlanName}</h3></div> */}
              <div><h3>Room(s) x {item.rooms}</h3></div>
              <div >

                <h3>Total: PKR {(item.priceWithBuyersGroup - item.tax).toLocaleString()}+
                  PKR {(item.tax).toLocaleString()}Tax
                </h3>

                <div style={{
                  borderTop: '1px solid gray', margin: '10px 0px', padding: '4px 0px'
                }}><h3>Sub-Total: PKR {(item.priceWithBuyersGroup * item.rooms).toLocaleString()}</h3></div>
                {/* <h3>Total: PKR {(item.priceWithBuyersGroup * item.rooms).toLocaleString()}</h3> */}
              </div>
            </ItemBox>
          ))}
          <TotalBox theme={styledTheme}>
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center'
            }}>
              <h2>Grand Total</h2>
              <h2>PKR {grandTotalWithBuyersGroup.toLocaleString()}</h2>

            </div>
          </TotalBox>
          {!isCheckOut && (
            <MyButton
              bgColor={styledTheme.colors.primary}
              fontSize={styledTheme.fontSizes.xsmall}
              padding="10px"
              borderRadius="10px"
              width="100%"
              disabled={cart.length <= 0}
              onClick={confirmOrder}
            >
              Confirm
            </MyButton>
          )}
        </CartBox>
      </RightColumn>

      {/* Mobile Bottom Bar */}
      {
        cart.length > 0 && (
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
                >
                  Confirm
                </MyButton>
              )}
            </BottomBar>
          </>
        )
      }
      {/* Modal for mobile cart details */}
      {modalOpen && (
        <MobileOverlay>
          <MobileContent theme={styledTheme}>
            <CloseModal onClick={() => setModalOpen(false)}>✕</CloseModal>
            <h2>Your Reservation</h2>
            {cart.map((item, idx) => (
              <ItemBox key={idx} theme={styledTheme}>
                <div><h3>{item.roomTypeName}</h3></div>
                {/* <div><h3>Rate Plan: {item.ratePlanName}</h3></div> */}
                <div>
                  <h3>
                    Room(s) x {item.rooms}
                  </h3>
                </div>
                <div><strong>Sub-Total: PKR {(item.price * item.rooms).toLocaleString()}</strong></div>
              </ItemBox>
            ))}
            <TotalBox theme={styledTheme}>
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center'
              }}>
                <h2>Grand Total</h2>
                <h2>PKR {grandTotalWithBuyersGroup.toLocaleString()}</h2>

              </div>
            </TotalBox>
            {!isCheckOut && (
              <MyButton
                bgColor={styledTheme.colors.primary}
                fontSize={styledTheme.fontSizes.xsmall}
                padding="10px"
                borderRadius="10px"
                width="100%"
                onClick={confirmOrder}
              >
                Confirm
              </MyButton>
            )}
          </MobileContent>
        </MobileOverlay>
      )}
    </>
  );
}

export default RightColumnSection;

// Styled Components
const RightColumn = styled.div`
  flex: 0 0 20%;
  height: fit-content;
  background: ${({ theme }) => theme.colors.cardColor};
  padding: 3px;
  border-radius: 0.8rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const CartBox = styled(Box)`
  flex: 1;
  padding: 1rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.cardColor};
  border-radius: 0.8rem;
  h2 { margin: 10px 0; }
`;

const ItemBox = styled(Box)`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  border-bottom: 0.1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.cardColor2};
  padding: 10px 5px;
  gap: 10px;
`;

const TotalBox = styled(Box)`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.secondaryText};
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
