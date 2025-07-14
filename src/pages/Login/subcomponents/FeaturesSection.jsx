import React from 'react';
import styled from 'styled-components';
import 'animate.css/animate.min.css';
import { useInView } from 'react-intersection-observer';
import sampleImg from '../../../assets/beach1.jpeg'; // TEMP image

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
  height: 100%;
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1rem;
  }
`;

const CardDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.3;
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

// --- AnimatedCard wrapper ---
function AnimatedCard({ index, card }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const animationClass = (() => {
    switch (index) {
      case 0:
        return 'animate__backInLeft';
      case 1:
        return 'animate__backInDown';
      case 2:
        return 'animate__backInRight';
      default:
        return 'animate__fadeIn';
    }
  })();

  return (
    <Card
      ref={ref}
      className={`animate__animated ${inView ? animationClass : ''}`}
    >
      <CardLeft>
        <CardDesc>{card.desc}</CardDesc>
        <LearnMoreButton onClick={() => console.log(`Details: ${card.title}`)}>
          Learn More →
        </LearnMoreButton>
      </CardLeft>
      <div
        style={{
          flex: 0.6,
          backgroundImage: `url(${sampleImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
        }}
      />
      <CardRight bg={card.img} />
    </Card>
  );
}
// replace your direct <Card> with this wrapper+lazy mount component
function LazyAnimatedCard({ index, card }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

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
            <CardDesc>{card.desc}</CardDesc>
            <LearnMoreButton
              onClick={() => console.log(`Details: ${card.title}`)}
            >
              Learn More →
            </LearnMoreButton>
          </CardLeft>
          <CardRight bg={card.img} />
        </Card>
      )}
    </LazyWrapper>
  );
}

export default function FeaturesSection() {
  const cards = [
    {
      title: 'Competitive Rates',
      desc: 'We guarantee the best prices for your hotel stays.',
      img: sampleImg,
    },
    {
      title: 'Flexible Bookings',
      desc: 'Book instantly or schedule in advance with no hassle.',
      img: sampleImg,
    },
    {
      title: 'Global Reach',
      desc: 'Access properties from cities across the globe.',
      img: sampleImg,
    },
  ];

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
