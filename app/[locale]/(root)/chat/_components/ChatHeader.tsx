"use client";

import { MoreVertical, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Chat } from "./ChatSidebar";

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
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Back to sidebar button */}
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={onBackToSidebar}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}

          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={currentChat?.avatar || ""}
              alt={currentChat?.name || ""}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Typography
              variant="body-small"
              className="font-semibold text-gray-900"
            >
              {currentChat?.name || "Unknown"}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              last seen 5 mins ago
            </Typography>
          </div>
          {currentChat?.isOnline && (
            <div
              className={`absolute ${currentChat?.chatType === "ad" && currentChat?.ad
                ? "top-0 right-0"
                : "bottom-0 right-0"
                } w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20`}
            ></div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={onMoreOptions}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
