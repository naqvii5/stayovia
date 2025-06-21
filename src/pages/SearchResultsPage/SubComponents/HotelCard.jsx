// src/pages/SubComponents/HotelCard.jsx
import React from "react";
import styled from "styled-components";
import beamImg from "../../../assets/beach.jpeg"; // placeholder
import mainImg from "../../../assets/main.jpeg"; // placeholder
import roomImg from "../../../assets/roomImg.jpeg"; // placeholder
import Ribbon from "../../../assets/ribbon.png"; // rating ribbon image
import { useThemeContext } from "../../../theme/ThemeProvider";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { specificHotelSearch } from "../../../api/specificHotelSearch";
import { useHotelSearch } from "../../../context/HotelSearchContext";
import { MyButton } from "../../../components/MyButton";

// —————————————————————————————————————————————————————————————
// Card container: column on mobile, row (30/70) on tablet+
const HotelCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.cardColor};
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

// Slider wrapper: full width on mobile, 30% on tablet+
const ImageSliderWrapper = styled.div`
  position: relative;
  width: 100%;

  .slick-slide img {
    width: 110%;
    height: 250px;
    object-fit: cover;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 30%;
  }
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

// Info column
const HotelInfo = styled.div`
  padding: 1rem;
  flex: 1;
`;

// Top row: title + rating ribbon
const HotelInfoTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

// Rating Ribbon overlay
const RatingRibbon = styled.div`
  background: url(${Ribbon}) no-repeat center/cover;
  min-width: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: #fff;
`;

// Titles & text
const HotelTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primary};
`;
const HotelBottomDetails = styled.div`
display: flex;
flex-direction:column;
align- items: center;
gap:5px
`;
const HotelSecondary = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
  margin: 0.25rem 0;
`;
const HotelTertiary = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: #777;
`;

// Room details
const RoomDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 1rem;
`;
const DetailsCol = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) =>
    theme.mode === "light" ? "#f5f5f5" : theme.colors.mainBackground};
  padding: 10px;
  border-radius: 0.8rem;
`;
const DetailBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
const BoldText = styled.div`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSizes.small};
`;
const ShowButtonCol = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

`;
const Stars = styled.div`
  color: #fbc02d; /* gold */
  font-size: ${({ theme }) => theme.fontSizes.small};
`;
const ShowButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 1rem 1.55rem;
  border-radius: 0.8rem;
  cursor: pointer;
`;

export default function HotelCard({ hotelSearchData, buyersGroupData, exchangeGroupData }) {
  const { mode } = useThemeContext();
  const { filteringData, setSpecificHotelSearchData, setBuyersGroupData } = useHotelSearch();
  // const baseImageURL = 'https://stagingconnect.purpletech.ai/storage/'
  const baseImageURL = 'https://connect.purpletech.ai/storage/'
  // const baseImageURL = 'http://192.168.0.148:8001/storage/'
  // Mapping for accommodation types
  const typeOptions = [
    { id: 1, label: "Hotel" },
    { id: 2, label: "Apartment" },
    { id: 3, label: "Hostel" },
    { id: 4, label: "Resort" },
    { id: 5, label: "Motel" },
    { id: 6, label: "Bed And Breakfast" },
    { id: 7, label: "Guest house" },
    { id: 8, label: "Campground" },
    { id: 9, label: "Capsule Hotel" },
    { id: 10, label: "Farm stay" },
    { id: 12, label: "Holiday Park" },
    { id: 13, label: "Inn" },
    { id: 14, label: "Lodge" },
    { id: 15, label: "Self-Catering" },
    { id: 16, label: "Vacation Rental" }
  ];
  function applyExchange(ratePlanPrice) {
    // console.log('ratePlanPrice', ratePlanPrice)
    // console.log('buyersGroupData', buyersGroupData)
    // console.log('exchangeGroupData', exchangeGroupData.rate)
    // console.log('ratePlanPrice * exchangeGroupData.rate', ratePlanPrice * exchangeGroupData.rate)
    return Number(ratePlanPrice * exchangeGroupData.rate)
  }
  function applyMarginFunc(hotel) {
    const rp = hotel?.rooms?.rateplans?.[0];
    if (!rp) return false;

    // BE is sending NonRefundableRate = false when room is refundable,
    // true when non‐refundable
    const isRoomNonRefundable = Boolean(rp.NonRefundableRate);
    // console.log('first', buyersGroupData)
    if (buyersGroupData?.type) {
      const buyersGrouptype = buyersGroupData?.type.toLowerCase();
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
    } else {
      return false;
    }
  }


  // console.log('hotelSearchData', hotelSearchData)
  // Custom arrows
  const PrevArrow = ({ onClick }) => (
    <PrevArrowButton onClick={onClick}>&#x276E;</PrevArrowButton>
  );
  const NextArrow = ({ onClick }) => (
    <NextArrowButton onClick={onClick}>&#x276F;</NextArrowButton>
  );

  const searchSpecificHotel = (id) => {
    // 1) validate
    // console.log("filteringData", filteringData, !filteringData.Cancellation);
    if (
      !filteringData.CheckIn ||
      !filteringData.CheckOut ||
      !filteringData.Rooms ||
      !filteringData.GuestQuantity ||
      !id
    ) {
      toast.error("Data is missing!", {
        style: { fontSize: "1.25rem", padding: "16px 24px" },
      });
      return;
    }
    // Calculate total guests from rooms
    const totalGuests = filteringData.GuestQuantity.reduce(
      (sum, room) => sum + room.Adults + room.Children,
      0
    );
    // 2) build payload & save filters in context
    const payload = {
      CheckIn: filteringData.CheckIn,
      CheckOut: filteringData.CheckOut,
      // nights: dates.nights,
      totalGuests: totalGuests,
      Rooms: filteringData.Rooms,
      GuestQuantity: filteringData.GuestQuantity,
      Cancellation: filteringData.Cancellation,
      AccommodationId: id,
      // Rating: rating,
    };
    // setFilteringData(payload);

    localStorage.setItem('payload', JSON.stringify(payload));
    // 3) kick off search
    const toastId = toast.loading("Searching…", {
      style: { fontSize: "1.25rem", padding: "16px 24px" },
    });

    specificHotelSearch(payload)
      .then((response) => {
        setSpecificHotelSearchData(response.data);
        setBuyersGroupData(response.buyerGroup)
        // setBuyersGroupData(response.exchangeData)
        localStorage.setItem(
          "specificHotelSearchData",
          JSON.stringify(response.data)
        );
        localStorage.setItem(
          "buyersGroupData",
          JSON.stringify(response.buyerGroup)
        );
        localStorage.setItem(
          "exchangeGroupData",
          JSON.stringify(exchangeGroupData)
        );


        // dismiss loading toast
        toast.dismiss(toastId);

        if (response.status) {
          toast.success("Data searched!", {
            style: { fontSize: "1.25rem", padding: "16px 24px" },
          });
          // 5) navigate only *after* context has been updated
          // navigate("/search-results");
          // window.open(`/hotel-details/${id}`, "_blank");
          window.open(`/hotel-details`, "_blank");
        } else {
          toast.error("Failed to load hotels", {
            style: { fontSize: "1.25rem", padding: "16px 24px" },
          });
        }
      })
      .catch((err) => {
        console.error("Search API failed:", err);
        toast.dismiss(toastId);
        toast.error("Error", {
          style: { fontSize: "1.25rem", padding: "16px 24px" },
        });
      });
  };

  // slider settings
  // const settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   arrows: true,
  //   prevArrow: <PrevArrow />,
  //   nextArrow: <NextArrow />,
  // };

  // const sampleHotels = [
  //   {
  //     id: 1,
  //     name: "Hotel de Papae Intl",
  //     rating: "7.5",
  //     details: "3-star hotel with free Wi-Fi",
  //     location: "16-D West Service Rd, Islamabad",
  //     images: [beamImg, mainImg, roomImg, beamImg, roomImg],
  //     rooms: [
  //       {
  //         roomName: "Executive Double room",
  //         roomDetail: "full double bed",
  //         breakfastIncluded: true,
  //         cancellation: "No free cancellation",
  //         payment: "Wire transfer",
  //         price: "15,651",
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Islamabad Marriott Hotel",
  //     rating: "7.5",
  //     details: "5-star luxury",
  //     location: "Aga Khan Road, Shalimar 5, Islamabad",
  //     images: [beamImg, beamImg, beamImg, beamImg, beamImg],
  //     rooms: [
  //       {
  //         roomName: "Deluxe Double room",
  //         roomDetail: "full double bed",
  //         breakfastIncluded: true,
  //         cancellation: "No free cancellation",
  //         payment: "Wire transfer",
  //         price: "59,043",
  //       },
  //     ],
  //   },
  // ];
  // console.log('hotel?.images', hotelSearchData[1])
  return (
    <>
      <>
        {hotelSearchData.length > 0 ? (hotelSearchData?.map((hotel) => {
          const type = typeOptions.find((opt) => opt.id === hotel.accommodationType)?.label || "Unknown";
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
          return (
            <HotelCardContainer key={hotel?.accommodationId}>

              {/* <ImageSliderWrapper>
              <Slider {...settings}>
                {hotel.images.map((src, idx) => (
                  <div key={idx}>
                    <img
                      src={`https://stagingconnect.purpletech.ai/storage/${src.ImageURL}`}
                      alt={`${hotel.name} slide ${idx + 1}`}
                      crossOrigin="anonymous"
                      allowsameOrigin
                    />
                  </div>
                ))}
              </Slider>
            </ImageSliderWrapper> */}

              <ImageSliderWrapper>
                <Slider
                  {...settings}
                >

                  {hotel?.images?.map((src, idx) => (
                    <div key={idx}>
                      <img src={baseImageURL + src.ImageURL} alt={`${hotel?.name} slide ${idx + 1}`} />
                    </div>
                  ))}
                </Slider>
              </ImageSliderWrapper>

              <HotelInfo>
                <HotelInfoTop>
                  <div>
                    <HotelTitle>{hotel?.accommodationName}</HotelTitle>
                    <HotelSecondary>{hotel?.details}</HotelSecondary>
                  </div>
                  <RatingRibbon>{hotel?.rating}</RatingRibbon>
                </HotelInfoTop>

                {/* {hotel.rooms.map((room, idx) => ( */}
                {/* <RoomDetailsContainer key={idx}> */}
                <RoomDetailsContainer>
                  <DetailsCol>
                    <DetailBlock>
                      <HotelTitle as="div">{hotel?.rooms?.RoomTypeName}</HotelTitle>
                      {/* <HotelTertiary>{room.roomDetail}</HotelTertiary> */}
                    </DetailBlock>
                    <DetailBlock>
                      {hotel?.rooms?.rateplans[0]?.BreakfastIncluded ? (
                        <div>Breakfast included</div>
                      ) : (
                        <div>Breakfast not included</div>
                      )}
                      <HotelTertiary>
                        {hotel?.rooms?.rateplans[0]?.NonRefundableRate
                          ? "Not Refundable"
                          : "Refundable"}
                      </HotelTertiary>
                    </DetailBlock>

                    {
                      (hotel?.rooms &&
                        hotel?.rooms?.rateplans[0]?.TotalPrice) ? (
                        <BoldText>
                          PKR. {
                            (() => {
                              const basePrice = hotel.rooms.rateplans[0].totalPriceExcludeTax;
                              const tax = hotel.rooms.rateplans[0].TotalTax;
                              let finalPrice = basePrice;

                              if (applyMarginFunc(hotel)) {
                                if (buyersGroupData.type_charged === "fixed") {
                                  finalPrice += buyersGroupData.margin;
                                } else {
                                  finalPrice += (basePrice * buyersGroupData.margin) / 100;
                                }
                              }

                              finalPrice += tax;

                              return applyExchange(finalPrice).toFixed(2);
                            })()
                          }
                        </BoldText>
                      ) : (
                        <BoldText>PKR 0</BoldText>
                      )
                    }


                  </DetailsCol>
                  <ShowButtonCol>



                    <HotelBottomDetails>
                      <Stars>
                        {/* {Number(hotel.rating).toFixed(1)}{" "} */}
                        {"★".repeat(Math.floor(hotel.rating))}
                      </Stars>
                      <HotelSecondary>{type}</HotelSecondary>
                      {/* <HotelTertiary>{hotel?.address}</HotelTertiary> */}
                    </HotelBottomDetails>
                    <HotelBottomDetails>
                      <HotelTertiary>{hotel?.address}</HotelTertiary>
                    </HotelBottomDetails>
                    <div style={{ padding: '1rem 1.55rem' }}>

                      <MyButton
                        color='#fff'
                        border='none'
                        padding='0.60rem 1.55rem'
                        width="100%"
                        height="100%"
                        borderRadius='0.8rem'
                        bgColor={({ theme }) => theme.colors.primary}
                        fontSize={({ theme }) => theme.fontSizes.xsmall}
                        onClick={
                          () => searchSpecificHotel(hotel?.accommodationId)}
                      >
                        Show All
                      </MyButton>
                    </div>
                    {/* <ShowButton
                      onClick={
                        () => searchSpecificHotel(hotel?.accommodationId)

                        // window.open(`/hotel-details/${hotel.id}`, "_blank")
                      }
                    >
                      Show All
                    </ShowButton> */}
                  </ShowButtonCol>
                </RoomDetailsContainer>
                {/* ))} */}
              </HotelInfo>
            </HotelCardContainer>
          )
        }
        )
        ) : (<HotelCardContainer>
          <HotelInfo>
            <h2 >No Hotel Available!</h2>
          </HotelInfo>
        </HotelCardContainer>)}

      </>
    </>
  );
}
