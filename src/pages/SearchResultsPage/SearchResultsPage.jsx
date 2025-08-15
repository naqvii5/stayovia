// src/pages/SearchResultsPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import debounce from 'lodash.debounce'; // ensure `npm install lodash.debounce`
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Container_NoGradient from '../../components/Container_NoGradient';
import HotelCard from './SubComponents/HotelCard';
import styled from 'styled-components';
import FooterSection from '../Login/subcomponents/FooterSection';
import { useHotelSearch } from '../../context/HotelSearchContext';
import { toast, Toaster } from 'react-hot-toast';
import { useRef } from 'react';
import HotelCardNew from './SubComponents/HotelCardNew';
import DestinationSection from '../FilterPage/subComponents/DestinationSection';
import DateSelectionSection from '../FilterPage/subComponents/DateSelectionSection';
import RoomSelectionComp from '../FilterPage/subComponents/RoomSelectionComp';
import { specificHotelSearch } from '../../api/specificHotelSearch';
import { FilterSearchCardForSearchPage } from '../../components/FilterSearchCardForSearchPage';
import { hotelSearch } from '../../api/hotelSearch';

// Mapping for accommodation types
const typeOptions = [
  { id: 0, label: 'All Types' },
  { id: 1, label: 'Hotel' },
  { id: 2, label: 'Apartment' },
  { id: 3, label: 'Hostel' },
  { id: 4, label: 'Resort' },
  { id: 5, label: 'Motel' },
  { id: 6, label: 'Bed And Breakfast' },
  { id: 7, label: 'Guest house' },
  { id: 8, label: 'Campground' },
  { id: 9, label: 'Capsule Hotel' },
  { id: 10, label: 'Farm stay' },
  { id: 12, label: 'Holiday Park' },
  { id: 13, label: 'Inn' },
  { id: 14, label: 'Lodge' },
  { id: 15, label: 'Self-Catering' },
  { id: 16, label: 'Vacation Rental' },
];

// Filters Component
function Filters({
  sortOption,
  onSortChange,
  searchInput,
  onNameChange,
  selectedStars,
  onStarChange,
  nonRefundOnly,
  onNonRefundChange,
  selectedType,
  onTypeChange,
  freeCancelOnly,
  onFreeCancelChange,
  onClear,
}) {
  return (
    <>
      <ClearFiltersButton onClick={onClear}>
        Clear All Filters
      </ClearFiltersButton>
      <FilterSection>
        <FilterTitle>Hotel Name</FilterTitle>
        <SearchInput
          type="text"
          placeholder="Search hotel name"
          value={searchInput}
          onChange={onNameChange}
        />
      </FilterSection>

      <FilterSection>
        <FilterTitle>Star Rating</FilterTitle>
        {[5, 4, 3, 2, 1].map((star) => (
          <CheckboxLabel key={star}>
            <CheckboxInput
              type="checkbox"
              checked={selectedStars.includes(star)}
              onChange={() => onStarChange(star)}
            />
            {Array.from({ length: star }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </CheckboxLabel>
        ))}
      </FilterSection>

      <FilterSection>
        <FilterTitle>Sort by</FilterTitle>
        <SortSelect
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="">None</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
        </SortSelect>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Accommodation Type</FilterTitle>
        <TypeSelect
          value={selectedType}
          onChange={(e) => onTypeChange(Number(e.target.value))}
        >
          {/* <option value="all types">All Types</option> */}
          {typeOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </TypeSelect>
      </FilterSection>

      <FilterSection>
        <FilterTitle>Payment Options</FilterTitle>
        <CheckboxLabel>
          <CheckboxInput
            type="checkbox"
            checked={nonRefundOnly}
            onChange={onNonRefundChange}
          />
          Non Refundable
        </CheckboxLabel>
        <CheckboxLabel>
          <CheckboxInput
            type="checkbox"
            checked={freeCancelOnly}
            onChange={onFreeCancelChange}
          />
          Free Cancellation
        </CheckboxLabel>
      </FilterSection>
    </>
  );
}

// Main Component
export default function SearchResultsPage() {
  const {
    hotelSearchData = [],
    filteringData,
    // buyersGroupData,
    // exchangeGroupData,
    setFilteringData,
    setHotelSearchData,
    // setBuyersGroupData,
    // setExchangeGroupData,
  } = useHotelSearch();
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
  const [isSearching, setIsSearching] = useState(false);

  const [rating, setRating] = useState([]);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [hotelNameFilter, setHotelNameFilter] = useState('');
  const [selectedStars, setSelectedStars] = useState([]);
  const [selectedType, setSelectedType] = useState(0);
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);
  const [nonRefundOnly, setNonRefundOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();

  const itemsPerPage = 15;

  // 1) Guard: if we didn’t come from FilterPage, bounce back
  useEffect(() => {
    if (!location.state?.cameFromSearch) {
      navigate('/search', { replace: true });
    }
  }, [location.state, navigate]);

  // Debounce search
  const debouncedFilter = useMemo(
    () =>
      debounce((val) => {
        setHotelNameFilter(val.toLowerCase());
        setCurrentPage(1);
      }, 300),
    []
  );

  useEffect(() => {
    if (isSearching) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearching]);
  const handleNameChange = (e) => {
    setSearchInput(e.target.value);
    debouncedFilter(e.target.value);
  };
  const handleSearch = () => {
    if (isSearching) return; // prevent double click

    setIsSearching(true);

    // 1) validate
    if (!destination || !dates.checkIn || !dates.checkOut || !roomsInfo) {
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
        if (response.status) {
          setHotelSearchData(response.data);
          setIsSearching(false);
          toast.dismiss(toastId);
        } else {
          toast.error('Failed to load hotels', {
            style: { fontSize: '1.25rem', padding: '16px 24px' },
          });
        }
      })
      .catch((err) => {
        console.error('Search API failed:', err);
        toast.dismiss(toastId);
      })
      .Finally((err) => {
        console.log('err', err);
        setIsSearching(false);
      });
  };

  // Star filter
  const handleStarChange = (star) => {
    setSelectedStars((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
    setCurrentPage(1);
  };

  // Type filter
  const handleTypeChange = (id) => {
    setSelectedType(id);
    setCurrentPage(1);
  };

  // free cancellation  filter
  const handleFreeCancelChange = () => {
    setFreeCancelOnly((prev) => !prev);
    setCurrentPage(1);
  };

  // Refund filter
  const handleNonRefundChange = (_) => {
    setNonRefundOnly((prev) => !prev);
    setCurrentPage(1);
  };

  // Sort
  const handleSortChange = (val) => {
    setSortOption(val);
    setCurrentPage(1);
  };

  // Clear all filters
  const resetFilters = (_) => {
    setSortOption('');
    setSearchInput('');
    setHotelNameFilter('');
    setSelectedStars([]);
    setSelectedType(0);
    setNonRefundOnly(false);
    setFreeCancelOnly(false);
    setCurrentPage(1);
  };

  // Filter & sort logic
  const filteredData = useMemo(() => {
    let data = hotelSearchData
      .filter(
        (h) =>
          !hotelNameFilter ||
          h.accommodationName.toLowerCase().includes(hotelNameFilter)
      )
      .filter((h) => !selectedStars.length || selectedStars.includes(h.rating))
      .filter((h) => {
        // if “All Types” is selected, don’t filter anything out
        if (selectedType === 0) return true;
        // otherwise only include this hotel if its type matches
        return h.accommodationType === selectedType;
      })
      .filter(
        (h) =>
          !nonRefundOnly || h.rooms?.rateplans?.[0]?.NonRefundableRate === false
      )
      .filter(
        (h) =>
          !freeCancelOnly ||
          // if freeCancelOnly, rateplans[0].FreeCancellation must be true
          h.rooms?.rateplans?.[0]?.FreeCancellation === true
      );
    if (sortOption === 'price_asc') {
      data = data
        .filter((h) => h.rooms?.rateplans?.[0]?.TotalPrice != null)
        .sort(
          (a, b) =>
            a.rooms.rateplans[0].TotalPrice - b.rooms.rateplans[0].TotalPrice
        );
    } else if (sortOption === 'price_desc') {
      data = data
        .filter((h) => h.rooms?.rateplans?.[0]?.TotalPrice != null)
        .sort(
          (a, b) =>
            b.rooms.rateplans[0].TotalPrice - a.rooms.rateplans[0].TotalPrice
        );
    }
    return data;
  }, [
    hotelSearchData,
    hotelNameFilter,
    selectedStars,
    selectedType,
    nonRefundOnly,
    freeCancelOnly,
    sortOption,
  ]);

  const cityNameTopBar = filteringData.CityName;

  // Prevent accidental refresh
  useEffect(() => {
    const h = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, []);
  // useEffect(() => { const h = e => { if (e.key === "F5" || (e.ctrlKey && /r/i.test(e.key))) { e.preventDefault(); toast.error("Search data will be lost if you refresh the page", { duration: 4000 }); } }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, []);
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'F5') {
        e.preventDefault();
        toast.error('Search data will be lost if you refresh the page', {
          duration: 4000,
        });
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // Pagination
  // const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // const startIdx = (currentPage - 1) * itemsPerPage;
  // const currentData = filteredData.slice(startIdx, startIdx + itemsPerPage);
  // const goToPage = (pg) => setCurrentPage(pg);
  const [displayedData, setDisplayedData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setDisplayedData(filteredData.slice(0, itemsPerPage));
    setCurrentPage(1);
  }, [filteredData]);

  const observerRef = useRef();
  const loadMoreRef = useRef();

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        !isLoadingMore &&
        displayedData.length < filteredData.length
      ) {
        setIsLoadingMore(true);
        setTimeout(() => {
          const nextData = filteredData.slice(
            0,
            displayedData.length + itemsPerPage
          );
          setDisplayedData(nextData);
          setIsLoadingMore(false);
        }, 500); // simulate network delay
      }
    });
    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current.disconnect();
  }, [displayedData, filteredData, isLoadingMore]);

  return (
    <>
      <Container>
        {/* <Toaster position="top-center" /> */}
        <Header />
      </Container>
      <Container_NoGradient>
        <TopBar>
          <Breadcrumb>
            <Link to="/">Main Page</Link> &gt;{' '}
            <Link to="/#/search">Search</Link> &gt; {cityNameTopBar}
          </Breadcrumb>
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
          <FilterButton onClick={() => setFilterOpen(true)}>
            Filters
          </FilterButton>
          <FilterButton onClick={resetFilters}>Reset Filters</FilterButton>
        </TopBar>
        <ContentArea>
          <Sidebar>
            <Filters
              sortOption={sortOption}
              onSortChange={handleSortChange}
              searchInput={searchInput}
              onNameChange={handleNameChange}
              selectedStars={selectedStars}
              onStarChange={handleStarChange}
              nonRefundOnly={nonRefundOnly}
              onNonRefundChange={handleNonRefundChange}
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
              freeCancelOnly={freeCancelOnly}
              onFreeCancelChange={handleFreeCancelChange}
              onClear={resetFilters}
            />
          </Sidebar>
          <Main>
            <HotelCardNew hotelSearchData={displayedData} />
            <div style={{ textAlign: 'center', height: '50px' }}>
              {isLoadingMore && <LoadingSpinner />}
            </div>
            <div ref={loadMoreRef}></div>
          </Main>
        </ContentArea>
        {filterOpen && (
          <ModalOverlay>
            <ModalContent>
              <CloseModal onClick={() => setFilterOpen(false)}>✕</CloseModal>
              <h2>Filters</h2>
              <Sidebar style={{ display: 'block', width: '100%' }}>
                <Filters
                  sortOption={sortOption}
                  onSortChange={handleSortChange}
                  searchInput={searchInput}
                  onNameChange={handleNameChange}
                  selectedStars={selectedStars}
                  onStarChange={handleStarChange}
                  nonRefundOnly={nonRefundOnly}
                  onNonRefundChange={handleNonRefundChange}
                  selectedType={selectedType}
                  onTypeChange={handleTypeChange}
                  freeCancelOnly={freeCancelOnly}
                  onFreeCancelChange={handleFreeCancelChange}
                  onClear={resetFilters}
                />
              </Sidebar>
            </ModalContent>
          </ModalOverlay>
        )}
      </Container_NoGradient>
      <BlockingOverlay show={isSearching} />
      <FooterSection />
    </>
  );
}

// — Layout components —
const TopBar = styled.div`
  width: 100%;
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
  width: 40%;
  color: ${({ theme }) => theme.colors.whiteText};
  a {
    text-decoration: none;
    margin: 0 0.5rem;
  }
`;
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
const SearchButton = styled.button`
  grid-area: search;
  background: ${({ theme, disabled }) =>
    disabled ? '#aaa' : theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.1rem 1.5rem;
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
const FilterButton = styled.button`
  display: none;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;
const ContentArea = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  // gap: 10px;
  margin-top: 1.5rem;
`;
const Sidebar = styled.aside`
  width: 20%;
  padding: 1rem;
  border-radius: 0.8rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;
const Main = styled.main`
  width: 80%;
  padding: 1rem;
  border-radius: 0.8rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
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
// Pagination styles
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  width: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    flex-wrap: wrap;
  }
`;
const PageButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  background: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.secondary};
  color: ${({ theme, active }) => (active ? '#fff' : theme.colors.primaryText)};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;
const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.mainBackground};
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
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

// — Filter controls —
const FilterSection = styled.div`
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.colors.cardColor};
  border-radius: 10px;
  padding: 1.7rem 1rem;
`;
const FilterTitle = styled.h4`
  margin: 0 0 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
`;
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
  cursor: pointer;
`;
const CheckboxInput = styled.input`
  margin-right: 0.5rem;
`;
const RangeInput = styled.input`
  width: 100%;
`;
const SortSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;
const TypeSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;
const ClearFiltersButton = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.7rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;
const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.secondary};
  border-top: 4px solid transparent;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  // margin: 2rem auto;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
const LoadingSpinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.secondary};
  border-top: 4px solid transparent;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const BlockingOverlay = styled.div`
  position: fixed;
  inset: 0;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 50, 0.2); /* deep translucent overlay */
  z-index: 9998; /* one layer below the toast */
  pointer-events: all;
  display: ${({ show }) => (show ? 'block' : 'none')};
`;
