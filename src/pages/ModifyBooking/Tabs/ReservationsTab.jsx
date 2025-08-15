// /src/pages/ModifyBooking/tabs/ReservationsTab.jsx
import React, { useState } from 'react';
import { TabsContent } from './TabsLayout';
import { AllBookingsPage } from '../SubComponents/AllBookingsPage';
import { SpecificBookingPage } from '../SubComponents/SpecificBookingPage';

export default function ReservationsTab() {
  const [selectedReservation, setSelectedReservation] = useState(null);

  return (
    <TabsContent value="reservations">
      {selectedReservation ? (
        <SpecificBookingPage
          selectedReservation={selectedReservation}
          onBack={() => setSelectedReservation(null)}
        />
      ) : (
        <AllBookingsPage reservationSelectionFunc={setSelectedReservation} />
      )}
    </TabsContent>
  );
}
