// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import FooterSection from "./Login/subcomponents/FooterSection";
import Container_NoGradient from "../components/Container_NoGradient";

// —————————————————————————————————————————————————————————————
const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const MessageCard = styled.div`
  background: ${({ theme }) => theme.colors.cardColor};
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 750px;
  width: 100%;
  text-align: center; /* ← center all text and inline elements */
  display: flex;
  flex-direction: column;
  align-items: center; /* ← center the button horizontally */

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xxlarge};
    margin: 0 0 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    color: ${({ theme }) => theme.colors.secondaryText};
    margin-bottom: 2rem;
  }
`;

const HomeButton = styled(Link)`
  width: 40%;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  text-align: center;
  text-decoration: none;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 60%; /* a bit wider on mobile */
  }
`;

// —————————————————————————————————————————————————————————————
export default function NotFoundPage() {
  return (
    <>
      <Container_NoGradient>
        <Header />
        <Content>
          <MessageCard>
            <h2>404 — Page Not Found</h2>
            <p>Oops! The page you’re looking for doesn’t exist.</p>
            <HomeButton to="/">Go back home</HomeButton>
          </MessageCard>
        </Content>
      </Container_NoGradient>
      <FooterSection />
    </>
  );
}
