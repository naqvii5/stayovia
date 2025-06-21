import React from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";
import { MyButton } from "../../../components/MyButton";

const Card1 = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 15px 20px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LeftInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Stars = styled.div`
  color: #fbc02d; /* gold */
  font-size: ${({ theme }) => theme.fontSizes.small};
`;

const HotelName = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const HotelDetailsText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const RightActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    align-self: stretch;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
`;

const FromLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const Price = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const ShowRoomsButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;
function LeftCard1Section({ specificHotelData }) {
  const styledTheme = useTheme();

  return (
    <Card1>
      <LeftInfo>
        <Stars>
          {"★".repeat(Math.floor(specificHotelData.Rating))}{" "}
          {/* {Number(specificHotelData.Rating.toFixed(1))} */}
        </Stars>
        <HotelName>{specificHotelData.AccommodationName}</HotelName>
        <HotelDetailsText>
          {specificHotelData.GeneralDescription}
        </HotelDetailsText>
      </LeftInfo>

      <RightActions>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2px",
            marginTop: "10px",
          }}
        >
          {/* <FromLabel>from </FromLabel>
          <Price>15,000</Price> */}
        </div>
        {/* <MyButton
          bgColor={styledTheme.colors.primary}
          fontSize={styledTheme.fontSizes.xsmall}
          padding="8px"
          borderRadius="10px"
          onClick={() => window.open(`/hotel-details/${hotel.id}`, "_self")}
        >
          Show Rooms
        </MyButton> */}
      </RightActions>
    </Card1>
  );
}

export default LeftCard1Section;
