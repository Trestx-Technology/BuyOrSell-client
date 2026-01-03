import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUserSettings,
  getUserSettings,
  updateUserSettings,
  deleteUserSettings,
} from "@/app/api/user-settings/user-settings.services";
import {
  UserSettingsPayload,
  UserSettingsResponse,
} from "@/interfaces/user-settings.types";
import { userSettingsQueries } from "@/app/api/user-settings/index";

// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useGetUserSettings = (enabled: boolean = true) => {
  return useQuery<UserSettingsResponse, Error>({
    queryKey: [...userSettingsQueries.getUserSettings().Key],
    queryFn: () => getUserSettings(),
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const useCreateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<UserSettingsResponse, Error, UserSettingsPayload>({
    mutationFn: createUserSettings,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...userSettingsQueries.getUserSettings().Key],
      });
    },
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<UserSettingsResponse, Error, UserSettingsPayload>({
    mutationFn: updateUserSettings,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...userSettingsQueries.getUserSettings().Key],
      });
    },
  });
};

export const useDeleteUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; timestamp: string; message?: string },
    Error,
    string
  >({
    mutationFn: deleteUserSettings,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: [...userSettingsQueries.getUserSettings().Key],
      });
    },
  });
};
