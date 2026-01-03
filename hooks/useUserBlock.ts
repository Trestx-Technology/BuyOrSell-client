import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
  isBlocked,
} from "@/app/api/user-block/user-block.services";
import {
  BlockUserPayload,
  BlockedUserResponse,
  BlockedUsersListResponse,
  IsBlockedResponse,
} from "@/interfaces/user-block.types";
import { userBlockQueries } from "@/app/api/user-block/index";

// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useGetBlockedUsers = (enabled: boolean = true) => {
  return useQuery<BlockedUsersListResponse, Error>({
    queryKey: [...userBlockQueries.getBlockedUsers.Key],
    queryFn: () => getBlockedUsers(),
    enabled,
  });
};

export const useIsBlocked = (id: string, enabled: boolean = true) => {
  return useQuery<IsBlockedResponse, Error>({
    queryKey: [...userBlockQueries.isBlocked(id).Key],
    queryFn: () => isBlocked(id),
    enabled: enabled && !!id,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockedUserResponse, Error, BlockUserPayload>({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...userBlockQueries.getBlockedUsers.Key],
      });
    },
  });
};

export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { statusCode: number; timestamp: string; message?: string },
    Error,
    string
  >({
    mutationFn: unblockUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [...userBlockQueries.getBlockedUsers.Key],
      });
      queryClient.invalidateQueries({
        queryKey: [...userBlockQueries.isBlocked(id).Key],
      });
    },
  });
};
