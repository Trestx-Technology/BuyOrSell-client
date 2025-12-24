import { ColumnDef } from "@tanstack/react-table";
import { Briefcase, MessageCircle, Bell, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";
import type { Notification } from "@/interfaces/notifications.types";

interface UseNotificationsColumnsProps {
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  isMarkingRead: boolean;
  isDeleting: boolean;
}

export function useNotificationsColumns({
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
      header: "Notification",
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
      header: "Date & Time",
      cell: ({ getValue }) => (
        <span className="text-gray-600">
          {formatDate(getValue() as string)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.original.read
              ? "bg-gray-100 text-gray-600"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {row.original.read ? "Read" : "Unread"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {!row.original.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkRead(row.original._id)}
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              disabled={isMarkingRead}
            >
              <Check className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row.original._id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            disabled={isDeleting}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];
}

