import { axiosInstance } from "@/services/axios-api-client";
import { userQueries } from "./index";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserResponse,
  ProfileResponse,
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
  const response = await axiosInstance.get<UsersListResponse>(
    userQueries.findAllUsers.endpoint,
    { params }
  );
  return response.data;
};

// Create user
export const createUser = async (
  data: CreateUserPayload
): Promise<UserResponse> => {
  const response = await axiosInstance.post<UserResponse>(
    userQueries.createUser.endpoint,
    data
  );
  return response.data;
};

// Send email OTP
export const sendEmailOtp = async (data: {
  email: string;
}): Promise<SendEmailOtpResponse> => {
  const response = await axiosInstance.post<SendEmailOtpResponse>(
    userQueries.sendEmailOtp.endpoint,
    data
  );
  return response.data;
};

// Send phone OTP
export const sendPhoneOtp = async (data: {
  phoneNo: string;
}): Promise<SendPhoneOtpResponse> => {
  const response = await axiosInstance.post<SendPhoneOtpResponse>(
    userQueries.sendPhoneOtp.endpoint,
    data
  );
  return response.data;
};

// Send login email OTP
export const sendLoginEmailOtp = async (data: {
  email: string;
}): Promise<SendEmailOtpResponse> => {
  const response = await axiosInstance.post<SendEmailOtpResponse>(
    userQueries.sendLoginEmailOtp.endpoint,
    data
  );
  return response.data;
};

// Send login phone OTP
export const sendLoginPhoneOtp = async (data: {
  phoneNumber: string;
}): Promise<SendPhoneOtpResponse> => {
  const response = await axiosInstance.post<SendPhoneOtpResponse>(
    userQueries.sendLoginPhoneOtp.endpoint,
    data
  );
  return response.data;
};

// Verify email OTP
export const verifyEmailOtp = async (data: {
  email: string;
  otp: string;
}): Promise<VerifyEmailResponse> => {
  const response = await axiosInstance.post<VerifyEmailResponse>(
    userQueries.verifyEmailOtp.endpoint,
    data
  );
  return response.data;
};

// Verify phone OTP
export const verifyPhoneOtp = async (data: {
  phoneNo: string;
  otp: string;
}): Promise<VerifyPhoneResponse> => {
  const response = await axiosInstance.post<VerifyPhoneResponse>(
    userQueries.verifyPhoneOtp.endpoint,
    data
  );
  return response.data;
};

// Get user profile
export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axiosInstance.get<ProfileResponse>(
    userQueries.getProfile.endpoint
  );
  return response.data;
};

// Add user type
export const addUserType = async (
  id: string,
  data: AddUserTypePayload
): Promise<UserResponse> => {
  const response = await axiosInstance.post<UserResponse>(
    userQueries.addUserType(id).endpoint,
    data
  );
  return response.data;
};

// Update user type
export const updateUserType = async (
  id: string,
  data: AddUserTypePayload
): Promise<UserResponse> => {
  const response = await axiosInstance.put<UserResponse>(
    userQueries.updateUserType(id).endpoint,
    data
  );
  return response.data;
};

// Update user type (deprecated)
export const updateUserTypeDeprecated = async (
  id: string,
  data: AddUserTypePayload
): Promise<UserResponse> => {
  const response = await axiosInstance.put<UserResponse>(
    userQueries.updateUserTypeDeprecated(id).endpoint,
    data
  );
  return response.data;
};

// Get user by ID
export const getUserById = async (id: string): Promise<UserResponse> => {
  const response = await axiosInstance.get<UserResponse>(
    userQueries.getUserById(id).endpoint
  );
  return response.data;
};

// Update user
export const updateUser = async (
  id: string,
  data: UpdateUserPayload
): Promise<UserResponse> => {
  const response = await axiosInstance.put<UserResponse>(
    userQueries.updateUser(id).endpoint,
    data
  );
  return response.data;
};

// Delete user
export const deleteUser = async (
  id: string
): Promise<{
  statusCode: number;
  timestamp: string;
  message?: string;
}> => {
  const response = await axiosInstance.delete(
    userQueries.deleteUser(id).endpoint
  );
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
  const response = await axiosInstance.get<UsersListResponse>(
    userQueries.findAllUsersWithAdsCount(minCount).endpoint,
    { params }
  );
  return response.data;
};

// Update my Emarati status
export const updateMyEmarati = async (
  data: UpdateEmaratiPayload
): Promise<UserResponse> => {
  const response = await axiosInstance.put<UserResponse>(
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
  const response = await axiosInstance.put<UserResponse>(
    userQueries.adminUpdateEmarati(id).endpoint,
    data
  );
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
  const response = await axiosInstance.post(
    userQueries.blockUser(id).endpoint,
    data
  );
  return response.data;
};

// Assign role
export const assignRole = async (
  id: string,
  data: AssignRolePayload
): Promise<UserResponse> => {
  const response = await axiosInstance.put<UserResponse>(
    userQueries.assignRole(id).endpoint,
    data
  );
  return response.data;
};

// Get block history
export const getBlockHistory = async (
  id: string
): Promise<BlockHistoryResponse> => {
  const response = await axiosInstance.get<BlockHistoryResponse>(
    userQueries.getBlockHistory(id).endpoint
  );
  return response.data;
};
