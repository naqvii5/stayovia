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
import filterVideo from '../../../assets/searchFilterBackdrop.mp4';

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
import { FaHotel } from 'react-icons/fa';
import { FilterSearchCardForSearchPage } from './../../../components/FilterSearchCardForSearchPage';

// Main container with gradient

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

// Card container
const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3rem;
  position: relative;
  z-index: 1;
  // background-image: url(${filterBg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: ${({ theme }) => theme.colors.mainBackground}; // fallback
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 40vw;
  max-height: 80vw;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-height: fit-content;
    min-height: 70vw;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-height: fit-content;
    gap: 0.5rem;
  }
`;
const InnerContent = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  margin: 5px auto;
  padding: 20px 100px 0 100px;
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: visible; /* allow calendar popover to show */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
`;

const Row1 = styled.div`
  display: grid;
  z-index: 5;
  padding: 30px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  overflow: visible; /* don't clip popovers */
  gap: 1rem;

  /* Desktop: 4 columns */
  grid-template-areas:
    'tagline tagline tagline tagline'
    'services services services services'
    'dest dates rooms search';
  grid-template-columns: 40% 25% 15% 15%;
  align-items: end;

  /* Tablet & below: single "mobile" row */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-areas:
      'tagline'
      'services'
      'mobile';
    grid-template-columns: 1fr;
  }
`;

const Tagline = styled.h1`
  grid-area: tagline;
  z-index: 5;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  text-align: center;
  margin: 0 0 1.5rem;
`;

/* Make sure services actually occupies its grid area */
const ServiceContainer = styled.div`
  grid-area: services;
  position: relative;
  display: flex;
  gap: 1rem;
  width: 100%;
  flex-wrap: wrap;
`;

/* Desktop-only wrapper */
const DesktopFilters = styled.div`
  display: contents; /* pass children into the grid */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

/* Mobile/tablet-only wrapper */
const MobileFilters = styled.div`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    grid-area: mobile; /* span the full width row */
    width: 100%;
  }
`;

const DestCol = styled.div`
  grid-area: dest;
  min-width: 0;
`;
const DatesCol = styled.div`
  grid-area: dates;
  position: relative; /* anchor calendar popover */
  z-index: 5;
  min-width: 0;
`;
const RoomsCol = styled.div`
  grid-area: rooms;
  min-width: 0;
`;
const SearchCol = styled.div`
  grid-area: search;
  display: flex;
  align-items: stretch;
  min-width: 0;
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
  min-height: 48px;
`;

const Separator = styled.div`
  height: 2rem;
  z-index: 5;

  border-bottom: 1px solid ${({ theme }) => theme.colors.secondaryText}33;
  margin: 3rem 0;
`;

const ServiceTab = styled.button`
  flex: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-family: ${({ theme }) => theme.fonts.primaryText};
  cursor: pointer;
  background: ${({ selected }) =>
    selected ? 'rgba(255, 255, 255, 0.69)' : 'rgba(255, 255, 255, 0.11)'};
  color: ${({ selected, theme }) =>
    selected ? theme.colors.secondary : theme.colors.primaryHeading};
  border: 1px solid rgba(255, 255, 255, 0.7);
`;

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

  const [rating, setRating] = useState([]);
  const [freeCancellation, setFreeCancellation] = useState(false);

  // const [isDataSearched, setIsDataSearched] = useState(false);

  const [selectedService, setSelectedService] = useState('hotels');
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
    const toastId = toast.loading(
      'Searching…'
      // {style: { fontSize: '1.25rem', padding: '16px 24px' },}
    );

    hotelSearch(payload)
      .then((response) => {
        setHotelSearchData(response.data);
        toast.dismiss(toastId);
        if (response.status) {
          navigate('/search-results', {
            state: {
              cameFromSearch: true,
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
        toast.error('Failed to load hotels', {
          style: { fontSize: '1.25rem', padding: '16px 24px' },
        });
        toast.dismiss(toastId);
        setIsSearching(false);
      })
      .Finally((err) => {
        toast.error('Failed to load hotels', {
          style: { fontSize: '1.25rem', padding: '16px 24px' },
        });
        setIsSearching(false);
        setIsSearching(false);
      });
  };
  const services = [
    { key: 'hotels', label: 'Hotels & Apartments', isDisabled: false },
    // { key: 'stays', label: 'Stayovia Stays', isDisabled: false },
    // { key: 'tour', label: 'Tour Packages', isDisabled: true },
  ];

  return (
    <>
      <Container>
        <Header />
      </Container>

      {/* <Beam src={beamImg} alt="beam" /> */}

      <InnerContent>
        {/* <SelectedOption>
          <FaHotel />
          <span>Hotels</span>
        </SelectedOption> */}

        <Card className="animate__animated animate__fadeIn">
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
              borderRadius: '1rem',
            }}
          >
            <source src={filterVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* // 
          Hotels & Appartments
          Stayovia Stays
          Tour Packages */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {/* <Tagline>Travel with Stayovia</Tagline> */}
          </div>

          {/* use searchFilterBackdrop.webp from assests image background on card */}

          {/* Row1: Tagline, Services, Filters */}
          <Row1>
            <Tagline>WHERE TO NEXT?</Tagline>

            <ServiceContainer>
              {services.map((svc) => (
                <ServiceTab
                  key={svc.key}
                  selected={selectedService === svc.key}
                  onClick={() => setSelectedService(svc.key)}
                >
                  {svc.label}
                </ServiceTab>
              ))}
            </ServiceContainer>

            {/* Desktop / large screens */}
            <DesktopFilters>
              <DestCol>
                <DestinationSection
                  dest={destination}
                  setDest={setDestination}
                  setCityName={setCityName}
                />
              </DestCol>

              <DatesCol>
                <DateSelectionSection
                  onDatesChange={({ checkIn, checkOut, nights }) =>
                    setDates({ checkIn, checkOut, nights })
                  }
                />
              </DatesCol>

              <RoomsCol>
                <RoomSelectionComp rooms={roomsInfo} setRooms={setRoomsInfo} />
              </RoomsCol>

              <SearchCol>
                <SearchButton disabled={isSearching} onClick={handleSearch}>
                  {isSearching ? <Spinner /> : 'Search'}
                </SearchButton>
              </SearchCol>
            </DesktopFilters>

            {/* Tablet & below */}
            <MobileFilters>
              <FilterSearchCardForSearchPage
                destination={destination}
                setDestination={setDestination}
                setCityName={setCityName}
                dates={dates}
                setDates={setDates}
                roomsInfo={roomsInfo}
                setRoomsInfo={setRoomsInfo}
                rating={rating}
                setRating={setRating}
                freeCancellation={freeCancellation}
                setFreeCancellation={setFreeCancellation}
                isSearching={isSearching}
                handleSearch={handleSearch}
                withDestination={true}
              />
            </MobileFilters>
          </Row1>

          {/* <FullSearchButton disabled={isSearching} onClick={handleSearch}>
            {isSearching ? <Spinner /> : 'Search'}
          </FullSearchButton> */}
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
