// /src/pages/ModifyBooking/tabs/TabsLayout.jsx
import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import styled from 'styled-components';

export default function TabsLayout({
  defaultTab = 'reservations',
  onTabChange,
  children,
}) {
  return (
    <TabsRoot defaultValue={defaultTab} onValueChange={onTabChange}>
      <TabsList aria-label="Account sections">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="reservations">Reservations</TabsTrigger>
        <TabsTrigger value="circle">Stayovia Circle</TabsTrigger>
      </TabsList>

      {
        children /* TabsContent lives outside so each tab file can render itself */
      }
    </TabsRoot>
  );
}

/* Styled Radix parts */
const TabsRoot = styled(RadixTabs.Root)`
  width: 100%;
  background: #ffff;
`;

const TabsList = styled(RadixTabs.List)`
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e9e9e9;
  padding: 0 16rem 0 16rem; /* match your page gutters */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 1rem;
  }
`;

const TabsTrigger = styled(RadixTabs.Trigger)`
  position: relative;
  background: transparent;
  border: none;
  padding: 0.85rem 1rem;
  border-radius: 10px 10px 0 0;
  color: ${({ theme }) => theme.colors.secondaryText};
  //   font-weight: 500;
  font-size: ${({ theme }) => theme.fontSizes.xsmall};
  cursor: pointer;

  &[data-state='active'] {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.cardColor};
    box-shadow: inset 0 -2px 0 ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.cardColor2};
  }
`;

/* Optional helper for each Tab panel */
export const TabsContent = styled(RadixTabs.Content)`
  padding-top: 1rem;
`;
