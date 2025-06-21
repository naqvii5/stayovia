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
  width: 22%;
aspect-ratio: 3 / 3.5; // slightly shorter
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.cardColor1};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 45%;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    aspect-ratio: unset;
    height: 250px;
  }
`;

const CardRight = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${({ bg }) => bg});
  background-size: cover; // ← change this
  background-repeat: no-repeat;
  background-position: center;
`;


const CardTitle = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
    color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.medium};

  background: rgba(0, 0, 0, 0.25);
  padding: 4px 10px;
  border-radius: 16px;
`;


const CircularButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: 1.25rem; // Increased for visibility
  font-weight: 600;   // Makes the arrow bold
  border: none;
  border-radius: 50%;
  width: 36px;         // Slightly larger for better appearance
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




export default function TopDestinationSection() {
  const cards = [
    {
      title: "Islamabad",
      img: sampleImg,
    },
    {
      title: "Islamabad",
      img: sampleImg,
    },
    {
      title: "Islamabad",
      img: sampleImg,
    },
    {
      title: "Islamabad",
      img: sampleImg,
    },
  ];


  return (
    <Container>
      <Heading>Top Destinations</Heading>
      <CardsGrid>
        {cards.map((card, index) => (
          <Card key={index} onClick={() => console.log(`Details: ${card.title}`)}>
            <CardRight bg={card.img} />
            <CardTitle>
              {card.title}
              <CircularButton onClick={() => console.log(`Go to: ${card.title}`)}>{">"}</CircularButton>
            </CardTitle>

          </Card>

        ))}
      </CardsGrid>
    </Container>
  );
}
