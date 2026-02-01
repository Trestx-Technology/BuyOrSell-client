import { JobseekerProfile } from "./job.types";

export interface SendConnectionRequestPayload {
  receiverId: string;
  message?: string;
  organisationId?: string;
}

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED" | null;

export interface ConnectionRequestResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: {
    id: string;
    fromUserId: string;
    toUserId: string;
    status: ConnectionStatus;
    message?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Connection {
  id: string;
  _id?: string;
  connectionId?: string;
  requestId?: string;
  fromUserId?: string;
  toUserId?: string;
  fromUser?: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  toUser?: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
  };
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    image?: string;
  };
  userProfile?: JobseekerProfile;
  status: ConnectionStatus;
  message?: string;
  createdAt: string;
  updatedAt?: string;
  acceptedAt?: string;
  connectedAt?: string;
  location?: string;
  skills?: string[];
}

export interface ConnectionsResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: {
    items: Connection[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ConnectionLevelResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: {
    level: "1st" | "2nd" | "3rd" | "none";
    connectionPath?: string[];
  };
}

export interface CanChatResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: {
    canChat: boolean;
    reason?: string;
  };
}
