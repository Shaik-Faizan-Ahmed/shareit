
'use client';

import { RoomProvider } from '@/context/RoomContext';
import { Toaster } from 'react-hot-toast';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <RoomProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #363636)',
            color: 'var(--toast-color, #fff)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <style jsx global>{`
        :root {
          --toast-bg: #363636;
          --toast-color: #fff;
        }
        
        .dark {
          --toast-bg: #1f2937;
          --toast-color: #f9fafb;
        }
      `}</style>
    </RoomProvider>
  );
}
