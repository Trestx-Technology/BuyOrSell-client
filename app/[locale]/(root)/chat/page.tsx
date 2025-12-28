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

// Dynamic imports with SSR disabled for all chat components
const ChatSidebar = dynamic(() => import("./_components/ChatSidebar").then(mod => ({ default: mod.ChatSidebar })), {
  ssr: false,
});

const ChatArea = dynamic(() => import("./_components/ChatArea").then(mod => ({ default: mod.ChatArea })), {
  ssr: false,
});

// Import types (not components, so regular import is fine)
import type { ChatType } from "./_components/ChatTypeSelector";
import type { Chat } from "./_components/ChatSidebar";

export default function ChatPage() {
  const { t, localePath } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session, isAuthenticated } = useAuthStore((state) => state);
  
  const [chats, setChats] = useState<FirebaseChat[]>([]);
  const [currentChatData, setCurrentChatData] = useState<FirebaseChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatType, setChatType] = useState<ChatType>("ad");
  const [onlineStatus, setOnlineStatus] = useState<{ [userId: string]: boolean }>({});
  const [typingStatus, setTypingStatus] = useState<{ [userId: string]: boolean }>({});
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);

  // Get chat type and chatId from URL
  const urlChatType = searchParams.get("type") as ChatType | null;
  const urlChatId = searchParams.get("chatId");

  // Initialize chat type
  useEffect(() => {
    if (urlChatType && ["ad", "dm", "organisation"].includes(urlChatType)) {
      setChatType(urlChatType);
    }
  }, [urlChatType]);

  // Set up presence hook for current user
  const userId = session.user?._id || null;
  usePresence(userId);

  // Subscribe to user chats in real-time
  useEffect(() => {
    const userId = session.user?._id;
    if (!isAuthenticated || !userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = ChatService.subscribeToUserChats(
      userId,
      chatType,
      (firebaseChats) => {
        setChats(firebaseChats);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated, session.user?._id, chatType]);

  // Load current chat data when chatId is in URL
  useEffect(() => {
    if (!urlChatId || !session.user?._id) {
      setCurrentChatData(null);
      setMessages([]);
      setMessage("");
      return;
    }

    const loadChat = async () => {
      try {
        const chatData = await ChatService.getChat(urlChatId);
        
        if (!chatData) {
          toast.error(t.chat.chatNotFound);
          router.push(localePath("/chat"));
          return;
        }

        setCurrentChatData(chatData);
        setChatType(chatData.chatType);

        // Load messages
        const chatMessages = await ChatService.getMessages(urlChatId);
        setMessages(chatMessages);

        // Mark chat as read for current user
        if (session.user?._id) {
          await ChatService.markChatAsRead(urlChatId, session.user._id);
        }
      } catch (error) {
        console.error("Error loading chat:", error);
        toast.error(t.chat.failedToLoadChat);
        router.push(localePath("/chat"));
      }
    };

    loadChat();
  }, [urlChatId, router, session.user?._id]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!urlChatId) return;

    const unsubscribe = ChatService.subscribeToMessages(urlChatId, (newMessages) => {
      setMessages(newMessages);
      // Mark chat as read when new messages arrive
      if (session.user?._id) {
        ChatService.markChatAsRead(urlChatId, session.user._id).catch(console.error);
      }
    });

    return () => unsubscribe();
  }, [urlChatId, session.user?._id]);

  // Subscribe to typing status
  useEffect(() => {
    if (!urlChatId) return;

    const unsubscribe = ChatService.subscribeToTypingStatus(urlChatId, (typing) => {
      setTypingStatus(typing);
    });

    return () => unsubscribe();
  }, [urlChatId]);

  // Subscribe to other user's online status (for current chat)
  useEffect(() => {
    if (!currentChatData || !session.user?._id) return;

    const otherParticipantId = currentChatData.participants.find(id => id !== session.user?._id);
    if (!otherParticipantId) return;

    const unsubscribe = ChatService.subscribeToOnlineStatus(otherParticipantId, (isOnline) => {
      setIsOtherUserOnline(isOnline);
    });

    return () => unsubscribe();
  }, [currentChatData, session.user?._id]);

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: Date | { toDate?: () => Date } | string | number | undefined): string => {
    if (!timestamp) return "";
    
    let date: Date;
    
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === "object" && timestamp !== null && "toDate" in timestamp && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else if (typeof timestamp === "string" || typeof timestamp === "number") {
      date = new Date(timestamp);
    } else {
      return "";
    }
    
    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "2-digit",
      });
    }
  };

  // Subscribe to online status for all participants
  useEffect(() => {
    const userId = session.user?._id;
    if (!userId || chats.length === 0) return;

    const unsubscribes: (() => void)[] = [];
    const statusMap: { [userId: string]: boolean } = {};

    chats.forEach((chat) => {
      chat.participants.forEach((participantId) => {
        if (participantId !== userId) {
          const unsubscribe = ChatService.subscribeToOnlineStatus(
            participantId,
            (online) => {
              statusMap[participantId] = online;
              setOnlineStatus({ ...statusMap });
            }
          );
          unsubscribes.push(unsubscribe);
        }
      });
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [chats, session.user?._id]);

  // Convert Firebase chats to component format
  const formattedChats: Chat[] = useMemo(() => {
    const userId = session.user?._id;
    if (!userId) return [];

    return chats.map((firebaseChat) => {
      // Get the other participant (not the current user)
      const otherParticipantId = firebaseChat.participants.find(
        (id) => id !== userId
      );
      const otherParticipant = otherParticipantId
        ? firebaseChat.participantDetails[otherParticipantId]
        : null;

      if (!otherParticipant) {
        // Fallback if participant not found
        return {
          id: firebaseChat.id,
          name: "Unknown",
          avatar: "",
          lastMessage: firebaseChat.lastMessage.text || "",
          time: formatTimestamp(firebaseChat.lastMessage.timestamp),
          unreadCount: firebaseChat.unreadCount[userId] || 0,
          isVerified: false,
          isOnline: false,
          chatType: firebaseChat.chatType,
          ad: firebaseChat.ad,
          organisation: firebaseChat.organisation,
        };
      }

      return {
        id: firebaseChat.id,
        name: otherParticipant.name,
        avatar: otherParticipant.avatar,
        lastMessage: firebaseChat.lastMessage.text || "",
        time: formatTimestamp(firebaseChat.lastMessage.timestamp),
        unreadCount: firebaseChat.unreadCount[userId] || 0,
        isVerified: otherParticipant.isVerified,
        isOnline: otherParticipantId ? (onlineStatus[otherParticipantId] || false) : false,
        chatType: firebaseChat.chatType,
        ad: firebaseChat.ad,
        organisation: firebaseChat.organisation,
      };
    });
  }, [chats, session.user?._id, onlineStatus]);

  const handleChatTypeChange = (type: ChatType) => {
    setChatType(type);
  };

  const handleChatSelect = (chatId: string) => {
    router.push(`${localePath("/chat")}?chatId=${chatId}&type=${chatType}`);
  };

  const handleBack = () => {
    router.push(localePath("/chat"));
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !urlChatId || !session.user?._id) return;

    try {
      await ChatService.sendMessage({
        chatId: urlChatId,
        senderId: session.user._id,
        text: message.trim(),
      });
      setMessage("");
      // Reset typing status after sending message
      await ChatService.setTypingStatus(urlChatId, session.user._id, false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t.chat.failedToSendMessage);
    }
  };

  const handleMessageChange = async (value: string) => {
    setMessage(value);
    if (session.user?._id && urlChatId) {
      await ChatService.setTypingStatus(urlChatId, session.user._id, !!value.trim());
    }
  };

  const handleAIMessageGenerated = (generatedMessage: string) => {
    setMessage(generatedMessage);
  };

  const handleBackToSidebar = () => {
    router.push(localePath("/chat"));
  };

  const handleSearch = () => {
    console.log("Search messages");
  };

  const handleCall = () => {
    console.log("Start call");
  };

  const handleMoreOptions = () => {
    console.log("Show more options");
  };

  // Convert Firebase Chat to component Chat format (for current chat)
  const currentChat = useMemo(() => {
    if (!currentChatData || !session.user?._id) return undefined;

    const userId = session.user._id;
    const otherParticipantId = currentChatData.participants.find(
      (id) => id !== userId
    );
    const otherParticipant = otherParticipantId
      ? currentChatData.participantDetails[otherParticipantId]
      : null;

    if (!otherParticipant) return undefined;

    return {
      id: currentChatData.id,
      name: otherParticipant.name,
      avatar: otherParticipant.avatar,
      lastMessage: currentChatData.lastMessage.text,
      time: formatTimestamp(currentChatData.lastMessage.timestamp),
      unreadCount: currentChatData.unreadCount[session.user._id] || 0,
      isVerified: otherParticipant.isVerified,
      isOnline: isOtherUserOnline,
      chatType: currentChatData.chatType,
      ad: currentChatData.ad,
      organisation: currentChatData.organisation,
    };
  }, [currentChatData, session.user?._id, isOtherUserOnline]);

  // Convert Firebase Messages to component Message format
  const formattedMessages = useMemo(() => {
    return messages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      time: formatTimestamp(msg.timestamp),
      isFromUser: msg.senderId === session.user?._id,
      isRead: msg.isRead,
    }));
  }, [messages, session.user?._id]);

  // Show loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">{t.chat.pleaseLogin}</p>
          <button
            onClick={() => router.push(localePath("/login"))}
            className="text-purple-600 hover:text-purple-700"
          >
            {t.chat.goToLogin}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex relative">
      {/* Sidebar - Always visible on desktop, full width on mobile when no chat selected */}
      <div
        className={cn(
          "border-r border-gray-200 flex flex-col h-full bg-white",
          urlChatId ? "hidden sm:flex sm:w-80 lg:w-96" : "flex w-full sm:w-80 sm:flex lg:w-96"
        )}
      >
        <ChatSidebar
          chats={formattedChats}
          activeChat={urlChatId || ""}
          chatType={chatType}
          onChatSelect={handleChatSelect}
          onChatTypeChange={handleChatTypeChange}
          onBack={handleBack}
        />
      </div>

      {/* Chat Area - Show current chat if selected, otherwise show empty state */}
      <ChatArea
        currentChat={currentChat}
        messages={formattedMessages}
        message={message}
        isTyping={Object.values(typingStatus).some((typing) => typing)}
        onMessageChange={handleMessageChange}
        onSendMessage={handleSendMessage}
        onAIMessageGenerated={handleAIMessageGenerated}
        onSearch={handleSearch}
        onCall={handleCall}
        onMoreOptions={handleMoreOptions}
        onBackToSidebar={handleBackToSidebar}
      />
    </div>
  );
}
