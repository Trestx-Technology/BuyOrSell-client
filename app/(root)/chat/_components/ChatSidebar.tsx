"use client";

import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import { ChatTypeSelector, ChatType } from "./ChatTypeSelector";

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isVerified: boolean;
  isOnline: boolean;
  isRead?: boolean;
  chatType: ChatType;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string;
  chatType: ChatType;
  onChatSelect: (chatId: string) => void;
  onChatTypeChange: (type: ChatType) => void;
  onBack?: () => void;
}

export function ChatSidebar({
  chats,
  activeChat,
  chatType,
  onChatSelect,
  onChatTypeChange,
}: ChatSidebarProps) {
  const handleChatSelect = (chatId: string) => {
    // Also call the onChatSelect callback for state management
    onChatSelect(chatId);
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header */}
      <div className="bg-purple p-4 space-y-3">
        <ChatTypeSelector value={chatType} onChange={onChatTypeChange} />
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search Chat"
            className="bg-white border-gray-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => handleChatSelect(chat.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
              activeChat === chat.id ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Typography
                      variant="body-small"
                      className="font-semibold text-gray-900 truncate"
                    >
                      {chat.name}
                    </Typography>
                    {chat.isVerified && (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <Typography
                    variant="caption"
                    className={`text-gray-500 ${
                      chat.unreadCount > 0 ? "text-gray-900" : ""
                    }`}
                  >
                    {chat.time}
                  </Typography>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <Typography
                    variant="body-small"
                    className="text-gray-500 truncate"
                  >
                    {chat.lastMessage}
                  </Typography>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
