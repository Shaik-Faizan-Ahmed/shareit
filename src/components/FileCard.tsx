'use client';

import { useState } from 'react';
import { useRoom } from '@/context/RoomContext';
import { deleteFile, formatFileSize, formatRelativeTime } from '@/lib/utils';
import { FileData } from '@/lib/types';
import { 
  Download, 
  Trash2, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  File 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FileCardProps {
  file: FileData;
  onFileDeleted: () => void;
}

export default function FileCard({ file, onFileDeleted }: FileCardProps) {
  const { currentRoom, isDeleteMode } = useRoom();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const getFileIcon = () => {
    const iconClass = "h-8 w-8";
    
    if (file.fileType.startsWith('image/')) {
      return <Image className={`${iconClass} text-green-500`} />;
    } else if (file.fileType.startsWith('video/')) {
      return <Video className={`${iconClass} text-red-500`} />;
    } else if (file.fileType.startsWith('audio/')) {
      return <Music className={`${iconClass} text-purple-500`} />;
    } else if (file.fileType === 'application/pdf' || file.fileType.includes('document') || file.fileType.includes('text')) {
      return <FileText className={`${iconClass} text-blue-500`} />;
    } else if (file.fileType.includes('zip') || file.fileType.includes('rar') || file.fileType.includes('7z')) {
      return <Archive className={`${iconClass} text-orange-500`} />;
    }
    
    return <File className={`${iconClass} text-gray-500`} />;
  };

  const getPreviewImage = () => {
    if (file.fileType.startsWith('image/')) {
      return (
        <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden mb-3">
          <img 
            src={file.storageURL} 
            alt={file.fileName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      );
    }
    return (
      <div className="w-full h-32 bg-gray-50 dark:bg-gray-700 rounded-md flex items-center justify-center mb-3">
        {getFileIcon()}
      </div>
    );
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.storageURL;
    link.download = file.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteClick = () => {
    if (isDeleteMode) {
      handleDeleteFile();
    } else {
      setShowDeleteModal(true);
    }
  };

  const handleDeleteFile = async () => {
    if (!currentRoom) return;

    // Check delete password if not in delete mode
    if (!isDeleteMode && deletePassword !== currentRoom.deletePassword) {
      toast.error('Incorrect delete password');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteFile(file.id, file.storageURL);
      toast.success(`${file.fileName} deleted successfully`);
      onFileDeleted();
      setShowDeleteModal(false);
      setDeletePassword('');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 group animate-fade-in">
        {getPreviewImage()}
        
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 dark:text-white truncate" title={file.fileName}>
            {file.fileName}
          </h3>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
            <p>{formatFileSize(file.size)}</p>
            <p>{formatRelativeTime(file.uploadTime)}</p>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
            
            <button
              onClick={handleDeleteClick}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                isDeleteMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delete File
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Enter the delete password to delete "{file.fileName}"
            </p>
            
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Delete password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleDeleteFile()}
            />
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFile}
                disabled={isDeleting || !deletePassword}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}