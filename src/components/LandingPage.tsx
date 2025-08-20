'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/context/RoomContext';
import { verifyRoomPassword, createRoom } from '@/lib/utils';
import { Plus, LogIn, Sun, Moon, Share2, Shield, Users, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LandingPage() {
  const { setCurrentRoom, darkMode, setDarkMode } = useRoom();
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  
  // Create form state
  const [createData, setCreateData] = useState({
    roomName: '',
    roomPassword: '',
    deletePassword: ''
  });
  
  // Join form state
  const [joinData, setJoinData] = useState({
    roomName: '',
    roomPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createData.roomName.trim() || !createData.roomPassword.trim() || !createData.deletePassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const room = await createRoom(
        createData.roomName.trim(),
        createData.roomPassword.trim(),
        createData.deletePassword.trim()
      );
      setCurrentRoom(room);
      toast.success(`Room "${createData.roomName}" created successfully!`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    }
    setIsLoading(false);
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinData.roomName.trim() || !joinData.roomPassword.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const room = await verifyRoomPassword(joinData.roomName.trim(), joinData.roomPassword.trim());
      
      if (room) {
        setCurrentRoom(room);
        toast.success(`Welcome to ${joinData.roomName}!`);
      } else {
        toast.error('Invalid room name or password');
      }
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    }
    setIsLoading(false);
  };

  const resetForms = () => {
    setShowCreateForm(false);
    setShowJoinForm(false);
    setCreateData({ roomName: '', roomPassword: '', deletePassword: '' });
    setJoinData({ roomName: '', roomPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8">
        {!showCreateForm && !showJoinForm ? (
          /* Main Landing Page */
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-6xl w-full">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-blue-600 p-4 rounded-2xl">
                    <Share2 className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
                  Share<span className="text-blue-600">It</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Secure, room-based file sharing. Create or join rooms to share files instantly with end-to-end security.
                </p>
              </div>

              {/* Action Cards - Moved above features for easier access */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                {/* Create Room Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Create Room</h2>
                    <p className="text-gray-600 dark:text-gray-300">Start a new secure file sharing room with custom passwords</p>
                  </div>
                  <button 
                    onClick={() => setShowCreateForm(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Create New Room
                  </button>
                </div>

                {/* Join Room Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <LogIn className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Join Room</h2>
                    <p className="text-gray-600 dark:text-gray-300">Enter an existing room with the room name and password</p>
                  </div>
                  <button 
                    onClick={() => setShowJoinForm(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Join Existing Room
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Secure Collaboration</h3>
                  <p className="text-gray-600 dark:text-gray-300">Password-protected rooms with delete permissions</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Multi-User Access</h3>
                  <p className="text-gray-600 dark:text-gray-300">Multiple users can share files in the same room</p>
                </div>
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Fast Transfer</h3>
                  <p className="text-gray-600 dark:text-gray-300">Instant file uploads and downloads</p>
                </div>
              </div>
            </div>
          </div>
        ) : showCreateForm ? (
          /* Create Room Form */
          <div className="min-h-screen flex items-center justify-center py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create Room</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Set up your new file sharing room</p>
              </div>
              
              <form onSubmit={handleCreateRoom} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Room Name</label>
                  <input 
                    type="text" 
                    value={createData.roomName}
                    onChange={(e) => setCreateData({...createData, roomName: e.target.value})}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" 
                    placeholder="Enter room name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Access Password</label>
                  <input 
                    type="password" 
                    value={createData.roomPassword}
                    onChange={(e) => setCreateData({...createData, roomPassword: e.target.value})}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" 
                    placeholder="Password for room access"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Delete Password</label>
                  <input 
                    type="password" 
                    value={createData.deletePassword}
                    onChange={(e) => setCreateData({...createData, deletePassword: e.target.value})}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" 
                    placeholder="Password for deleting files"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    This password will be required to delete files.
                  </p>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={resetForms}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Join Room Form */
          <div className="min-h-screen flex items-center justify-center py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Join Room</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Enter room credentials to access</p>
              </div>
              
              <form onSubmit={handleJoinRoom} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Room Name</label>
                  <input 
                    type="text" 
                    value={joinData.roomName}
                    onChange={(e) => setJoinData({...joinData, roomName: e.target.value})}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" 
                    placeholder="Enter room name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Access Password</label>
                  <input 
                    type="password" 
                    value={joinData.roomPassword}
                    onChange={(e) => setJoinData({...joinData, roomPassword: e.target.value})}
                    required 
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors" 
                    placeholder="Enter access password"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={resetForms}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
        )}
      </div>
    </div>
  );
}
