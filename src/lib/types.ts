export interface Room {
  id: string;
  roomName: string;
  roomPassword: string;
  deletePassword: string;
  createdAt: Date;
}

export interface FileData {
  id: string;
  fileName: string;
  fileType: string;
  uploadTime: Date;
  storageURL: string;
  roomName: string;
  size: number;
}

export interface RoomContextType {
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
  isDeleteMode: boolean;
  setIsDeleteMode: (mode: boolean) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}