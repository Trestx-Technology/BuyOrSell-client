import { ColumnDef } from "@tanstack/react-table";
import { Briefcase, MessageCircle, Bell, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";
import type { Notification } from "@/interfaces/notifications.types";

interface UseNotificationsColumnsProps {
  t: any;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  isMarkingRead: boolean;
  isDeleting: boolean;
}

export function useNotificationsColumns({
  t,
  onMarkRead,
  onDelete,
  isMarkingRead,
  isDeleting,
}: UseNotificationsColumnsProps): ColumnDef<Notification>[] {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_match':
        return <Briefcase className="w-4 h-4 text-purple" />;
      case 'message':
        return <MessageCircle className="w-4 h-4 text-purple" />;
      default:
        return <Bell className="w-4 h-4 text-purple" />;
    }
  };

  return [
    {
      accessorKey: "title",
      header: t.notifications.notification,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {getNotificationIcon(row.original.type)}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{row.original.title}</span>
              {!row.original.read && (
                <div className="w-2 h-2 bg-purple rounded-full"></div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {row.original.message}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: t.notifications.dateTime,
      cell: ({ getValue }) => (
        <span className="text-gray-600">
          {formatDate(getValue() as string)}
        </span>
      ),
    },
    {
      id: "status",
      header: t.notifications.status,
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.read
              ? "bg-gray-100 text-gray-600"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {row.original.read ? t.notifications.read : t.notifications.unread}
        </span>
      ),
    },
    {
      id: "actions",
      header: t.notifications.actions,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {!row.original.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkRead(row.original._id)}
              className="text-purple hover:text-purple/80 hover:bg-purple/5 px-2 h-8 whitespace-nowrap"
              disabled={isMarkingRead}
            >
              {t.notifications.markAsRead}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.original._id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 h-8 whitespace-nowrap"
            disabled={isDeleting}
          >
            {t.common.delete}
          </Button>
        </div>
      ),
    },
  ];
}

