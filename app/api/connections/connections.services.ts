import { axiosInstance } from '@/services/axios-api-client';
import { connectionQueries } from './index';
import type {
  SendConnectionRequestPayload,
  ConnectionRequestResponse,
  ConnectionsResponse,
  ConnectionLevelResponse,
  CanChatResponse,
} from '@/interfaces/connection.types';

// Re-export types for convenience
export type {
  SendConnectionRequestPayload,
  ConnectionRequestResponse,
  Connection,
  ConnectionsResponse,
  ConnectionLevelResponse,
  CanChatResponse,
} from '@/interfaces/connection.types';

// ============================================================================
// SERVICES
// ============================================================================

/**
 * Send a connection request to another user
 */
export const sendConnectionRequest = async (
  payload: SendConnectionRequestPayload,
): Promise<ConnectionRequestResponse> => {
  const response = await axiosInstance.post<ConnectionRequestResponse>(
    connectionQueries.sendRequest.endpoint,
    {
      receiverId: payload.receiverId,
      message: payload.message,
    },
  );
  return response.data;
};

/**
 * Accept a connection request
 */
export const acceptConnectionRequest = async (
  id: string,
): Promise<ConnectionRequestResponse> => {
  const response = await axiosInstance.post<ConnectionRequestResponse>(
    connectionQueries.acceptRequest(id).endpoint,
  );
  return response.data;
};

/**
 * Reject a connection request
 */
export const rejectConnectionRequest = async (
  id: string,
): Promise<ConnectionRequestResponse> => {
  const response = await axiosInstance.post<ConnectionRequestResponse>(
    connectionQueries.rejectRequest(id).endpoint,
  );
  return response.data;
};

/**
 * Cancel a pending connection request (sent by you)
 */
export const cancelConnectionRequest = async (
  id: string,
): Promise<ConnectionRequestResponse> => {
  const response = await axiosInstance.post<ConnectionRequestResponse>(
    connectionQueries.cancelRequest(id).endpoint,
  );
  return response.data;
};

/**
 * Remove an accepted connection
 */
export const removeConnection = async (
  id: string,
): Promise<ConnectionRequestResponse> => {
  const response = await axiosInstance.delete<ConnectionRequestResponse>(
    connectionQueries.removeConnection(id).endpoint,
  );
  return response.data;
};

/**
 * Get my connections with optional status filter
 */
export const getMyConnections = async (
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED',
): Promise<ConnectionsResponse> => {
  const response = await axiosInstance.get<ConnectionsResponse>(
    connectionQueries.getMyConnections.endpoint,
    {
      params: status ? { status } : undefined,
    },
  );
  return response.data;
};

/**
 * Get sent connection requests (pending)
 */
export const getSentRequests = async (): Promise<ConnectionsResponse> => {
  const response = await axiosInstance.get<ConnectionsResponse>(
    connectionQueries.getSentRequests.endpoint,
  );
  return response.data;
};

/**
 * Get received connection requests (pending)
 */
export const getReceivedRequests = async (): Promise<ConnectionsResponse> => {
  const response = await axiosInstance.get<ConnectionsResponse>(
    connectionQueries.getReceivedRequests.endpoint,
  );
  return response.data;
};

/**
 * Get connection level with another user (1st, 2nd, 3rd degree or no connection)
 */
export const getConnectionLevel = async (
  userId: string,
): Promise<ConnectionLevelResponse> => {
  const response = await axiosInstance.get<ConnectionLevelResponse>(
    connectionQueries.getConnectionLevel(userId).endpoint,
  );
  return response.data;
};

/**
 * Check if you can chat with a user (requires accepted connection)
 */
export const canChat = async (userId: string): Promise<CanChatResponse> => {
  const response = await axiosInstance.get<CanChatResponse>(
    connectionQueries.canChat(userId).endpoint,
  );
  return response.data;
};

