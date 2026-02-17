"use client";

import React, { useState } from "react";
import { Bell, Briefcase, MessageCircle, X, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useGetNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from "@/hooks/useNotifications";
import { useLocale } from "@/hooks/useLocale";
import { useRouter } from "next/navigation";
import { getNotifications } from "@/app/api/notifications/notifications.services";
import { notificationsQueries } from "@/app/api/notifications/index";
import { useAuthStore } from "@/stores/authStore";
import { formatDate } from "@/utils/format-date";

interface NotificationsPopoverProps {
  className?: string;
}

const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  className = "",
}) => {
  const { t, localePath } = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: notifications, isLoading } = useQuery({
    queryKey: notificationsQueries.getNotifications({ limit: 5 }).Key,
    queryFn: () => getNotifications({ limit: 5 }),
    enabled: isAuthenticated && isOpen,
  });

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
        return <Briefcase className="w-5 h-5 text-purple mt-0.5" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-purple mt-0.5" />;
      default:
        return <Bell className="w-5 h-5 text-purple mt-0.5" />;
    }
  };

  const unreadCount = notifications?.data?.filter(n => !n.read).length || 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`min-w-6 md:block hidden p-1 rounded hover:bg-white/10 transition-colors relative ${className}`}
        >
          <Bell className="size-6 hover:scale-110 transition-all duration-300 text-purple" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              {t.notifications?.title || "Notifications"}
            </h3>
            <button
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending || unreadCount === 0}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {markAllReadMutation.isPending
                ? t.notifications?.markingAll || "Marking..."
                : t.notifications?.markAllRead || "Mark All as Read"}
            </button>
          </div>

          {/* Notification Items */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">
                  {t.notifications?.loading || "Loading..."}
                </p>
              </div>
            ) : notifications?.data && notifications.data.length > 0 ? (
              notifications.data.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.read && handleMarkRead(notification._id)}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    notification.read
                      ? "bg-white border border-gray-200"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-purple rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(notification._id, e)}
                    className="p-1 hover:bg-gray-200 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">
                  {t.notifications?.noNotifications || "No notifications"}
                </p>
              </div>
            )}
          </div>

          {notifications?.data && notifications.data.length > 0 && (
            <button
              onClick={() => router.push(localePath("/user/notifications"))}
              className="block w-full text-center text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              {t.notifications?.viewAll || "View All"}
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;

