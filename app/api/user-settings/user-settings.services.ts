import { axiosInstance } from "@/services/axios-api-client";
import { userSettingsQueries } from "./index";
import type {
  UserSettingsPayload,
  UserSettingsResponse,
} from "@/interfaces/user-settings.types";

// Create user settings
export const createUserSettings = async (
  data: UserSettingsPayload
): Promise<UserSettingsResponse> => {
  const response = await axiosInstance.post<UserSettingsResponse>(
    userSettingsQueries.createUserSettings.endpoint,
    data
  );
  return response.data;
};

// Get user settings by userId
export const getUserSettings = async (): Promise<UserSettingsResponse> => {
  const response = await axiosInstance.get<UserSettingsResponse>(
    userSettingsQueries.getUserSettings().endpoint
  );
  return response.data;
};

// Update user settings
export const updateUserSettings = async (
  data: UserSettingsPayload
): Promise<UserSettingsResponse> => {
  const response = await axiosInstance.put<UserSettingsResponse>(
    userSettingsQueries.updateUserSettings.endpoint,
    data
  );
  return response.data;
};

// Delete user settings
export const deleteUserSettings = async (
  userId: string
): Promise<{
  statusCode: number;
  timestamp: string;
  message?: string;
}> => {
  const response = await axiosInstance.delete(
    `${userSettingsQueries.deleteUserSettings.endpoint}?userId=${userId}`
  );
  return response.data;
};
