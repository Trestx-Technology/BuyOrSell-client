"use client";

import { useState } from "react";
import { mockAds } from "@/constants/sample-listings";
import { ChatSidebar } from "../_components/ChatSidebar";
import { ChatHeader } from "../_components/ChatHeader";
import { MessagesList } from "../_components/MessagesList";
import { MessageInput } from "../_components/MessageInput";
import { Container1080 } from "@/components/layouts/container-1080";

import { useChat } from "@/hooks/useChat";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function ChatPage() {
  const {
    loading,
    formattedChats,
    currentChat,
    formattedMessages,
    message,
    typingStatus,
    handleChatSelect,
    handleSendMessage,
    handleMessageChange,
    handleAIMessageGenerated,
    handleBackToSidebar,
    handleChatTypeChange,
    handleSearch,
    handleCall,
    handleMoreOptions,
    handleBack,
  } = useChat("/help-centre/messages", "/help-centre");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Re-sync with ticket type on load
  useEffect(() => {
    handleChatTypeChange("ticket");
  }, []);

  if (!isAuthenticated) {
    return (
      <Container1080 className="py-8 h-[calc(100vh-100px)]">
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Please log in to view your messages.</p>
        </div>
      </Container1080>
    );
  }

  if (loading) {
    return (
      <Container1080 className="py-8 h-[calc(100vh-100px)]">
        <Skeleton className="w-full h-full rounded-xl" />
      </Container1080>
    );
  }

  return (
    <Container1080 className="py-8 h-[calc(100vh-100px)]">
      {/* Full Width Sidebar - When no chat is selected */}
      {!currentChat && (
        <div className="w-full flex h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          {/* Sidebar */}
          <div className="w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800">
            <ChatSidebar
              chats={formattedChats}
              activeChat=""
              onChatSelect={handleChatSelect}
              onBack={handleBack}
            />
          </div>

          {/* Empty State Message */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600 dark:text-purple-400"
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Select a chat to continue
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Choose a conversation from the left sidebar to start chatting
                with our support team.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout - When chat is selected */}
      {currentChat && (
        <div className="flex w-full h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className=" hidden lg:flex w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
            <ChatSidebar
              chats={formattedChats}
              activeChat={currentChat.id}
              onChatSelect={handleChatSelect}
              onBack={handleBack}
            />
          </div>

          {/* Chat Area */}
          <div className="flex-1 w-full flex flex-col min-h-0 bg-white dark:bg-gray-900">
            <ChatHeader
              currentChat={currentChat}
              onSearch={handleSearch}
              onCall={handleCall}
              onMoreOptions={handleMoreOptions}
              onBackToSidebar={handleBackToSidebar}
              showBackButton={true}
            />

            <div className="flex-1 min-h-0 bg-gray-50 dark:bg-gray-950/50">
              <MessagesList
                messages={formattedMessages}
                isTyping={Object.values(typingStatus).some(Boolean)}
              />
            </div>

            <MessageInput
              value={message}
              onChange={handleMessageChange}
              onSend={handleSendMessage}
              onAIMessageGenerated={handleAIMessageGenerated}
              itemTitle={currentChat.name}
              maxRows={5}
              minRows={1}
            />
          </div>
        </div>
      )}
    </Container1080>
  );
}
