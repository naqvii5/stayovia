// src/pages/HotelDetails.jsx
import React from 'react';
import Container_NoGradient from '../../components/Container_NoGradient';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { MyButton } from '../../components/MyButton';
// import { useThemeContext } from "../../theme/ThemeProvider";
import beachImg from '../../assets/beach.jpeg'; // placeholder
// import mainImg from '../../assets/main.jpeg'; // placeholder
import Ribbon from '../../assets/ribbon.png'; // rating ribbon image

// import roomImg from '../../assets/roomImg.jpeg'; // placeholder
import {
  FaSnowflake,
  FaTv,
  FaShower,
  FaWifi,
  FaBath,
  FaCouch,
  FaBed,
  FaLock,
  FaPhone,
  FaEye,
  FaLeaf,
  FaWater,
  FaUtensils,
  FaBook,
  FaKey,
  FaStore,
  FaFire,
  FaFan,
  FaLightbulb,
  FaTemperatureHigh,
  FaClock,
  FaCoffee,
  FaTable,
  FaPlug,
  FaCompactDisc,
  FaBroadcastTower,
  FaMusic,
  FaVideo,
  // FaIron,
  FaTshirt,
  FaRuler,
  FaDoorOpen,
  FaNewspaper,
  FaBriefcase,
  FaCheck,
  FaShieldAlt,
  FaMagic,
  FaGift,
  FaSatelliteDish,
  FaCloudSun,
} from 'react-icons/fa';
import { Slider as MuiSlider, Box, Modal } from '@mui/material';
import {
  Table,
  TableHead,
  // TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from '@mui/material';

import { useTheme } from 'styled-components';
import { useState } from 'react';
import { useEffect } from 'react';
import FooterSection from '../Login/subcomponents/FooterSection';
import RightColumnSection from './subcomponents/RightColumnSection';
import LeftCard1Section from './subcomponents/LeftCard1Section';
import { useHotelSearch } from '../../context/HotelSearchContext';
// import { da } from 'date-fns/locale';
import RoomTypeRatePlanSection from './subcomponents/RoomTypeRatePlanSection';
// import DestinationSection from '../FilterPage/subComponents/DestinationSection';
// import DateSelectionSection from '../FilterPage/subComponents/DateSelectionSection';
// import RoomSelectionComp from '../FilterPage/subComponents/RoomSelectionComp';
import toast from 'react-hot-toast';
// import { hotelSearch } from '../../api/hotelSearch';
// import Spinner from '../../components/Spinner';
import { specificHotelSearch } from '../../api/specificHotelSearch';
import { FilterSearchCardForSearchPage } from '../../components/FilterSearchCardForSearchPage';

export default function HotelDetails() {
  // const { id } = useParams();
  const {
    setGrandTotal,
    // setGrandTotalWithBuyersGroup
  } = useHotelSearch();
  const [hoveredImg, setHoveredImg] = useState(null);
  const [specificHotelData, setSpecificHotelData] = useState(
    JSON.parse(localStorage.getItem('specificHotelSearchData'))
  );
  // console.log('specificHotelData', specificHotelData)
  // const [buyersGroupData, setBuyersGroupData] = useState(
  //   JSON.parse(localStorage.getItem('buyersGroupData'))
  // );
  // const [exchangeGroupData, setExchangeGroupData] = useState(
  //   JSON.parse(localStorage.getItem('exchangeGroupData'))
  // );
  const [allRoomData, setAllRoomData] = useState([]);
  const images = specificHotelData.accommodationImages || [];

  // const [roomsPayload, setRoomsPayload] = useState([]);
  const [cartHasRefundable, setCartHasRefundable] = useState(false);
  const [cartHasNonRefundable, setCartHasNonRefundable] = useState(false);
  // const [selectedRoomType, setSelectedRoomType] = useState(null);
  const baseImageURL = 'https://connect.purpletech.ai/storage/';
  // const baseImageURL = 'http://192.168.0.148:8002/storage/';

  const baseImageURLRoomType =
    'https://staging.booknowengine.com/storage/room-types/';
  // const baseImageURL = 'http://192.168.0.148:8001/storage/'
  // console.log('allRoomRate', allRoomData)
  // const TOTAL_AVAILABLE = 10;
  // const [imageIndex, setImageIndex] = useState(0);
  const raw = localStorage.getItem('payload');
  const payload = JSON.parse(raw);
  const [rating, setRating] = useState([]);
  const [freeCancellation, setFreeCancellation] = useState(false);
  // 1) Lifted state for every filter
  const [destination, setDestination] = useState(payload.AccommodationId);
  // eslint-disable-next-line no-unused-vars
  const [cityName, setCityName] = useState('');
  const [dates, setDates] = useState({
    checkIn: payload.CheckIn,
    checkOut: payload.CheckOut,
    nights: null,
  });
  const [roomsInfo, setRoomsInfo] = useState(payload.GuestQuantity);

  // const [roomsInfo, setRoomsInfo] = useState([
  //   { label: 'Room 1', Adults: 1, Children: 0 },
  // ]);
  const [isSearching, setIsSearching] = useState(false);
  const [cart, setCart] = useState([]);

  const [cartDetails, setCartDetails] = useState({
    isRefundable: null,
    buyerGroupId: null,
    marginApplied: null,
    cancellationDeadline: null,
  });

  useEffect(() => {
    const raw = localStorage.getItem('specificHotelSearchData');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        // console.log("parsed data", data);
        setSpecificHotelData(data);
      } catch (err) {
        console.error('failed to parse stored hotel data', err);
      }
    }
  }, []);

  useEffect(() => {
    // console.log("specificHotelData", specificHotelData);
    setAllRoomData(specificHotelData?.roomData || []);
  }, [specificHotelData]);

  // const theme = useTheme();
  const searchSpecificHotel = () => {
    if (isSearching) return; // prevent double click

    setIsSearching(true);
    const toastId = toast.loading('Searching data...', {
      style: { fontSize: '1.25rem', padding: '16px 24px' },
    });

    const totalGuests = roomsInfo.reduce(
      (sum, room) => sum + room.Adults + room.Children,
      0
    );

    const payload = {
      CheckIn: dates.checkIn,
      CheckOut: dates.checkOut,
      totalGuests,
      Rooms: roomsInfo.length,
      GuestQuantity: roomsInfo,
      Cancellation: freeCancellation,
      AccommodationId: specificHotelData?.accommodationData?.AccommodationId,
      Rating: rating,
    };

    localStorage.setItem('payload', JSON.stringify(payload));

    specificHotelSearch(payload)
      .then((response) => {
        toast.dismiss(toastId);
        setIsSearching(false);

        if (response.status) {
          toast.success('Data searched!', {
            style: { fontSize: '1.25rem', padding: '16px 24px' },
          });
          setSpecificHotelData(response.data);
          localStorage.setItem(
            'specificHotelSearchData',
            JSON.stringify(response.data)
          );
        } else {
          toast.error('Failed to load hotels', {
            style: { fontSize: '1.25rem', padding: '16px 24px' },
          });
        }
      })
      // eslint-disable-next-line no-unused-vars
      .catch((err) => {
        toast.dismiss(toastId);
        setIsSearching(false);
        toast.error('Error while searching', {
          style: { fontSize: '1.25rem', padding: '16px 24px' },
        });
      });
  };
  // Cart helpers
  // const totalUsed = cart.reduce((sum, item) => sum + item.quantity, 0);
  // helper: total selected for room at `index`
  // function getRoomTotal(index) {
  //   return cart
  //     .filter((item) => item.index === index)
  //     .reduce((sum, item) => sum + item.quantity, 0);
  // }
  // function applyExchange(ratePlanPrice) {
  //   // console.log('ratePlanPrice', ratePlanPrice)
  //   // console.log('exchangeGroupData', exchangeGroupData)
  //   return Number(ratePlanPrice * exchangeGroupData.rate);
  // }
  // function applyMarginFunc(hotel) {
  //   const rp = hotel;
  //   if (!rp) return false;

  //   // BE is sending NonRefundableRate = false when room is refundable,
  //   // true when non‐refundable
  //   // console.log('hotel', buyersGroupData)
  //   if (buyersGroupData?.type) {
  //     const isRoomNonRefundable = Boolean(rp.NonRefundableRate);
  //     const buyersGrouptype = buyersGroupData.type.toLowerCase();
  //     const isForRefundable = buyersGrouptype.includes('refundable');
  //     const isForNonRefundable =
  //       buyersGrouptype.includes('non-refundable') ||
  //       buyersGrouptype.includes('non refundable');

  //     // 1) applies to both kinds
  //     if (isForRefundable && isForNonRefundable) {
  //       return true;
  //     }

  //     // 2) applies only to refundable AND if  room is refundable
  //     if (isForRefundable && !isRoomNonRefundable) {
  //       return true;
  //     }

  //     // 3) applies only to non‐refundable AND if  room is non‐refundable
  //     if (isForNonRefundable && isRoomNonRefundable) {
  //       return true;
  //     }

  //     // otherwise, do not apply margin
  //     return false;
  //   }
  //   return false;
  // }

  // Composite-key helper
  const makeKey = (roomTypeId, ratePlanId, idx) =>
    `${roomTypeId}_${ratePlanId}_${idx}`;

  // 2) ADD a new rate plan to cart
  function addRatePlan(room, rt, idx) {
    // ← We now receive `idx` from the child
    const key = makeKey(room.RoomTypeId, rt.RatePlanId, idx);

    // Compute how many rooms of this type are already booked
    const totalBooked = cart
      .filter((item) => item.roomTypeId === room.RoomTypeId)
      .reduce((sum, item) => sum + item.rooms, 0);
    const remainingCapacity = room.RoomAvaiabile - totalBooked;
    if (remainingCapacity <= 0) {
      // No capacity left → do nothing
      return;
    }
    // var cancellationDeadline = room.rateplans[0]?.CancellationPolicy?.Hours;
    // console.log('buyersGroupData', buyersGroupData)
    setCartDetails({
      isRefundable: !rt.NonRefundableRate,
      // marginApplied: applyMarginFunc(rt),
      // buyerGroupId: applyMarginFunc(rt) ? buyersGroupData.id : null,
      cancellationDeadline: rt.CancellationPolicy?.Hours
        ? rt.CancellationPolicy?.Hours - 24
        : null,
    });
    setCart((prev) => {
      // If this exact key already exists, don’t add again
      if (prev.some((item) => item.key === key)) return prev;

      // const totalPriceExclTax = Math.round((rt.TotalPrice * 100) / 116);

      // const basePrice = rt.TotalPrice - rt.TotalTax;
      // const tax = rt.TotalTax;
      // let finalPrice = basePrice;

      // if (applyMarginFunc(rt)) {
      //   if (buyersGroupData.type_charged === 'fixed') {
      //     finalPrice += buyersGroupData.margin;
      //   } else {
      //     finalPrice += (basePrice * buyersGroupData.margin) / 100;
      //   }
      // }

      // finalPrice += tax;

      // const convertedPrice = applyExchange(finalPrice);
      return [
        ...prev,
        {
          key,
          roomTypeId: room.RoomTypeId,
          ratePlanId: rt.RatePlanId,
          rooms: 1, // start with 1
          // totalPriceExclTax: Math.round(basePrice),
          totalPriceExclTax: rt.TotalPrice - rt.TotalTax,
          totalPct: 16,
          bedTax: false,
          bedTaxValue: 0,
          price: rt.TotalPrice,
          // priceWithBuyersGroup: convertedPrice.toFixed(2), // <-- format only for display/API
          adults: rt.Adults,
          children: rt.Children,
          roomTypeName: room.RoomTypeName,
          ratePlanName: rt.RatePlanName,
          tax: rt.TotalTax,
          nonRefundableRate: rt.NonRefundableRate,
        },
      ];
    });
  }
  // ——————————————————————————————————

  // ——————————————————————————————————
  // 3) Update quantity (increment/decrement)
  // eslint-disable-next-line no-unused-vars
  function updateCartQty(key, delta, idx, roomCapacity) {
    // We also receive `idx` here to match the same key
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.key !== key) return item;

          const newCount = item.rooms + delta;
          if (newCount <= 0) {
            // Remove the line if rooms drop to 0
            return null;
          }

          // Check dynamic capacity for this roomTypeId
          const thisRoomTypeId = item.roomTypeId;
          const totalBooked = prev
            .filter((it) => it.roomTypeId === thisRoomTypeId)
            .reduce((sum, it) => sum + it.rooms, 0);
          const wouldBeTotal = totalBooked + delta;
          // Look up original capacity:
          const roomObject = allRoomData.find(
            (r) => r.RoomTypeId === thisRoomTypeId
          );
          const origCapacity = roomObject ? roomObject.RoomAvaiabile : 0;

          if (wouldBeTotal > origCapacity) {
            // No capacity left → do not increment
            return item;
          }

          return { ...item, rooms: newCount };
        })
        .filter(Boolean)
    );
  }
  // ——————————————————————————————————

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.price * item.rooms,
    0
  );
  // const grandTotalWithBuyersGroup = cart.reduce(
  //   (sum, item) => sum + item.priceWithBuyersGroup * item.rooms,
  //   0
  // );
  setGrandTotal(grandTotal);
  // setGrandTotalWithBuyersGroup(grandTotalWithBuyersGroup);
  // ← ADD THESE NEXT:
  useEffect(() => {
    const cartHasNonRefundableTemp = cart.some(
      (item) => item.nonRefundableRate
    );
    const cartHasRefundableTemp = cart.some((item) => !item.nonRefundableRate);
    setCartHasNonRefundable(cartHasNonRefundableTemp);
    setCartHasRefundable(cartHasRefundableTemp);
    // console.log("cart", cart);
  }, [cart]);

  // Using useTheme from styled-components to access the theme
  const styledTheme = useTheme();

  // Custom arrows
  const PrevArrow = ({ onClick }) => (
    <PrevArrowButton onClick={onClick}>&#x276E;</PrevArrowButton>
  );
  const NextArrow = ({ onClick }) => (
    <NextArrowButton onClick={onClick}>&#x276F;</NextArrowButton>
  );
  // const settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow:
  //     styledTheme.mode === 'light' ||
  //     window.innerWidth >= parseInt(styledTheme.breakpoints.xLargeDesktop)
  //       ? 1
  //       : 1,
  //   slidesToScroll: 1,
  //   arrows: true,
  //   prevArrow: <PrevArrow />,
  //   nextArrow: <NextArrow />,
  //   responsive: [
  //     {
  //       breakpoint: parseInt(styledTheme.breakpoints.xLargeDesktop),
  //       settings: { slidesToShow: 1 },
  //     },
  //   ],
  // };
  const getFacilityIcon = (name) => {
    const keyword = name.toLowerCase();

    if (keyword.includes('shower'))
      return (
        <FeatureItem>
          <FaShower /> Shower
        </FeatureItem>
      );
    if (keyword.includes('ac') || keyword.includes('cold'))
      return (
        <FeatureItem>
          <FaSnowflake /> AC
        </FeatureItem>
      );
    if (keyword.includes('tv') || keyword.includes('television'))
      return (
        <FeatureItem>
          <FaTv /> TV
        </FeatureItem>
      );
    if (keyword.includes('wifi') || keyword.includes('internet'))
      return (
        <FeatureItem>
          <FaWifi /> Wifi
        </FeatureItem>
      );
    if (keyword.includes('bath') || keyword.includes('bathtub'))
      return (
        <FeatureItem>
          <FaBath /> Bath
        </FeatureItem>
      );
    if (keyword.includes('sofa') || keyword.includes('armchair'))
      return (
        <FeatureItem>
          <FaCouch /> Sofa
        </FeatureItem>
      );
    if (keyword.includes('bed'))
      return (
        <FeatureItem>
          <FaBed /> Bed
        </FeatureItem>
      );
    if (
      keyword.includes('lock') ||
      keyword.includes('secure') ||
      keyword.includes('key')
    )
      return (
        <FeatureItem>
          <FaLock /> Secure
        </FeatureItem>
      );
    if (keyword.includes('telephone') || keyword.includes('phone'))
      return (
        <FeatureItem>
          <FaPhone /> Phone
        </FeatureItem>
      );
    if (keyword.includes('view') || keyword.includes('window'))
      return (
        <FeatureItem>
          <FaEye /> View
        </FeatureItem>
      );
    if (keyword.includes('garden'))
      return (
        <FeatureItem>
          <FaLeaf /> Garden
        </FeatureItem>
      );
    if (keyword.includes('sea'))
      return (
        <FeatureItem>
          <FaWater /> Sea View
        </FeatureItem>
      );
    if (
      keyword.includes('kitchen') ||
      keyword.includes('stove') ||
      keyword.includes('cooker')
    )
      return (
        <FeatureItem>
          <FaUtensils /> Kitchen
        </FeatureItem>
      );
    if (keyword.includes('guest handbook') || keyword.includes('book'))
      return (
        <FeatureItem>
          <FaBook /> Handbook
        </FeatureItem>
      );
    if (keyword.includes('entry'))
      return (
        <FeatureItem>
          <FaKey /> Entry
        </FeatureItem>
      );
    if (keyword.includes('store') || keyword.includes('minibar'))
      return (
        <FeatureItem>
          <FaStore /> Store
        </FeatureItem>
      );
    if (
      keyword.includes('oven') ||
      keyword.includes('burner') ||
      keyword.includes('fireplace')
    )
      return (
        <FeatureItem>
          <FaFire /> Fireplace/Oven
        </FeatureItem>
      );
    if (keyword.includes('fan'))
      return (
        <FeatureItem>
          <FaFan /> Fan
        </FeatureItem>
      );
    if (keyword.includes('light') || keyword.includes('mood'))
      return (
        <FeatureItem>
          <FaLightbulb /> Lighting
        </FeatureItem>
      );
    if (
      keyword.includes('temperature') ||
      keyword.includes('heat') ||
      keyword.includes('air')
    )
      return (
        <FeatureItem>
          <FaTemperatureHigh /> Temperature
        </FeatureItem>
      );
    if (
      keyword.includes('alarm') ||
      keyword.includes('wake') ||
      keyword.includes('early') ||
      keyword.includes('late')
    )
      return (
        <FeatureItem>
          <FaClock /> Alarm
        </FeatureItem>
      );
    if (keyword.includes('coffee') || keyword.includes('tea'))
      return (
        <FeatureItem>
          <FaCoffee /> Coffee/Tea
        </FeatureItem>
      );
    if (keyword.includes('dining') || keyword.includes('table'))
      return (
        <FeatureItem>
          <FaTable /> Dining
        </FeatureItem>
      );
    if (
      keyword.includes('dryer') ||
      keyword.includes('laundry') ||
      keyword.includes('washing')
    )
      return (
        <FeatureItem>
          <FaPlug /> Laundry
        </FeatureItem>
      );
    if (
      keyword.includes('cd') ||
      keyword.includes('dvd') ||
      keyword.includes('disc')
    )
      return (
        <FeatureItem>
          <FaCompactDisc /> CD/DVD
        </FeatureItem>
      );
    if (keyword.includes('radio'))
      return (
        <FeatureItem>
          <FaBroadcastTower /> Radio
        </FeatureItem>
      );
    if (
      keyword.includes('music') ||
      keyword.includes('hi-fi') ||
      keyword.includes('ipod')
    )
      return (
        <FeatureItem>
          <FaMusic /> Music
        </FeatureItem>
      );
    if (keyword.includes('video'))
      return (
        <FeatureItem>
          <FaVideo /> Video
        </FeatureItem>
      );
    // if (keyword.includes("ironing") || keyword.includes("press")) return <FeatureItem><FaIron /> Ironing</FeatureItem>;
    if (keyword.includes('closet') || keyword.includes('wardrobe'))
      return (
        <FeatureItem>
          <FaTshirt /> Wardrobe
        </FeatureItem>
      );
    if (keyword.includes('floor'))
      return (
        <FeatureItem>
          <FaRuler /> Floor Space
        </FeatureItem>
      );
    if (keyword.includes('curtain') || keyword.includes('drape'))
      return (
        <FeatureItem>
          <FaDoorOpen /> Curtain
        </FeatureItem>
      );
    if (keyword.includes('newspaper'))
      return (
        <FeatureItem>
          <FaNewspaper /> Newspaper
        </FeatureItem>
      );
    if (keyword.includes('desk') || keyword.includes('work'))
      return (
        <FeatureItem>
          <FaBriefcase /> Work Desk
        </FeatureItem>
      );
    if (keyword.includes('service') || keyword.includes('check'))
      return (
        <FeatureItem>
          <FaCheck /> Room Service
        </FeatureItem>
      );
    if (
      keyword.includes('deposit') ||
      keyword.includes('safe') ||
      keyword.includes('safety')
    )
      return (
        <FeatureItem>
          <FaShieldAlt /> Safe Deposit
        </FeatureItem>
      );
    if (keyword.includes('marble'))
      return (
        <FeatureItem>
          <FaMagic /> Marble Interior
        </FeatureItem>
      );
    if (keyword.includes('pack'))
      return (
        <FeatureItem>
          <FaGift /> Welcome Pack
        </FeatureItem>
      );
    if (keyword.includes('satellite'))
      return (
        <FeatureItem>
          <FaSatelliteDish /> Satellite TV
        </FeatureItem>
      );
    if (keyword.includes('central heating'))
      return (
        <FeatureItem>
          <FaCloudSun /> Heating
        </FeatureItem>
      );

    // Default
    return (
      <FeatureItem>
        <FaCheck /> {name}
      </FeatureItem>
    );
  };

  // auto-advance every 3s
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setImageIndex((prev) =>
  //       prev === hotel.images.length - 1 ? 0 : prev + 1
  //     );
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, [hotel.images.length]);
  // const baseImageURL = 'https://stagingconnect.purpletech.ai/storage/'
  // console.log('specificHotelData', specificHotelData);
  return (
    <>
      <Container>
        <Header />
      </Container>
      <Container_NoGradient>
        <TopBar>
          <Breadcrumb>
            <Link to="/">Main Page</Link> &gt;
            <Link to="/#/search"> Search</Link>
            &gt; Hotel Details
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
            handleSearch={searchSpecificHotel}
          />
        </TopBar>

        <ContentArea>
          <LeftColumn>
            <LeftColumnCards>
              <LeftCard1Section
                specificHotelData={specificHotelData.accommodationData}
              />
            </LeftColumnCards>

            <LeftColumnCards>
              <Card2>
                <Card2ImageSlider>
                  <SliderContainer>
                    <SliderContainer>
                      {/* Left half: slot 0 or demo */}
                      <LeftHalf>
                        <ImgThumbnail
                          src={
                            images[0]?.ImageURL
                              ? baseImageURL + images[0].ImageURL
                              : beachImg
                          }
                          // src={baseImageURL + (images[0]?.ImageURL || beachImg)}
                          // onMouseEnter={() =>
                          //   setHoveredImg(
                          //     baseImageURL + (images[0]?.ImageURL || beachImg)
                          //   )
                          // }
                          // onMouseLeave={() => setHoveredImg(null)}
                          onClick={() =>
                            setHoveredImg(
                              baseImageURL + (images[0]?.ImageURL || beachImg)
                            )
                          }
                        />
                      </LeftHalf>

                      {/* Right grid: slots 1–4 or demo */}
                      <RightGrid>
                        {[1, 2, 3, 4].map((i) => (
                          <ImgThumbnail
                            key={i}
                            src={
                              baseImageURL + (images[i]?.ImageURL || beachImg)
                            }
                            onClick={() =>
                              setHoveredImg(
                                baseImageURL + (images[i]?.ImageURL || beachImg)
                              )
                            }

                            // onMouseEnter={() =>
                            //   setHoveredImg(
                            //     baseImageURL + (images[i]?.ImageURL || beachImg)
                            //   )
                            // }
                            // onMouseLeave={() => setHoveredImg(null)}
                          />
                        ))}
                      </RightGrid>
                    </SliderContainer>

                    {/* Re-enable your modal if you want the zoom effect */}
                    <Modal
                      open={Boolean(hoveredImg)}
                      onClose={() => setHoveredImg(null)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        component="img"
                        src={hoveredImg}
                        sx={{
                          maxWidth: '80vw',
                          maxHeight: '80vh',
                          borderRadius: '8px',
                        }}
                      />
                    </Modal>
                  </SliderContainer>

                  <RatingRibbon>
                    {specificHotelData.accommodationData.Rating}
                  </RatingRibbon>
                </Card2ImageSlider>

                <Card2HotelSpecifications>
                  <SpecItem>
                    Check-In: {specificHotelData.accommodationData.CheckInFrom}
                  </SpecItem>
                  <SpecItem>
                    Check-Out: {specificHotelData.accommodationData.CheckOutTo}
                  </SpecItem>
                </Card2HotelSpecifications>
                <Card2HotelSpecifications>
                  <SpecItemFacilities>
                    Property Facilities:
                    {specificHotelData?.accommodationData?.facilities?.length >
                      0 &&
                      specificHotelData?.accommodationData?.facilities?.map(
                        // eslint-disable-next-line no-unused-vars
                        (facility, i) => getFacilityIcon(facility?.FacilityName)
                      )}
                  </SpecItemFacilities>
                  <SpecItem></SpecItem>
                </Card2HotelSpecifications>
              </Card2>
            </LeftColumnCards>

            <LeftColumnCards>
              <Card3Wrapper>
                {allRoomData.map((room, idx) => (
                  <Card3 key={idx}>
                    <RoomTypeData>
                      <RoomTypeCard>
                        {/* key={idx}> */}
                        <ImgWrapper>
                          <img
                            src={
                              baseImageURLRoomType +
                              room?.RoomTypeImages[0]?.ImageUrl
                            }
                            alt={room.RoomTypeName}
                            style={{
                              width: '100%',
                              borderRadius: '0.5rem 0 0 0.5rem',
                              padding: '0',
                              margin: '0',
                              maxHeight: '185px',
                              objectFit: 'cover',
                            }}
                          />
                        </ImgWrapper>
                        <DetailsWrapper>
                          <h2
                            style={{
                              margin: 0,
                              color: styledTheme.colors.primary,
                            }}
                          >
                            {room.RoomTypeName}
                          </h2>

                          <div
                            style={{
                              fontSize: styledTheme.fontSizes.xsmall,
                              color: styledTheme.colors.secondaryText,
                              margin: '0px 0px 5px 0px',
                            }}
                          >
                            <h3>
                              {/* {console.log('room', room)} */}
                              {room?.RoomSize} sq.ft
                              {/* with amenities like AC, TV, */}
                            </h3>
                          </div>
                          <div
                            style={{
                              fontSize: styledTheme.fontSizes.xsmall,
                              color: styledTheme.colors.secondaryText,
                              margin: '0px 0px 5px 0px',
                            }}
                          >
                            <h3>
                              {/* {console.log('room', room)} */}
                              {room?.NoOfBeds} Bed(s).
                              {/* with amenities like AC, TV, */}
                            </h3>
                          </div>
                          <div
                            style={{
                              fontSize: styledTheme.fontSizes.xsmall,
                              color: styledTheme.colors.secondaryText,
                              margin: '0px 0px 5px 0px',
                            }}
                          >
                            <p>
                              {/* {console.log('room', room)} */}
                              {room?.RoomTypeDescription}
                              {/* {room?.RoomTypeName} */}
                              {/* {' '}with amenities like AC, TV, */}
                            </p>
                          </div>
                          <FeatureList>
                            {room?.Facilities?.length > 0 &&
                              // eslint-disable-next-line no-unused-vars
                              room?.Facilities?.map((facility, i) =>
                                getFacilityIcon(facility?.FacilityName)
                              )}
                          </FeatureList>
                        </DetailsWrapper>
                      </RoomTypeCard>
                      {/* ))} */}
                    </RoomTypeData>

                    <Card3RoomTypeTable>
                      {room.rateplans.length > 0 ? (
                        <ResponsiveTableFix>
                          <TableContainer
                            className="rp-table"
                            component={Paper}
                            sx={{
                              width: '100%',
                              margin: '0 0 30px 0',
                              backgroundColor: styledTheme.colors.cardColor,
                              borderRadius: '1rem',
                              border: `2px solid ${styledTheme.colors.cardColor2}`,
                              borderBottom: `0.1px solid ${styledTheme.colors.primary}`,
                              /* no horizontal overflow—cards handle small screens */
                              overflowX: 'visible',
                            }}
                          >
                            <h3
                              style={{
                                margin: '10px 10px',
                                color: styledTheme.colors.primaryText,
                              }}
                            >
                              Available Rate Plan(s)
                            </h3>
                            <Table
                              size="large"
                              sx={{
                                tableLayout: 'fixed',
                                width: '100%',
                              }}
                            >
                              <TableHead>
                                <TableRow
                                  sx={{
                                    backgroundColor:
                                      styledTheme.colors.cardColor2,
                                  }}
                                >
                                  {[
                                    'Room',
                                    'Breakfast',
                                    'Cancellation',
                                    'Total Price',
                                    'Pax',
                                    'Refundable',
                                    'Select',
                                  ].map((h) => (
                                    <TableCell
                                      key={h}
                                      sx={{
                                        color: '#fff',
                                        backgroundColor:
                                          styledTheme.colors.primary,
                                        // fontWeight: "bold",
                                      }}
                                    >
                                      <h2> {h}</h2>
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <RoomTypeRatePlanSection
                                room={room}
                                cart={cart}
                                setCart={setCart}
                                // applyMarginFunc={applyMarginFunc}
                                // applyExchange={applyExchange}
                                updateCartQty={updateCartQty}
                                addRatePlan={addRatePlan}
                                makeKey={makeKey}
                                // buyersGroupData={buyersGroupData}
                                cartHasRefundable={cartHasRefundable}
                                cartHasNonRefundable={cartHasNonRefundable}
                              />
                            </Table>
                          </TableContainer>
                        </ResponsiveTableFix>
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            padding: '20px 10px',
                            // margin: " 0 0 30px 0",
                            backgroundColor: styledTheme.colors.cardColor,
                            borderRadius: '0.5rem',
                            borderBottom: `0.1px solid ${styledTheme.colors.primary}`,
                          }}
                        >
                          <h3 style={{ color: 'red' }}>
                            No Rate Plan Available!
                          </h3>
                        </div>
                      )}
                    </Card3RoomTypeTable>
                  </Card3>
                ))}
              </Card3Wrapper>
            </LeftColumnCards>
            {/* <LeftColumnCards>
            <h1>hotel Details</h1>
          </LeftColumnCards> */}
          </LeftColumn>

          {/* Right Column + bottom sticky bar for small devices */}
          <RightColumnSection
            cart={cart}
            cartDetails={cartDetails}
            grandTotal={grandTotal}
            // grandTotalWithBuyersGroup={grandTotalWithBuyersGroup}
          />
        </ContentArea>
      </Container_NoGradient>
      <BlockingOverlay show={isSearching} />
      <FooterSection />
    </>
  );
}

// Breadcrumb / Top bar
const TopBar = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  padding: 1rem 2rem;
  border-radius: 0.8rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap; /* lets children wrap when space is tight */

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column; /* stack */
    align-items: stretch; /* stretch children */
    padding: 0.75rem 1rem;

    /* make ALL direct children take full width, including your
       <FilterSearchCardForSearchPage /> component */
    & > * {
      width: 100%;
    }
  }
`;

// Breadcrumb: fixed width on desktop, full width on tablet and below
const Breadcrumb = styled.div`
  width: 40%;
  color: ${({ theme }) => theme.colors.whiteText};

  a {
    text-decoration: none;
    margin: 0 0.5rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    margin-bottom: 0.5rem; /* breathing room from the search card */
  }
`;

// Main layout
const ContentArea = styled.div`
      display: flex;
      gap: 2rem;
      margin-top: 1.5rem;

      @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        flex - direction: column;
  }
      `;

const LeftColumn = styled.main`
  flex: 0 0 80%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1 1 100%;
  }
`;
const LeftColumnCards = styled.div`
  display: flex;
  width: 100%;
  background: ${({ theme }) => theme.colors.cardColor};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  align-items: center;
`;

// Card1 Styles

// Card2 Styles: image slider + specs
const Card2 = styled.div`
      display: flex;
      overflow: hidden;
      flex-direction: column;

      width: 100%;
      @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        flex - direction: column;
  }
      `;

const Card2ImageSlider = styled.div`
  flex: 0 0 100%;
  display: flex;
  overflow: hidden;
  position: relative;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;
const RatingRibbon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: url(${Ribbon}) no-repeat center/cover;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: #fff;
`;
// Arrow button common styles
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

const PrevArrowButton = styled(ArrowButton)`
  left: 10px;
`;
const NextArrowButton = styled(ArrowButton)`
  right: 10px;
`;

const Card2HotelSpecifications = styled.div`
  // display: none;
  display: flex;
  // flex: 0 0 20%;
  padding: 1rem;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 0.5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    // flex-direction: row;
    // justify-content: space-around;
  }
`;

const SpecItem = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
`;

const SpecItemFacilities = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const RightColumn = styled.div`
  flex: 0 0 20%;
  height: fit-content;

  background: ${({ theme }) => theme.colors.cardColor};
  padding: 1rem;
  border-radius: 0.8rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

// Card2 Styles: image slider + specs
const Card3Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const Card3 = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
`;

const RoomTypeData = styled.div`
  display: flex;
  flex-direction: row;
  // gap: 0px;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-wrap: wrap;
  }
`;
const RoomTypeCard = styled.div`
  display: flex;
  padding: 10px 0px;
  border: 1px solid
    ${({ theme }) =>
      theme.mode == 'light' ? '#e9e9e9' : theme.colors.secondaryText};
  width: 100%;
  background: ${({ theme }) => theme.colors.cardColor};
  border-radius: 0.8rem;
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    height: 100%;
    // gap: 2rem;
  }
`;
const ImgWrapper = styled.div`
  flex: 0 0 30%;
  padding: 0;
`;
const DetailsWrapper = styled.div`
  flex: 1;
  margin-left: 5px;
  padding: 16px;
  border-left: 1px solid
    ${({ theme }) =>
      theme.mode == 'light'
        ? theme.colors.primary
        : theme.colors.secondaryText};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    border: none;
  }
`;
const FeatureList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
`;

const Card3RoomTypeTable = styled.div`
  width: 100%;
  overflow-x: auto; /* horizontal scroll when needed */
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  border-radius: 1rem;

  /* nicer thin scrollbar */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.cardColor2} transparent;
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.cardColor2};
    border-radius: 999px;
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
// replace your existing ResponsiveTableFix with this:
const ResponsiveTableFix = styled.div`
  width: 100%;

  /* Desktop defaults */
  .rp-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: auto; /* natural sizing */
  }
  .rp-table th,
  .rp-table td {
    padding: 12px 14px;
    white-space: normal;
    word-break: break-word;
    overflow-wrap: anywhere;
    line-height: 1.35;
    vertical-align: top;
  }

  /* Tablet & below: vertical “header | value” layout */
  @media (max-width: 900px) {
    .rp-table thead {
      display: none;
    }

    .rp-table,
    .rp-table tbody,
    .rp-table tr,
    .rp-table td {
      display: block;
      width: 100%;
    }

    .rp-table tr {
      background: ${({ theme }) => theme.colors.cardColor};
      border: 1px solid ${({ theme }) => theme.colors.cardColor2};
      border-radius: 12px;
      padding: 4px 0; /* inner spacing comes from cells */
      margin-bottom: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      overflow: hidden; /* prevent bleed */
    }

    /* Each cell becomes: [label | value] */
    .rp-table td {
      display: grid;
      grid-template-columns: 9.5rem 1fr; /* header | value */
      align-items: start;
      gap: 10px;
      padding: 10px 12px;
      border-bottom: 1px dashed ${({ theme }) => theme.colors.cardColor2};
    }
    .rp-table td:last-child {
      border-bottom: 0;
    }

    /* Labels (headers on the left) */
    .rp-table td::before {
      font-weight: 700;
      color: ${({ theme }) => theme.colors.secondaryText};
      align-self: start;
    }
    .rp-table td:nth-child(1)::before {
      content: 'Room';
    }
    .rp-table td:nth-child(2)::before {
      content: 'Breakfast';
    }
    .rp-table td:nth-child(3)::before {
      content: 'Cancellation';
    }
    .rp-table td:nth-child(4)::before {
      content: 'Total Price';
    }
    .rp-table td:nth-child(5)::before {
      content: 'Pax';
    }
    .rp-table td:nth-child(6)::before {
      content: 'Refundable';
    }
    .rp-table td:nth-child(7)::before {
      content: 'Select';
    }

    /* Make action controls in the "Select" cell fill nicely */
    .rp-table td:nth-child(7) > * {
      justify-self: start;
      width: 100%;
      max-width: 100%;
    }

    /* Slight emphasis for price row */
    .rp-table td:nth-child(4) {
      background: ${({ theme }) => theme.colors.cardColor};
    }

    /* Phone tweaks */
    @media (max-width: 560px) {
      .rp-table td {
        grid-template-columns: 8.5rem 1fr;
        padding: 8px 10px;
      }
    }
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
const SliderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 55vh;
  objectfit: fill;
  borderradius: 0.8rem 0 0 0.8rem;
  border: 0.5px solid
    ${({ theme }) =>
      theme.mode == 'light' ? '#e9e9e9' : theme.colors.cardColor};
`;

const LeftHalf = styled.div`
  width: 50%;
  padding: 4px;
`;

const RightGrid = styled.div`
  width: 50%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 4px;
`;

const ImgThumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
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
