/* eslint-disable no-unused-vars */
// import beamImg from '../../../assets/filters_beam.png';
// import { useThemeContext } from '../../../theme/ThemeProvider';
// import RatingSection from './RatingSection';
// import { FaHotel } from 'react-icons/fa';
// import { getCities } from '../../../api/getCities';
// import { useEffect } from 'react';
import React, { useState } from 'react';
import styled from 'styled-components';
import filterBg from '../../../assets/searchFilterBackdrop.webp';

import RoomSelectionComp from './RoomSelectionComp';
import DestinationSection from './DestinationSection';
import DateSelectionSection from './DateSelectionSection';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { hotelSearch } from '../../../api/hotelSearch';
import { useHotelSearch } from '../../../context/HotelSearchContext';
import FooterSection from '../../Login/subcomponents/FooterSection';
import Spinner from '../../../components/Spinner';
import Header from '../../../components/Header';
import FeaturesSection from '../../Login/subcomponents/FeaturesSection';
import AboutSection from '../../Login/subcomponents/AboutSection';
import TopDestinationSection from '../../Login/subcomponents/TopDestinationSection';

// Main container with gradient
// const Container = styled.section`
//   display: flex;
//   flex-direction: column;
//   gap: 5px;
//   position: relative;
//   oberflow: hidden;
//   width: 100%;
//   height: 79.5vh;
//   justify-content: center;
//   margin: 0 auto;
//   padding: 60px 160px;
//   background: linear-gradient(
//     90deg,
//     ${({ theme }) => theme.colors.secondary} -20%,
//     ${({ theme }) => theme.colors.primary} 40%
//   );
//   color: ${({ theme }) => theme.colors.primaryText};
//   box-sizing: border-box;
//   // overflow: hidden;
//   overflow: visible;

//   @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
//     padding: 10px;
//   }
// `;
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
const SubContainer = styled.section`
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px 100px 0 100px;
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
`;
// Beam overlay
const Beam = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

// Service selection tabs
const ServiceContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1rem;
  width: 100%;

  max-width: 600px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    overflow-x: auto;
    flex-direction: column;
  }
`;

const ServiceTab = styled.button`
  flex: none;
  background: ${({ selected, theme }) =>
    selected ? theme.colors.primary : 'transparent'};
  color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  font-family: ${({ theme }) => theme.fonts.primaryText};
  // font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.small};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

// Card container
const Card = styled.div`
  position: relative;
  z-index: 1;
  background-image: url(${filterBg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: ${({ theme }) => theme.colors.mainBackground}; // fallback
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 500px; // Adjust based on how tall you want the image to be

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InnerContent = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px 100px 0 100px;

  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
  // max-width: 1400px; // You can adjust this
  // margin: 0 auto;
  // width: 100%;
  // padding: 0; // Keep same spacing as Card if needed
  // box-sizing: border-box;
`;
const Separator = styled.div`
  height: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryText}33;
  margin: 3rem 0;
`;
const Tagline = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-family: ${({ theme }) => theme.fonts.primaryHeading};
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;
const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  font-family: ${({ theme }) => theme.fonts.primaryHeading};
  text-align: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

// Reusable input style
const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.75rem;
  border-radius: 0.8rem;
  // border: 0.5px solid ${({ theme }) => theme.colors.secondaryText};
  border: 0.5px solid #dddddd;
  background: ${({ theme }) => theme.colors.mainBackground};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.small};
  height: 100%;
  box-sizing: border-box;

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondaryText};
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

// Filter row layout
const Row1 = styled.div`
  display: grid;
  gap: 1rem;
  /* For screens > 768px, use percentage widths */
  grid-template-areas: 'dest dates rooms search';
  grid-template-columns: 40% 25% 15% 15%;
  align-items: end;

  /* Tablet and below (<=768px): two-row layout */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-areas:
      'dest dest dest dest'
      'dates rooms search search';
    grid-template-columns: repeat(3, 1fr);
  }

  /* Mobile (<=450px): single column */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-areas:
      'dest'
      'dates'
      'rooms'
      'search';
    grid-template-columns: 1fr;
  }
`;

// Additional parameters heading
const Additional = styled.h3`
  margin: 1.5rem 0 0.5rem;
  font-family: ${({ theme }) => theme.fonts.primaryHeading};
  font-size: ${({ theme }) => theme.fontSizes.small};
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
const SelectedOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  // margin-left: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  cursor: pointer;
`;

// const Spinner = styled.div`
//   width: 18px;
//   height: 18px;
//   border: 2px solid #fff;
//   border-top: 2px solid transparent;
//   border-radius: 50%;
//   animation: spin 0.8s linear infinite;

//   @keyframes spin {
//     to {
//       transform: rotate(360deg);
//     }
//   }
// `;

// Component
export default function FilterSection() {
  // const { mode } = useThemeContext();
  const {
    // hotelSearchData,
    setHotelSearchData,
    // setBuyersGroupData,
    setFilteringData,
    // setExchangeGroupData,
  } = useHotelSearch();
  const navigate = useNavigate();

  // 1) Lifted state for every filter
  const [destination, setDestination] = useState('');
  const [cityName, setCityName] = useState('');
  const [dates, setDates] = useState({
    checkIn: null,
    checkOut: null,
    nights: null,
  });
  const [roomsInfo, setRoomsInfo] = useState([
    { label: 'Room 1', Adults: 1, Children: 0 },
  ]);
  // eslint-disable-next-line no-unused-vars
  const [rating, setRating] = useState([]);
  const [freeCancellation, setFreeCancellation] = useState(false);

  // const [isDataSearched, setIsDataSearched] = useState(false);

  // const [selectedService, setSelectedService] = useState('hotels');
  const [isSearching, setIsSearching] = useState(false);

  // 2) When the Search button is clicked, build your payload
  const handleSearch = () => {
    setIsSearching(true);

    // 1) validate
    if (
      !destination ||
      !dates.checkIn ||
      !dates.checkOut ||
      !roomsInfo ||
      !rating
    ) {
      toast.error('Filter data is missing!', {
        style: { fontSize: '1.25rem', padding: '16px 24px' },
      });
      setIsSearching(false);

      return;
    }
    // 2) build payload & save filters in context
    const payload = {
      AddressId: destination,
      CityName: cityName,
      CheckIn: dates.checkIn,
      CheckOut: dates.checkOut,
      nights: dates.nights,
      Rooms: roomsInfo.length,
      GuestQuantity: roomsInfo,
      Cancellation: freeCancellation,
      Rating: rating,
    };
    setFilteringData(payload);

    // 3) kick off search
    const toastId = toast.loading('Searching…', {
      style: { fontSize: '1.25rem', padding: '16px 24px' },
    });

    hotelSearch(payload)
      .then((response) => {
        // normalize results into an array (even if empty)
        // const results = response;
        // console.log("results", response);
        // 4) save results in context
        // console.log('response1', response.exchangeGroup)
        // if (!response.exchangeGroup) {
        //   toast.error("Please complete office profile!", {
        //     style: { fontSize: "1.25rem", padding: "16px 24px" },
        //   });
        //   toast.dismiss(toastId);
        //   setIsSearching(false)
        //   return
        // }
        setHotelSearchData(response.data);
        // setBuyersGroupData(response.buyerGroup);
        // setExchangeGroupData(response.exchangeGroup);
        // dismiss loading toast
        toast.dismiss(toastId);

        if (response.status) {
          // toast.success("Data searched!", {
          //   style: { fontSize: "1.25rem", padding: "16px 24px" },
          // });
          // 5) navigate only *after* context has been updated
          // navigate("/search-results");
          navigate('/search-results', {
            state: {
              cameFromSearch: true,
              // Optionally pass the actual results or query if you want:
              // searchResults: results,
              // searchCriteria: criteria,
            },
          });
        } else {
          toast.error('Failed to load hotels', {
            style: { fontSize: '1.25rem', padding: '16px 24px' },
          });
        }
      })
      .catch((err) => {
        console.error('Search API failed:', err);
        toast.dismiss(toastId);

        // toast.error("Network error", {
        //   style: { fontSize: "1.25rem", padding: "16px 24px" },
        // });
      })
      .Finally((err) => {
        setIsSearching(false);
      });
  };

  const services = [
    { key: 'hotels', label: 'Hotels and Apartments' },
    // { key: "flights", label: "Air tickets" },
    // { key: "cars", label: "Car rentals" },
    // { key: "trains", label: "Train tickets" },
  ];

  return (
    <>
      <Container>
        <Header />
      </Container>

      {/* <Beam src={beamImg} alt="beam" /> */}

      {/* <ServiceContainer>
          {services.map((svc) => (
            <ServiceTab
              key={svc.key}
              selected={selectedService === svc.key}
              onClick={() => setSelectedService(svc.key)}
            >
              {svc.label}
            </ServiceTab>
          ))}
        </ServiceContainer> */}
      <InnerContent>
        {/* <SelectedOption>
            <FaHotel />
            <span>Hotels</span>
          </SelectedOption> */}
        <Card>
          {/* use searchFilterBackdrop.webp from assests image background on card */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Tagline>Travel with Stayovia</Tagline>
          </div>
          {/* <div
            style={{
              display: 'flex',
              justifyContent: 'start',
            }}
          >
            <Title>Where to next?</Title>
          </div> */}
          <Row1>
            {/* Destination Section */}
            <DestinationSection
              dest={destination}
              setDest={(city) => setDestination(city)}
              setCityName={setCityName}
            />

            {/* Date Selection Section */}
            <DateSelectionSection
              onDatesChange={({ checkIn, checkOut, nights }) => {
                setDates({ checkIn, checkOut, nights });
              }}
            />

            {/* Room Selection Section */}
            <RoomSelectionComp
              rooms={roomsInfo}
              setRooms={(newRooms) => setRoomsInfo(newRooms)}
            />
            <SearchButton disabled={isSearching} onClick={handleSearch}>
              {isSearching ? <Spinner /> : 'Search'}
            </SearchButton>
          </Row1>

          {/* <Additional>Additional parameters</Additional> */}

          <Row2>
            {/* <ControlSelect area="citizen" value="Pakistan" disabled>
              <option>Citizenship: Pakistan</option>
            </ControlSelect> */}

            {/* Rating Section */}
            {/* <RatingSection
              selectedStars={rating}
              setSelectedStars={(newRating) => setRating(newRating)}
            /> */}
          </Row2>

          <Row3>
            {/* <CancelLabel>
              <input
                type="checkbox"
                checked={freeCancellation}
                onChange={(e) => setFreeCancellation(e.target.checked)}
              />{" "}
              Free cancellation
            </CancelLabel> */}
          </Row3>

          <FullSearchButton disabled={isSearching} onClick={handleSearch}>
            {isSearching ? <Spinner /> : 'Search'}
          </FullSearchButton>
        </Card>
        <Separator />

        <FeaturesSection />
        <Separator />
        <TopDestinationSection />
        <Separator />

        <AboutSection />
      </InnerContent>

      {/* </Container> */}
      <FooterSection />
    </>
  );
}
