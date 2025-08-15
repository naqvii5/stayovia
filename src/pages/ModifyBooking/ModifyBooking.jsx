// ModifyBooking.jsx (trimmed to show the tab layer)
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Header from '../../components/Header';
import FooterSection from '../Login/subcomponents/FooterSection';
import { useModifyBooking } from '../../context/ModifyBookingContext';

// import TabsLayout, { TabsContent } from './tabs/TabsLayout';
// import ProfileTab from './tabs/ProfileTab';
// import ReservationsTab from './tabs/ReservationsTab';
// import StayoviaCircleTab from './tabs/StayoviaCircleTab';
import { LoginPage } from './SubComponents/LoginPage';
import ProfileTab from './Tabs/ProfileTab';
import ReservationsTab from './Tabs/ReservationsTab';
import StayoviaCircleTab from './Tabs/StayoviaCircleTab';
import TabsLayout from './Tabs/TabsLayout';

export function ModifyBooking() {
  const { loginToken, loginWithToken } = useModifyBooking();
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('reservations'); // default tab

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (tokenFromStorage && !loginToken) loginWithToken(tokenFromStorage);
  }, [loginToken, loginWithToken]);

  return (
    <>
      <Container>
        <Header />
      </Container>

      {!loginToken ? (
        <SubContainer>
          <LoginPage />
        </SubContainer>
      ) : (
        <>
          <TabsLayout defaultTab="reservations" onTabChange={setActiveTab}>
            <ProfileTab />
            <ReservationsTab />
            <StayoviaCircleTab />
          </TabsLayout>
        </>
      )}

      <FooterSection />
    </>
  );
}

const SubContainer = styled.section`
  width: 100%;
  min-height: 60vh;
`;
const Container = styled.section`
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 20px 100px 0 100px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 10px 10px 0 10px;
  }
`;
