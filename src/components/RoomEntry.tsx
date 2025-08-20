'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/context/RoomContext';
import { verifyRoomPassword } from '@/lib/utils';
import { LogIn, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoomEntry() {
  const { setCurrentRoom, darkMode, setDarkMode } = useRoom();
  const router = useRouter();
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !roomPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const room = await verifyRoomPassword(roomName.trim(), roomPassword.trim());
      
      if (room) {
        setCurrentRoom(room);
        toast.success(`Welcome to ${roomName}!`);
      } else {
        toast.error(`Room "${roomName}" doesn't exist. Redirecting to create page.`);
        router.push(`/create-room?roomName=${roomName.trim()}`);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <LogIn className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ShareIt</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Secure file sharing made simple
          </p>
        </div>

        {/* Dark mode toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Main Form */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <form onSubmit={handleJoinRoom}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter room name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Password
                </label>
                <input
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter room password"
                  required
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Join Room
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}