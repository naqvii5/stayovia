// src/pages/Loading404.jsx
import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import Header from "../components/Header";
import FooterSection from "./Login/subcomponents/FooterSection";
import Container_NoGradient from "../components/Container_NoGradient";

// —————————————————————————————————————————————————————————————
// keyframes for the gradient slide
const slide = keyframes`
  0%   { background-position: 0% 0; }
  100% { background-position: 200% 0; }
`;

const Wrapper = styled.div`
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  overflow: hidden;
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
  //   padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  width: 100%;
  height: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  text-align: center;

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0 0 0;
    // padding-bottom: 1rem;
  }
`;

const LoaderBar = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary},
    ${({ theme }) => theme.colors.primary}
  );
  background-size: 200% 100%;
  animation: ${slide} 1.5s linear infinite;
`;

// —————————————————————————————————————————————————————————————
export default function LoadingPageScreen() {
  return (
    <Wrapper>
      <Container_NoGradient>
        <Header />
        <Content>
          <MessageCard>
            <LoaderBar />

            <h2>Please wait! Loading....</h2>
            <LoaderBar />
          </MessageCard>
        </Content>
      </Container_NoGradient>
      <FooterSection />
    </Wrapper>
  );
}
