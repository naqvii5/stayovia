// src/components/EditDatesSheet.jsx (cancel flow with glassmorphism + confirm)
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaChevronDown } from 'react-icons/fa';

export default function CancelBookingModal({
  open,
  onClose,
  headerOffset = 64,
  reservation = {},
}) {
  const {
    id = '—',
    hotelName = 'Hotel Name',
    imageUrl,
    cityName = '',
    checkIn = '',
    checkOut = '',
    status = 'Confirmed',
    currency = 'USD',
    price = 0,
    cancellation = '',
    cancellationFee = 0,
    willBeCharged = 0,
    rooms = [],
  } = reservation || {};

  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [touchReason, setTouchReason] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const nights = useMemo(
    () => diffNights(checkIn, checkOut),
    [checkIn, checkOut]
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const continueDisabled = !reason;

  return (
    <Sheet
      $headerOffset={headerOffset}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <SheetInner onClick={(e) => e.stopPropagation()}>
        <SheetWrapper>
          {/* LEFT */}
          <LeftContainer>
            {step === 1 && (
              <Section>
                <TopInline>
                  <BackMini onClick={onClose}>
                    ← Back to my reservation
                  </BackMini>
                  <StepMeta>Step 1 of 2</StepMeta>
                </TopInline>

                <StepTitle>Reason for canceling</StepTitle>
                <StepSubtitle>
                  We can help you find alternative solutions if you need to make
                  changes to your booking.
                </StepSubtitle>

                <FieldLabel>Reason</FieldLabel>
                <SelectWrap $invalid={touchReason && !reason}>
                  <SelectBase
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    onBlur={() => setTouchReason(true)}
                    aria-invalid={touchReason && !reason}
                  >
                    <option value="">Select a reason</option>
                    <option value="change_of_plans">Change of plans</option>
                    <option value="found_better_price">
                      Found a better price
                    </option>
                    <option value="booking_mistake">Booked by mistake</option>
                    <option value="travel_restrictions">
                      Travel restrictions
                    </option>
                    <option value="other">Other</option>
                  </SelectBase>
                  <Chevron>
                    <FaChevronDown />
                  </Chevron>
                </SelectWrap>

                <ButtonsRow>
                  <PrimarySm
                    disabled={continueDisabled}
                    onClick={() => !continueDisabled && setStep(2)}
                  >
                    Continue
                  </PrimarySm>
                  <LinkBtn type="button" onClick={onClose}>
                    I want to keep this booking
                  </LinkBtn>
                </ButtonsRow>
              </Section>
            )}

            {step === 2 && (
              <Section>
                <TopInline>
                  <BackMini onClick={() => setStep(1)}>← Back</BackMini>
                  <StepMeta>Step 2 of 2</StepMeta>
                </TopInline>

                <StepTitle>Confirm cancellation</StepTitle>
                <StepSubtitle>
                  You're about to cancel your entire booking – review the
                  details below before canceling.
                </StepSubtitle>

                <RoomSummary>
                  <Thumb>
                    <img src={imageUrl} alt={hotelName} />
                  </Thumb>
                  <SummaryBody>
                    <HotelName>{hotelName}</HotelName>
                    <Meta>
                      <span>
                        {fmtDate(checkIn)} – {fmtDate(checkOut)} ({nights} night
                        {nights === 1 ? '' : 's'})
                      </span>
                      <Dot>•</Dot>
                      <span>{cityName}</span>
                      {cancellation ? (
                        <>
                          <Dot>•</Dot>
                          <span>{cancellation}</span>
                        </>
                      ) : null}
                    </Meta>
                    <StatusBadge $type={status}>{status}</StatusBadge>
                  </SummaryBody>
                </RoomSummary>

                <BreakdownCard>
                  <BreakTitle>Price breakdown</BreakTitle>
                  <BreakRow>
                    <span>Cancellation fee</span>
                    <strong>{(currency || 'USD').toUpperCase()} 0</strong>
                  </BreakRow>
                  <Divider />
                  <BreakRow>
                    <span>You&apos;ll be charged</span>
                    <strong>{(currency || 'USD').toUpperCase()} 0</strong>
                  </BreakRow>
                </BreakdownCard>

                <ButtonsRow>
                  <DangerBtn onClick={() => setConfirmOpen(true)}>
                    Cancel booking
                  </DangerBtn>
                  <LinkBtn type="button" onClick={onClose}>
                    I want to keep this booking
                  </LinkBtn>
                </ButtonsRow>
              </Section>
            )}
          </LeftContainer>

          {/* RIGHT */}
          <RightContainer>
            <InfoCard>
              <CardGrid>
                <CardThumb>
                  <img src={imageUrl} alt={hotelName} />
                </CardThumb>
                <CardContent>
                  <CardTop>
                    <CardHotel>{hotelName}</CardHotel>
                    <CardPrice>
                      <Cur>{(currency || 'USD').toUpperCase()}</Cur>
                      <Amt>{Number(price || 0).toFixed(2)}</Amt>
                    </CardPrice>
                  </CardTop>
                  <CardMeta>
                    <span>
                      {fmtDate(checkIn)} – {fmtDate(checkOut)}
                    </span>
                    <Dot>•</Dot>
                    <span>{cityName}</span>
                  </CardMeta>
                  <StatusBadge $type={status}>{status}</StatusBadge>
                </CardContent>
              </CardGrid>

              <CardList>
                <li>
                  <strong>Reservation ID:</strong> {id}
                </li>
                <li>
                  <strong>Nights:</strong> {nights}
                </li>
                {rooms?.[0]?.name && (
                  <li>
                    <strong>Room:</strong> {rooms[0].name}
                  </li>
                )}
                {cancellation && (
                  <li>
                    <strong>Policy:</strong> {cancellation}
                  </li>
                )}
              </CardList>
              <CardDivider />

              <CardSubSection>
                <CardSubHeader>Cancellation policy & fees</CardSubHeader>
                <PolicyText>
                  {cancellation || 'See policy for details.'}
                </PolicyText>

                <CardSubRow>
                  <span>Cancellation fee</span>
                  <strong>
                    {(currency || 'USD').toUpperCase()}{' '}
                    {Number(cancellationFee).toFixed(2)}
                  </strong>
                </CardSubRow>

                <CardSubRow>
                  <span>You&apos;ll be charged</span>
                  <strong>
                    {(currency || 'USD').toUpperCase()}{' '}
                    {Number(willBeCharged).toFixed(2)}
                  </strong>
                </CardSubRow>
              </CardSubSection>
            </InfoCard>
          </RightContainer>
        </SheetWrapper>

        {confirmOpen && (
          <ConfirmOverlay
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirmTitle"
          >
            <ConfirmBox onClick={(e) => e.stopPropagation()}>
              <ConfirmTitle id="confirmTitle">
                Cancel this booking?
              </ConfirmTitle>
              <ConfirmText>
                This action can’t be undone.
                {reason ? (
                  <>
                    {' '}
                    Reason selected: <strong>{readableReason(reason)}</strong>.
                  </>
                ) : null}
              </ConfirmText>
              <ConfirmActions>
                <ConfirmNo type="button" onClick={() => setConfirmOpen(false)}>
                  No
                </ConfirmNo>
                <ConfirmYes
                  type="button"
                  onClick={() => {
                    setConfirmOpen(false);
                    // keep behavior same as before—close sheet (parent may also call API)
                    onClose?.();
                  }}
                >
                  Confirm
                </ConfirmYes>
              </ConfirmActions>
            </ConfirmBox>
          </ConfirmOverlay>
        )}
      </SheetInner>
    </Sheet>
  );
}

/* utils */
function readableReason(v) {
  switch (v) {
    case 'change_of_plans':
      return 'Change of plans';
    case 'found_better_price':
      return 'Found a better price';
    case 'booking_mistake':
      return 'Booked by mistake';
    case 'travel_restrictions':
      return 'Travel restrictions';
    case 'other':
      return 'Other';
    default:
      return '';
  }
}
function diffNights(from, to) {
  const a = toDate(from);
  const b = toDate(to);
  if (!a || !b) return 0;
  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((b - a) / 86400000));
}
function toDate(v) {
  if (!v) return null;
  return v instanceof Date ? v : new Date(v);
}
function fmtDate(v) {
  if (!v) return '—';
  const d = toDate(v);
  if (!d || isNaN(d)) return String(v);
  return d.toISOString().slice(0, 10);
}

/* styles — glass/morphism, same layout */
const Sheet = styled.div`
  position: fixed;
  inset: 0;
  top: ${({ $headerOffset }) => ($headerOffset ? `${$headerOffset}px` : '0')};
  z-index: 999;
  /* subtle frosted backdrop */
  // background: radial-gradient(
  //     1200px 600px at 20% -10%,
  //     rgba(255, 255, 255, 0.65),
  //     rgba(255, 255, 255, 0.35)
  //   ),
  //   linear-gradient(
  //     180deg,
  //     rgba(250, 250, 252, 0.75),
  //     rgba(250, 250, 252, 0.75)
  //   );
  display: grid;
  backdrop-filter: blur(6px);
`;

const SheetInner = styled.div`
  width: 100vw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: env(safe-area-inset-bottom);
  /* glass panel along the whole content */
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);
  border-radius: 18px;
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    /* make glass panels a bit more opaque so text stays readable */
    .no-blur-fallback {
      background: rgba(255, 255, 255, 0.92);
    }
  }
`;

const SheetWrapper = styled.div`
  width: 100%;
  margin: 25px 0 0 0;
  display: flex;
  flex-direction: row;
  gap: 4rem;

  /* glass panel along the whole content */
  // background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.35);
  // backdrop-filter: blur(10px);
  // box-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);
  // border-radius: 18px;

  padding: 1.25rem 16rem 2rem 16rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0.75rem 1rem 1.25rem 1rem;
    flex-direction: column;
    gap: 1.2rem;
    border-radius: 12px;
  }
`;

const LeftContainer = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const RightContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.65),
    rgba(255, 255, 255, 0.45)
  );
  // backdrop-filter: blur(8px);
  box-shadow: 0 4px 14px rgba(16, 24, 40, 0.06);
`;

/* header bits */
const TopInline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const BackMini = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
`;
const StepMeta = styled.span`
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;
const StepTitle = styled.h3`
  margin: 0.2rem 0 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.large || theme.fontSizes.medium};
`;
const StepSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

/* select */
const FieldLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;
const SelectWrap = styled.div`
  position: relative;
  width: 100%;
  border-radius: 10px;
  border: 1px solid
    ${({ $invalid }) => ($invalid ? '#e53935' : 'rgba(0,0,0,0.08)')};
  background: rgba(255, 255, 255, 0.7);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6),
    0 1px 6px rgba(16, 24, 40, 0.04);
  backdrop-filter: blur(6px);
  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    /* make glass panels a bit more opaque so text stays readable */
    .no-blur-fallback {
      background: rgba(255, 255, 255, 0.92);
    }
  }
`;
const SelectBase = styled.select`
  appearance: none;
  width: 100%;
  padding: 12px 40px 12px 12px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  border-radius: 10px;
  cursor: pointer;
  outline: none;
`;
const Chevron = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #000;
  pointer-events: none;
`;

/* buttons */
const ButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
`;
const PrimarySm = styled.button`
  padding: 8px 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
`;
const LinkBtn = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

/* summary */
const RoomSummary = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 1rem;
  align-items: center;
`;
const Thumb = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 0.8rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.6);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
const SummaryBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  min-width: 0;
`;
const HotelName = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.heading};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;
const Dot = styled.span`
  opacity: 0.5;
`;
const StatusBadge = styled.span`
  align-self: flex-start;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  font-weight: 700;
  ${({ $type, theme }) => {
    const t = ($type || '').toLowerCase();
    if (t.includes('confirm'))
      return `background: rgba(31,143,58,0.12); color: ${
        theme.colors.successText || '#1f8f3a'
      };`;
    if (t.includes('pending'))
      return `background: rgba(255,176,31,0.14); color: ${
        theme.colors.warningText || '#b47800'
      };`;
    if (t.includes('cancel'))
      return `background: rgba(220,53,69,0.14); color: ${
        theme.colors.dangerText || '#b10016'
      };`;
    return `background: rgba(0,0,0,0.06); color: ${theme.colors.primaryText};`;
  }}
`;

/* breakdown (glass) */
const BreakdownCard = styled.div`
  margin-top: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.65),
    rgba(255, 255, 255, 0.45)
  );
  padding: 1rem;
  display: grid;
  gap: 0.6rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 14px rgba(16, 24, 40, 0.06);
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    /* make glass panels a bit more opaque so text stays readable */
    .no-blur-fallback {
      background: rgba(255, 255, 255, 0.92);
    }
  }
`;
const BreakTitle = styled.h5`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small || theme.fontSizes.xsmall};
`;
const BreakRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
`;
const DangerBtn = styled.button`
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #d93025;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(217, 48, 37, 0.25);
`;

/* right card (glass) */
const InfoCard = styled.aside`
  position: sticky;
  top: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.65),
    rgba(255, 255, 255, 0.45)
  );
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  backdrop-filter: blur(10px);
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    /* make glass panels a bit more opaque so text stays readable */
    .no-blur-fallback {
      background: rgba(255, 255, 255, 0.92);
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: static;
    top: auto;
  }
`;
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 1rem;
  align-items: center;
`;
const CardThumb = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 0.8rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.6);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;
const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
`;
const CardTop = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
  align-items: start;
`;
const CardHotel = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.heading};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const CardPrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
`;
const Cur = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
  text-transform: uppercase;
`;
const Amt = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.primaryText};
  font-weight: 550;
`;
const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;
const CardList = styled.ul`
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.25rem;
  li {
    list-style: disc;
    font-size: ${({ theme }) => theme.fontSizes.xsmall};
    color: ${({ theme }) => theme.colors.primaryText};
  }
`;
const CardDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
`;
const CardSubSection = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.65),
    rgba(255, 255, 255, 0.45)
  );
  padding: 0.9rem;
  display: grid;
  gap: 0.6rem;
  backdrop-filter: blur(8px);
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    /* make glass panels a bit more opaque so text stays readable */
    .no-blur-fallback {
      background: rgba(255, 255, 255, 0.92);
    }
  }
`;
const CardSubHeader = styled.h5`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.small || theme.fontSizes.xsmall};
  font-weight: 700;
`;
const PolicyText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  line-height: 1.35;
`;
const CardSubRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
  strong {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primaryText};
  }
`;

/* confirm dialog */
const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.35);
  display: grid;
  place-items: center;
  backdrop-filter: blur(4px);
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    /* make glass panels a bit more opaque so text stays readable */
    .no-blur-fallback {
      background: rgba(255, 255, 255, 0.92);
    }
  }
`;
const ConfirmBox = styled.div`
  width: min(520px, 92vw);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.75),
    rgba(255, 255, 255, 0.55)
  );
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.3);
  padding: 1.25rem;
  display: grid;
  gap: 0.9rem;
  backdrop-filter: blur(12px);
  @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    /* make glass panels a bit more opaque so text stays readable */
    .no-blur-fallback {
      background: rgba(255, 255, 255, 0.92);
    }
  }
`;
const ConfirmTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.heading};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;
const ConfirmText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;
const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
`;
const ConfirmNo = styled.button`
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.8);
  color: ${({ theme }) => theme.colors.primaryText};
  cursor: pointer;
  font-weight: 600;
`;
const ConfirmYes = styled.button`
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #d93025;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(217, 48, 37, 0.25);
`;
