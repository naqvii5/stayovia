// src/pages/BookingFailed.jsx
import React from "react";
import styled from "styled-components";
import { FiAlertCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Container_NoGradient from "../../components/Container_NoGradient";
import Header from "../../components/Header";
import FooterSection from "../Login/subcomponents/FooterSection";

// —————————————————————————————————————————————————————————————
// Styled Components
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
  margin-bottom: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    margin: 0 0.5rem;
    font-size: ${({ theme }) => theme.fontSizes.small};
  }
`;

const Content = styled.div`
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.cardColor};
  display: flex;
  width: 60%;
  padding: 30px;
  margin: 0 auto;
  min-height: calc(100vh - 370px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xxlarge};
  color: ${({ theme }) => theme.colors.primaryHeading};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.secondaryText};
  text-align: center;
  max-width: 500px;
  margin-bottom: 2rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.primaryHeadingRevert};
  background: ${({ primary, theme }) =>
    primary ? theme.colors.primary : theme.colors.secondaryText};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  min-width: 140px;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ primary, theme }) =>
      primary ? theme.colors.primaryHeading : "#888"};
  }
`;
// —————————————————————————————————————————————————————————————

export default function BookingFailed() {
  const navigate = useNavigate();

  return (
    <>
      <Container_NoGradient>
        <Header />
        <TopBar>
          <Link to="/">Main Page</Link> &gt;
          <Link to="/search">Search</Link> &gt; <span>Booking Failed</span>
        </TopBar>
        <Content>
          <IconWrapper>
            <FiAlertCircle />
          </IconWrapper>
          <Title>Oops! Booking Failed</Title>
          <Description>
            Unfortunately, we couldn't process your booking at this time. Please
            check your payment details and try again. If the problem persists,
            contact our support team for assistance.
          </Description>
          <Actions>
            {/* <Button primary onClick={() => navigate(-1)}>
              Retry Booking
            </Button> */}
            <Button onClick={() => window.open("mailto:support@example.com")}>
              <p>Contact Support</p>
            </Button>
          </Actions>
        </Content>
      </Container_NoGradient>
      <FooterSection />
    </>
  );
}
