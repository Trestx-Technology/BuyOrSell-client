/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/services/axios-api-client";
import { authQueries } from "@/api-queries/auth.query";
import type { loginResponse, SocialLoginPayload } from "@/interfaces/auth.types";
import { removeCookies } from "@/actions/cookies.action";
import { LocalStorageService } from "@/services/local-storage";

// Login
export const Login = async (
  email: string,
  password: string,
  deviceKey: string
): Promise<loginResponse> => {
  const response = await axiosInstance.post(authQueries.login.endpoint, {
    email,
    password,
    deviceKey,
  });
  return response.data;
};

// Signup
export const SignUp = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<any> => {
  const response = await axiosInstance.post(authQueries.signUp.endpoint, data);
  return response.data;
};

// Logout
export const Logout = async (): Promise<any> => {
  const response = await axiosInstance.post(authQueries.logout.endpoint);
  LocalStorageService.clear();
  await removeCookies();
  return response.data;
};

//Send Reset Password Email
export const SendResetPasswordEmail = async (email: string): Promise<any> => {
  const response = await axiosInstance.post(
    authQueries.sendResetPasswordEmail.endpoint,
    {
      email,
    }
  );
    return response.data;
};

// Reset Password (with token and new password)
export const ResetPassword = async (
  resetToken: string,
  newPassword: string
): Promise<{
  message: string;
  statusCode: number;
  timeStamp: string;
}> => {
  const { data } = await axiosInstance.post(
    authQueries.resetPassword.endpoint,
    { resetToken, newPassword }
  );
  return data;
};

// Reset Password
export const verifyResetToken = async (
  resetToken: string,
  newPassword: string
): Promise<{
  message: string;
  statusCode: number;
  timeStamp: string;
}> => {
  const { data } = await axiosInstance.post(
    authQueries.verifyResetToken.endpoint,
    { resetToken, newPassword }
  );
  return data;
};

// Social Login
export const SocialLogin = async (
  data: SocialLoginPayload
): Promise<loginResponse> => {
  const response = await axiosInstance.post(
    authQueries.socialLogin.endpoint,
    data
  );
  return response.data;
};

// Verify Email OTP
export const VerifyEmailOtp = async (data: {
  email: string;
  otp: string;
}): Promise<any> => {
  const response = await axiosInstance.post(
    authQueries.verifyEmailOtp.endpoint,
    data
  );
  return response.data;
};

// Verify Phone OTP
export const VerifyPhoneOtp = async (data: {
  phone: string;
  otp: string;
}): Promise<any> => {
  const response = await axiosInstance.post(
    authQueries.verifyPhoneOtp.endpoint,
    data
  );
  return response.data;
};

// Refresh Token
export const RefreshToken = async (refreshToken: string): Promise<any> => {
  const response = await axiosInstance.post(authQueries.refreshToken.endpoint, {
    refreshToken,
  });
  return response.data;
};
