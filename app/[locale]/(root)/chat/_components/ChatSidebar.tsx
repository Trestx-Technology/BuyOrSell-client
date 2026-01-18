"use client";

import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import { ChatTypeSelector, ChatType } from "./ChatTypeSelector";

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
  isRead?: boolean;
  chatType: ChatType;
  ad?: AdDetails;
  amIAdOwner?: boolean;
  organisation?: OrganisationDetails;
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
    <div className="w-full border max-w-sm flex flex-col h-full">
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
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <Typography variant="body-small" className="text-gray-500 mb-2">
              No chats found
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              Start a conversation to see your chats here
            </Typography>
          </div>
        ) : (
            chats.map((chat) => {
              let displayName = chat.name;
              let displayImage = chat.avatar;

              // Only override for Organisation. For Ads, we strictly want User Name + Ad Image overlay.
              if (chat.chatType === "organisation" && chat.organisation) {
                displayName = chat.organisation.orgTradeName;
                displayImage = chat.organisation.orgImage;
              }

              return (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeChat === chat.id ? "bg-gray-50" : ""
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={
                              displayImage || "/assets/images/placeholder-avatar.png"
                            }
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Ad Image Overlay */}
                        {chat.chatType === "ad" && chat.ad && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded overflow-hidden border-2 border-white shadow-sm z-10">
                            <img
                              src={chat.ad.adImage}
                              alt="Ad"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {chat.isOnline && (
                          <div
                            className={`absolute ${chat.chatType === "ad" && chat.ad
                              ? "top-0 right-0"
                              : "bottom-0 right-0"
                              } w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-20`}
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
                              <div className="shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center p-[2px]">
                                <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                              </div>
                            )}
                          </div>
                          <Typography
                            variant="caption"
                            className={`text-gray-500 whitespace-nowrap ml-2 ${chat.unreadCount > 0 ? "text-gray-900 font-medium" : ""
                              }`}
                          >
                            {chat.time}
                          </Typography>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <Typography
                            variant="body-small"
                            className="text-gray-500 truncate flex-1 mr-2"
                          >
                            {chat.lastMessage}
                          </Typography>
                          {chat.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center font-medium shrink-0">
                              {chat.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
              );
            })
        )}
      </div>
    </div>
  );
}
