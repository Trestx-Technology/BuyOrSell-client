/**
 * Notification Types
 */

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_match' | 'message' | 'system' | 'other';
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SendNotificationPayload {
  token: string;
  title: string;
  message: string;
  type?: "job_match" | "message" | "system" | "other";
}

export interface MarkNotificationsReadPayload {
  notificationIds: string[];
}

export interface NotificationResponse {
  success: boolean;
  data: Notification;
  message?: string;
}

export interface NotificationsListResponse {
  success: boolean;
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

export interface MarkReadResponse {
  success: boolean;
  message: string;
  updatedCount?: number;
}

