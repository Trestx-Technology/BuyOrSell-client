import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
  getMyConnections,
  getSentRequests,
  getReceivedRequests,
  getConnectionLevel,
  canChat,
} from "@/app/api/connections/connections.services";
import { connectionQueries } from "@/app/api/connections/index";
import type {
  SendConnectionRequestPayload,
  ConnectionRequestResponse,
  ConnectionsResponse,
  ConnectionLevelResponse,
  CanChatResponse,
} from "@/interfaces/connection.types";
import { jobseekerQueries } from "@/app/api/jobseeker";

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get my connections with optional status filter
 */
export const useMyConnections = (
  status?: "PENDING" | "ACCEPTED" | "REJECTED"
) => {
  return useQuery<ConnectionsResponse, Error>({
    queryKey: [...connectionQueries.getMyConnections.Key, status],
    queryFn: () => getMyConnections(status),
  });
};

/**
 * Get sent connection requests (pending)
 */
export const useSentRequests = () => {
  return useQuery<ConnectionsResponse, Error>({
    queryKey: connectionQueries.getSentRequests.Key,
    queryFn: () => getSentRequests(),
  });
};

/**
 * Get received connection requests (pending)
 */
export const useReceivedRequests = () => {
  return useQuery<ConnectionsResponse, Error>({
    queryKey: connectionQueries.getReceivedRequests.Key,
    queryFn: () => getReceivedRequests(),
  });
};

/**
 * Get connection level with another user
 */
export const useConnectionLevel = (userId: string) => {
  return useQuery<ConnectionLevelResponse, Error>({
    queryKey: connectionQueries.getConnectionLevel(userId).Key,
    queryFn: () => getConnectionLevel(userId),
    enabled: !!userId,
  });
};

/**
 * Check if you can chat with a user
 */
export const useCanChat = (userId: string) => {
  return useQuery<CanChatResponse, Error>({
    queryKey: connectionQueries.canChat(userId).Key,
    queryFn: () => canChat(userId),
    enabled: !!userId,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Send a connection request to another user
 */
export const useSendConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ConnectionRequestResponse,
    Error,
    SendConnectionRequestPayload
  >({
    mutationFn: sendConnectionRequest,
    onSuccess: () => {
      // Invalidate and refetch connection-related queries
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getMyConnections.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.searchJobseekerProfiles.Key,
      });
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getSentRequests.Key,
      });
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getReceivedRequests.Key,
      });
    },
  });
};

/**
 * Accept a connection request
 */
export const useAcceptConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<ConnectionRequestResponse, Error, string>({
    mutationFn: acceptConnectionRequest,
    onSuccess: () => {
      // Invalidate and refetch connection-related queries
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getMyConnections.Key,
      });
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getSentRequests.Key,
      });
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getReceivedRequests.Key,
      });
    },
  });
};

/**
 * Reject a connection request
 */
export const useRejectConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<ConnectionRequestResponse, Error, string>({
    mutationFn: rejectConnectionRequest,
    onSuccess: () => {
      // Invalidate and refetch connection-related queries
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getMyConnections.Key,
      });
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getReceivedRequests.Key,
      });
    },
  });
};

/**
 * Cancel a pending connection request (sent by you)
 */
export const useCancelConnectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<ConnectionRequestResponse, Error, string>({
    mutationFn: cancelConnectionRequest,
    onSuccess: () => {
      // Invalidate and refetch connection-related queries
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getMyConnections.Key,
      });
      queryClient.invalidateQueries({
        queryKey: jobseekerQueries.searchJobseekerProfiles.Key,
      });
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getSentRequests.Key,
      });
    },
  });
};

/**
 * Remove an accepted connection
 */
export const useRemoveConnection = () => {
  const queryClient = useQueryClient();

  return useMutation<ConnectionRequestResponse, Error, string>({
    mutationFn: removeConnection,
    onSuccess: () => {
      // Invalidate and refetch connection-related queries
      queryClient.invalidateQueries({
        queryKey: connectionQueries.getMyConnections.Key,
      });
    },
  });
};
