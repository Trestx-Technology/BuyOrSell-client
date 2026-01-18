"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ChatService } from "@/lib/firebase/chat.service";
import { Chat as FirebaseChat, Message } from "@/lib/firebase/types";
import { useAuthStore } from "@/stores/authStore";
import { usePresence } from "@/lib/firebase/presence.hook";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLocale } from "@/hooks/useLocale";
import { useChat } from "@/hooks/useChat";

// Dynamic imports with SSR disabled for all chat components
const ChatSidebar = dynamic(
  () =>
    import("./_components/ChatSidebar").then((mod) => ({
      default: mod.ChatSidebar,
    })),
  {
    ssr: false,
  }
);

const ChatArea = dynamic(
  () =>
    import("./_components/ChatArea").then((mod) => ({ default: mod.ChatArea })),
  {
    ssr: false,
  }
);

// Import types (not components, so regular import is fine)
import type { ChatType } from "./_components/ChatTypeSelector";
import type { Chat } from "./_components/ChatSidebar";
import { Container1080 } from "@/components/layouts/container-1080";
import { LoginRequiredDialog } from "@/components/auth/login-required-dialog";


export default function ChatPage() {
  const {
    t,
    localePath,
    isAuthenticated,
    session,
    loading,
    chatType,
    urlChatId,
    message,
    formattedChats,
    currentChat,
    formattedMessages,
    typingStatus,
    handleChatTypeChange,
    handleChatSelect,
    handleBack,
    handleSendMessage,
    handleMessageChange,
    handleAIMessageGenerated,
    handleBackToSidebar,
    handleSearch,
    handleCall,
    handleMoreOptions,
    router,
  } = useChat();

  // Show loading state
  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-500">{t.chat.loadingChats}</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !session.user) {
    return (
      <div className="h-dvh">
        <LoginRequiredDialog
          onOpenChange={() => router.push(localePath("/login"))}
          open={true}
          message="Please login to chat"
          redirectUrl={localePath("/chat")}
        />
      </div>
    );
  }

  return (
    <Container1080 className="flex relative h-dvh">
      {/* Sidebar - Always visible on desktop, full width on mobile when no chat selected */}

      <ChatSidebar
        chats={formattedChats}
        activeChat={urlChatId || ""}
        chatType={chatType}
        onChatSelect={handleChatSelect}
        onChatTypeChange={handleChatTypeChange}
        onBack={handleBack}
      />

      {/* Chat Area - Show current chat if selected, otherwise show empty state */}
      <ChatArea
        currentChat={currentChat}
        messages={formattedMessages}
        message={message}
        isTyping={Object.entries(typingStatus).some(
          ([userId, isTyping]) => userId !== session.user?._id && isTyping
        )}
        onMessageChange={handleMessageChange}
        onSendMessage={handleSendMessage}
        onAIMessageGenerated={handleAIMessageGenerated}
        onSearch={handleSearch}
        onCall={handleCall}
        onMoreOptions={handleMoreOptions}
        onBackToSidebar={handleBackToSidebar}
      />
    </Container1080>
  );
}
