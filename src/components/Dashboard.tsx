'use client';

import { useState, useEffect } from 'react';
import { useRoom } from '@/context/RoomContext';
import { getRoomFiles, getFileTypeCategory } from '@/lib/utils';
import { FileData } from '@/lib/types';
import FileUpload from './FileUpload';
import FileCard from './FileCard';
import { 
  Search, 
  Filter, 
  LogOut, 
  Sun, 
  Moon, 
  Key,
  FolderOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { 
    currentRoom, 
    setCurrentRoom, 
    isDeleteMode, 
    setIsDeleteMode, 
    darkMode, 
    setDarkMode 
  } = useRoom();
  
  const [files, setFiles] = useState<FileData[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeletePasswordModal, setShowDeletePasswordModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const filterOptions = ['All', 'Images', 'Videos', 'Docs', 'Archives', 'Others'];

  useEffect(() => {
    if (currentRoom) {
      fetchFiles();
    }
  }, [currentRoom]);

  useEffect(() => {
    filterFiles();
  }, [files, searchQuery, selectedFilter]);

  const fetchFiles = async () => {
    if (!currentRoom) return;
    
    setIsLoading(true);
    try {
      const roomFiles = await getRoomFiles(currentRoom.roomName);
      setFiles(roomFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    }
    setIsLoading(false);
  };

  const filterFiles = () => {
    let filtered = files;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(file =>
        getFileTypeCategory(file.fileType) === selectedFilter
      );
    }

    // Sort by upload time (newest first)
    filtered.sort((a, b) => b.uploadTime.getTime() - a.uploadTime.getTime());

    setFilteredFiles(filtered);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setIsDeleteMode(false);
    setFiles([]);
    setFilteredFiles([]);
    toast.success('Left the room');
  };

  const handleDeleteModeToggle = () => {
    if (isDeleteMode) {
      setIsDeleteMode(false);
      toast.success('Delete mode disabled');
    } else {
      setShowDeletePasswordModal(true);
    }
  };

  const handleEnableDeleteMode = () => {
    if (!currentRoom) return;
    
    if (deletePassword === currentRoom.deletePassword) {
      setIsDeleteMode(true);
      setShowDeletePasswordModal(false);
      setDeletePassword('');
      toast.success('Delete mode enabled');
    } else {
      toast.error('Incorrect delete password');
    }
  };

  if (!currentRoom) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                ShareIt
              </h1>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Room: <span className="font-medium">{currentRoom.roomName}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Delete Mode Toggle */}
              <button
                onClick={handleDeleteModeToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isDeleteMode
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={isDeleteMode ? 'Disable delete mode' : 'Enable delete mode'}
              >
                {isDeleteMode ? <Key className="h-5 w-5" /> : <Key className="h-5 w-5" />}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Leave Room */}
              <button
                onClick={handleLeaveRoom}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Leave</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to <span className="text-blue-600">{currentRoom.roomName}</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload and share files securely with everyone in this room
              </p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <FileUpload onFileUploaded={fetchFiles} />

        {/* Search and Filter */}
        <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Files Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {files.length === 0 ? 'No files yet' : 'No files match your search'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {files.length === 0 
                ? 'Upload your first file to get started!' 
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onFileDeleted={fetchFiles}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Password Modal */}
      {showDeletePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Enable Delete Mode
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter the delete password to enable delete mode
            </p>
            
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Delete password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleEnableDeleteMode()}
            />
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeletePasswordModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnableDeleteMode}
                disabled={!deletePassword}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}