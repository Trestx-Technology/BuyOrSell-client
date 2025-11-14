import { useMutation } from "@tanstack/react-query";
import { SignUp, Login, SignUpPayload, SignUpResponse } from "@/app/api/auth";
import { loginResponse } from "@/interfaces/auth.types";
import { authQueries } from "@/api-queries/auth.query";

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const useSignUp = () => {
  return useMutation<SignUpResponse, Error, SignUpPayload>({
    mutationFn: SignUp,
    mutationKey: [authQueries.signUp.key],
  });
};

export const useLogin = () => {
  return useMutation<loginResponse, Error, { email: string; password: string; deviceKey: string }>({
    mutationFn: ({ email, password, deviceKey }) => Login(email, password, deviceKey),
    mutationKey: [authQueries.login.key],
  });
};

