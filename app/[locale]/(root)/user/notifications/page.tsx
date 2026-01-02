"use client";

import React, { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import {
  useGetNotifications,
  useMarkNotificationRead,
  useDeleteNotification,
  useMarkAllNotificationsRead,
} from "@/hooks/useNotifications";
import { ErrorCard } from "@/components/ui/error-card";
import { Table } from "@/components/table/table";
import { useNotificationsColumns } from "./_components/column";
import { Clock } from "lucide-react";
import { Container1080 } from "@/components/layouts/container-1080";

export default function NotificationsPage() {
  const { t } = useLocale();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: notifications,
    isLoading,
    error,
  } = useGetNotifications({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const markReadMutation = useMarkNotificationRead();
  const deleteMutation = useDeleteNotification();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  // Get table columns
  const columns = useNotificationsColumns({
    onMarkRead: handleMarkRead,
    onDelete: handleDelete,
    isMarkingRead: markReadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  });

  if (isLoading) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
            <p className="text-gray-600">
              {t.notifications?.loadingNotifications ||
                "Loading notifications..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1080px] mx-auto px-4 py-8">
        <ErrorCard
          variant="error"
          title={
            t.notifications?.failedToLoad || "Failed to load notifications"
          }
          description={
            t.notifications?.failedToLoadDescription ||
            "Unable to fetch notifications. Please try again later."
          }
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  return (
    <Container1080 className="min-h-fit py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {t.notifications?.pageTitle || "Notifications"}
          </h1>
          <p className="text-sm text-gray-600">
            {t.notifications?.pageDescription ||
              "View and manage your notifications"}
          </p>
        </div>
        {notifications?.data && notifications.data.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {markAllReadMutation.isPending
              ? t.notifications?.markingAll || "Marking..."
              : t.notifications?.markAllRead || "Mark All as Read"}
          </button>
        )}
      </div>

      {/* Notifications Table */}
      <Table
        data={notifications?.data || []}
        columns={columns}
        loading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        showPagination={true}
        rowCount={notifications?.total || 0}
      />
    </Container1080>
  );
}
