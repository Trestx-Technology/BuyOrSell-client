"use client";

import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { MessageInput } from "./MessageInput";
import { Chat } from "./ChatSidebar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  time: string;
  isFromUser: boolean;
  isRead: boolean;
}

interface ChatAreaProps {
  currentChat: Chat | undefined;
  messages: Message[];
  message: string;
  isTyping: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onAIMessageGenerated: (message: string) => void;
  onSearch?: () => void;
  onCall?: () => void;
  onMoreOptions?: () => void;
  onBackToSidebar?: () => void;
}

export function ChatArea({
  currentChat,
  messages,
  message,
  isTyping,
  onMessageChange,
  onSendMessage,
  onAIMessageGenerated,
  onSearch,
  onCall,
  onMoreOptions,
  onBackToSidebar,
}: ChatAreaProps) {
  // Empty State - Only shown on desktop when no chat is selected
  if (!currentChat) {
    return (
      <div className="hidden sm:flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select a chat to continue
          </h3>
          <p className="text-gray-500 max-w-sm">
            Choose a conversation from the left sidebar to start chatting with
            other users.
          </p>
        </div>
      </div>
    );
  }

  // Chat Area - Shown when chat is selected
  return (
    <div className={cn("flex-1 w-full flex flex-col min-h-0 bg-white")}>
      <ChatHeader
        currentChat={currentChat}
        onSearch={onSearch}
        onCall={onCall}
        onMoreOptions={onMoreOptions}
        onBackToSidebar={onBackToSidebar}
        showBackButton={true}
      />

      <div className="flex-1 min-h-0">
        <MessagesList messages={messages} isTyping={isTyping} />
      </div>

      <MessageInput
        value={message}
        onChange={onMessageChange}
        onSend={onSendMessage}
        onAIMessageGenerated={onAIMessageGenerated}
        itemTitle={currentChat.name}
        itemPrice="$15,000"
        maxRows={5}
        minRows={1}
      />
    </div>
  );
}

