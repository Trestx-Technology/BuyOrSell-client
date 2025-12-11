// Connection-related TypeScript interfaces

export interface SendConnectionRequestPayload {
  receiverId: string;
  message?: string;
}

export interface ConnectionRequestResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: {
    id: string;
    fromUserId: string;
    toUserId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    message?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Connection {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser?: {
    id: string;
    name: string;
    image?: string;
  };
  toUser?: {
    id: string;
    name: string;
    image?: string;
  };
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  createdAt: string;
  updatedAt: string;
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
    level: '1st' | '2nd' | '3rd' | 'none';
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

