"use client";

import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import { ChatTypeSelector, ChatType } from "./ChatTypeSelector";
import Image from "next/image";
import { User } from "lucide-react";
import { useState, memo } from "react";
import { cn } from "@/lib/utils";
import { ICONS } from "@/constants/icons";

export interface AdDetails {
  adId: string;
  adTitle: string;
  adImage: string;
  adPrice: number;
}

export interface OrganisationDetails {
  organisationId: string;
  orgTradeName: string;
  orgImage: string;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen?: string;
  isRead?: boolean;
  chatType: ChatType;
  ad?: AdDetails;
  amIAdOwner?: boolean;
  organisation?: OrganisationDetails;
  initiatorId?: string;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string;
  chatType: ChatType;
  onChatSelect: (chatId: string) => void;
  onChatTypeChange: (type: ChatType) => void;
  onBack?: () => void;
  className?: string;
}

export const AvatarImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
    className?: string;
}) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-gray-400 w-full h-full ${className}`}
      >
        <User className="w-1/2 h-1/2" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill
      sizes="56px"
      onError={() => setError(true)}
      style={{ objectFit: "cover" }}
    />
  );
};

// Memoized Chat Item to prevent unnecessary re-renders when other chats change
const ChatListItem = memo(({
  chat,
  isActive,
  onClick,
}: {
  chat: Chat;
  isActive: boolean;
  onClick: (chatId: string) => void;
}) => {
  const displayName = chat.name;
  const displayImage = chat.avatar;

  return (
    <div
      onClick={() => onClick(chat.id)}
      className={cn(
        "p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50",
        isActive ? "bg-purple-50" : "bg-white"
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 relative rounded-full overflow-hidden shrink-0 border border-gray-100">
            <AvatarImage
              src={displayImage || "/assets/images/placeholder-avatar.png"}
              alt={displayName}
              className=""
            />
          </div>

          {chat.chatType === "ad" && chat.ad && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm z-10">
              <Image
                src={chat.ad.adImage}
                alt="Ad"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {chat.isOnline && (
            <div
              className={cn(
                "absolute w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20",
                chat.chatType === "ad" && chat.ad ? "top-0 right-0" : "bottom-0 right-0"
              )}
            ></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 max-w-[70%]">
              <Typography
                variant="body-small"
                className="font-semibold text-gray-900 truncate"
              >
                {displayName}
              </Typography>
              {chat.isVerified && (
                <div className="shrink-0 w-5 h-5">
                  <Image
                    src={ICONS.auth.verified}
                    alt="Verified"
                    width={20}
                    height={20}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
            <Typography
              variant="caption"
              className={cn(
                "text-gray-500 whitespace-nowrap ml-2 text-[11px]",
                chat.unreadCount > 0 && "text-purple-600 font-bold"
              )}
            >
              {chat.time}
            </Typography>
          </div>

          <div className="flex items-center justify-between mt-1">
            <Typography
              variant="body-small"
              className={cn(
                "truncate flex-1 mr-2 text-gray-500",
                chat.unreadCount > 0 && "text-gray-900 font-medium"
              )}
            >
              {chat.lastMessage}
            </Typography>
            {chat.unreadCount > 0 && (
              <div className="w-5 h-5 bg-purple-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold shrink-0 animate-in zoom-in duration-200">
                {chat.unreadCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatListItem.displayName = "ChatListItem";

export function ChatSidebar({
  chats,
  activeChat,
  chatType,
  onChatSelect,
  onChatTypeChange,
  className,
}: ChatSidebarProps) {
  return (
    <div className={cn("w-full md:max-w-sm flex flex-col h-full bg-white border-r border-gray-100", className)}>
      {/* Header */}
      <div className="bg-purple p-4 space-y-3 shadow-md z-10">
        <ChatTypeSelector value={chatType} onChange={onChatTypeChange} />
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <Input
              placeholder="Search Chat"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pl-9 focus:bg-white focus:text-gray-900 focus:placeholder:text-gray-400 transition-all duration-300"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/30">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-purple-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <Typography variant="body-large" className="text-gray-900 font-semibold mb-2">
              No chats found
            </Typography>
            <Typography variant="body-small" className="text-gray-400">
              Your conversations will appear here
            </Typography>
          </div>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={activeChat === chat.id}
              onClick={onChatSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
