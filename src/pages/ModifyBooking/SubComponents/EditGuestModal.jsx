// src/components/EditGuestModal.jsx
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

export default function EditGuestModal({
  open,
  onClose,
  onSave, // (guest) => void
  headerOffset = 64,
  reservation = {},
  initialGuest = {}, // { firstName, lastName, contact, dob, isPrimary }
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
    rooms = [],
  } = reservation || {};

  const nights = useMemo(
    () => diffNights(checkIn, checkOut),
    [checkIn, checkOut]
  );

  // Prefilled form state + resync when modal re-opens
  const [guest, setGuest] = useState({
    firstName: initialGuest.firstName || '',
    lastName: initialGuest.lastName || '',
    contact: initialGuest.contact || '',
    dob: initialGuest.dob || '',
    isPrimary:
      typeof initialGuest.isPrimary === 'boolean'
        ? initialGuest.isPrimary
        : true,
  });

  useEffect(() => {
    if (!open) return;
    setGuest({
      firstName: initialGuest.firstName || '',
      lastName: initialGuest.lastName || '',
      contact: initialGuest.contact || '',
      dob: initialGuest.dob || '',
      isPrimary:
        typeof initialGuest.isPrimary === 'boolean'
          ? initialGuest.isPrimary
          : true,
    });
  }, [
    open,
    initialGuest.firstName,
    initialGuest.lastName,
    initialGuest.contact,
    initialGuest.dob,
    initialGuest.isPrimary,
  ]);

  // Lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const [showConfirm, setShowConfirm] = useState(false);

  if (!open) return null;

  const handleChange = (key) => (e) => {
    let val = e.target.value;
    if (key === 'contact') val = val.replace(/\D/g, ''); // numeric only
    setGuest((g) => ({ ...g, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true); // custom confirm, not browser
  };

  const confirmSave = () => {
    onSave?.(guest);
    setShowConfirm(false);
    onClose?.();
  };

  return (
    <Sheet
      $headerOffset={headerOffset}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <BlurBackdrop />

      <SheetInner onClick={(e) => e.stopPropagation()}>
        <SheetWrapper>
          {/* LEFT: Glassy guest form */}

          <LeftContainer>
            <Section>
              <TopInline>
                <BackMini type="button" onClick={onClose}>
                  ← Back to my reservation
                </BackMini>
                <FormTitle>Edit guest details</FormTitle>
              </TopInline>
              {/* <FormTitle>Edit guest details</FormTitle> */}
              <FormSubtitle>
                Update the primary guest’s information below.
              </FormSubtitle>

              <GlassForm onSubmit={handleSubmit}>
                <FieldBlock>
                  <FieldLabel>First Name</FieldLabel>
                  <InputText
                    placeholder="Enter first name"
                    value={guest.firstName}
                    onChange={handleChange('firstName')}
                  />
                </FieldBlock>

                <FieldBlock>
                  <FieldLabel>Last Name</FieldLabel>
                  <InputText
                    placeholder="Enter last name"
                    value={guest.lastName}
                    onChange={handleChange('lastName')}
                  />
                </FieldBlock>

                <FieldBlock>
                  <FieldLabel>Contact #</FieldLabel>
                  <InputText
                    inputMode="numeric"
                    placeholder="03XXXXXXXXX"
                    value={guest.contact}
                    onChange={handleChange('contact')}
                  />
                </FieldBlock>

                <FieldBlock>
                  <FieldLabel>DOB</FieldLabel>
                  <InputDate
                    type="date"
                    value={guest.dob}
                    onChange={handleChange('dob')}
                  />
                </FieldBlock>

                <UpdateButton type="submit">Update</UpdateButton>
              </GlassForm>
            </Section>
          </LeftContainer>

          {/* RIGHT: Glassy reservation summary (no cancellation here) */}
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
                      <Cur>{(currency || '').toUpperCase()}</Cur>
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
              </CardList>
            </InfoCard>
          </RightContainer>
        </SheetWrapper>

        {/* Confirm dialog (glassy) */}
        {showConfirm && (
          <ConfirmOverlay onClick={() => setShowConfirm(false)}>
            <ConfirmCard onClick={(e) => e.stopPropagation()}>
              <ConfirmTitle>Save changes?</ConfirmTitle>
              <ConfirmText>
                You’re about to update the guest details for this reservation.
              </ConfirmText>
              <ConfirmActions>
                <GhostBtn type="button" onClick={() => setShowConfirm(false)}>
                  No, go back
                </GhostBtn>
                <PrimaryBtn type="button" onClick={confirmSave}>
                  Yes, save
                </PrimaryBtn>
              </ConfirmActions>
            </ConfirmCard>
          </ConfirmOverlay>
        )}
      </SheetInner>
    </Sheet>
  );
}

/* ---------------- utils ---------------- */
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

/* ---------------- styles (glassy + soft neo) ---------------- */

const Sheet = styled.div`
  position: fixed;
  inset: 0;
  top: ${({ $headerOffset }) => ($headerOffset ? `${$headerOffset}px` : '0')};
  z-index: 999;
  display: grid;
`;

const TopInline = styled.div`
  display: flex;
  flex-direction: column; /* ⬅️ stack */
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.15rem;
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

const BlurBackdrop = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
      80rem 80rem at 10% 0%,
      rgba(56, 132, 255, 0.1),
      transparent 40%
    ),
    radial-gradient(
      70rem 70rem at 90% 100%,
      rgba(56, 132, 255, 0.1),
      transparent 45%
    ),
    rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(10px);
`;

const SheetInner = styled.div`
  position: relative;
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: env(safe-area-inset-bottom);
`;

const SheetWrapper = styled.div`
  width: 100%;
  margin: 40px 0 0 0;
  display: flex;
  // background: ${({ theme }) => theme.colors.mainBackground};
  gap: 4rem;
  padding: 0 16rem 2rem 16rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 1rem 2rem 1rem;
    flex-direction: column;
    gap: 1.5rem;
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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  padding: 10px 0;
  border-top: 1px solid rgba(233, 233, 233, 0.7);
`;

/* --- Glassy form --- */

const GlassForm = styled.form`
  display: grid;
  gap: 0.9rem;
  padding: 1.1rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 20px 20px 60px rgba(0, 0, 0, 0.08),
    -8px -8px 20px rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
`;

const FormTitle = styled.h3`
  margin: 0.2rem 0 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.large || theme.fontSizes.medium};
`;

const FormSubtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const FieldLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const InputBase = styled.input`
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.7);
  color: ${({ theme }) => theme.colors.primaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  outline: none;
  box-shadow: inset 2px 2px 6px rgba(0, 0, 0, 0.05),
    inset -2px -2px 6px rgba(255, 255, 255, 0.7);

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(255, 255, 255, 0.9);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondaryText};
    opacity: 0.8;
  }
`;

const InputText = styled(InputBase).attrs({ type: 'text' })``;
const InputDate = styled(InputBase)``;

const UpdateButton = styled.button`
  width: 100%;
  margin-top: 0.25rem;
  padding: 12px 16px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  box-shadow: 0 10px 20px rgba(56, 132, 255, 0.18);
  transition: transform 0.06s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 14px rgba(56, 132, 255, 0.16);
  }
`;

/* --- Right glassy card --- */

const InfoCard = styled.aside`
  position: sticky;
  top: 1rem;
  border-radius: 16px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(12px);
  box-shadow: 20px 20px 60px rgba(0, 0, 0, 0.08),
    -8px -8px 20px rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
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
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: ${({ theme }) => theme.colors.mainBackground};

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
      return `background: rgba(255,176,31,0.16); color: ${
        theme.colors.warningText || '#b47800'
      };`;
    if (t.includes('cancel'))
      return `background: rgba(220,53,69,0.16); color: ${
        theme.colors.dangerText || '#b10016'
      };`;
    return `background: ${theme.colors.cardColor2}; color: ${theme.colors.primaryText};`;
  }}
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

/* --- Confirm dialog --- */

const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(1px);
`;

const ConfirmCard = styled.div`
  width: min(520px, 92vw);
  border-radius: 16px;
  padding: 1.1rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 20px 20px 60px rgba(0, 0, 0, 0.12),
    -8px -8px 20px rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(10px);
  display: grid;
  gap: 0.65rem;
`;

const ConfirmTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 800;
`;

const ConfirmText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const ConfirmActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.25rem;
`;

const GhostBtn = styled.button`
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.cardColor2 || '#e5e5e5'};
  background: rgba(255, 255, 255, 0.85);
  color: ${({ theme }) => theme.colors.primaryText};
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
  }
`;

const PrimaryBtn = styled.button`
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 800;
  box-shadow: 0 10px 20px rgba(56, 132, 255, 0.18);

  &:hover {
    opacity: 0.95;
  }
`;
