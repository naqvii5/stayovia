import React, { useState, useEffect } from "react";
import styled from "styled-components";
import logoSrc from "../../../assets/StayoViaLogo.png";
import playStore from "../../../assets/playStore.png";
import appStore from "../../../assets/appStore.png";

import MC from "../../../assets/mastercard.svg";
import UP from "../../../assets/unionpay.svg";
import Visa from "../../../assets/visa.svg";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const Container = styled.footer`
  width: 100%;
  margin-top: 40px;
  padding: 0px 100px 20px 100px;
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.colors.cardColor} 100%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  color: ${({ theme }) => theme.colors.primaryText};
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 20px;
  }
`;

const FooterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const BrandColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Logo = styled.img`
  width: 100px;
`;

const PaymentLogo = styled.img`
  width: 50px;
`;

const Description = styled.p`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.4;
`;

const Payments = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 24px;
`;

const BottomBar = styled.div`
  margin-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.primary};
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
`;

const LinkItem = styled.span`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  margin-left: 10px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
const AppIcons = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.5rem;
`;
const SocialIcons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const SocialIcon = styled.a`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${({ theme }) => theme.colors.primaryText};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.primaryText};
  text-decoration: none;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryText};
    color: ${({ theme }) => theme.colors.cardColor};
  }
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.cardColor};
  color: ${({ theme }) => theme.colors.primaryText};
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  padding: 2rem;
  border-radius: 16px;
  z-index: 999;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  opacity: 0;
  transform: translate(-50%, -20%);
  animation: fadeInModal 0.3s ease forwards;

  @keyframes fadeInModal {
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 998;
`;

const ModalHeading = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  margin-bottom: 1rem;
`;

const ModalContent = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.5;
  white-space: pre-line;
`;

export default function FooterSection() {
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    if (modalType) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalType]);

  const getModalText = (type) => {
    switch (type) {
      case "Privacy Policy":
        return `Effective Date: June 01, 2025\nLast Updated: June 21, 2025\nAt Stayovia, your privacy is our priority. We are committed to protecting your personal information and providing you with a secure online booking experience.\n\nInformation We Collect\n- Personal details (name, email, phone, etc.) for booking purposes\n- Payment details processed via secure third-party gateways\n- Booking history and preferences\n- Technical data (IP, device type, browser info, etc.)\n\nHow We Use Your Information\n- To process and confirm bookings\n- To communicate booking updates or support messages\n- To improve our services and user experience\n- To comply with legal or regulatory requirements\n\nSharing of Information\nWe do not sell or rent your personal information. We may share necessary data with:\n- Our accommodation partners (for booking confirmation)\n- Payment gateways and fraud prevention services\n- Regulatory authorities where required\n\nData Security\nWe use industry-standard security protocols to protect your data. Sensitive information is encrypted in transit and at rest.\n\nYour Rights\nYou may request access to your data, ask for correction, or request deletion by contacting us at: reach@stayovia.com`;
      case "Terms & Conditions":
        return `Welcome to Stayovia. By using our platform, you agree to the following terms.\n\n1. Use of the Website\nStayovia allows users to search and book accommodations globally. By booking through our platform, you enter into a direct contractual relationship with the selected accommodation provider.\n\n2. Prices & Payments\nWe strive to offer rates lower than other major OTAs. Prices include all taxes unless stated otherwise. All payments are processed securely via third-party payment providers.\n\n3. Booking Confirmation\nAll bookings are confirmed instantly or via email within a few minutes. If any discrepancies arise, please contact our team at reach@stayovia.com within 24 hours.\n\n4. Cancellations & Refunds\nCancellation policies vary by property and are displayed clearly before booking. Refunds, where applicable, will be processed according to the cancellation policy shown.\n\n5. Platform Liability\nStayovia is not responsible for the quality, service, or condition of accommodations listed. However, we are committed to ensuring fair practices and will intervene in disputes when needed.\n\n6. User Responsibilities\nYou agree to:\n- Provide accurate booking details\n- Not use the site for fraudulent activity\n- Comply with the property’s terms during your stay\n\n7. Changes to Terms\nWe reserve the right to update these terms at any time. Changes will be published on this page with a new effective date.`;
      case "Frequently Asked Questions":
        return `1. What is Stayovia?\nStayovia is an online travel agency (OTA) offering affordable accommodations with lower prices than Booking.com and Expedia, powered by direct Google Travel integration.\n\n2. How is Stayovia cheaper than other OTAs?\nWe work on slimmer commission models, avoid heavy advertising, and pass the savings directly to travelers.\n\n3. How do I know my booking is confirmed?\nYou will receive a confirmation email instantly after payment. If not received within 10 minutes, contact us at reach@stayovia.com.\n\n4. Can I cancel or change my booking?\nYes — but cancellation and change policies vary by property. Always review the cancellation policy shown before booking.\n\n5. Who should I contact for help?\nReach us anytime at reach@stayovia.com or WhatsApp/Call at +92 334 1787753.\n\n6. How do I know the property is genuine?\nAll listings are vetted and monitored via Google and partner systems. Reviews and ratings help ensure quality.\n\n7. Do you offer support in case of a problem during stay?\nYes. In case of issues during your stay, reach us and we’ll try to resolve the matter directly with the property on your behalf.`;
      case "Contact Us":
        return `We’re here to help with all your booking and travel needs.\n\nEmail: reach@stayovia.com\nPhone: +92 334 1787753\nWebsite: www.stayovia.com\nSupport Hours: Monday–Saturday, 10 AM to 8 PM (GMT+5)`;
      default:
        return "";
    }
  };

  return (
    <Container>
      <FooterContent>
        <BrandColumn>
          <Logo src={logoSrc} alt="Logo" />
          <div style={{ display: 'flex', flexDirection: "row", width: '100%', justifyContent: 'space-between' }}>

            <div style={{ display: 'flex', flexDirection: "column" }}>
              <Description>
                Stayovia is a travel tech brand of Purple Technologies (Pvt) Ltd
              </Description>
              <SocialIcons>
                <SocialIcon href="https://facebook.com" target="_blank"><FaFacebookF size={16} /></SocialIcon>
                <SocialIcon href="https://tiktok.com" target="_blank"><FaTiktok size={16} /></SocialIcon>
                <SocialIcon href="https://instagram.com" target="_blank"><FaInstagram size={16} /></SocialIcon>
                <SocialIcon href="https://youtube.com" target="_blank"><FaYoutube size={16} /></SocialIcon>
              </SocialIcons>
            </div>
            <AppIcons>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column", width: '100%' }}>
                {/* <h3>Coming Soon</h3> */}
                {/* <SocialIcon title="App Store (Coming Soon)"> */}
                {/* <SiAppstore size={24} /> */}
                <img style={{ width: '120px' }} src={appStore}></img>
                {/* </SocialIcon> */}

              </div>
              <div style={{ display: 'flex', alignItems: 'center', flexDirection: "column", width: '100%' }}>
                {/* <SocialIcon title="Play Store (Coming Soon)"> */}
                {/* <SiGoogleplay size={24} /> */}
                {/* <FaGooglePlay /> */}
                <img style={{ width: '160px' }} src={playStore}></img>
                {/* </SocialIcon> */}

              </div>

              {/* <SocialIcon title="Play Store (Coming Soon)">
                <SiGoogleplay size={24} />
              </SocialIcon>
              <h3>Coming soon on App Store</h3> */}

            </AppIcons>
          </div>
        </BrandColumn>
      </FooterContent>

      <BottomBar>
        <Payments>
          <PaymentLogo src={MC} alt="MasterCard" />
          <PaymentLogo src={UP} alt="UnionPay" />
          <PaymentLogo src={Visa} alt="Visa" />
        </Payments>
        <div>
          © {new Date().getFullYear()} Stayovia. All rights reserved
          <LinkItem onClick={() => window.open("https://purpletech.ai/", "_blank")}>Purple Technologies</LinkItem>
          <LinkItem onClick={() => setModalType("Privacy Policy")}>Privacy</LinkItem>
          <LinkItem onClick={() => setModalType("Terms & Conditions")}>Terms & Conditions</LinkItem>
          <LinkItem onClick={() => setModalType("Frequently Asked Questions")}>FAQ</LinkItem>
          <LinkItem onClick={() => setModalType("Contact Us")}>Contact Us</LinkItem>
        </div>
      </BottomBar>

      {modalType && (
        <>
          <Backdrop onClick={() => setModalType(null)} />
          <Modal>
            <ModalHeading>{modalType.replace(/\b\w/g, (l) => l.toUpperCase())}</ModalHeading>
            <ModalContent>{getModalText(modalType)}</ModalContent>
          </Modal>
        </>
      )}
    </Container>
  );
}
