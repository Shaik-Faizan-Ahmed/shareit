import { supabase } from './supabase';
import { Room, FileData } from './types';

// Room operations
export async function checkRoomExists(roomName: string): Promise<Room | null> {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('room_name', roomName)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw error;
    }
    
    return {
      id: data.id,
      roomName: data.room_name,
      roomPassword: data.room_password,
      deletePassword: data.delete_password,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Error checking room:', error);
    return null;
  }
}

export async function createRoom(
  roomName: string, 
  roomPassword: string, 
  deletePassword: string
): Promise<Room> {
  const { data, error } = await supabase
    .from('rooms')
    .insert({
      room_name: roomName,
      room_password: roomPassword,
      delete_password: deletePassword,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    roomName: data.room_name,
    roomPassword: data.room_password,
    deletePassword: data.delete_password,
    createdAt: new Date(data.created_at),
  };
}

export async function verifyRoomPassword(
  roomName: string, 
  password: string
): Promise<Room | null> {
  const room = await checkRoomExists(roomName);
  if (room && room.roomPassword === password) {
    return room;
  }
  return null;
}

// File operations
export async function uploadFile(
  file: File, 
  roomName: string
): Promise<FileData> {
  console.log('🚀 Starting file upload:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    roomName
  });
  
  const fileName = `${Date.now()}_${file.name}`;
  const filePath = `rooms/${roomName}/${fileName}`;

  console.log('📁 Upload path:', filePath);

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('files')
    .upload(filePath, file);

  if (uploadError) {
    console.error('❌ Upload error:', uploadError);
    throw uploadError;
  }
  
  console.log('✅ File uploaded to storage:', uploadData);

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('files')
    .getPublicUrl(filePath);

  console.log('🔗 Public URL:', publicUrlData.publicUrl);

  // Save file metadata to Supabase database
  console.log('💾 Saving to database...');
  const { data, error } = await supabase
    .from('files')
    .insert({
      file_name: file.name,
      file_type: file.type || 'application/octet-stream',
      upload_time: new Date().toISOString(),
      storage_url: publicUrlData.publicUrl,
      room_name: roomName,
      file_size: file.size,
    })
    .select()
    .single();
  
  if (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
  
  console.log('🎉 Upload complete!', data);
  
  return {
    id: data.id,
    fileName: data.file_name,
    fileType: data.file_type,
    uploadTime: new Date(data.upload_time),
    storageURL: data.storage_url,
    roomName: data.room_name,
    size: data.file_size,
  };
}

export async function getRoomFiles(roomName: string): Promise<FileData[]> {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('room_name', roomName)
    .order('upload_time', { ascending: false });
  
  if (error) throw error;
  
  return data.map(file => ({
    id: file.id,
    fileName: file.file_name,
    fileType: file.file_type,
    uploadTime: new Date(file.upload_time),
    storageURL: file.storage_url,
    roomName: file.room_name,
    size: file.file_size || 0,
  }));
}

export async function deleteFile(fileId: string, storageURL: string): Promise<void> {
  // Extract file path from storage URL
  const url = new URL(storageURL);
  const pathParts = url.pathname.split('/');
  const filePath = pathParts.slice(pathParts.indexOf('files') + 1).join('/');
  
  // Delete from Supabase Storage
  const { error: storageError } = await supabase.storage
    .from('files')
    .remove([filePath]);
  
  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
  }
  
  // Delete from Supabase database
  const { error: dbError } = await supabase
    .from('files')
    .delete()
    .eq('id', fileId);
  
  if (dbError) throw dbError;
}

// Utility functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

export function getFileTypeCategory(fileType: string): string {
  if (fileType.startsWith('image/')) return 'Images';
  if (fileType.startsWith('video/')) return 'Videos';
  if (fileType.startsWith('audio/')) return 'Audio';
  if (fileType === 'application/pdf') return 'Docs';
  if (fileType.includes('document') || fileType.includes('text') || 
      fileType.includes('sheet') || fileType.includes('presentation')) return 'Docs';
  if (fileType.includes('zip') || fileType.includes('rar') || 
      fileType.includes('7z') || fileType.includes('tar')) return 'Archives';
  return 'Others';
}