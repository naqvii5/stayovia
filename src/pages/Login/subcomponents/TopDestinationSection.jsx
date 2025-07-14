import React from 'react';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'animate.css/animate.min.css';
import { useInView } from 'react-intersection-observer';

// Images
import Islamabad1Img from '../../../assets/Islamabad1.jpeg';
import Islamabad2Img from '../../../assets/Islamabad2.jpeg';
import Islamabad3Img from '../../../assets/Islamabad3.jpeg';
import Lahore1Img from '../../../assets/Lahore1.jpeg';
import Lahore2Img from '../../../assets/Lahore2.jpeg';
import Karachi1Img from '../../../assets/Karachi1.jpeg';
import Karachi2Img from '../../../assets/Karachi2.jpeg';
import Lyallpur1Img from '../../../assets/Lyallpur1.jpeg';
import Multan1Img from '../../../assets/Multan1.jpeg';

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

// 1) Update your SlideImage:
const SlideImage = styled.img`
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
function LazyDestinationCard({ index, card }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  // 0–2 slideDown, 3–5 slideUp
  const animationClass =
    index <= 2 ? 'animate__slideInUp' : 'animate__slideInUp';

  return (
    <LazyWrapper ref={ref}>
      {inView && (
        <Card
          className={`animate__animated ${animationClass}`}
          onClick={() => console.log(`Details: ${card.title}`)}
        >
          <CardRightSlider
            {...{
              dots: false,
              arrows: false,
              autoplay: card.images.length > 1,
              infinite: card.images.length > 1,
              speed: 500,
              autoplaySpeed: 2500,
              slidesToShow: 1,
              slidesToScroll: 1,
            }}
          >
            {card.images.map((imgSrc, idx) => (
              <SlideWrapper key={idx}>
                <SlideImage src={imgSrc} alt={`${card.title} ${idx + 1}`} />
              </SlideWrapper>
            ))}
          </CardRightSlider>
          <CardTitle>
            {card.title}
            <CircularButton
              onClick={(e) => {
                e.stopPropagation();
                console.log(`Go to: ${card.title}`);
              }}
            >
              &gt;
            </CircularButton>
          </CardTitle>
        </Card>
      )}
    </LazyWrapper>
  );
}

export default function TopDestinationSection() {
  const cards = [
    {
      title: 'Islamabad',
      images: [Islamabad1Img],
      // , Islamabad2Img, Islamabad3Img],
    },
    {
      title: 'Karachi',
      images: [Karachi1Img],
      // , Karachi2Img],
    },
    {
      title: 'Lahore',
      images: [Lahore2Img],
    },
    {
      title: 'Faisalabad',
      images: [Lyallpur1Img],
    },
    {
      title: 'Multan',
      images: [Multan1Img],
    },
    {
      title: 'Faisalabad',
      images: [Lyallpur1Img],
    },
  ];

  return (
    <Container>
      <Heading>Top Destinations</Heading>
      <CardsGrid>
        {/* {cards.map((card, index) => {
          const isSingle = card.images.length === 1;

          const sliderSettings = {
            dots: false,
            arrows: false,
            autoplay: !isSingle,
            infinite: !isSingle,
            speed: 500,
            autoplaySpeed: 2500,
            slidesToShow: 1,
            slidesToScroll: 1,
          };

          return (
            <Card
              key={index}
              className={`animate__animated index 0 to 2 animate__slideInDown, index 3-5 animate__slideInUp`}
              onClick={() => console.log(`Details: ${card.title}`)}
            >
              <CardRightSlider {...sliderSettings}>
                {card.images.map((imgSrc, idx) => (
                  <SlideWrapper key={idx}>
                    <SlideImage src={imgSrc} alt={`${card.title} ${idx + 1}`} />
                  </SlideWrapper>
                ))}
              </CardRightSlider>

              <CardTitle>
                {card.title}
                <CircularButton
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log(`Go to: ${card.title}`);
                  }}
                >
                  {'>'}
                </CircularButton>
              </CardTitle>
            </Card>
          );
        })} */}

        {cards.map((card, index) => (
          <LazyDestinationCard key={index} index={index} card={card} />
        ))}
      </CardsGrid>
    </Container>
  );
}
