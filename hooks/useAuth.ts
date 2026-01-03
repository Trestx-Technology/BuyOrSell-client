import { useMutation } from "@tanstack/react-query";
import {
  signUp,
  login,
  changePassword,
  SignUpPayload,
  SignUpResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "@/app/api/auth/auth.services";
import { loginResponse } from "@/interfaces/auth.types";
import { authQueries } from "@/app/api/auth/index";

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const useSignUp = () => {
  return useMutation<SignUpResponse, Error, SignUpPayload>({
    mutationFn: signUp,
    mutationKey: authQueries.signUp.Key,
  });
};

export const useLogin = () => {
  return useMutation<
    loginResponse,
    Error,
    { email: string; password: string; deviceKey: string }
  >({
    mutationFn: ({ email, password, deviceKey }) =>
      login(email, password, deviceKey),
    mutationKey: authQueries.login.Key,
  });
};

export const useChangePassword = () => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordPayload>({
    mutationFn: changePassword,
    mutationKey: authQueries.changePassword.Key,
  });
};
