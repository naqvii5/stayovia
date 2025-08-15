import React from 'react';
import styled from 'styled-components';
import DestinationSection from '../pages/FilterPage/subComponents/DestinationSection';
import DateSelectionSection from '../pages/FilterPage/subComponents/DateSelectionSection';
import RoomSelectionComp from '../pages/FilterPage/subComponents/RoomSelectionComp';
import RatingSection from '../pages/FilterPage/subComponents/RatingSection';
import Spinner from './Spinner';

export function FilterSearchCardForSearchPage({
  destination,
  setDestination,
  setCityName,
  dates,
  setDates,
  roomsInfo,
  setRoomsInfo,
  rating,
  setRating,
  freeCancellation,
  setFreeCancellation,
  isSearching,
  handleSearch,
  withDestination = false,
}) {
  return (
    <Row1>
      {withDestination && (
        <DestinationSection
          dest={destination}
          setDest={(city) => setDestination(city)}
          setCityName={setCityName}
        />
      )}

      <div style={{ width: '60%' }}>
        <DateSelectionSection
          onDatesChange={({ checkIn, checkOut, nights }) => {
            setDates({ checkIn, checkOut, nights });
          }}
        />
      </div>

      <div style={{ width: '40%' }}>
        <RoomSelectionComp
          rooms={roomsInfo}
          setRooms={(newRooms) => setRoomsInfo(newRooms)}
        />
      </div>
      <div style={{ width: '15%' }}>
        <SearchButton disabled={isSearching} onClick={handleSearch}>
          {isSearching ? <Spinner /> : 'Search'}
        </SearchButton>
      </div>
    </Row1>
  );
}

// Card container
const Card = styled.div`
  overflow: auto;
  width: 60%;
  position: relative;
  z-index: 9999;
  background: ${({ theme }) => theme.colors.mainBackground};
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;
// Filter row layout
const Row1 = styled.div`
  // display: grid;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
  /* For screens > 768px, use percentage widths */
  // grid-template-areas: 'dates rooms search';
  // grid-template-columns: 40% 30% 30%;
  align-items: end;

  /* Tablet and below (<=768px): two-row layout */
  // @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
  // grid-template-areas: 'dates rooms search search';
  // grid-template-columns: repeat(3, 1fr);
  // }

  /* Mobile (<=450px): single column */
  // @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
  // grid-template-areas:
  // 'dates'
  // 'rooms'
  // 'search';
  // grid-template-columns: 1fr;
  // }
`;

// Additional parameters heading
const Additional = styled.h3`
  margin: 1.5rem 0 0.5rem;
  font-family: ${({ theme }) => theme.fonts.primaryHeading};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryHeading};
`;
// Row2 and Row3
const Row2 = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
  grid-template-areas: 'citizen rating';
  grid-template-columns: 1fr 1fr;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-areas:
      'citizen'
      'rating';
    grid-template-columns: 1fr;
  }
`;

const Row3 = styled.div`
  margin-bottom: 1rem;
`;

// Select and other controls
const ControlSelect = styled.select`
  grid-area: ${({ area }) => area};
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border-radius: 0.8rem;
  background: ${({ theme }) => theme.colors.mainBackground};
  // border: 0.5px solid ${({ theme }) => theme.colors.secondaryText};
  border: 0.5px solid #dddddd;
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const CancelLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};

  input {
    margin: 0;
  }
`;

const SearchButton = styled.button`
  grid-area: search;
  background: ${({ theme, disabled }) =>
    disabled ? '#aaa' : theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  align-self: stretch;
  border-radius: 0.8rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transform: translateY(0);
  transition: all 0.1s ease-in;

  &:active {
    transform: translateY(2px); /* press down effect */
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;
const FullSearchButton = styled(SearchButton)`
  display: none;
  margin-top: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: flex;
  }
`;
