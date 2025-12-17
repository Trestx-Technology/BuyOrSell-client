import { Timestamp } from "firebase/firestore";

export type ChatType = "ad" | "dm" | "organisation";

export interface User {
  id: string;
  name: string;
  avatar: string;
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
    avatar: string;
    isVerified: boolean;
  };
}

export interface LastMessage {
  text: string;
  senderId: string;
  timestamp: Timestamp | Date;
}

export interface UnreadCount {
  [userId: string]: number;
}

export interface TypingStatus {
  [userId: string]: boolean;
}

export interface AdDetails {
  adId: string;
  adTitle: string;
  adImage: string;
  adPrice: number;
}

export interface OrganisationDetails {
  organisationId: string;
  orgTradeName: string;
  orgImage: string;
}

export interface Chat {
  id: string;
  chatType: ChatType;
  participants: string[];
  participantDetails: ParticipantDetails;
  ad?: AdDetails;
  organisation?: OrganisationDetails;
  lastMessage: LastMessage;
  unreadCount: UnreadCount;
  typing: TypingStatus;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  readBy: string[];
  timestamp: Timestamp | Date;
  createdAt: Timestamp | Date;
}

export interface UserChat {
  chatId: string;
  chatType: ChatType;
  lastMessage: LastMessage;
  unreadCount: number;
  updatedAt: Timestamp | Date;
}

export interface Presence {
  userId: string;
  online: boolean;
  lastSeen: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface CreateChatParams {
  chatType: ChatType;
  participants: string[];
  participantDetails: ParticipantDetails;
  ad?: AdDetails;
  organisation?: OrganisationDetails;
}

export interface SendMessageParams {
  chatId: string;
  senderId: string;
  text: string;
}

