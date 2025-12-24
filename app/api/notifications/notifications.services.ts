import { axiosInstance } from '@/services/axios-api-client';
import { notificationsQueries } from './index';
import type {
  SendNotificationPayload,
  NotificationResponse,
  NotificationsListResponse,
  DeleteNotificationResponse,
  MarkReadResponse,
  MarkNotificationsReadPayload,
} from '@/interfaces/notifications.types';

/**
 * Get notifications for the current user
 */
export const getNotifications = async (params?: {
  page?: number;
  limit?: number;
}): Promise<NotificationsListResponse> => {
  const response = await axiosInstance.get<NotificationsListResponse>(
    notificationsQueries.getNotifications(params).endpoint,
    { params }
  );
  return response.data;
};

/**
 * Send a notification to a specific device
 */
export const sendNotification = async (
  data: SendNotificationPayload
): Promise<NotificationResponse> => {
  const response = await axiosInstance.post<NotificationResponse>(
    notificationsQueries.sendNotification.endpoint,
    data
  );
  return response.data;
};

/**
 * Delete a specific notification
 */
export const deleteNotification = async (
  id: string
): Promise<DeleteNotificationResponse> => {
  const response = await axiosInstance.delete<DeleteNotificationResponse>(
    notificationsQueries.deleteNotification(id).endpoint
  );
  return response.data;
};

/**
 * Mark a notification as read
 */
export const markNotificationRead = async (
  id: string
): Promise<MarkReadResponse> => {
  const response = await axiosInstance.patch<MarkReadResponse>(
    notificationsQueries.markNotificationRead(id).endpoint
  );
  return response.data;
};

/**
 * Mark all notifications as read for the authenticated user
 */
export const markAllNotificationsRead = async (): Promise<MarkReadResponse> => {
  const response = await axiosInstance.patch<MarkReadResponse>(
    notificationsQueries.markAllNotificationsRead.endpoint
  );
  return response.data;
};

/**
 * Mark selected notifications as read
 */
export const markSelectedNotificationsRead = async (
  data: MarkNotificationsReadPayload
): Promise<MarkReadResponse> => {
  const response = await axiosInstance.patch<MarkReadResponse>(
    notificationsQueries.markSelectedNotificationsRead.endpoint,
    data
  );
  return response.data;
};

