"use client";

import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";

import { Chat } from "@/app/[locale]/(root)/chat/_components/ChatSidebar";

import { AvatarImage } from "@/app/[locale]/(root)/chat/_components/ChatSidebar";
import { ICONS } from "@/constants/icons";
import Image from "next/image";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onBack?: () => void;
}

export function ChatSidebar({
  chats,
  activeChat,
  onChatSelect,
  onBack,
}: ChatSidebarProps) {
  const handleChatSelect = (chatId: string) => {
    onChatSelect(chatId);
  };

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-purple p-4">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/10 shrink-0 -ml-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          <div className="relative w-full">
            <Input
              placeholder="Search Support Chat"
              className="bg-white/10 dark:bg-white/10 border-white/20 text-white placeholder:text-white/60 pl-9 focus:bg-white focus:text-gray-900 dark:focus:text-gray-900 focus:placeholder:text-gray-400 transition-all duration-300"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Typography variant="body-large" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
              No conversations
            </Typography>
            <Typography variant="body-small" className="text-gray-400 dark:text-gray-500">
              Your support tickets will appear here
            </Typography>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                activeChat === chat.id ? "bg-purple-50 dark:bg-purple/10" : "bg-white dark:bg-gray-900"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 relative rounded-full overflow-hidden shrink-0 border border-gray-100 dark:border-gray-800">
                    <AvatarImage
                      src={chat.avatar || "/assets/images/placeholder-avatar.png"}
                      alt={chat.name}
                    />
                  </div>
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full z-20"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <Typography
                        variant="body-small"
                        className="font-semibold text-gray-900 dark:text-gray-100 truncate"
                      >
                        {chat.name}
                      </Typography>
                      {chat.isVerified && (
                        <div className="shrink-0 w-4 h-4">
                          <Image
                            src={ICONS.auth.verified}
                            alt="Verified"
                            width={16}
                            height={16}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <Typography
                      variant="caption"
                      className={`text-gray-500 dark:text-gray-400 text-[11px] ${
                        chat.unreadCount > 0 ? "text-purple-600 dark:text-purple-400 font-bold" : ""
                      }`}
                    >
                      {chat.time}
                    </Typography>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <Typography
                      variant="body-small"
                      className={`truncate flex-1 mr-2 text-gray-500 dark:text-gray-400 ${
                        chat.unreadCount > 0 ? "text-gray-900 dark:text-gray-100 font-medium" : ""
                      }`}
                    >
                      {chat.lastMessage}
                    </Typography>
                    {chat.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-purple-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shrink-0">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
