import React from "react";
import styled from "styled-components";
import {
  AiOutlineDollarCircle,
  AiOutlineClockCircle,
  AiOutlineGlobal,
} from "react-icons/ai";
import { MdSecurity, MdHotel } from "react-icons/md";
import sampleImg from "../../../assets/beach1.jpeg"; // TEMP image

const Container = styled.section`
  width: 100%;
  margin: 0px auto;
  // padding: 70px 100px 40px 100px;
  box-sizing: border-box;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 20px 20px;
  }
`;

const Heading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.primaryHeading};
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.mode == 'light' ? theme.colors.primary : theme.colors.primaryHeading};
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



const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin-bottom: 0.25rem;
  line-height: 1.2;
`;

const CardDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.3;
`;

const CardRight = styled.div`
  flex: 0.6;
  background-image: url(${({ bg }) => bg});
  background-size: cover;
  background-position: center;
  height: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 140px;
  }
`;

const LearnMoreButton = styled.button`
  margin-top: 0.5rem;
  padding: 0;
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


export default function FeaturesSection() {
  const cards = [
    {
      title: "Competitive Rates",
      desc: "We guarantee the best prices for your hotel stays.",
      img: sampleImg,
    },
    {
      title: "Flexible Bookings",
      desc: "Book instantly or schedule in advance with no hassle.",
      img: sampleImg,
    },
    {
      title: "Global Reach",
      desc: "Access properties from cities across the globe.",
      img: sampleImg,
    },
    // {
    //   title: "Secure Checkout",
    //   desc: "Your data is safe and transactions are encrypted.",
    //   img: sampleImg,
    // },
  ];


  return (
    <Container>
      <Heading>Explore the Featured Hotels</Heading>
      <CardsGrid>
        {cards.map((card, index) => (
          <Card key={index}>
            <CardLeft>
              {/* <CardTitle>{card.title}</CardTitle> */}
              <CardDesc>{card.desc}</CardDesc>
              <LearnMoreButton onClick={() => console.log(`Details: ${card.title}`)}>
                Learn More →
              </LearnMoreButton>

            </CardLeft>

            <CardRight bg={card.img} />
          </Card>
        ))}
      </CardsGrid>
    </Container>
  );
}
