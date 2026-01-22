import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  sendNotification,
  deleteNotification,
  markNotificationRead,
  markAllNotificationsRead,
  markSelectedNotificationsRead,
} from '@/app/api/notifications/notifications.services';
import type {
  SendNotificationPayload,
  NotificationResponse,
  NotificationsListResponse,
  DeleteNotificationResponse,
  MarkReadResponse,
  MarkNotificationsReadPayload,
} from '@/interfaces/notifications.types';
import { notificationsQueries } from '@/app/api/notifications/index';
import { useIsAuthenticated } from './useAuth';

// ============================================================================
// NOTIFICATIONS QUERY HOOKS
// ============================================================================

/**
 * Get notifications for the current user
 */
export const useGetNotifications = (
  params?: {
    page?: number;
    limit?: number;
  },
  options?: {
    enabled?: boolean;
  }
) => {
  const isAuthenticated = useIsAuthenticated();
  return useQuery<NotificationsListResponse, Error>({
    queryKey: notificationsQueries.getNotifications(params).Key,
    queryFn: () => getNotifications(params),
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
};

// ============================================================================
// NOTIFICATIONS MUTATION HOOKS
// ============================================================================

/**
 * Send a notification to a specific device
 */
export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<NotificationResponse, Error, SendNotificationPayload>({
    mutationFn: sendNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsQueries.getNotifications().Key,
      });
    },
  });
};

/**
 * Delete a specific notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteNotificationResponse, Error, string>({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsQueries.getNotifications().Key,
      });
    },
  });
};

/**
 * Mark a notification as read
 */
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkReadResponse, Error, string>({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsQueries.getNotifications().Key,
      });
    },
  });
};

/**
 * Mark all notifications as read
 */
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkReadResponse, Error, void>({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsQueries.getNotifications().Key,
      });
    },
  });
};

/**
 * Mark selected notifications as read
 */
export const useMarkSelectedNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<MarkReadResponse, Error, MarkNotificationsReadPayload>({
    mutationFn: markSelectedNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsQueries.getNotifications().Key,
      });
    },
  });
};

