// src/components/EditDatesSheet.jsx
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt } from 'react-icons/fa';
import Datepicker from '../../../components/DatePicker';
export default function EditDatesSheet({
  open,
  checkIn, // string "yyyy-MM-dd" or Date
  checkOut, // string "yyyy-MM-dd" or Date
  onApply, // ({checkIn, checkOut, nights}) => void
  onClose, // () => void
  title = 'Edit Dates',
  months = 'auto', // number | 'auto'
  headerOffset = 0, // if your page header is fixed (e.g., 64)
}) {
  const toDate = (v) => (v instanceof Date ? v : v ? new Date(v) : undefined);

  const [draft, setDraft] = useState(() => ({
    checkIn,
    checkOut,
    nights: diffNights(toDate(checkIn), toDate(checkOut)),
  }));

  // sync when props change while open
  useEffect(() => {
    if (!open) return;
    setDraft({
      checkIn,
      checkOut,
      nights: diffNights(toDate(checkIn), toDate(checkOut)),
    });
  }, [open, checkIn, checkOut]);

  // lock page scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const resolvedMonths = useMemo(() => {
    if (typeof months === 'number') return months;
    if (typeof window === 'undefined') return 1;
    return window.innerWidth >= 1024 ? 2 : 1;
  }, [months]);

  if (!open) return null;

  return (
    <Sheet
      $headerOffset={headerOffset}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <SheetInner onClick={(e) => e.stopPropagation()}>
        {/* Header like your main page */}
        <HeaderRow>
          <BackButton onClick={onClose}>← Back</BackButton>
          <Title>{title}</Title>
        </HeaderRow>

        {/* Same two-column layout inside the sheet */}
        <SheetWrapper>
          {/* LEFT 75% */}
          <LeftContainer>
            <Section>
              <SubTitle>
                <FaCalendarAlt
                  style={{ marginRight: 8, verticalAlign: '-2px' }}
                />
                Pick your dates
              </SubTitle>

              {/* Datepicker area */}
              <CalendarBlock>
                <Datepicker
                  isModal
                  months={resolvedMonths}
                  initialStartDate={toDate(draft.checkIn)}
                  initialEndDate={toDate(draft.checkOut)}
                  onDatesChange={(res) => {
                    setDraft({
                      checkIn: res.checkIn,
                      checkOut: res.checkOut,
                      nights: res.nights,
                    });
                  }}
                />
              </CalendarBlock>

              {/* Live summary */}
              <SummaryRow>
                <SummaryPill>
                  <Label>Check-in</Label>
                  <Value>{formatOut(draft.checkIn)}</Value>
                </SummaryPill>
                <SummaryDivider />
                <SummaryPill>
                  <Label>Check-out</Label>
                  <Value>{formatOut(draft.checkOut)}</Value>
                </SummaryPill>
                <SummaryDivider />
                <SummaryPill>
                  <Label>Nights</Label>
                  <Value>{draft.nights ?? 0}</Value>
                </SummaryPill>
              </SummaryRow>
            </Section>
          </LeftContainer>

          {/* RIGHT 25–30% with the same card look */}
          <RightContainer>
            <EditCard>
              <EditTitle>Update dates</EditTitle>
              <EditSub>Review your selection and apply.</EditSub>

              <RightList>
                <RightRow>
                  <SmallLabel>Check-in</SmallLabel>
                  <StrongVal>{formatOut(draft.checkIn)}</StrongVal>
                </RightRow>
                <RightRow>
                  <SmallLabel>Check-out</SmallLabel>
                  <StrongVal>{formatOut(draft.checkOut)}</StrongVal>
                </RightRow>
                <RightRow>
                  <SmallLabel>Nights</SmallLabel>
                  <StrongVal>{draft.nights ?? 0}</StrongVal>
                </RightRow>
              </RightList>

              <Actions>
                <GhostBtn onClick={onClose}>Cancel</GhostBtn>
                <PrimaryBtn
                  onClick={() => {
                    if (!draft.checkIn || !draft.checkOut) return onClose?.();
                    onApply?.(draft);
                    onClose?.();
                  }}
                >
                  Apply Dates
                </PrimaryBtn>
              </Actions>
            </EditCard>
          </RightContainer>
        </SheetWrapper>
      </SheetInner>
    </Sheet>
  );
}

/* ---------- utils ---------- */
function diffNights(from, to) {
  if (!from || !to) return 0;
  const a = new Date(from);
  a.setHours(0, 0, 0, 0);
  const b = new Date(to);
  b.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((b - a) / 86400000));
}
function formatOut(v) {
  if (!v) return '—';
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

/* ---------- styles (mirroring your main layout) ---------- */

/* Full white sheet baseline */
const Sheet = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: ${({ $headerOffset }) => ($headerOffset ? `${$headerOffset}px` : '0')};
  z-index: 999;
  background: #fff;
  display: grid;
`;

const SheetInner = styled.div`
  width: 100vw;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

/* Header (same vibe as your page) */
const HeaderRow = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
  border-bottom: 1px solid #eee;
  padding: 0 16px;
`;

const BackButton = styled.button`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 1.8rem;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
`;

/* --- SAME WRAPPER / LEFT / RIGHT LAYOUT (scoped to this sheet) --- */

const SheetWrapper = styled.div`
  width: 100%;
  margin: 25px 0 0 0;
  display: flex;
  background: ${({ theme }) => theme.colors.mainBackground};
  flex-direction: row;
  gap: 4rem;

  padding: 0 16rem 2rem 16rem; /* match your page container padding visually */
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

/* Right-side card (same styling as your EditCard) */
const EditCard = styled.aside`
  position: sticky;
  top: 1rem; /* stays visible while scrolling */
  border: 1px solid ${({ theme }) => theme.colors.cardColor2 || '#e9e9e9'};
  background: ${({ theme }) => theme.colors.cardColor};
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

const RightList = styled.div`
  display: grid;
  gap: 0.35rem;
`;

const RightRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const SmallLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const StrongVal = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small || theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const GhostBtn = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.cardColor2 || '#e5e5e5'};
  background: #fff;
  color: ${({ theme }) => theme.colors.primaryText};
  cursor: pointer;
  font-weight: 600;
  &:hover {
    background: #fafafa;
  }
`;

const PrimaryBtn = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  &:hover {
    opacity: 0.95;
  }
`;

/* Left-side content blocks */
const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 10px 0;
  border-top: 1px solid #e9e9e9;
`;

const SubTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.large || theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const CalendarBlock = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.cardColor2 || '#e5e5e5'};
  border-radius: 12px;
  padding: 8px;
  background: ${({ theme }) => theme.colors.cardColor};
  overflow: hidden;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const SummaryPill = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.cardColor2 || '#e5e5e5'};
  background: ${({ theme }) => theme.colors.cardColor};
`;

const SummaryDivider = styled.span`
  width: 1px;
  height: 28px;
  background: ${({ theme }) => theme.colors.cardColor2 || '#e9e9e9'};
  display: inline-block;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
`;

const Value = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small || theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.primaryText};
  font-weight: 600;
`;
