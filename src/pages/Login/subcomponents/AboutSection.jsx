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
  // background: linear-gradient(
  //   to bottom,
  //   ${({ theme }) => theme.colors.secondary} 0%,
  //   ${({ theme }) => theme.colors.primary} 100%
  // );
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
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
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const DescriptionRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
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

const QRCode = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

const RightPanel = styled.div`
  flex: 0 0 40%;
  position: relative;
  display: flex;
`;

const Image = styled.img`
  width: 100%;
  height: 100%; // reduced height
  // max-height: 280px;
  border-radius: 0px 40px 40px 0px;
  border-width: 6px 0 6px 6px;
  border-left: solid 1px ${({ theme }) => theme.colors.primary};
  // border-color: ${({ theme }) => theme.colors.primaryHeadingRevert};
  object-fit: cover;
`;
// lazy wrappers reserve space so layout won’t collapse
const LazyLeft = styled.div`
  flex: 0 0 60%;
  min-height: 240px; /* adjust to your panel’s expected height */
  position: relative;
`;

const LazyRight = styled.div`
  flex: 0 0 40%;
  min-height: 240px;
  position: relative;
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
