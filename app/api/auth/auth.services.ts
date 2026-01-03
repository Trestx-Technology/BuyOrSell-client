/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/services/axios-api-client';
import { authQueries } from './index';
import type {
  loginResponse,
  SocialLoginPayload,
  User,
} from '@/interfaces/auth.types';
import { CookieService } from '@/services/cookie-service';
import { AUTH_TOKEN_NAMES } from '@/constants/auth.constants';
import { LocalStorageService } from '@/services/local-storage';

// Signup
export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  countryCode: string;
  deviceKey?: string;
}

export interface SignUpResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: {
    user: User;
    accessToken?: string;
    refreshToken?: string;
  };
}

// Login
export const login = async (
  email: string,
  password: string,
  deviceKey: string,
): Promise<loginResponse> => {
  const response = await axiosInstance.post<loginResponse>(
    authQueries.login.endpoint,
    {
      email,
      password,
      deviceKey,
    },
  );
  return response.data;
};

// Signup
export const signUp = async (
  data: SignUpPayload,
): Promise<SignUpResponse> => {
  const response = await axiosInstance.post<SignUpResponse>(
    authQueries.signUp.endpoint,
    {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      countryCode: data.countryCode,
      deviceKey: data.deviceKey || 'web',
    },
  );
  return response.data;
};

// Logout
export const logout = async (): Promise<any> => {
  const response = await axiosInstance.post(authQueries.logout.endpoint);
  LocalStorageService.clear();
  CookieService.remove(AUTH_TOKEN_NAMES.ACCESS_TOKEN, { path: '/' });
  return response.data;
};

// Send Reset Password Email
export const sendResetPasswordEmail = async (
  email: string,
): Promise<any> => {
  const response = await axiosInstance.post(
    authQueries.sendResetPasswordEmail.endpoint,
    {
      email,
    },
  );
  return response.data;
};

// Reset Password (with token and new password)
export const resetPassword = async (
  resetToken: string,
  newPassword: string,
): Promise<{
  message: string;
  statusCode: number;
  timeStamp: string;
}> => {
  const { data } = await axiosInstance.post(
    authQueries.resetPassword.endpoint,
    { resetToken, newPassword },
  );
  return data;
};

// Verify Reset Token
export const verifyResetToken = async (
  resetToken: string,
  newPassword: string,
): Promise<{
  message: string;
  statusCode: number;
  timeStamp: string;
}> => {
  const { data } = await axiosInstance.post(
    authQueries.verifyResetToken.endpoint,
    { resetToken, newPassword },
  );
  return data;
};

// Social Login
export const socialLogin = async (
  data: SocialLoginPayload,
): Promise<loginResponse> => {
  const response = await axiosInstance.post<loginResponse>(
    authQueries.socialLogin.endpoint,
    data,
  );
  return response.data;
};

// Verify Email OTP
export const verifyEmailOtp = async (data: {
  email: string;
  otp: string;
}): Promise<any> => {
  const response = await axiosInstance.post(
    authQueries.verifyEmailOtp.endpoint,
    data,
  );
  return response.data;
};

// Verify Phone OTP
export const verifyPhoneOtp = async (data: {
  phone: string;
  otp: string;
}): Promise<any> => {
  const response = await axiosInstance.post(
    authQueries.verifyPhoneOtp.endpoint,
    data,
  );
  return response.data;
};

// Refresh Token
export const refreshToken = async (
  refreshToken: string,
): Promise<any> => {
  const response = await axiosInstance.post(authQueries.refreshToken.endpoint, {
    refreshToken,
  });
  return response.data;
};

// Change Password
export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
  statusCode: number;
  timestamp?: string;
}

export const changePassword = async (
  data: ChangePasswordPayload,
): Promise<ChangePasswordResponse> => {
  const response = await axiosInstance.patch<ChangePasswordResponse>(
    authQueries.changePassword.endpoint,
    data,
  );
  return response.data;
};
