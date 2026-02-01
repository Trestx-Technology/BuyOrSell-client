import { Timestamp } from "firebase/firestore";

export type ChatType = "ad" | "dm" | "organisation";

export interface User {
  id: string;
  name: string;
  avatar: string; // Keep for user profile, but chat generic uses 'image'
  email: string;
  isVerified: boolean;
  lastSeen: Timestamp | Date;
  online: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface ParticipantDetails {
  [userId: string]: {
    name: string;
    nameAr: string;
    image: string;
    isVerified: boolean;
  };
}

export interface LastMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp | Date;
  type: string;
}

export interface UnreadCount {
  [userId: string]: number;
}

export interface TypingStatus {
  [userId: string]: boolean;
}

export interface OnlineStatus {
  [userId: string]: boolean;
}

export interface Chat {
  id: string;
  type: ChatType;
  title: string;
  titleAr: string;
  image: string;
  participants: string[];
  participantDetails: ParticipantDetails;
  lastMessage: LastMessage;
  unreadCount: UnreadCount;
  typing: TypingStatus;
  onlineStatus: OnlineStatus;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  // Optional references if needed for navigation, though specific data is now flat
  adId?: string;
  adOwnerId?: string;
  organisationId?: string;
  initiatorId?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  type: "text" | "location" | "file";
  isRead: boolean;
  readBy: string[]; // Keeping for backward compat logic if needed, but schema only has isRead in list
  createdAt: Timestamp | Date;
  timeStamp: Timestamp | Date;
  userImage?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  fileUrl?: string;
}

export interface UserChat {
  chatId: string;
  type: ChatType;
  lastMessage: {
    text: string;
    createdAt: Timestamp | Date;
  };
  unreadCount: number;
  updatedAt: Timestamp | Date;
}

export interface CreateChatParams {
  type: ChatType;
  title: string;
  titleAr: string;
  image: string;
  participants: string[];
  participantDetails: ParticipantDetails;
  adId?: string;
  adOwnerId?: string;
  organisationId?: string;
  initiatorId?: string;
}

export interface SendMessageParams {
  chatId: string;
  senderId: string;
  text: string;
  type: "text" | "location" | "file";
  userImage?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  fileUrl?: string;
}

