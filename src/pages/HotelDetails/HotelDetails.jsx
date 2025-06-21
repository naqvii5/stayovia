// src/pages/HotelDetails.jsx
import React from "react";
import Container_NoGradient from "../../components/Container_NoGradient";
import Header from "../../components/Header";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { MyButton } from "../../components/MyButton";
// import { useThemeContext } from "../../theme/ThemeProvider";
import beachImg from "../../assets/beach.jpeg"; // placeholder
import mainImg from "../../assets/main.jpeg"; // placeholder
import Ribbon from "../../assets/ribbon.png"; // rating ribbon image

import roomImg from "../../assets/roomImg.jpeg"; // placeholder
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
} from "react-icons/fa";
import { Slider as MuiSlider, Box } from "@mui/material";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";

import { useTheme } from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import FooterSection from "../Login/subcomponents/FooterSection";
import RightColumnSection from "./subcomponents/RightColumnSection";
import LeftCard1Section from "./subcomponents/LeftCard1Section";
import { useHotelSearch } from "../../context/HotelSearchContext";
import { da } from "date-fns/locale";
import RoomTypeRatePlanSection from "./subcomponents/RoomTypeRatePlanSection";

export default function HotelDetails() {
  const { id } = useParams();
  const { setGrandTotal, setGrandTotalWithBuyersGroup } = useHotelSearch();

  const [specificHotelData, setSpecificHotelData] = useState(
    JSON.parse(localStorage.getItem("specificHotelSearchData"))
  );
  // console.log('specificHotelData', specificHotelData)
  const [buyersGroupData, setBuyersGroupData] = useState(
    JSON.parse(localStorage.getItem("buyersGroupData"))
  );
  const [exchangeGroupData, setExchangeGroupData] = useState(
    JSON.parse(localStorage.getItem("exchangeGroupData"))
  );
  const [allRoomData, setAllRoomData] = useState([]);
  const [roomsPayload, setRoomsPayload] = useState([]);
  const [cartHasRefundable, setCartHasRefundable] = useState(false);
  const [cartHasNonRefundable, setCartHasNonRefundable] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const baseImageURL = 'https://connect.purpletech.ai/storage/'
  const baseImageURLRoomType = 'https://staging.booknowengine.com/storage/room-types/'
  // const baseImageURL = 'http://192.168.0.148:8001/storage/'
  // console.log('allRoomRate', allRoomData)
  // const TOTAL_AVAILABLE = 10;
  const [imageIndex, setImageIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartDetails, setCartDetails] = useState({
    isRefundable: null,
    buyerGroupId: null,
    marginApplied: null,
    cancellationDeadline: null
  });

  useEffect(() => {
    const raw = localStorage.getItem("specificHotelSearchData");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        // console.log("parsed data", data);
        setSpecificHotelData(data);
      } catch (err) {
        console.error("failed to parse stored hotel data", err);
      }
    }
  }, []);

  useEffect(() => {
    // console.log("specificHotelData", specificHotelData);
    setAllRoomData(specificHotelData?.roomData || []);
  }, [specificHotelData]);

  // const theme = useTheme();


  // Cart helpers
  const totalUsed = cart.reduce((sum, item) => sum + item.quantity, 0);
  // helper: total selected for room at `index`
  function getRoomTotal(index) {
    return cart
      .filter((item) => item.index === index)
      .reduce((sum, item) => sum + item.quantity, 0);
  }
  function applyExchange(ratePlanPrice) {
    // console.log('ratePlanPrice', ratePlanPrice)
    // console.log('exchangeGroupData', exchangeGroupData)
    return Number(ratePlanPrice * exchangeGroupData.rate)
  }
  function applyMarginFunc(hotel) {
    const rp = hotel;
    if (!rp) return false;

    // BE is sending NonRefundableRate = false when room is refundable,
    // true when non‐refundable
    // console.log('hotel', buyersGroupData)
    if (buyersGroupData?.type) {
      const isRoomNonRefundable = Boolean(rp.NonRefundableRate);
      const buyersGrouptype = buyersGroupData.type.toLowerCase();
      const isForRefundable = buyersGrouptype.includes('refundable');
      const isForNonRefundable =
        buyersGrouptype.includes('non-refundable') || buyersGrouptype.includes('non refundable');

      // 1) applies to both kinds
      if (isForRefundable && isForNonRefundable) {
        return true;
      }

      // 2) applies only to refundable AND if  room is refundable
      if (isForRefundable && !isRoomNonRefundable) {
        return true;
      }

      // 3) applies only to non‐refundable AND if  room is non‐refundable
      if (isForNonRefundable && isRoomNonRefundable) {
        return true;
      }

      // otherwise, do not apply margin
      return false;
    }
    return false;
  }


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
    var cancellationDeadline = room.rateplans[0]?.CancellationPolicy?.Hours;
    // console.log('buyersGroupData', buyersGroupData)
    setCartDetails({
      isRefundable: !rt.NonRefundableRate,
      marginApplied: applyMarginFunc(rt),
      buyerGroupId: applyMarginFunc(rt) ? buyersGroupData.id : null,
      cancellationDeadline: rt.CancellationPolicy?.Hours ? rt.CancellationPolicy?.Hours - 24 : null,
    });
    setCart((prev) => {
      // If this exact key already exists, don’t add again
      if (prev.some((item) => item.key === key)) return prev;

      // const totalPriceExclTax = Math.round((rt.TotalPrice * 100) / 116);

      const basePrice = rt.TotalPrice - rt.TotalTax;
      const tax = rt.TotalTax;
      let finalPrice = basePrice;

      if (applyMarginFunc(rt)) {
        if (buyersGroupData.type_charged === "fixed") {
          finalPrice += buyersGroupData.margin;
        } else {
          finalPrice += (basePrice * buyersGroupData.margin) / 100;
        }
      }

      finalPrice += tax;

      const convertedPrice = applyExchange(finalPrice);
      return [
        ...prev,
        {
          key,
          roomTypeId: room.RoomTypeId,
          ratePlanId: rt.RatePlanId,
          rooms: 1, // start with 1
          totalPriceExclTax: Math.round(basePrice),
          totalPct: 16,
          bedTax: false,
          bedTaxValue: 0,
          price: rt.TotalPrice,
          priceWithBuyersGroup: convertedPrice.toFixed(2), // <-- format only for display/API
          adults: rt.Adults,
          children: rt.Children,
          roomTypeName: room.RoomTypeName,
          ratePlanName: rt.RatePlanName,
          tax: applyExchange(Number(tax)),
          nonRefundableRate: rt.NonRefundableRate,
        },
      ];
    });

  }
  // ——————————————————————————————————

  // ——————————————————————————————————
  // 3) Update quantity (increment/decrement)
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
  const grandTotalWithBuyersGroup = cart.reduce(
    (sum, item) => sum + item.priceWithBuyersGroup * item.rooms,
    0
  );
  setGrandTotal(grandTotal);
  setGrandTotalWithBuyersGroup(grandTotalWithBuyersGroup);
  // ← ADD THESE NEXT:
  useEffect(() => {
    const cartHasNonRefundableTemp = cart.some(item => item.nonRefundableRate);
    const cartHasRefundableTemp = cart.some(item => !item.nonRefundableRate);
    setCartHasNonRefundable(cartHasNonRefundableTemp);
    setCartHasRefundable(cartHasRefundableTemp);
    // console.log("cart", cart);

  }, [cart]);



  // Using useTheme from styled-components to access the theme
  const styledTheme = useTheme();

  // // sample data
  // const hotel = {
  //   id,
  //   rating: 7.5,
  //   ratingText: "Very Good",
  //   reviews: 234,
  //   name: "Hotel de Papae Intl",
  //   details: "3-star hotel with free Wi-Fi & breakfast",
  //   fromPrice: "PKR 15,651",
  //   images: [beachImg, mainImg, beachImg],
  //   roomTypes: [
  //     {
  //       id: 1,
  //       name: "Standard",
  //       meals: true,
  //       details: "Standard room with AC and TV",
  //       cancellation: "Free until 24h",
  //       totalPrice: "PKR 14,000",
  //       paymentType: "Pay Later",
  //     },
  //     {
  //       id: 2,
  //       name: "Deluxe",
  //       meals: true,
  //       cancellation: "Free until 48h",
  //       totalPrice: "PKR 18,000",
  //       paymentType: "Online Payment",
  //     },
  //     {
  //       id: 3,
  //       name: "Deluxe",
  //       meals: true,
  //       cancellation: "Free until 48h",
  //       totalPrice: "PKR 18,000",
  //       paymentType: "Online Payment",
  //     },
  //     {
  //       id: 4,
  //       name: "Deluxe",
  //       meals: true,
  //       cancellation: "Free until 48h",
  //       totalPrice: "PKR 18,000",
  //       paymentType: "Online Payment",
  //     },
  //     {
  //       id: 5,
  //       name: "Deluxe",
  //       meals: true,
  //       cancellation: "Free until 48h",
  //       totalPrice: "PKR 18,000",
  //       paymentType: "Online Payment",
  //     },
  //   ],
  // };

  // slider settings: show max 2 slides

  // Custom arrows
  const PrevArrow = ({ onClick }) => (
    <PrevArrowButton onClick={onClick}>&#x276E;</PrevArrowButton>
  );
  const NextArrow = ({ onClick }) => (
    <NextArrowButton onClick={onClick}>&#x276F;</NextArrowButton>
  );
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow:
      styledTheme.mode === "light" ||
        window.innerWidth >= parseInt(styledTheme.breakpoints.xLargeDesktop)
        ? 1
        : 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: parseInt(styledTheme.breakpoints.xLargeDesktop),
        settings: { slidesToShow: 1 },
      },
    ],
  };
  const getFacilityIcon = (name) => {
    const keyword = name.toLowerCase();

    if (keyword.includes("shower")) return <FeatureItem><FaShower /> Shower</FeatureItem>;
    if (keyword.includes("ac") || keyword.includes("cold")) return <FeatureItem><FaSnowflake /> AC</FeatureItem>;
    if (keyword.includes("tv") || keyword.includes("television")) return <FeatureItem><FaTv /> TV</FeatureItem>;
    if (keyword.includes("wifi") || keyword.includes("internet")) return <FeatureItem><FaWifi /> Wifi</FeatureItem>;
    if (keyword.includes("bath") || keyword.includes("bathtub")) return <FeatureItem><FaBath /> Bath</FeatureItem>;
    if (keyword.includes("sofa") || keyword.includes("armchair")) return <FeatureItem><FaCouch /> Sofa</FeatureItem>;
    if (keyword.includes("bed")) return <FeatureItem><FaBed /> Bed</FeatureItem>;
    if (keyword.includes("lock") || keyword.includes("secure") || keyword.includes("key")) return <FeatureItem><FaLock /> Secure</FeatureItem>;
    if (keyword.includes("telephone") || keyword.includes("phone")) return <FeatureItem><FaPhone /> Phone</FeatureItem>;
    if (keyword.includes("view") || keyword.includes("window")) return <FeatureItem><FaEye /> View</FeatureItem>;
    if (keyword.includes("garden")) return <FeatureItem><FaLeaf /> Garden</FeatureItem>;
    if (keyword.includes("sea")) return <FeatureItem><FaWater /> Sea View</FeatureItem>;
    if (keyword.includes("kitchen") || keyword.includes("stove") || keyword.includes("cooker")) return <FeatureItem><FaUtensils /> Kitchen</FeatureItem>;
    if (keyword.includes("guest handbook") || keyword.includes("book")) return <FeatureItem><FaBook /> Handbook</FeatureItem>;
    if (keyword.includes("entry")) return <FeatureItem><FaKey /> Entry</FeatureItem>;
    if (keyword.includes("store") || keyword.includes("minibar")) return <FeatureItem><FaStore /> Store</FeatureItem>;
    if (keyword.includes("oven") || keyword.includes("burner") || keyword.includes("fireplace")) return <FeatureItem><FaFire /> Fireplace/Oven</FeatureItem>;
    if (keyword.includes("fan")) return <FeatureItem><FaFan /> Fan</FeatureItem>;
    if (keyword.includes("light") || keyword.includes("mood")) return <FeatureItem><FaLightbulb /> Lighting</FeatureItem>;
    if (keyword.includes("temperature") || keyword.includes("heat") || keyword.includes("air")) return <FeatureItem><FaTemperatureHigh /> Temperature</FeatureItem>;
    if (keyword.includes("alarm") || keyword.includes("wake") || keyword.includes("early") || keyword.includes("late")) return <FeatureItem><FaClock /> Alarm</FeatureItem>;
    if (keyword.includes("coffee") || keyword.includes("tea")) return <FeatureItem><FaCoffee /> Coffee/Tea</FeatureItem>;
    if (keyword.includes("dining") || keyword.includes("table")) return <FeatureItem><FaTable /> Dining</FeatureItem>;
    if (keyword.includes("dryer") || keyword.includes("laundry") || keyword.includes("washing")) return <FeatureItem><FaPlug /> Laundry</FeatureItem>;
    if (keyword.includes("cd") || keyword.includes("dvd") || keyword.includes("disc")) return <FeatureItem><FaCompactDisc /> CD/DVD</FeatureItem>;
    if (keyword.includes("radio")) return <FeatureItem><FaBroadcastTower /> Radio</FeatureItem>;
    if (keyword.includes("music") || keyword.includes("hi-fi") || keyword.includes("ipod")) return <FeatureItem><FaMusic /> Music</FeatureItem>;
    if (keyword.includes("video")) return <FeatureItem><FaVideo /> Video</FeatureItem>;
    // if (keyword.includes("ironing") || keyword.includes("press")) return <FeatureItem><FaIron /> Ironing</FeatureItem>;
    if (keyword.includes("closet") || keyword.includes("wardrobe")) return <FeatureItem><FaTshirt /> Wardrobe</FeatureItem>;
    if (keyword.includes("floor")) return <FeatureItem><FaRuler /> Floor Space</FeatureItem>;
    if (keyword.includes("curtain") || keyword.includes("drape")) return <FeatureItem><FaDoorOpen /> Curtain</FeatureItem>;
    if (keyword.includes("newspaper")) return <FeatureItem><FaNewspaper /> Newspaper</FeatureItem>;
    if (keyword.includes("desk") || keyword.includes("work")) return <FeatureItem><FaBriefcase /> Work Desk</FeatureItem>;
    if (keyword.includes("service") || keyword.includes("check")) return <FeatureItem><FaCheck /> Room Service</FeatureItem>;
    if (keyword.includes("deposit") || keyword.includes("safe") || keyword.includes("safety")) return <FeatureItem><FaShieldAlt /> Safe Deposit</FeatureItem>;
    if (keyword.includes("marble")) return <FeatureItem><FaMagic /> Marble Interior</FeatureItem>;
    if (keyword.includes("pack")) return <FeatureItem><FaGift /> Welcome Pack</FeatureItem>;
    if (keyword.includes("satellite")) return <FeatureItem><FaSatelliteDish /> Satellite TV</FeatureItem>;
    if (keyword.includes("central heating")) return <FeatureItem><FaCloudSun /> Heating</FeatureItem>;

    // Default
    return <FeatureItem><FaCheck /> {name}</FeatureItem>;
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
  // console.log('specificHotelData', specificHotelData)
  return (
    <>
      <Container_NoGradient>
        <Header />
        <TopBar>
          <Breadcrumb>
            <Link to="/">Main Page</Link> &gt;
            <Link to="/search"> Search</Link> &gt; Islamabad &gt; {id}
          </Breadcrumb>
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
                  {/* current image */}
                  <Box
                    component="img"
                    src={baseImageURL + specificHotelData?.accommodationData?.images[imageIndex]?.ImageURL}
                    alt={`${specificHotelData?.accommodationData?.name}
                     image ${imageIndex}`}
                    sx={{
                      width: "100%",
                      height: "40vh",
                      objectFit: "cover",
                      borderRadius: "0.8rem 0 0 0.8rem",
                      border: `0.5px solid ${styledTheme.mode === "light"
                        ? "#e9e9e9"
                        : styledTheme.colors.cardColor
                        }`,
                    }}
                  />

                  {/* MUI slider to pick an image */}
                  {/* centered MUI slider */}
                  {
                    specificHotelData?.accommodationData?.images.length > 1 &&
                    <MuiSlider
                      value={imageIndex}
                      min={0}
                      color="primary"
                      max={specificHotelData?.accommodationData?.images.length - 1}
                      step={1}
                      marks={specificHotelData?.accommodationData?.images.map((_, idx) => ({ value: idx }))}
                      onChange={(_, val) => setImageIndex(val)}
                      aria-labelledby="image-slider"
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 0,
                        right: 0,
                        width: "50%",
                        mx: "auto",
                        opacity: 0.7, // keep the unfilled rail subtle
                        color: styledTheme.colors.primary,
                        "& .MuiSlider-thumb": {
                          boxShadow: "none", // optional: remove default shadow
                        },
                        "& .MuiSlider-mark, & .MuiSlider-track, & .MuiSlider-thumb":
                        {
                          backgroundColor: styledTheme.colors.primary,
                        },
                        "& .MuiSlider-rail": {
                          opacity: 0.1, // keep the unfilled rail subtle
                        },
                      }}
                    />
                  }

                  <RatingRibbon>
                    {specificHotelData.accommodationData.Rating}
                  </RatingRibbon>
                </Card2ImageSlider>

                {/* <Card2HotelSpecifications>
                  <SpecItem>
                    Rating:{" "}
                    {specificHotelData.accommodationData.Rating <= 5 && "Good"}
                    {specificHotelData.accommodationData.Rating > 5 &&
                      specificHotelData.accommodationData.Rating <= 7 &&
                      "Very Good"}
                    {specificHotelData.accommodationData.Rating > 7 &&
                      specificHotelData.accommodationData.Rating < 10 &&
                      "Excellent"}
                  </SpecItem>
                  <SpecItem>
                    City : {specificHotelData.accommodationData.city.CityName}
                  </SpecItem>
                </Card2HotelSpecifications> */}
                <Card2HotelSpecifications>
                  <SpecItem>
                    Check-In:{" "}
                    {specificHotelData.accommodationData.CheckInFrom}
                  </SpecItem>
                  <SpecItem>
                    Check-Out:{" "}
                    {specificHotelData.accommodationData.CheckOutTo}
                  </SpecItem>
                </Card2HotelSpecifications>
                <Card2HotelSpecifications>
                  <SpecItemFacilities>
                    Property Facilities:
                    {specificHotelData?.accommodationData?.facilities?.length > 0 &&
                      specificHotelData?.accommodationData?.facilities?.map((facility, i) => (
                        getFacilityIcon(facility?.FacilityName)
                      ))}
                  </SpecItemFacilities>
                  <SpecItem>
                  </SpecItem>
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
                            src={baseImageURLRoomType + room?.RoomTypeImages[0]?.ImageUrl}
                            alt={room.RoomTypeName}
                            style={{
                              width: "100%",
                              borderRadius: "0.5rem 0 0 0.5rem",
                              padding: "0",
                              margin: "0",
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
                              margin: '0px 0px 5px 0px'
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
                              margin: '0px 0px 5px 0px'
                            }}
                          >
                            <h3>
                              {/* {console.log('room', room)} */}
                              {room?.NoOfBeds} beds.
                              {/* with amenities like AC, TV, */}
                            </h3>
                          </div>
                          <div
                            style={{
                              fontSize: styledTheme.fontSizes.xsmall,
                              color: styledTheme.colors.secondaryText,
                              margin: '0px 0px 5px 0px'
                            }}
                          >
                            <p>
                              {/* {console.log('room', room)} */}
                              {room?.RoomTypeDescription}
                              {room?.RoomTypeName}
                              {' '}with amenities like AC, TV,
                            </p>
                          </div>
                          <FeatureList>
                            {room?.Facilities?.length > 0 &&
                              room?.Facilities?.map((facility, i) => (
                                getFacilityIcon(facility?.FacilityName)
                              ))}
                          </FeatureList>
                        </DetailsWrapper>
                      </RoomTypeCard>
                      {/* ))} */}
                    </RoomTypeData>

                    <Card3RoomTypeTable>
                      {room.rateplans.length > 0 ? (
                        <TableContainer
                          component={Paper}
                          sx={{
                            width: "100%",
                            margin: " 0 0 30px 0",
                            backgroundColor: styledTheme.colors.cardColor,
                            borderRadius: "1rem",
                            border: `2px solid ${styledTheme.colors.cardColor2}`,
                            borderBottom: `0.1px solid ${styledTheme.colors.primary}`,
                          }}
                        >
                          <h3
                            style={{
                              margin: "10px 10px",
                              color: styledTheme.colors.primaryText,
                            }}
                          >
                            Available Rate Plan(s)
                          </h3>
                          <Table size="large"
                            sx={{
                              tableLayout: 'fixed',
                              width: '100%',
                            }}>
                            <TableHead>
                              <TableRow
                                sx={{
                                  backgroundColor:
                                    styledTheme.colors.cardColor2,
                                }}
                              >
                                {[
                                  "Room",
                                  "Breakfast",
                                  "Cancellation",
                                  "Total Price",
                                  "Pax",
                                  "Refundable",
                                  "Select",
                                ].map((h) => (
                                  <TableCell
                                    key={h}
                                    sx={{
                                      color: '#fff',
                                      backgroundColor: styledTheme.colors.primary,
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
                              applyMarginFunc={applyMarginFunc}
                              applyExchange={applyExchange}
                              updateCartQty={updateCartQty}
                              addRatePlan={addRatePlan}
                              makeKey={makeKey}
                              buyersGroupData={buyersGroupData}
                              cartHasRefundable={cartHasRefundable}
                              cartHasNonRefundable={cartHasNonRefundable}
                            />

                          </Table>
                        </TableContainer>
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            padding: "20px 10px",
                            // margin: " 0 0 30px 0",
                            backgroundColor: styledTheme.colors.cardColor,
                            borderRadius: "0.5rem",
                            borderBottom: `0.1px solid ${styledTheme.colors.primary}`,
                          }}
                        >
                          <h3 style={{ color: "red" }}>
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
          <RightColumnSection cart={cart} cartDetails={cartDetails}
            grandTotal={grandTotal} grandTotalWithBuyersGroup={grandTotalWithBuyersGroup} />
        </ContentArea>
      </Container_NoGradient>
      <FooterSection />
    </>
  );
}

// Breadcrumb / Top bar
const TopBar = styled.div`
      width: max-content;
      background: ${({ theme }) => theme.colors.secondary};
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
      width: 100%;
      a {
        color: ${({ theme }) => theme.colors.primary};
      text-decoration: none;
      margin: 0 0.5rem;
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
        flex - wrap: wrap;
  }
      `;
const RoomTypeCard = styled.div`
      display: flex;
      padding: 0px;
      border: 1px solid
      ${({ theme }) =>
    theme.mode == "light" ? "#e9e9e9" : theme.colors.secondaryText};
      width: 100%;
      background: ${({ theme }) => theme.colors.cardColor};
      border-radius: 0.8rem;
      border-top:2px solid ${({ theme }) => theme.colors.primary};
      border-bottom:2px solid ${({ theme }) => theme.colors.primary};
      `;
const ImgWrapper = styled.div`
      flex: 0 0 30%;
      padding: 0;
      `;
const DetailsWrapper = styled.div`
      flex: 1;
      margin-left: 5px;
      padding: 16px;
      border-left: 1px solid${({ theme }) => theme.mode == "light" ? theme.colors.primary : theme.colors.secondaryText};
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
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
      overflow: hidden;
      width: 100%;
      @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
        overflow: auto;
  }
      `;
