import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import { useTheme } from "styled-components";
// import { MyButton } from "../../../components/MyButton";
import { useNavigate } from "react-router-dom";
import { MyButton } from "../../../components/MyButton";

function OrderDetail({ cart, grandTotal, isCheckOut = false }) {
    const navigate = useNavigate();
    const styledTheme = useTheme();

    return (
        <>
            <RightColumn>
                <Box
                    flex={1}
                    p={1}
                    width={"100%"}
                    bgcolor={styledTheme.colors.cardColor}
                    borderRadius="0.8rem"
                >
                    <h2 style={{ margin: "10px 0" }}>Your Reservation</h2>
                    {cart.map((item) => (
                        <Box
                            key={item.key} mb={2}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                borderBottom: `0.1px solid ${styledTheme.colors.primary}`,
                                borderRadius: `5px`,
                                background: styledTheme.colors.cardColor2,
                                padding: "10px 5px",
                                justifyContent: "space-between",
                                gap: "10px",
                            }}
                        >
                            <div>
                                <strong>{item.roomTypeName}</strong>
                            </div>
                            {/* <div>
                                <strong>Rate Plan:{item.ratePlanName}</strong>
                            </div> */}
                            <div>Room(s) x {item.rooms}</div>
                            <div>
                                <strong>
                                    Sub-Total: PKR {(item.price * item.rooms).toLocaleString()}
                                </strong>
                            </div>
                        </Box>
                    ))}
                    <Box
                        mt={3}
                        my={3}
                        pt={2}
                        borderTop={`1px solid ${styledTheme.colors.secondaryText}`}
                    >
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <h2>Grand Total</h2>
                            <h2>PKR {grandTotalWithBuyersGroup.toLocaleString()}</h2>

                        </div>
                    </Box>

                </Box>
            </RightColumn>

            <BottomBar>
                <RightColumn>
                    <h2>Booking Info</h2>
                    <p>Select dates & rooms to book</p>
                    <Box
                        flex={1}
                        p={2}
                        bgcolor={styledTheme.colors.cardColor}
                        borderRadius="0.8rem"
                    >
                        <h2>Booking Info</h2>
                        {cart.map((item, idx) => (
                            <Box key={item.id + idx} mb={2}>
                                <div>
                                    <strong>Room Type:{item.roomTypeName}</strong>
                                </div>
                                <div>
                                    <strong>Rate Plan:{item.ratePlanName}</strong>
                                </div>
                                <div>Quantity: {item.rooms}</div>
                                <div>
                                    Sub‑Total: PKR {(item.price * item.rooms).toLocaleString()}
                                </div>
                            </Box>
                        ))}
                        <Box
                            mt={3}
                            pt={2}
                            borderTop={`1px solid ${styledTheme.colors.secondaryText}`}
                        >
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <h2>Grand Total</h2>
                                <h2>PKR {grandTotalWithBuyersGroup.toLocaleString()}</h2>

                            </div>
                        </Box>
                    </Box>
                </RightColumn>
                <button>Book Now</button>
            </BottomBar>
        </>
    );
}

export default OrderDetail;

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

// Sticky bottom bar on mobile
const BottomBar = styled.div`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: ${({ theme }) => theme.colors.cardColor};
    padding: 1rem;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    justify-content: center;
    z-index: 100;
  }
`;
