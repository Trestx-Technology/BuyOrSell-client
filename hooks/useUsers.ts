import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findAllUsers,
  createUser,
  sendEmailOtp,
  sendPhoneOtp,
  sendLoginEmailOtp,
  sendLoginPhoneOtp,
  verifyEmailOtp,
  verifyPhoneOtp,
  getProfile,
  addUserType,
  updateUserType,
  updateUserTypeDeprecated,
  getUserById,
  updateUser,
  deleteUser,
  findAllUsersWithAdsCount,
  updateMyEmarati,
  adminUpdateEmarati,
  assignRole,
} from "@/app/api/user/user.services";
import {
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
  AssignRolePayload,
} from "@/interfaces/user.types";
import { userQueries } from "@/app/api/user/index";
import { useIsAuthenticated } from "./useAuth";
// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useFindAllUsers = (params?: {
  filter?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<UsersListResponse, Error>({
    queryKey: [...userQueries.findAllUsers.Key, params],
    queryFn: () => findAllUsers(params),
  });
};

export const useGetUserById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery<UserResponse, Error>({
    queryKey: [...userQueries.getUserById(id).Key],
    queryFn: () => getUserById(id),
    enabled: options?.enabled !== undefined ? options.enabled : !!id,
  });
};

export const useGetProfile = () => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<ProfileResponse, Error>({
    queryKey: userQueries.getProfile.Key,
    queryFn: () => getProfile(),
    enabled: isAuthenticated,
  });
};

export const useFindAllUsersWithAdsCount = (
  minCount: string,
  params?: {
    filter?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery<UsersListResponse, Error>({
    queryKey: [...userQueries.findAllUsersWithAdsCount(minCount).Key, params],
    queryFn: () => findAllUsersWithAdsCount(minCount, params),
    enabled: !!minCount,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, CreateUserPayload>({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.findAllUsers.Key });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    Error,
    { id: string; data: UpdateUserPayload }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userQueries.findAllUsers.Key });
      queryClient.invalidateQueries({
        queryKey: [...userQueries.getUserById(variables.id).Key],
      });
      queryClient.invalidateQueries({
        queryKey: userQueries.getProfile.Key,
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; timestamp: string; message?: string },
    Error,
    string
  >({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueries.findAllUsers.Key });
    },
  });
};

export const useSendEmailOtp = () => {
  return useMutation<SendEmailOtpResponse, Error, { email: string }>({
    mutationFn: sendEmailOtp,
    mutationKey: userQueries.sendEmailOtp.Key,
  });
};

export const useSendPhoneOtp = () => {
  return useMutation<SendPhoneOtpResponse, Error, { phoneNo: string }>({
    mutationFn: sendPhoneOtp,
    mutationKey: userQueries.sendPhoneOtp.Key,
  });
};

export const useSendLoginEmailOtp = () => {
  return useMutation<SendEmailOtpResponse, Error, { email: string }>({
    mutationFn: sendLoginEmailOtp,
    mutationKey: userQueries.sendLoginEmailOtp.Key,
  });
};

export const useSendLoginPhoneOtp = () => {
  return useMutation<SendPhoneOtpResponse, Error, { phoneNumber: string }>({
    mutationFn: sendLoginPhoneOtp,
    mutationKey: userQueries.sendLoginPhoneOtp.Key,
  });
};

export const useVerifyEmailOtp = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VerifyEmailResponse,
    Error,
    { email: string; otp: string }
  >({
    mutationFn: verifyEmailOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueries.getProfile.Key,
      });
    },
  });
};

export const useVerifyPhoneOtp = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VerifyPhoneResponse,
    Error,
    { phoneNo: string; otp: string }
  >({
    mutationFn: verifyPhoneOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueries.getProfile.Key,
      });
    },
  });
};

export const useAddUserType = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    Error,
    { id: string; data: AddUserTypePayload }
  >({
    mutationFn: ({ id, data }) => addUserType(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...userQueries.getUserById(variables.id).Key],
      });
      queryClient.invalidateQueries({
        queryKey: userQueries.getProfile.Key,
      });
    },
  });
};

export const useUpdateUserType = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    Error,
    { id: string; data: AddUserTypePayload }
  >({
    mutationFn: ({ id, data }) => updateUserType(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...userQueries.getUserById(variables.id).Key],
      });
      queryClient.invalidateQueries({
        queryKey: userQueries.getProfile.Key,
      });
    },
  });
};

export const useUpdateUserTypeDeprecated = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    Error,
    { id: string; data: AddUserTypePayload }
  >({
    mutationFn: ({ id, data }) => updateUserTypeDeprecated(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...userQueries.getUserById(variables.id).Key],
      });
      queryClient.invalidateQueries({
        queryKey: userQueries.getProfile.Key,
      });
    },
  });
};

export const useUpdateMyEmarati = () => {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, UpdateEmaratiPayload>({
    mutationFn: updateMyEmarati,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userQueries.getProfile.Key,
      });
    },
  });
};

export const useAdminUpdateEmarati = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    Error,
    { id: string; data: UpdateEmaratiPayload }
  >({
    mutationFn: ({ id, data }) => adminUpdateEmarati(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...userQueries.getUserById(variables.id).Key],
      });
      queryClient.invalidateQueries({
        queryKey: userQueries.findAllUsers.Key,
      });
    },
  });
};

export const useAssignRole = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserResponse,
    Error,
    { id: string; data: AssignRolePayload }
  >({
    mutationFn: ({ id, data }) => assignRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...userQueries.getUserById(variables.id).Key],
      });
      queryClient.invalidateQueries({
        queryKey: userQueries.findAllUsers.Key,
      });
    },
  });
};
