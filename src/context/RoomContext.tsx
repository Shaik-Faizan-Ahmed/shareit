'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Room, RoomContextType } from '@/lib/types';

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shareit-darkmode');
      if (saved) {
        setDarkMode(JSON.parse(saved));
      }
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shareit-darkmode', JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  return (
    <RoomContext.Provider
      value={{
        currentRoom,
        setCurrentRoom,
        isDeleteMode,
        setIsDeleteMode,
        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}