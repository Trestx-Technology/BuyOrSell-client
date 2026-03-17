"use client";

import {  MoreVertical, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";

import { Chat } from "@/app/[locale]/(root)/chat/_components/ChatSidebar";

interface ChatHeaderProps {
  currentChat: Chat | undefined;
  onSearch?: () => void;
  onCall?: () => void;
  onMoreOptions?: () => void;
  onBackToSidebar?: () => void;
  showBackButton?: boolean;
}

export function ChatHeader({
  currentChat,
  onMoreOptions,
  onBackToSidebar,
  showBackButton = false,
}: ChatHeaderProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Back to sidebar button */}
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 dark:text-gray-400"
              onClick={onBackToSidebar}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 dark:border-gray-700">
            <img
              src={currentChat?.avatar || ""}
              alt={currentChat?.name || ""}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Typography
              variant="body-small"
              className="font-semibold text-gray-900 dark:text-gray-100"
            >
              {currentChat?.name || "Unknown"}
            </Typography>
            <Typography variant="caption" className="text-gray-500 dark:text-gray-400">
              {currentChat?.isOnline ? "Online" : currentChat?.lastSeen || "last seen 5 mins ago"}
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 dark:text-gray-400"
            onClick={onMoreOptions}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
