import React, { useState } from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'animate.css/animate.min.css';
import { useInView } from 'react-intersection-observer';

// Images
import Islamabad1Img from '../../../assets/Islamabad1.jpeg';
import Hunza1Img from '../../../assets/Hunza.jpg';
import Islamabad2Img from '../../../assets/Islamabad2.jpeg';
import Islamabad3Img from '../../../assets/Islamabad3.jpeg';
import Lahore1Img from '../../../assets/Lahore1.jpeg';
import Lahore2Img from '../../../assets/Lahore2.jpeg';
import Karachi1Img from '../../../assets/Karachi1.jpeg';
import Karachi2Img from '../../../assets/Karachi2.jpeg';
import Faisalabad1Img from '../../../assets/Lyallpur1.jpeg';
import Multan1Img from '../../../assets/Multan1.jpeg';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { hotelSearch } from '../../../api/hotelSearch';
import { useHotelSearch } from '../../../context/HotelSearchContext';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { memo } from 'react';

const Container = styled.section`
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 20px;
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
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
`;

const SlideImage = styled.img.attrs({
  loading: 'lazy',
})`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* Set up the transition for transform + opacity */
  transition: transform 0.5s ease, opacity 0.5s ease;
  transform: scale(1);
  opacity: 1;
`;

// 2) Add a hover rule in Card that targets SlideImage:
const Card = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 90%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    height: 200px;
    aspect-ratio: unset;
  }

  /* On hover, zoom + fade the image */
  &:hover ${SlideImage} {
    transform: scale(1.1); /* zoom in 10% */
    opacity: 0.9; /* slightly fade for a softer look */
  }
`;
const CardRightSlider = styled(Slider)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  .slick-slide {
    height: 100%;
    display: flex;
  }

  .slick-slide > div {
    height: 100%;
    width: 100%;
  }
`;

const SlideWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

// const SlideImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   display: block;
// `;

const CardTitle = styled.div`
  position: absolute;
  bottom: 12px;
  // left: 50%;
  right: 0;
  // transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  // color: ${({ theme }) => theme.colors.primary};
  color: #ffff;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  background: rgba(0, 0, 0, 0.25);
  padding: 4px 10px;
  border-radius: 16px;
  z-index: 2;
`;

const CircularButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: 1.25rem;
  font-weight: 600;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    opacity: 0.9;
  }
`;
// Add this BELOW your existing styled components:

// placeholder wrapper to reserve the card’s space
const LazyWrapper = styled.div`
  width: 30%;
  aspect-ratio: 16/9;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 90%;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    height: 200px;
    aspect-ratio: unset;
  }
`;
// ————— Memoized Card —————
const LazyDestinationCard = memo(function LazyDestinationCard({
  card,
  onSelect,
  index,
}) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [loading, setLoading] = useState(false);
  // pick slide-in animation based on position
  const animationClass =
    index < 3 // cards 0,1,2
      ? 'animate__slideInDown'
      : 'animate__slideInUp';
  const handleClick = () => {
    if (loading) return;
    setLoading(true);
    Promise.resolve(onSelect(card))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <LazyWrapper ref={ref}>
      {inView && (
        // <Card disabled={loading} onClick={handleClick}>
        <Card
          className={`animate__animated ${animationClass}`}
          disabled={loading}
          onClick={handleClick}
        >
          <CardRightSlider
            dots={false}
            arrows={false}
            autoplay={card.images.length > 1}
            infinite={card.images.length > 1}
            speed={500}
            autoplaySpeed={2500}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {card.images.map((img, idx) => (
              <SlideWrapper key={idx}>
                <SlideImage src={img} alt={`${card.title} ${idx + 1}`} />
              </SlideWrapper>
            ))}
          </CardRightSlider>
          <CardTitle>
            {card.title}
            <CircularButton
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              &gt;
            </CircularButton>
          </CardTitle>
        </Card>
      )}
    </LazyWrapper>
  );
});

export default function TopDestinationSection() {
  const { setFilteringData, setHotelSearchData } = useHotelSearch();
  const navigate = useNavigate();
  const formatInput = useCallback((d) => format(d, 'yyyy-MM-dd'), []);

  const handleSelect = useCallback(
    async (card) => {
      const payload = {
        AddressId: card.code,
        CityName: card.title,
        CheckIn: formatInput(new Date()),
        CheckOut: formatInput(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        nights: 1,
        Rooms: 1,
        GuestQuantity: [{ label: 'Room 1', Adults: 1, Children: 0 }],
        Cancellation: false,
        Rating: [],
      };

      setFilteringData(payload);
      const toastId = toast.loading('Searching…', {
        style: { fontSize: '1.25rem', padding: '16px 24px' },
      });

      try {
        const response = await hotelSearch(payload);
        setHotelSearchData(response.data);
        toast.dismiss(toastId);

        if (response.status) {
          navigate('/search-results', { state: { cameFromSearch: true } });
        } else {
          toast.error('Failed to load hotels', {
            style: { fontSize: '1.25rem', padding: '16px 24px' },
          });
        }
      } catch (err) {
        console.error('Search API failed:', err);
        toast.dismiss(toastId);
      }
    },
    [formatInput, navigate, setFilteringData, setHotelSearchData]
  );

  const cards = [
    {
      title: 'Islamabad',
      images: [Islamabad1Img],
      code: 4277,
      // , Islamabad2Img, Islamabad3Img],
    },
    {
      title: 'Karachi',
      images: [Karachi1Img],
      code: 4269,
      // , Karachi2Img],
    },
    {
      title: 'Lahore',
      images: [Lahore2Img],
      code: 4270,
    },
    {
      title: 'Faisalabad',
      images: [Faisalabad1Img],
      code: 4271,
    },
    {
      title: 'Multan',
      images: [Multan1Img],
      code: 4273,
    },
    {
      title: 'Hunza',
      images: [Hunza1Img],
      code: 8500,
    },
  ];

  return (
    <Container>
      <Heading>Top Destinations</Heading>
      <CardsGrid>
        {cards.map((card, index) => (
          <LazyDestinationCard
            key={card.code}
            card={card}
            onSelect={handleSelect}
            index={index}
          />
        ))}
      </CardsGrid>
    </Container>
  );
}
