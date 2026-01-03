export interface BlockUserPayload {
  userId: string;
  reason: string;
}

import type { User } from "@/interfaces/user.types";

export interface BlockedUser {
  _id: string;
  blocker: User;
  blocked: User;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface BlockedUserResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: BlockedUser;
}

export interface BlockedUsersListResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: BlockedUser[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface IsBlockedResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: {
    isBlocked: boolean;
  };
}
