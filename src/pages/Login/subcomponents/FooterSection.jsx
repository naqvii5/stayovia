import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import logoSrc from '../../../assets/StayoViaLogo.png';
// import playStore from '../../../assets/playStore.png';
// import appStore from '../../../assets/appStore.png';
import Stores from '../../../assets/stores.png';
import ComingSoon from '../../../assets/comingSoonRibbon.png';

import MC from '../../../assets/mastercard.svg';
import UP from '../../../assets/unionpay.svg';
import Visa from '../../../assets/visa.svg';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

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

  /* Avoid chopping text on the right */
  overflow: visible;

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
const NoWrap = styled.span`
  white-space: nowrap;
`;

const Payments = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 24px;
`;
// 1) Fix SectionMid and make desktop row layout spaced
// Keep BottomBar left-aligned on mobile; allow wrapping overall
const BottomBar = styled.div`
  margin-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.colors.primary};
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start; /* left on mobile */
  text-align: left;
  flex-wrap: wrap; /* avoid overflow */

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

// Remove margin-left so wrapped lines start flush-left; spacing handled by gaps
const LinkItem = styled.span`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
const LegalGroup = styled.div`
  display: flex;
  flex-direction: column; /* mobile: legal line, then links */
  align-items: flex-start;
  gap: 0.4rem;
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row; /* tablet+: inline */
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap; /* wrap to next row instead of overflowing */
  }
`;

/* Keep the legal sentence compact on desktop, but allow wrap on small.
   NOTE: Avoid inline-flex here; it resists wrapping. */
const LegalLine = styled.span`
  font-family: ${({ theme }) => theme.fonts.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  display: inline; /* allow text to wrap normally */
  white-space: normal; /* mobile: can wrap if needed */
  overflow-wrap: anywhere;
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    white-space: nowrap; /* tablet+: keep the legal sentence on one line */
  }
`;

/* Inline link inside the legal line; don’t split the company name */
const InlineLink = styled(LinkItem)`
  display: inline;
  white-space: nowrap;
`;

/* Links row wraps as needed (both mobile and when desktop gets tight) */
const LinksRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.75rem;
  min-width: 0;
`;

const SectionMid = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between; /* <-- typo fixed */

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

// 3) (Optional) Make the store image wrapper responsive
const StoreIconWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 350px; /* was fixed width */
  overflow: visible;
`;

const StoreImage = styled.img`
  display: block; /* remove inline whitespace below img */
  width: 100%;
  height: auto;
  opacity: 0.6; /* only the store badges are translucent */
`;

const RibbonLeft = styled.img`
  position: absolute;
  top: 25px; /* nudge it a bit outside the wrapper */
  left: 40px; /* adjust as needed */
  width: 30%; /* scale to taste */
  height: auto;
  z-index: 10; /* ensure it’s on top */
  pointer-events: none;
  // transform: rotate(-12deg);
  // transform-origin: bottom left;
`;
const RibbonRight = styled.img`
  position: absolute;
  top: 25px; /* nudge it a bit outside the wrapper */
  right: 30px; /* adjust as needed */
  width: 30%; /* scale to taste */
  height: auto;
  z-index: 10; /* ensure it’s on top */
  pointer-events: none;
  // transform: rotate(-12deg);
  // transform-origin: bottom left;
`;
// 2) On desktop, push AppIcons to the right end
const AppIcons = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: auto; /* <-- this sends it to the far right */
    margin-top: 0; /* tidy spacing on desktop */
  }
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

const ModalContent = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.5;
  white-space: pre-line;
`;
// at top of file, alongside your other styled components
const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  margin: 1rem 0 0.5rem;
`;

const SectionText = styled.p`
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.5;
  margin: 0.5rem 0;
`;

const BulletList = styled.ul`
  margin: 0.5rem 0 1rem 1.5rem;
  list-style: disc;
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  li {
    margin-bottom: 0.25rem;
  }
`;

export default function FooterSection() {
  const [modalType, setModalType] = useState(null);

  useEffect(() => {
    if (modalType) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [modalType]);

  const getModalText = (type) => {
    switch (type) {
      case 'Privacy Policy':
        return (
          <>
            <SectionTitle>Introduction</SectionTitle>
            <SectionText>
              Stayovia is a travel tech brand of Purple Technologies (Pvt) Ltd,
              is committed to protecting your privacy. This policy outlines how
              we collect, use, and protect your personal information.
            </SectionText>

            <SectionTitle>Information Collection</SectionTitle>
            <BulletList>
              <li>
                <strong>Personal Information:</strong> We collect your name,
                email address, and phone number when you make a booking.
              </li>
              <li>
                <strong>Usage Data:</strong> We may collect info on how you use
                our booking engine: IP, browser, pages visited.
              </li>
            </BulletList>

            <SectionTitle>Use of Information</SectionTitle>
            <BulletList>
              <li>
                <strong>Booking and Reservation:</strong> Used to process and
                confirm your booking.
              </li>
              <li>
                <strong>Communication:</strong> To send confirmations, updates,
                promos.
              </li>
              <li>
                <strong>Improvement:</strong> Usage data helps us improve our
                UX.
              </li>
            </BulletList>

            <SectionTitle>Data Protection</SectionTitle>
            <SectionText>
              We implement industry-standard security measures to guard your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </SectionText>

            <SectionTitle>Third-Party Disclosure</SectionTitle>
            <SectionText>
              We do not sell, trade, or otherwise transfer your personal
              information to outside parties except to the hotel with which you
              are making a booking.
            </SectionText>

            <SectionTitle>Your Rights</SectionTitle>
            <SectionText>
              You have the right to access, correct, or delete your personal
              information. You may also opt-out of receiving promotional
              communications.
            </SectionText>

            <SectionTitle>Changes to the Policy</SectionTitle>
            <SectionText>
              We may update this policy from time to time. Any changes will be
              posted on this page.
            </SectionText>
          </>
        );
      case 'Terms & Conditions':
        return (
          <>
            <SectionTitle>Introduction</SectionTitle>
            <SectionText>
              Welcome to Stayovia, a trevel tech brand of Purple Technologies
              Pvt Ltd. By accessing or using our travel portal, you agree to
              comply with and be bound by these Terms and Conditions. Please
              review them carefully before making a booking.
            </SectionText>
            <SectionTitle>Address:</SectionTitle>
            <SectionText>
              3rd Floor, Block 9-E, F-6 Markaz, Super Market, Islamabad.
            </SectionText>
            <SectionTitle>Definitions</SectionTitle>
            <BulletList>
              <li>
                <strong>Stayovia:</strong> The travel portal developed by Purple
                Technologies Pvt Ltd.
              </li>
              <li>
                <strong>Hotel:</strong> The accommodation provider using
                Stayovia for direct bookings.
              </li>
              <li>
                <strong>Guest:</strong>The person making a booking through
                Stayovia.
              </li>
            </BulletList>
            <SectionTitle>Booking Process</SectionTitle>
            <BulletList>
              <li>
                <strong>Availability and Pricing:</strong>
                All bookings are subject to availability and the hotel’s terms
                and conditions. Prices are subject to change without prior
                notice until a booking is confirmed.
              </li>
              <li>
                <strong>Confirmation: </strong> A booking is confirmed when you
                receive an email confirmation with a reservation voucher.
              </li>
              <li>
                <strong>Payment:</strong> Full payment or a deposit, as
                specified during the booking process, must be made to secure a
                reservation.
              </li>
            </BulletList>
            <SectionTitle>Cancellation and Refund</SectionTitle>
            <BulletList>
              <li>
                <strong>Refundable Rates:</strong>
                Bookings made under refundable rates can be canceled as per the
                hotel’s cancellation policy, and the applicable refund will be
                processed.
              </li>
              <li>
                <strong>Non-Refundable Rates: </strong> Bookings made under
                non-refundable rates cannot be canceled or refunded.
              </li>
              <li>
                <strong>No-Shows:</strong> Failure to arrive at the hotel on the
                scheduled check-in date will be treated as a no-show, and no
                refund will be issued.
              </li>
            </BulletList>

            <SectionTitle>Amendments</SectionTitle>
            <BulletList>
              <li>
                {/* <strong>Refundable Rates:</strong> */}
                Changes to bookings are subject to availability and the hotel’s
                amendment policies. Additional charges may apply.
              </li>
            </BulletList>
            <SectionTitle>Liability</SectionTitle>
            <BulletList>
              <li>
                {/* <strong>Refundable Rates:</strong> */}
                Purple Technologies Pvt Ltd is not responsible for any loss or
                damage incurred by the guest due to circumstances beyond our
                control, including but not limited to, natural disasters,
                strikes, or governmental actions.
              </li>
            </BulletList>
            <SectionTitle>Governing Law</SectionTitle>
            <BulletList>
              <li>
                {/* <strong>Refundable Rates:</strong> */}
                These terms and conditions are governed by the laws of Pakistan.
                Any disputes arising from these terms and conditions will be
                subject to the exclusive jurisdiction of the courts in Pakistan.
              </li>
            </BulletList>
          </>
        );
      case 'Frequently Asked Questions':
        return `1. What is Stayovia?\nStayovia is an online travel agency (OTA) offering affordable accommodations with lower prices than Booking.com and Expedia, powered by direct Google Travel integration.\n\n2. How is Stayovia cheaper than other OTAs?\nWe work on slimmer commission models, avoid heavy advertising, and pass the savings directly to travelers.\n\n3. How do I know my booking is confirmed?\nYou will receive a confirmation email instantly after payment. If not received within 10 minutes, contact us at reach@stayovia.com.\n\n4. Can I cancel or change my booking?\nYes — but cancellation and change policies vary by property. Always review the cancellation policy shown before booking.\n\n5. Who should I contact for help?\nReach us anytime at reach@stayovia.com or WhatsApp/Call at +92 334 1787753.\n\n6. How do I know the property is genuine?\nAll listings are vetted and monitored via Google and partner systems. Reviews and ratings help ensure quality.\n\n7. Do you offer support in case of a problem during stay?\nYes. In case of issues during your stay, reach us and we’ll try to resolve the matter directly with the property on your behalf.`;
      case 'Support':
        return (
          <>
            <SectionTitle>Support</SectionTitle>
            <SectionText>
              At Purple Technologies, we are committed to providing our
              customers and partners with a transparent and fair process to
              raise and resolve complaints efficiently.
            </SectionText>

            <SectionTitle>Business Hours</SectionTitle>
            <SectionText>
              Monday to Saturday
              <br />
              0900–1800 hours (GMT+5)
            </SectionText>

            <SectionTitle>Contact Details</SectionTitle>
            <BulletList>
              <li>
                <strong>Email:</strong> reach@purpletech.ai
              </li>
              <li>
                <strong>Phone:</strong> +92 334 1PURPLE (787753)
              </li>
            </BulletList>

            <SectionTitle>Our Commitments</SectionTitle>
            <BulletList>
              <li>Acknowledge all complaints within 1 business day</li>
              <li>
                Provide a resolution or meaningful update within 3 to 5 business
                days
              </li>
              <li>
                Keep you informed throughout the process until the matter is
                resolved
              </li>
            </BulletList>

            <SectionText>
              If your issue requires more time, we will notify you of the
              expected timeline.
            </SectionText>
          </>
        );
      case 'Cancellation Policy':
        return (
          <>
            <SectionTitle>Introduction</SectionTitle>
            <SectionText>
              Stayovia provides flexible cancellation policies to accommodate
              our guests’ needs. The cancellation policy varies based on the
              rate plan booked.
            </SectionText>

            <SectionTitle>Refundable Rates</SectionTitle>
            <BulletList>
              <li>
                <strong>Cancellation Period:</strong> Cancellations made within
                the specified period in the booked rate plan before the check-in
                date are eligible for a full refund.
              </li>
              <li>
                <strong>Method:</strong> Cancellations must be made through the
                Stayovia platform.
              </li>
            </BulletList>

            <SectionTitle>Non-Refundable Rates</SectionTitle>
            <SectionText>
              No cancellations or refunds are permitted for bookings made under
              non-refundable rate plans.
            </SectionText>

            <SectionTitle>Specific Hotel Policies</SectionTitle>
            <SectionText>
              Each hotel may have its own specific cancellation policy, which
              will be displayed during booking and included in your reservation
              voucher.
            </SectionText>

            <SectionTitle>Confirmation</SectionTitle>
            <SectionText>
              Upon cancellation, you will receive a confirmation email outlining
              the details of your canceled booking and any applicable refunds.
            </SectionText>
          </>
        );
      case 'Refund Policy':
        return (
          <>
            <SectionTitle>Introduction</SectionTitle>
            <SectionText>
              Stayovia aims to provide a clear and fair refund policy to all our
              guests. The refund policy is based on the type of rate plan
              booked.
            </SectionText>

            <SectionTitle>Refundable Rates</SectionTitle>
            <BulletList>
              <li>
                <strong>Cancellation:</strong> If you cancel a booking made
                under a refundable rate plan within the specified period, a full
                refund will be issued.
              </li>
              <li>
                <strong>Process:</strong> Refunds will be processed within 7–10
                business days to the original payment method used.
              </li>
            </BulletList>

            <SectionTitle>Non-Refundable Rates</SectionTitle>
            <SectionText>
              No refunds for bookings under non-refundable rate plans.
            </SectionText>

            <SectionTitle>Partial Refunds</SectionTitle>
            <SectionText>
              In certain circumstances, such as early check-out or booking
              modifications, partial refunds may be issued at the hotel’s
              discretion.
            </SectionText>

            <SectionTitle>No-Show</SectionTitle>
            <SectionText>No refunds will be issued for no-shows.</SectionText>
          </>
        );

      default:
        return '';
    }
  };

  return (
    <Container>
      <FooterContent>
        <BrandColumn>
          <Logo src={logoSrc} alt="Logo" />
          {/* <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}
          > */}
          <SectionMid>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Description>
                Stayovia is a travel tech brand of{' '}
                <NoWrap>Purple Technologies (Pvt) Ltd</NoWrap>
              </Description>

              <SocialIcons>
                <SocialIcon href="https://facebook.com" target="_blank">
                  <FaFacebookF size={16} />
                </SocialIcon>
                <SocialIcon href="https://tiktok.com" target="_blank">
                  <FaTiktok size={16} />
                </SocialIcon>
                <SocialIcon href="https://instagram.com" target="_blank">
                  <FaInstagram size={16} />
                </SocialIcon>
                <SocialIcon href="https://youtube.com" target="_blank">
                  <FaYoutube size={16} />
                </SocialIcon>
              </SocialIcons>
            </div>

            <AppIcons>
              <StoreIconWrapper>
                <StoreImage src={Stores} alt="App & Play Store Badges" />
                <RibbonLeft src={ComingSoon} alt="Coming Soon" />
                <RibbonRight src={ComingSoon} alt="Coming Soon" />
              </StoreIconWrapper>
            </AppIcons>

            {/* </div> */}
          </SectionMid>
        </BrandColumn>
      </FooterContent>

      <BottomBar>
        <Payments>
          <PaymentLogo src={MC} alt="MasterCard" />
          <PaymentLogo src={UP} alt="UnionPay" />
          <PaymentLogo src={Visa} alt="Visa" />
        </Payments>
        <LegalGroup>
          <LegalLine>
            © {new Date().getFullYear()} Stayovia. All rights reserved{' '}
            <InlineLink
              onClick={() => window.open('https://purpletech.ai/', '_blank')}
            >
              <NoWrap>Purple Technologies (Pvt) Ltd</NoWrap>
            </InlineLink>
          </LegalLine>

          <LinksRow>
            <LinkItem onClick={() => setModalType('Terms & Conditions')}>
              <NoWrap>Terms & Conditions</NoWrap>
            </LinkItem>
            <LinkItem onClick={() => setModalType('Privacy Policy')}>
              <NoWrap>Privacy Policy</NoWrap>
            </LinkItem>
            <LinkItem onClick={() => setModalType('Refund Policy')}>
              <NoWrap>Refund Policy</NoWrap>
            </LinkItem>
            <LinkItem onClick={() => setModalType('Cancellation Policy')}>
              <NoWrap>Cancellation Policy</NoWrap>
            </LinkItem>
            <LinkItem onClick={() => setModalType('Support')}>
              <NoWrap>Support</NoWrap>
            </LinkItem>
          </LinksRow>
        </LegalGroup>
      </BottomBar>

      {modalType && (
        <>
          <Backdrop onClick={() => setModalType(null)} />
          <Modal>
            <ModalHeading>
              {modalType.replace(/\b\w/g, (l) => l.toUpperCase())}
            </ModalHeading>
            <ModalContent>{getModalText(modalType)}</ModalContent>
          </Modal>
        </>
      )}
    </Container>
  );
}
