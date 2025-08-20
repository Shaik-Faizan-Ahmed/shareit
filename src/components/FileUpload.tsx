'use client';

import { useState, useRef } from 'react';
import { useRoom } from '@/context/RoomContext';
import { uploadFile } from '@/lib/utils';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileUploaded: () => void;
}

export default function FileUpload({ onFileUploaded }: FileUploadProps) {
  const { currentRoom } = useRoom();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    handleFileUpload(files[0]);
  };

  const handleFileUpload = async (file: File) => {
    if (!currentRoom) return;

    setIsUploading(true);
    try {
      await uploadFile(file, currentRoom.roomName);
      toast.success(`${file.name} uploaded successfully!`);
      onFileUploaded();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
    setIsUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="mb-8">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Uploading...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Upload Files
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Drag and drop files here, or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  browse
                </button>
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          multiple={false}
        />
      </div>
    </div>
  );
}