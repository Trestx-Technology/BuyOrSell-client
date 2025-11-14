import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  findAllUsers,
  createUser,
  sendEmailOtp,
  sendPhoneOtp,
  sendLoginEmailOtp,
  sendLoginPhoneOtp,
  verifyEmail,
  verifyPhone,
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
  blockUser,
  assignRole,
  getBlockHistory,
} from "@/app/api/user";
import {
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
import { userQueries } from "@/api-queries/user.query";

// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useFindAllUsers = (params?: {
  filter?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery<UsersListResponse, Error>({
    queryKey: [userQueries.findAllUsers.key, params],
    queryFn: () => findAllUsers(params),
  });
};

export const useGetUserById = (id: string) => {
  return useQuery<UserResponse, Error>({
    queryKey: [userQueries.getUserById.key, id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useGetProfile = () => {
  return useQuery<UserResponse, Error>({
    queryKey: [userQueries.getProfile.key],
    queryFn: () => getProfile(),
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
    queryKey: [userQueries.findAllUsersWithAdsCount.key, minCount, params],
    queryFn: () => findAllUsersWithAdsCount(minCount, params),
    enabled: !!minCount,
  });
};

export const useGetBlockHistory = (id: string) => {
  return useQuery<BlockHistoryResponse, Error>({
    queryKey: [userQueries.getBlockHistory.key, id],
    queryFn: () => getBlockHistory(id),
    enabled: !!id,
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
      queryClient.invalidateQueries({ queryKey: [userQueries.findAllUsers.key] });
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
      queryClient.invalidateQueries({ queryKey: [userQueries.findAllUsers.key] });
      queryClient.invalidateQueries({
        queryKey: [userQueries.getUserById.key, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [userQueries.getProfile.key],
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
      queryClient.invalidateQueries({ queryKey: [userQueries.findAllUsers.key] });
    },
  });
};

export const useSendEmailOtp = () => {
  return useMutation<SendEmailOtpResponse, Error, string>({
    mutationFn: sendEmailOtp,
    mutationKey: [userQueries.sendEmailOtp.key],
  });
};

export const useSendPhoneOtp = () => {
  return useMutation<SendPhoneOtpResponse, Error, string>({
    mutationFn: sendPhoneOtp,
    mutationKey: [userQueries.sendPhoneOtp.key],
  });
};

export const useSendLoginEmailOtp = () => {
  return useMutation<SendEmailOtpResponse, Error, string>({
    mutationFn: sendLoginEmailOtp,
    mutationKey: [userQueries.sendLoginEmailOtp.key],
  });
};

export const useSendLoginPhoneOtp = () => {
  return useMutation<SendPhoneOtpResponse, Error, string>({
    mutationFn: sendLoginPhoneOtp,
    mutationKey: [userQueries.sendLoginPhoneOtp.key],
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VerifyEmailResponse,
    Error,
    { email: string; code: string }
  >({
    mutationFn: ({ email, code }) => verifyEmail(email, code),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userQueries.getProfile.key],
      });
    },
  });
};

export const useVerifyPhone = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VerifyPhoneResponse,
    Error,
    { phone: string; code: string }
  >({
    mutationFn: ({ phone, code }) => verifyPhone(phone, code),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [userQueries.getProfile.key],
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
        queryKey: [userQueries.getUserById.key, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [userQueries.getProfile.key],
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
        queryKey: [userQueries.getUserById.key, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [userQueries.getProfile.key],
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
        queryKey: [userQueries.getUserById.key, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [userQueries.getProfile.key],
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
        queryKey: [userQueries.getProfile.key],
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
        queryKey: [userQueries.getUserById.key, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [userQueries.findAllUsers.key],
      });
    },
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; timestamp: string; message?: string; data?: string },
    Error,
    { id: string; data: BlockUserPayload }
  >({
    mutationFn: ({ id, data }) => blockUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [userQueries.getUserById.key, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [userQueries.getBlockHistory.key, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [userQueries.findAllUsers.key],
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
        queryKey: [userQueries.getUserById.key, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [userQueries.findAllUsers.key],
      });
    },
  });
};

