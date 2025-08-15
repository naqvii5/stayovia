import React from 'react';
import styled from 'styled-components';
// import { useThemeContext } from '../../../theme/ThemeProvider';
import beachImg from '../../../assets/beach1.jpeg';
// import qrCodeImg from '../../../assets/qr_dummy.png'; // Replace with real QR later
import 'animate.css/animate.min.css';
import { useInView } from 'react-intersection-observer';
const Container = styled.section`
  width: 100%;
  margin: 0 auto;
  padding: 28px 100px; // reduced height
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 16px;
  }
`;
const ContentRow = styled.div`
  display: flex;
  width: 100%;
  border-radius: 40px;
  background: ${({ theme }) => theme.colors.primary};
  flex-direction: column;
  position: relative;
  overflow: hidden;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }

  /* Smallest devices: no background, no rounded corners */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    // background: transparent;
    // border-radius: 0;
  }
`;

const LeftPanel = styled.div`
  flex: 0 0 60%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1 1 100%;
    padding: 24px;
  }

  /* Smallest devices: ensure text comes first */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    order: 1;
  }
`;

const RightPanel = styled.div`
  flex: 0 0 40%;
  position: relative;
  display: flex;
  overflow: hidden;
  border-radius: 0 40px 40px 0;
  border-left: 1px solid ${({ theme }) => theme.colors.primary};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1 1 100%;
    border-left: 0;
    border-top: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: 0 0 40px 40px;
  }

  /* Smallest devices: image LAST and no extra panel height */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    order: 2;
    border-top: 0; /* remove the divider so no background line shows */
    border-radius: 0; /* no rounded edges on the tiny screen */
    min-height: 0;
    height: auto;
  }
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-sizing: border-box;
  border-radius: inherit;

  /* Smallest devices: let image size itself without leaving extra space */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: auto; /* prevents extra empty area below */
    max-height: none;
  }
`;

/* lazy wrappers reserve space only where needed */
const LazyLeft = styled.div`
  flex: 0 0 60%;
  min-height: 240px;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1 1 100%;
    min-height: auto;
  }
`;

const LazyRight = styled.div`
  flex: 0 0 40%;
  min-height: 240px;
  position: relative;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 1 1 100%;
  }

  /* Smallest devices: remove enforced height so no background shows below */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 0;
  }
`;

const QRColumn = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

const AppTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.primaryHeading};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: white;
  // color: ${({ theme }) => theme.colors.primaryText};
  margin-bottom: 0.5rem;
  flex: 1; // take remaining space
  min-width: 200px; // optional, to keep it readable
`;

const AppDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.small};
  // color: ${({ theme }) => theme.colors.primaryText};
  color: white;
  line-height: 1.6;
`;

const QRInstruction = styled.p`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  // color: ${({ theme }) => theme.colors.secondaryText};
  color: white;
`;

export default function AboutSection() {
  // const { mode } = useThemeContext();
  const { ref: leftRef, inView: leftIn } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: rightRef, inView: rightIn } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <Container>
      <ContentRow>
        <LazyLeft ref={leftRef}>
          {leftIn && (
            <LeftPanel className={`animate__animated animate__backInLeft`}>
              <QRColumn>
                {/* <QRCode src={qrCodeImg} alt="QR Code" /> */}
              </QRColumn>

              <AppTitle>Go further with Stayovia Circle</AppTitle>
              <QRInstruction>
                Your journey gets better with every stay, ride, and tour
              </QRInstruction>
              <AppDescription>
                Earn rewards on hotels, stays, rides & tours with Stayovia
                Circle. Your travel gets better with each booking—exclusive
                deals, perks, and future savings await.
              </AppDescription>
            </LeftPanel>
          )}
        </LazyLeft>

        <LazyRight ref={rightRef}>
          {rightIn && (
            <RightPanel className={`animate__animated animate__backInRight`}>
              <Image src={beachImg} alt="Beach view" />
            </RightPanel>
          )}
        </LazyRight>
      </ContentRow>
    </Container>
  );
}
