
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRoom } from '@/context/RoomContext';
import { createRoom } from '@/lib/utils';
import { Plus, Sun, Moon } from 'lucide-react';
import toast from 'react-hot-toast';
import AppWrapper from '@/components/AppWrapper';

function CreateRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentRoom, darkMode, setDarkMode } = useRoom();
  const [roomName, setRoomName] = useState(searchParams.get('roomName') || '');
  const [roomPassword, setRoomPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim() || !roomPassword.trim() || !deletePassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const room = await createRoom(
        roomName.trim(),
        roomPassword.trim(),
        deletePassword.trim()
      );
      setCurrentRoom(room);
      toast.success(`Room "${roomName}" created successfully!`);
      router.push('/');
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create a New Room</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a secure room to share files with others.
          </p>
        </div>

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

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
          <form onSubmit={handleCreateRoom}>
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
                  Access Password
                </label>
                <input
                  type="password"
                  value={roomPassword}
                  onChange={(e) => setRoomPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter access password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Delete Password
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter delete password"
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This password will be required to delete files.
                </p>
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
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateRoomPage() {
  return (
    <AppWrapper>
      <CreateRoomContent />
    </AppWrapper>
  );
}
