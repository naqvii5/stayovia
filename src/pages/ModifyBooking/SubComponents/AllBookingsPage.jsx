import React from 'react';
import styled from 'styled-components';
import { useModifyBooking } from '../../../context/ModifyBookingContext';

export function AllBookingsPage({ reservationSelectionFunc }) {
  const { logout } = useModifyBooking();

  // Sample reservation data
  const reservations = [
    {
      id: 1,
      imageUrl: 'https://picsum.photos/seed/hotel1/400/300',
      hotelName: 'Grand Palace Hotel',
      checkIn: '2025-08-12',
      checkOut: '2025-08-15',
      cityName: 'Paris',
      cancellation: 'Free Cancellation',
      status: 'Confirmed',
      price: 450,
      currency: 'EUR',
    },
    {
      id: 2,
      imageUrl: 'https://picsum.photos/seed/hotel2/400/300',
      hotelName: 'Ocean View Resort',
      checkIn: '2025-09-02',
      checkOut: '2025-09-07',
      cityName: 'Barcelona',
      cancellation: 'Non-refundable',
      status: 'Pending',
      price: 620,
      currency: 'EUR',
    },
    {
      id: 3,
      imageUrl: 'https://picsum.photos/seed/hotel3/400/300',
      hotelName: 'Mountain Escape Lodge',
      checkIn: '2025-10-01',
      checkOut: '2025-10-05',
      cityName: 'Zurich',
      cancellation: 'Free Cancellation',
      status: 'Cancelled',
      price: 350,
      currency: 'CHF',
    },
  ];

  return (
    <Wrapper>
      <HeaderRow>
        <Title>Your Reservations</Title>
        <LogoutButton onClick={logout}>Logout</LogoutButton>
      </HeaderRow>

      {reservations.map((b) => (
        <ReservationCard key={b.id} onClick={() => reservationSelectionFunc(b)}>
          <Thumb>
            <img src={b.imageUrl} alt={b.hotelName} />
          </Thumb>

          <Content>
            <TopRow>
              <HotelName>{b.hotelName}</HotelName>
              <Price>
                <Currency>{b.currency}</Currency>
                <Amount>{b.price}</Amount>
              </Price>
            </TopRow>

            <Meta>
              <span>
                {b.checkIn} - {b.checkOut}
              </span>
              <Dot>•</Dot>
              <span>{b.cityName}</span>
              <Dot>•</Dot>
              <FreeCancel
                $isFree={b.cancellation.toLowerCase().includes('free')}
              >
                {b.cancellation}
              </FreeCancel>
            </Meta>

            <Status $type={b.status}>{b.status}</Status>
          </Content>
        </ReservationCard>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 80%;
  margin: auto;
  padding: 3rem;
  // background: ${({ theme }) => theme.colors.mainBackground};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1rem;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  margin: auto;
`;

const LogoutButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.75rem;
  font-size: ${({ theme }) => theme.fontSizes.small};
  border-radius: 1.8rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ReservationCard = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 1rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.cardColor};
  box-shadow: 0px 2px 8px 0px #1a1a1a29;
  border-radius: 0.9rem;
  padding: 1rem;
  align-items: center;

  &:hover {
    box-shadow: 0px 6px 20px 0px #5f5c5c54;
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 72px 1fr;
    padding: 0.85rem;
  }
`;

const Thumb = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 0.6rem;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.mainBackground};
  border: 1px solid ${({ theme }) => theme.colors.cardColor2};
  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 72px;
    height: 72px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 0;
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 0.75rem;
`;

const HotelName = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.heading};
  margin: 0;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Price = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
`;

const Currency = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  color: ${({ theme }) => theme.colors.secondaryText};
  text-transform: uppercase;
`;

const Amount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.primaryText};
  font-weight: 550;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  color: ${({ theme }) => theme.colors.secondaryText};
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
`;

const Dot = styled.span`
  opacity: 0.5;
`;

const FreeCancel = styled.span`
  color: ${({ $isFree, theme }) =>
    $isFree
      ? theme.colors.successText || '#1f8f3a'
      : theme.colors.secondaryText};
  font-weight: 600;
`;

const Status = styled.span`
  align-self: flex-start;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  font-weight: 700;

  ${({ $type, theme }) => {
    const t = ($type || '').toLowerCase();
    if (t.includes('confirm')) {
      return `
        background: rgba(31, 143, 58, 0.1);
        color: ${theme.colors.successText || '#1f8f3a'};
      `;
    }
    if (t.includes('pending')) {
      return `
        background: rgba(255, 176, 31, 0.12);
        color: ${theme.colors.warningText || '#b47800'};
      `;
    }
    if (t.includes('cancel')) {
      return `
        background: rgba(220, 53, 69, 0.12);
        color: ${theme.colors.dangerText || '#b10016'};
      `;
    }
    return `
      background: ${theme.colors.cardColor2};
      color: ${theme.colors.primaryText};
    `;
  }}
`;
