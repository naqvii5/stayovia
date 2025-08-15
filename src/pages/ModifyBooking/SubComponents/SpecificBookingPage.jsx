import styled from 'styled-components';
import {
  FaCheck,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaTimesCircle,
  FaUser,
} from 'react-icons/fa';
import { useState } from 'react';
import EditDatesSheet from './EditDatesSheet';
import CancelBookingModal from './CancelBookingModal';
import EditGuestModal from './EditGuestModal';

export function SpecificBookingPage({ selectedReservation, onBack }) {
  if (!selectedReservation) return null;
  const b = selectedReservation;
  // Rooms: prefer real data if present, otherwise show two demo rooms
  // NEW: one reservation item per rate plan
  const reservations =
    Array.isArray(b.reservations) && b.reservations.length
      ? b.reservations
      : (() => {
          const fallbackCurrency = (b.currency || 'USD').toUpperCase();
          const out = [];

          if (Array.isArray(b.rooms) && b.rooms.length) {
            // Legacy shape: flatten rooms → ratePlans into independent reservations
            b.rooms.forEach((room) => {
              (room.ratePlans || []).forEach((rp, i) => {
                out.push({
                  id: rp.id || `${room.id || 'room'}_${i}`,
                  room: {
                    id: room.id,
                    name: room.name || b.roomName || 'Room',
                    imageUrl: room.imageUrl || b.roomImageUrl || b.imageUrl,
                    details: room.details || b.roomDetails,
                    paxAdults: room.paxAdults ?? b.paxAdults ?? b.adults ?? 2,
                    paxChildren:
                      room.paxChildren ?? b.paxChildren ?? b.children ?? 0,
                  },
                  ratePlan: {
                    id: rp.id,
                    name: rp.name || b.ratePlanName || 'Rate Plan',
                    details: rp.details || b.ratePlanDetails,
                    breakfastIncluded:
                      rp.breakfastIncluded ?? !!b.breakfastIncluded,
                    cancellation: rp.cancellation || b.cancellation,
                  },
                  unitPrice:
                    Number(rp.price ?? b.ratePlanPrice ?? b.price) || 0,
                  quantity: Number(rp.quantity ?? b.quantity ?? 1),
                  currency: (rp.currency || fallbackCurrency).toUpperCase(),
                });
              });
            });
            return out;
          }

          // No b.rooms and no b.reservations → DUMMY DATA (two items)
          out.push({
            id: 'dummy_1',
            room: {
              id: 'dummy_room_1',
              name: b.roomName || 'Deluxe King Room',
              imageUrl: b.roomImageUrl || b.imageUrl,
              details:
                b.roomDetails || 'Spacious room with city view and workspace',
              paxAdults: b.paxAdults ?? b.adults ?? 2,
              paxChildren: b.paxChildren ?? b.children ?? 0,
            },
            ratePlan: {
              id: 'dummy_rp_1',
              name: b.ratePlanName || 'Best Available',
              details: b.ratePlanDetails || 'Breakfast included',
              breakfastIncluded: b.breakfastIncluded ?? true,
              cancellation:
                b.cancellation || 'Free cancellation until 24h before check-in',
            },
            unitPrice: Number(b.ratePlanPrice ?? b.price ?? 120),
            quantity: Number(b.quantity ?? 1),
            currency: fallbackCurrency,
          });

          out.push({
            id: 'dummy_2',
            room: {
              id: 'dummy_room_2',
              name: 'Executive Twin',
              imageUrl: b.imageUrl,
              details: 'High floor, lounge access, espresso machine',
              paxAdults: 2,
              paxChildren: 1,
            },
            ratePlan: {
              id: 'dummy_rp_2',
              name: 'Best Rate',
              details: 'Prepay & save 15%',
              breakfastIncluded: false,
              cancellation: 'Non-refundable',
            },
            unitPrice: 110,
            quantity: 1,
            currency: fallbackCurrency,
          });

          return out;
        })();

  const grandTotal = reservations.reduce(
    (sum, it) => sum + (Number(it.unitPrice) || 0) * (Number(it.quantity) || 1),
    0
  );

  const grandCurrency = (
    reservations[0]?.currency ||
    b.currency ||
    'USD'
  ).toUpperCase();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const [isEditOpen, setIsEditOpen] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const [dates, setDates] = useState({
  //   checkIn: b.checkIn,
  //   checkOut: b.checkOut,
  //   nights: b.nights || null,
  // });

  return (
    <Container>
      <HeaderRow>
        <BackButton onClick={onBack}>← Back to reservations</BackButton>
        <Title>Reservation Details</Title>
      </HeaderRow>
      <Wrapper>
        <LeftContainer>
          {/* Booking info list */}
          <BookingInfoList>
            <Status $type={b.status}>{b.status}</Status>

            <BookingInfoItem>
              <FaCheck /> Your booking in <strong>{b.id}</strong> is {b.status}.
            </BookingInfoItem>
            <BookingInfoItem>
              <FaCheck /> You’re all set! We sent your confirmation email to{' '}
              <strong>guest@email.com</strong>
            </BookingInfoItem>
            <BookingInfoItem>
              <FaCheck /> Your payment will be handled by{' '}
              <strong>{b.hotelName}</strong> in <strong>{b.cityName}</strong>.
              {/* The Price section below has more details. */}
            </BookingInfoItem>
          </BookingInfoList>

          {/* ——— Hotel details (no borders / no bg) ——— */}
          <Section>
            <SectionHeader>
              <SubTitle>{b.hotelName}</SubTitle>

              <StarsWrap aria-label={`Rating ${b.stars || 0} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => {
                  const r = Number(b.stars) || 0;
                  if (r >= i + 1) return <FaStar key={i} />;
                  if (r > i && r < i + 1) return <FaStarHalfAlt key={i} />;
                  return <FaRegStar key={i} />;
                })}
              </StarsWrap>
            </SectionHeader>

            {/* Grouped: dates + address on the left, image on the right */}
            <DetailsRow>
              <LeftCol>
                {/* Dates row */}
                <InlineRow>
                  <Icon>
                    <FaCalendarAlt />
                  </Icon>
                  <FieldGroup>
                    <FieldLabel>Check‑in</FieldLabel>
                    <FieldValue>{b.checkIn}</FieldValue>
                  </FieldGroup>
                  <VDivider aria-hidden />
                  <FieldGroup>
                    <FieldLabel>Check‑out</FieldLabel>
                    <FieldValue>{b.checkOut}</FieldValue>
                  </FieldGroup>
                </InlineRow>

                {/* Address row */}
                <InlineRow>
                  <Icon>
                    <FaMapMarkerAlt />
                  </Icon>
                  <FieldValue title={b.address}>
                    {b.address || `${b.cityName || ''}`}
                  </FieldValue>
                </InlineRow>
              </LeftCol>

              <RightCol>
                <HotelImageSide>
                  <img src={b.imageUrl} alt={b.hotelName} />
                </HotelImageSide>
              </RightCol>
            </DetailsRow>
          </Section>

          {/* ——— Rooms & Rate Plans (iterate) ——— */}
          {/* ——— Reservations (each item = one rate plan) ——— */}
          {reservations.map((item, idx) => (
            <Section key={item.id || idx}>
              <SubTitle>
                Room {idx + 1}
                {/* : {item.room.name} */}
              </SubTitle>

              <Row $alignStart>
                <ThumbSmall>
                  <img src={item.room.imageUrl} alt={item.room.name} />
                </ThumbSmall>

                <div>
                  <RoomTitle>{item.room.name}</RoomTitle>
                  <Subtle>
                    {item.room.details ||
                      'Comfortable room with essential amenities'}
                  </Subtle>

                  <Bullets>
                    <li>
                      <strong>Pax:</strong> {item.room.paxAdults ?? 2} adults
                      {typeof item.room.paxChildren === 'number' &&
                      item.room.paxChildren > 0
                        ? `, ${item.room.paxChildren} child`
                        : ''}
                    </li>
                    {/* <li>
                      <strong>Rate Plan:</strong> {item.ratePlan.name}
                      {item.ratePlan.breakfastIncluded
                        ? ', Breakfast included'
                        : ''}
                    </li> */}
                    {item.ratePlan.cancellation && (
                      <li>
                        <strong>Cancellation:</strong>{' '}
                        {item.ratePlan.cancellation}
                      </li>
                    )}
                  </Bullets>
                </div>
              </Row>

              <PriceRow>
                <span>
                  RatePlan: <strong> {item.ratePlan.name}</strong>
                </span>
              </PriceRow>
              <PriceRow>
                <span>RatePlan Price:</span>
                <span>
                  <strong>
                    {(item.currency || 'USD').toUpperCase()} {item.unitPrice}
                  </strong>{' '}
                  + Tax
                </span>
              </PriceRow>

              <PriceRow>
                <span>Sub Total:</span>
                <span>
                  <strong>
                    {(item.currency || 'USD').toUpperCase()}{' '}
                    {(
                      (Number(item.unitPrice) || 0) *
                      (Number(item.quantity) || 1)
                    ).toFixed(2)}
                  </strong>{' '}
                  ({item.unitPrice} × {item.quantity || 1})
                </span>
              </PriceRow>
            </Section>
          ))}

          {/* ——— Grand Total ——— */}
          <Section>
            <GrandTotalCard>
              <GrandTotalLabel>Grand Total</GrandTotalLabel>
              <GrandTotalValue>
                <GrandTotalCurrency>{grandCurrency}</GrandTotalCurrency>
                <GrandTotalAmount>{grandTotal.toFixed(2)}</GrandTotalAmount>
              </GrandTotalValue>
            </GrandTotalCard>
          </Section>
        </LeftContainer>
        <RightContainer>
          <EditCard>
            <EditTitle>Edit details of reservation.</EditTitle>
            <EditSub>You can view or change your reservations.</EditSub>

            <ActionList>
              {/* <ActionItem type="button" onClick={() => setIsEditOpen(true)}>
                <ActionIcon>
                  <FaCalendarAlt />
                </ActionIcon>
                <ActionText>Edit Dates</ActionText>
              </ActionItem> */}

              <ActionItem type="button" onClick={() => setIsCancelOpen(true)}>
                <ActionIcon>
                  <FaTimesCircle />
                </ActionIcon>
                <ActionText>Cancel Reservation</ActionText>
              </ActionItem>

              <ActionItem
                type="button"
                onClick={() => {
                  setIsGuestOpen(true);
                }}
              >
                <ActionIcon>
                  <FaUser />
                </ActionIcon>
                <ActionText>Edit Guest Details</ActionText>
              </ActionItem>
            </ActionList>
          </EditCard>
        </RightContainer>
      </Wrapper>
      {/* sheet */}
      {/* <EditDatesSheet
        open={isEditOpen}
        checkIn={dates.checkIn}
        checkOut={dates.checkOut}
        headerOffset={64} // set to 64 if your page header is fixed
        onClose={() => setIsEditOpen(false)}
        onApply={(res) => setDates(res)} // persist to API here if needed
        // months={2}                  // or leave auto
        title="Edit Dates"
      /> */}
      {/* Cancellation Modal */}
      <CancelBookingModal
        open={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        headerOffset={64} // set to 64 if your page header is fixed
        reservation={b} // pass your existing reservation object
      />
      <EditGuestModal
        open={isGuestOpen}
        onClose={() => setIsGuestOpen(false)}
        onSave={(guest) => {
          // persist guest to API/state
          console.log('guest updated:', guest);
        }}
        headerOffset={64}
        reservation={b}
        initialGuest={{
          firstName: b.firstName,
          lastName: b.lastName,
          contact: b.contactNumber,
          dob: b.dob, // "YYYY-MM-DD"
          isPrimary: true,
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 3rem 10rem 13rem 16rem;
  margin: auto;
  background: ${({ theme }) => theme.colors.mainBackground};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 2rem 1.25rem 6rem 1.25rem;
  }
  @media (max-width: 520px) {
    padding: 1.25rem 1rem 5rem 1rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  margin: 25px 0 0 0;
  display: flex;
  background: ${({ theme }) => theme.colors.mainBackground};
  flex-direction: row;
  gap: 4rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 2rem;
    padding: 0 0.25rem;
  }
`;

const LeftContainer = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const RightContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const EditCard = styled.aside`
  position: sticky;
  top: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.cardColor2 || '#e9e9e9'};
  background: ${({ theme }) => theme.colors.cardColor};
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: static; /* avoid sticky overlap on small screens */
    top: auto;
  }
`;

const EditTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

const EditSub = styled.p`
  margin: -0.25rem 0 0.25rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.9;
`;

const ActionList = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const ActionItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 0.65rem;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.cardColor2};
  }
`;

const ActionIcon = styled.span`
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.mainBackground};
  color: #000;
  flex-shrink: 0;

  svg {
    font-size: 1rem;
  }

  @media (max-width: 520px) {
    width: 30px;
    height: 30px;
    svg {
      font-size: 0.9rem;
    }
  }
`;

const ActionText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small || theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`;

const HeaderRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* left | center | right */
  align-items: center;
  column-gap: 12px;
  min-height: 40px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr; /* stack */
    row-gap: 0.75rem;
    justify-items: center; /* center the title */
  }
`;

const BackButton = styled.button`
  grid-column: 1 / 2; /* left column */
  justify-self: start;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 1.8rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-self: start; /* stays left when stacked */
  }

  @media (max-width: 520px) {
    padding: 0.4rem 0.8rem;
  }
`;

const Title = styled.h2`
  grid-column: 2 / 3; /* middle column on desktop */
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-column: 1 / -1; /* full width when stacked */
    text-align: center;
  }

  @media (max-width: 520px) {
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const Status = styled.span`
  align-self: flex-start;
  padding: 0.2rem 0rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 700;

  ${({ $type, theme }) => {
    const t = ($type || '').toLowerCase();
    if (t.includes('confirm'))
      return `color: ${theme.colors.successText || '#1f8f3a'};`;
    if (t.includes('pending'))
      return `color: ${theme.colors.warningText || '#b47800'};`;
    if (t.includes('cancel'))
      return `color: ${theme.colors.dangerText || '#b10016'};`;
    return `color: ${theme.colors.primaryText};`;
  }}
`;

const BookingInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const BookingInfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};

  svg {
    flex-shrink: 0;
    font-size: 1rem;
    color: black;
    margin-top: 0.25rem;
  }

  @media (max-width: 520px) {
    font-size: 12px;
    svg {
      font-size: 0.9rem;
    }
  }

  strong {
    font-weight: 600;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 10px 0;
  border-top: 1px solid #e9e9e9;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const SubTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.large || theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 520px) {
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const StarsWrap = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  svg {
    font-size: 1rem;
    color: #f5b400;
  }

  @media (max-width: 520px) {
    svg {
      font-size: 0.9rem;
    }
  }
`;

const DetailsRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const LeftCol = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`;

const InlineRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  min-width: 0;
`;

const RightCol = styled.div`
  flex: 0 0 auto;
`;

const HotelImageSide = styled.div`
  width: 200px;
  height: 120px;
  border-radius: 0.8rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.cardColor2};
  background: ${({ theme }) => theme.colors.mainBackground};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    height: 180px;
  }
  @media (max-width: 520px) {
    height: 140px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: ${({ $alignStart }) => ($alignStart ? 'flex-start' : 'center')};
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Icon = styled.span`
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.cardColor2};
  color: ${({ theme }) => theme.colors.primaryText};

  svg {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 140px;
  gap: 0.15rem;

  @media (max-width: 520px) {
    min-width: 120px;
  }
`;

const FieldLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const FieldValue = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VDivider = styled.span`
  display: inline-block;
  width: 1px;
  height: 35px;
  background: #b9b2b2ff;
  margin: 0 3rem 0 0;
  align-self: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const ThumbSmall = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 0.6rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.cardColor2};
  background: ${({ theme }) => theme.colors.mainBackground};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 520px) {
    width: 56px;
    height: 56px;
  }
`;

const RoomTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const Subtle = styled.p`
  margin: 0.15rem 0 0.35rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const Bullets = styled.ul`
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.25rem;

  li {
    list-style: disc;
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    color: ${({ theme }) => theme.colors.primaryText};
  }

  @media (max-width: 520px) {
    padding-left: 0.9rem;
  }
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap; /* allow wrap on small screens */
  font-size: ${({ theme }) => theme.fontSizes.small || theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};

  span:last-child {
    // margin-left: auto; /* keep amount right-aligned when wrapping */
  }
`;

const GrandTotalCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 4rem;
  padding: 2rem 1.25rem;
  border-radius: 0.9rem;
  background: rgba(56, 132, 255, 0.08);
  border: 1px solid rgba(56, 132, 255, 0.18);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 1.25rem 1rem;
  }
`;

const GrandTotalLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 550;
`;

const GrandTotalValue = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
`;

const GrandTotalCurrency = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

const GrandTotalAmount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.large || theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 550;

  @media (max-width: 520px) {
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;
