import { axiosInstance } from "@/services/axios-api-client";
import { userQueries } from "@/api-queries/user.query";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserResponse,
  UsersListResponse,
  SendEmailOtpResponse,
  SendPhoneOtpResponse,
  VerifyEmailResponse,
  VerifyPhoneResponse,
  AddUserTypePayload,
  UpdateEmaratiPayload,
  BlockUserPayload,
  AssignRolePayload,
  BlockHistoryResponse,
} from "@/interfaces/user.types";

// Get all users
export const findAllUsers = async (params?: {
  filter?: string;
  page?: number;
  limit?: number;
}): Promise<UsersListResponse> => {
  const response = await axiosInstance.get(userQueries.findAllUsers.endpoint, {
    params,
  });
  return response.data;
};

// Create user
export const createUser = async (
  data: CreateUserPayload
): Promise<UserResponse> => {
  const response = await axiosInstance.post(
    userQueries.createUser.endpoint,
    data
  );
  return response.data;
};

// Send email OTP
export const sendEmailOtp = async (
  email: string
): Promise<SendEmailOtpResponse> => {
  const endpoint = userQueries.sendEmailOtp.endpoint.replace(":email", email);
  const response = await axiosInstance.put(endpoint);
  return response.data;
};

// Send phone OTP
export const sendPhoneOtp = async (
  phone: string
): Promise<SendPhoneOtpResponse> => {
  const endpoint = userQueries.sendPhoneOtp.endpoint.replace(":phone", phone);
  const response = await axiosInstance.put(endpoint);
  return response.data;
};

// Send login email OTP
export const sendLoginEmailOtp = async (
  email: string
): Promise<SendEmailOtpResponse> => {
  const endpoint = userQueries.sendLoginEmailOtp.endpoint.replace(":email", email);
  const response = await axiosInstance.put(endpoint);
  return response.data;
};

// Send login phone OTP
export const sendLoginPhoneOtp = async (
  phone: string
): Promise<SendPhoneOtpResponse> => {
  const endpoint = userQueries.sendLoginPhoneOtp.endpoint.replace(":phone", phone);
  const response = await axiosInstance.put(endpoint);
  return response.data;
};

// Verify email
export const verifyEmail = async (
  email: string,
  code: string
): Promise<VerifyEmailResponse> => {
  const endpoint = userQueries.verifyEmail.endpoint
    .replace(":email", email)
    .replace(":code", code);
  const response = await axiosInstance.get(endpoint);
  return response.data;
};

// Verify phone
export const verifyPhone = async (
  phone: string,
  code: string
): Promise<VerifyPhoneResponse> => {
  const endpoint = userQueries.verifyPhone.endpoint
    .replace(":phone", phone)
    .replace(":code", code);
  const response = await axiosInstance.get(endpoint);
  return response.data;
};

// Get user profile
export const getProfile = async (): Promise<UserResponse> => {
  const response = await axiosInstance.get(userQueries.getProfile.endpoint);
  return response.data;
};

// Add user type
export const addUserType = async (
  id: string,
  data: AddUserTypePayload
): Promise<UserResponse> => {
  const endpoint = userQueries.addUserType.endpoint.replace(":id", id);
  const response = await axiosInstance.post(endpoint, data);
  return response.data;
};

// Update user type
export const updateUserType = async (
  id: string,
  data: AddUserTypePayload
): Promise<UserResponse> => {
  const endpoint = userQueries.updateUserType.endpoint.replace(":id", id);
  const response = await axiosInstance.put(endpoint, data);
  return response.data;
};

// Update user type (deprecated)
export const updateUserTypeDeprecated = async (
  id: string,
  data: AddUserTypePayload
): Promise<UserResponse> => {
  const endpoint = userQueries.updateUserTypeDeprecated.endpoint.replace(":id", id);
  const response = await axiosInstance.put(endpoint, data);
  return response.data;
};

// Get user by ID
export const getUserById = async (id: string): Promise<UserResponse> => {
  const endpoint = userQueries.getUserById.endpoint.replace(":id", id);
  const response = await axiosInstance.get(endpoint);
  return response.data;
};

// Update user
export const updateUser = async (
  id: string,
  data: UpdateUserPayload
): Promise<UserResponse> => {
  const endpoint = userQueries.updateUser.endpoint.replace(":id", id);
  const response = await axiosInstance.put(endpoint, data);
  return response.data;
};

// Delete user
export const deleteUser = async (id: string): Promise<{
  statusCode: number;
  timestamp: string;
  message?: string;
}> => {
  const endpoint = userQueries.deleteUser.endpoint.replace(":id", id);
  const response = await axiosInstance.delete(endpoint);
  return response.data;
};

// Find users with minimum ads count
export const findAllUsersWithAdsCount = async (
  minCount: string,
  params?: {
    filter?: string;
    page?: number;
    limit?: number;
  }
): Promise<UsersListResponse> => {
  const endpoint = userQueries.findAllUsersWithAdsCount.endpoint.replace(
    ":minCount",
    minCount
  );
  const response = await axiosInstance.get(endpoint, { params });
  return response.data;
};

// Update my Emarati status
export const updateMyEmarati = async (
  data: UpdateEmaratiPayload
): Promise<UserResponse> => {
  const response = await axiosInstance.put(
    userQueries.updateMyEmarati.endpoint,
    data
  );
  return response.data;
};

// Admin update Emarati status
export const adminUpdateEmarati = async (
  id: string,
  data: UpdateEmaratiPayload
): Promise<UserResponse> => {
  const endpoint = userQueries.adminUpdateEmarati.endpoint.replace(":id", id);
  const response = await axiosInstance.put(endpoint, data);
  return response.data;
};

// Block user
export const blockUser = async (
  id: string,
  data: BlockUserPayload
): Promise<{
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: string;
}> => {
  const endpoint = userQueries.blockUser.endpoint.replace(":id", id);
  const response = await axiosInstance.post(endpoint, data);
  return response.data;
};

// Assign role
export const assignRole = async (
  id: string,
  data: AssignRolePayload
): Promise<UserResponse> => {
  const endpoint = userQueries.assignRole.endpoint.replace(":id", id);
  const response = await axiosInstance.put(endpoint, data);
  return response.data;
};

// Get block history
export const getBlockHistory = async (id: string): Promise<BlockHistoryResponse> => {
  const endpoint = userQueries.getBlockHistory.endpoint.replace(":id", id);
  const response = await axiosInstance.get(endpoint);
  return response.data;
};

