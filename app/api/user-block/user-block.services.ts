import { axiosInstance } from "@/services/axios-api-client";
import { userBlockQueries } from "./index";
import type {
  BlockUserPayload,
  BlockedUserResponse,
  BlockedUsersListResponse,
  IsBlockedResponse,
} from "@/interfaces/user-block.types";

// Block a user
export const blockUser = async (
  data: BlockUserPayload
): Promise<BlockedUserResponse> => {
  const response = await axiosInstance.post<BlockedUserResponse>(
    userBlockQueries.blockUser.endpoint,
    data
  );
  return response.data;
};

// Unblock a user
export const unblockUser = async (
  id: string
): Promise<{
  statusCode: number;
  timestamp: string;
  message?: string;
}> => {
  const response = await axiosInstance.delete(
    userBlockQueries.unblockUser(id).endpoint
  );
  return response.data;
};

// Get all users blocked by the current user
export const getBlockedUsers = async (): Promise<BlockedUsersListResponse> => {
  const response = await axiosInstance.get<BlockedUsersListResponse>(
    userBlockQueries.getBlockedUsers.endpoint
  );
  return response.data;
};

// Check if a user is blocked by the current user
export const isBlocked = async (
  id: string
): Promise<IsBlockedResponse> => {
  const response = await axiosInstance.get<IsBlockedResponse>(
    userBlockQueries.isBlocked(id).endpoint
  );
  return response.data;
};
