// src/pages/SubComponents/HotelCard.jsx
import React from 'react';
import styled from 'styled-components';
import Ribbon from '../../../assets/ribbon.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import toast from 'react-hot-toast';
import { specificHotelSearch } from '../../../api/specificHotelSearch';
import { useHotelSearch } from '../../../context/HotelSearchContext';
import { MyButton } from '../../../components/MyButton';
import { useRef } from 'react';
import { FaWifi, FaParking, FaConciergeBell, FaVideo } from 'react-icons/fa';

// Mapping accommodation types
const typeOptions = [
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

// Container with three columns
const HotelCardContainer = styled.div`
  display: flex;
  width: 100%;
  background: ${({ theme }) => theme.colors.cardColor};
  border-radius: 1rem;
  overflow: hidden;
  // gap: 1.5rem;
  justify-content: space-between;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

// Column 1: Images (40%)
const ImageColumn = styled.div`
  flex: 0 0 35%;
  position: relative;
  max-width: 35%;
  .slick-slide img {
    width: 100%;
    height: 210px;
    object-fit: cover;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    max-width: 100%;
  }
`;

// Column 2: Hotel details (30%)
const DetailsColumn = styled.div`
  flex: 0 0 35%;
  display: flex;
  margin: 0 0 0 10px;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  // border-right: 1px solid ${({ theme }) => theme.colors.primary};
  border-right: 1px solid #d3d3d3;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

// Column 3: Rateplan details (30%)
const RateplanColumn = styled.div`
  flex: 0 0 20%;
  display: flex;
  margin: 0 0 0 10px;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1rem 1rem;
  gap: 0.5rem;
`;
// Column 3: Rateplan details (30%)
const RateplanColumnDataDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  // justify-content: space-between;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-evenly;
  }
`;

// Common styled items
const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
`;
const TitleAmount = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.secondary};
`;
const TitleTax = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xxsmall};
  font-weight: 0;
  // color: ${({ theme }) => theme.colors.primary};
  color: gray;
`;
const SubText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
  margin: 0.25rem 0;
`;
const SubTextCancellationPolicy = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xxsmall};
  // color: ${({ theme }) => theme.colors.primaryText};
  color: green;
  margin: 0.25rem 0;
`;
const RibbonBadge = styled.div`
  background: url(${Ribbon}) no-repeat center/cover;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: #fff;
`;
const Stars = styled.div`
  color: #fbc02d;
  font-size: ${({ theme }) => theme.fontSizes.small};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.25rem;
`;

// Slider arrows
const ArrowButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;
const FacilitiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 0.5rem;
`;

const FacilityBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.8rem;
  background: #fff;
  // color: #000;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xxsmall};
`;

const PrevArrow = ({ onClick }) => (
  <ArrowButton style={{ left: 10 }} onClick={onClick}>
    &#x276E;
  </ArrowButton>
);
const NextArrow = ({ onClick }) => (
  <ArrowButton style={{ right: 10 }} onClick={onClick}>
    &#x276F;
  </ArrowButton>
);
function MyBadge() {
  const randomCountRef = useRef(Math.floor(Math.random() * 6) + 1);
  return <div>Only {randomCountRef.current} left</div>;
}
export default function HotelCardNew({ hotelSearchData }) {
  const { filteringData, setSpecificHotelSearchData } = useHotelSearch();
  const baseImageURL = 'https://connect.purpletech.ai/storage/';
  // const baseImageURL = 'http://192.168.0.148:8002/storage/';
  console.log('hotelSearchData :>> ', hotelSearchData);
  const searchSpecificHotel = (id) => {
    if (
      !filteringData?.CheckIn ||
      !filteringData?.CheckOut ||
      !filteringData?.Rooms ||
      !filteringData?.GuestQuantity ||
      !id
    ) {
      toast.error('Data is missing!', {
        style: { fontSize: '1.25rem', padding: '16px 24px' },
      });
      return;
    }
    const totalGuests = filteringData.GuestQuantity?.reduce(
      (sum, room) => sum + (room?.Adults || 0) + (room?.Children || 0),
      0
    );
    const payload = {
      CheckIn: filteringData.CheckIn,
      CheckOut: filteringData.CheckOut,
      totalGuests,
      Rooms: filteringData.Rooms,
      GuestQuantity: filteringData.GuestQuantity,
      Cancellation: filteringData.Cancellation,
      AccommodationId: id,
    };
    localStorage.setItem('payload', JSON.stringify(payload));
    const toastId = toast.loading('Searching…', {
      style: { fontSize: '1.25rem', padding: '16px 24px' },
    });
    specificHotelSearch(payload)
      .then((response) => {
        setSpecificHotelSearchData(response?.data);
        localStorage.setItem(
          'specificHotelSearchData',
          JSON.stringify(response?.data)
        );
        toast.dismiss(toastId);
        if (response?.status) {
          toast.success('Data searched!', {
            style: { fontSize: '1.25rem', padding: '16px 24px' },
          });
          window.open(`/#/hotel-details`, '_blank');
        } else {
          toast.error('Failed to load hotels', {
            style: { fontSize: '1.25rem', padding: '16px 24px' },
          });
        }
      })
      .catch((err) => {
        console.error('Search API failed:', err);
        toast.dismiss(toastId);
        toast.error('Error', {
          style: { fontSize: '1.25rem', padding: '16px 24px' },
        });
      });
  };

  return (
    <>
      {hotelSearchData?.length > 0 ? (
        hotelSearchData.map((hotel) => {
          const facilityNames = new Set(
            hotel.accommodationFacilities?.map((f) => f.FacilityName) || []
          );
          const settings = {
            dots: false,
            infinite: hotel?.images?.length > 1,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: hotel?.images?.length > 1,
            prevArrow: <PrevArrow />,
            nextArrow: <NextArrow />,
          };
          const typeLabel =
            typeOptions.find((opt) => opt.id === hotel?.accommodationType)
              ?.label || 'Unknown';
          return (
            <HotelCardContainer key={hotel?.accommodationId}>
              <ImageColumn>
                <Slider
                  {...settings}
                  // style={{
                  // maxHeight: '300px',
                  // maxWidth: '320px',
                  // }}
                >
                  {hotel?.images?.map((src, idx) => (
                    // <div key={idx} style={{ height: '100%' }}>
                    <div>
                      {/* key={idx} style={{ height: '100%' }}> */}
                      <img
                        // style={{ maxWidth: '380px', maxHeight: '300px' }}
                        src={baseImageURL + src?.ImageURL}
                        alt={`${hotel?.accommodationName} ${idx + 1}`}
                      />
                    </div>
                  ))}
                </Slider>
              </ImageColumn>
              <DetailsColumn>
                <div>
                  <div>
                    <Title>{hotel?.accommodationName}</Title>
                    <Stars>
                      {'★'.repeat(Math.floor(hotel?.rating || 0))}
                      <SubText>{typeLabel}</SubText>
                    </Stars>
                    {/* <SubText>{hotel?.details}</SubText> */}
                  </div>
                  {/* <RibbonBadge>{hotel?.rating}</RibbonBadge> */}
                  <div>
                    <SubText>{hotel?.address}</SubText>
                  </div>
                </div>

                {/* === NEW FACILITIES SECTION === */}
                <div>
                  <SubText as="div" style={{ fontWeight: '300' }}>
                    Facilities Provided
                  </SubText>
                  <FacilitiesContainer>
                    {(facilityNames.has('WiFi') ||
                      facilityNames.has('Internet')) && (
                      <FacilityBox>
                        <FaWifi /> WiFi
                      </FacilityBox>
                    )}
                    {facilityNames.has('Parking') && (
                      <FacilityBox>
                        <FaParking /> Parking
                      </FacilityBox>
                    )}
                    {facilityNames.has('Room Service') && (
                      <FacilityBox>
                        <FaConciergeBell /> Room Service
                      </FacilityBox>
                    )}
                    {facilityNames.has('Security CCTV') && (
                      <FacilityBox>
                        <FaVideo /> Security
                      </FacilityBox>
                    )}
                  </FacilitiesContainer>
                </div>
              </DetailsColumn>
              <RateplanColumn>
                <div
                  style={{
                    background: 'red',
                    padding: '5px 16px',
                    borderRadius: '0.1rem',
                    margin: 0,
                    color: '#fff',
                    textWrap: 'nowrap',
                  }}
                >
                  ONLY {Math.floor(Math.random() * 3) + 1} LEFT
                </div>
                <RateplanColumnDataDiv>
                  {/* <Title as="div">{hotel?.rooms?.RoomTypeName}</Title> */}

                  {/* <div> */}

                  <TitleTax>
                    {hotel?.rooms?.rateplans?.[0]?.BreakfastIncluded
                      ? 'Breakfast included'
                      : 'Breakfast not included'}
                  </TitleTax>
                  <TitleTax>
                    {hotel?.rooms?.rateplans?.[0]?.NonRefundableRate
                      ? 'Not Refundable'
                      : 'Refundable'}
                  </TitleTax>
                  <TitleTax
                  // as="div"
                  // style={{
                  // display: 'flex',
                  // alignSelf: 'flex-end',
                  // }} /* ← only this child moves right */
                  >
                    PKR.
                    {hotel?.rooms?.rateplans?.[0]?.totalPriceExcludeTax || '0'}+
                    PKR. {hotel?.rooms?.rateplans?.[0]?.TotalTax || '0'} Tax{' '}
                  </TitleTax>
                  <TitleAmount>
                    PKR.{' '}
                    {hotel?.rooms?.rateplans?.[0]?.TotalPrice.toLocaleString() ||
                      '0'}
                  </TitleAmount>
                  <SubTextCancellationPolicy>
                    {hotel?.rooms?.rateplans?.[0]?.CancellationPolicy
                      ? '+ Free Cancellation'
                      : ''}
                  </SubTextCancellationPolicy>
                  {/* </div> */}
                </RateplanColumnDataDiv>
                <MyButton
                  color="#fff"
                  textColor="#fff"
                  border="none"
                  padding="0.60rem 1.35rem"
                  width="100%"
                  height="100%"
                  borderRadius="0.8rem"
                  bgColor={({ theme }) => theme.colors.primary}
                  fontSize={({ theme }) => theme.fontSizes.xxsmall}
                  onClick={() => searchSpecificHotel(hotel?.accommodationId)}
                >
                  Show All
                </MyButton>
              </RateplanColumn>
            </HotelCardContainer>
          );
        })
      ) : (
        <HotelCardContainer>
          <DetailsColumn>
            <Title>No Hotel Available!</Title>
          </DetailsColumn>
        </HotelCardContainer>
      )}
    </>
  );
}
