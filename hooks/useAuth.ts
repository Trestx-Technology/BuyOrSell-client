import { useAuthStore } from "@/stores/authStore";
import { useMutation } from "@tanstack/react-query";
import {
  signUp,
  login,
  changePassword,
  socialLogin,
  SignUpPayload,
  SignUpResponse,
  SocialLoginPayload,
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
  });
};

export const useSocialLogin = () => {
  const setSession = useAuthStore((state) => state.setSession);
  return useMutation<loginResponse, Error, SocialLoginPayload>({
    mutationFn: (payload) => socialLogin(payload),
    mutationKey: authQueries.socialLogin.Key,
    onSuccess: async (data) => {
      if (data.data.accessToken) {
        await setSession(
          data.data.accessToken,
          data.data.refreshToken,
          data.data.user as any,
        );
      }
    },
  });
};

export const useIsAuthenticated = () => {
  const accessToken = useAuthStore((state) => state.session.accessToken);
  const userSession = useAuthStore((state) => state.session.user);
  return !!accessToken && !!userSession;
};
