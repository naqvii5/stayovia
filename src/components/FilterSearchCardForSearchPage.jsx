import styled from 'styled-components';
import DestinationSection from '../pages/FilterPage/subComponents/DestinationSection';
import DateSelectionSection from '../pages/FilterPage/subComponents/DateSelectionSection';
import RoomSelectionComp from '../pages/FilterPage/subComponents/RoomSelectionComp';
import Spinner from './Spinner';

export function FilterSearchCardForSearchPage({
  destination,
  setDestination,
  setCityName,
  setDates,
  roomsInfo,
  setRoomsInfo,
  isSearching,
  handleSearch,
  withDestination = false,
}) {
  return (
    <Row1 $withDestination={withDestination}>
      {withDestination && (
        <DestCol>
          <DestinationSection
            dest={destination}
            setDest={(city) => setDestination(city)}
            setCityName={setCityName}
          />
        </DestCol>
      )}

      <DatesCol>
        <DateSelectionSection
          onDatesChange={({ checkIn, checkOut, nights }) => {
            setDates({ checkIn, checkOut, nights });
          }}
        />
      </DatesCol>

      <RoomsCol>
        <RoomSelectionComp
          rooms={roomsInfo}
          setRooms={(newRooms) => setRoomsInfo(newRooms)}
        />
      </RoomsCol>

      <SearchCol>
        <SearchButton disabled={isSearching} onClick={handleSearch}>
          {isSearching ? <Spinner /> : 'Search'}
        </SearchButton>
      </SearchCol>
    </Row1>
  );
}

/* ------------ Layout ------------ */

const Row1 = styled.div`
  display: grid;
  width: 100%;
  gap: 1rem;
  align-items: end;

  /* Desktop/tablet+: 3 or 4 columns depending on withDestination */
  grid-template-areas: ${({ $withDestination }) =>
    $withDestination ? '"dest dates rooms search"' : '"dates rooms search"'};

  grid-template-columns: ${({ $withDestination }) =>
    $withDestination
      ? 'minmax(180px, 30%) minmax(260px, 35%) minmax(180px, 20%) minmax(120px, 15%)'
      : 'minmax(260px, 60%) minmax(180px, 25%) minmax(120px, 15%)'};

  /* Tablet & below: stack full-width */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-areas: ${({ $withDestination }) =>
      $withDestination
        ? '"dest" "dates" "rooms" "search"'
        : '"dates" "rooms" "search"'};
    grid-template-columns: 1fr;
    align-items: stretch;

    /* ensure children fill */
    & > * {
      width: 100%;
    }
  }
`;

const DestCol = styled.div`
  grid-area: dest;
`;

const DatesCol = styled.div`
  grid-area: dates;
`;

const RoomsCol = styled.div`
  grid-area: rooms;
`;

const SearchCol = styled.div`
  grid-area: search;
  display: flex;
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    /* make button full-width on small screens */
    width: 100%;
  }
`;

const SearchButton = styled.button`
  width: 100%;
  background: ${({ theme, disabled }) =>
    disabled ? '#aaa' : theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.8rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transform: translateY(0);
  transition: all 0.1s ease-in;
  min-height: 48px;

  &:active {
    transform: translateY(2px);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;
