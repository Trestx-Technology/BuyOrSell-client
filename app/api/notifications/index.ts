export const notificationsQueries = {
  // Get all notifications for current user
  getNotifications: (params?: { page?: number; limit?: number }) => ({
    Key: ["notifications", ...(params ? [params.page, params.limit] : [])],
    endpoint: "/notifications",
  }),

  // Send notification to a specific device
  sendNotification: {
    Key: ["notifications", "send"],
    endpoint: "/notifications",
  },

  // Delete specific notification
  deleteNotification: (id: string) => ({
    Key: ["notifications", id, "delete"],
    endpoint: `/notifications/${id}`,
  }),

  // Mark notification as read
  markNotificationRead: (id: string) => ({
    Key: ["notifications", id, "read"],
    endpoint: `/notifications/${id}/read`,
  }),

  // Mark all notifications as read
  markAllNotificationsRead: {
    Key: ["notifications", "read-all"],
    endpoint: "/notifications/read-all",
  },

  // Mark selected notifications as read
  markSelectedNotificationsRead: {
    Key: ["notifications", "read-selected"],
    endpoint: "/notifications/read-selected",
  },
};

