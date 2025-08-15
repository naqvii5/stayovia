import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import 'animate.css/animate.min.css';
import { useInView } from 'react-intersection-observer';
import sampleImg from '../../../assets/beach1.jpeg'; // TEMP image
import { featuredHotels } from '../../../api/featuredHotels';
import { format } from 'date-fns/format';
import { specificHotelSearch } from './../../../api/specificHotelSearch';
import { useHotelSearch } from '../../../context/HotelSearchContext';

import { toast } from 'react-hot-toast';

// placeholder wrapper to reserve card space before mounting
const LazyWrapper = styled.div`
  width: 340px;
  min-height: 140px;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    min-height: 140px;
  }
`;

const Container = styled.section`
  width: 100%;
  margin: 0px auto;
  box-sizing: border-box;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 20px 20px;
  }
`;

const Heading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.primaryHeading};
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) =>
    theme.mode === 'light'
      ? theme.colors.primary
      : theme.colors.primaryHeading};
  margin-bottom: 2rem;
  text-align: center;
`;

const CardsGrid = styled.div`
  display: flex;
  flex-direction: row-reverse;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const Card = styled.div`
  width: 340px;
  min-height: 140px;
  display: flex;
  flex-direction: row;
  background: ${({ theme }) => theme.colors.header};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    width: 100%;
    height: auto;
  }
`;

const CardLeft = styled.div`
  padding: 0.75rem;
  flex: 0.4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const CardDesc = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.3;
  color: ${({ theme }) => theme.colors.primary};
`;

const CardRight = styled.div`
  flex: 0.6;
  background: ${({ bg }) => bg && `url(${bg})`} center/cover no-repeat;
  min-height: 140px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 140px;
  }
`;

const LearnMoreButton = styled.button`
  margin-top: 0.5rem;
  background: none;
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

// replace your direct <Card> with this wrapper+lazy mount component

function FeaturesSection() {
  const [cards, setCards] = useState([]);

  const { setSpecificHotelSearchData } = useHotelSearch();

  const formatInput = (d) => format(d, 'yyyy-MM-dd');

  const dateRange = {
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
  const searchSpecificHotel = (id, loading, setLoading) => {
    if (loading) return;
    setLoading(true);
    // setIsClicked(true);
    const payload = {
      CheckIn: formatInput(dateRange.startDate),
      CheckOut: formatInput(dateRange.endDate),
      totalGuests: 1,
      Rooms: 1,
      GuestQuantity: [{ label: 'Room 1', Adults: 1, Children: 0 }],
      Cancellation: false,
      AccommodationId: id,
    };
    localStorage.setItem('payload', JSON.stringify(payload));
    const toastId = toast.loading(
      'Searching…'
      // , {style: { fontSize: '1.25rem', padding: '16px 24px' },}
    );

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
      })
      .finally(() => {
        // Reset loading state so the button is re-enabled
        setLoading(true);
        // setIsClicked(false);
      });
  };

  function LazyAnimatedCard({ card }) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    const [loading, setLoading] = useState(false);
    const animationClass = 'animate__zoomIn';
    // index === 0
    //   ? 'animate__backInLeft'
    //   : index === 1
    //   ? 'animate__backInDown'
    //   : index === 2
    //   ? 'animate__backInRight'
    //   : 'animate__fadeIn';

    return (
      <LazyWrapper ref={ref}>
        {inView && (
          <Card className={`animate__animated ${animationClass}`}>
            <CardLeft>
              <CardDesc>{card.title}</CardDesc>
              <LearnMoreButton
                disabled={loading}
                onClick={() =>
                  searchSpecificHotel(card.id, loading, setLoading)
                }
              >
                View Details →
              </LearnMoreButton>
            </CardLeft>
            <CardRight bg={card.img} />
          </Card>
        )}
      </LazyWrapper>
    );
  }

  // Fetch cities on mount

  useEffect(() => {
    if (cards.length > 0) return;
    featuredHotels()
      .then(({ status, data }) => {
        // console.log('data :>> ', data);
        if (status && Array.isArray(data)) {
          const mapped = data.map((hotel) => ({
            title: hotel.AccommodationName,
            id: hotel.AccommodationId,
            desc: hotel.GeneralDescription,
            // use first image or fallback
            img: hotel.images?.[0]?.ImageURL
              ? `https://connect.purpletech.ai/storage/${hotel.images[0].ImageURL}`
              : sampleImg,
          }));
          setCards(mapped);
        }
        // else toast.error('Failed to load cities');
      })
      .catch(
        () => console.log('Network')
        // toast.error("Network error")
      );
  }, [cards]);
  // const cards = [
  //   {
  //     title: 'Competitive Rates',
  //     desc: 'We guarantee the best prices for your hotel stays.',
  //     img: sampleImg,
  //   },
  //   {
  //     title: 'Flexible Bookings',
  //     desc: 'Book instantly or schedule in advance with no hassle.',
  //     img: sampleImg,
  //   },
  //   {
  //     title: 'Global Reach',
  //     desc: 'Access properties from cities across the globe.',
  //     img: sampleImg,
  //   },
  // ];

  return (
    <Container>
      <Heading>Explore the Featured Hotels</Heading>
      <CardsGrid>
        {/* {cards.map((card, idx) => (
          <AnimatedCard key={idx} index={idx} card={card} />
        ))} */}
        {cards.map((card, idx) => (
          <LazyAnimatedCard key={idx} index={idx} card={card} />
        ))}
      </CardsGrid>
    </Container>
  );
}
export default React.memo(FeaturesSection);
