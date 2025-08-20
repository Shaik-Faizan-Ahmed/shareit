'use client';

import { useRoom } from '@/context/RoomContext';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import AppWrapper from '@/components/AppWrapper';

function AppContent() {
  const { currentRoom } = useRoom();

  if (!currentRoom) {
    return <LandingPage />;
  }

  return <Dashboard />;
}

export default function Home() {
  return (
    <AppWrapper>
      <AppContent />
    </AppWrapper>
  );
}