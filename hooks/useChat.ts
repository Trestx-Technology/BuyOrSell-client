import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatService } from "@/lib/firebase/chat.service";
import { Chat as FirebaseChat, Message } from "@/lib/firebase/types";
import { useAuthStore } from "@/stores/authStore";
import { usePresence } from "@/lib/firebase/presence.hook";
import { toast } from "sonner";
import { useLocale } from "@/hooks/useLocale";
import type { ChatType } from "@/app/[locale]/(root)/chat/_components/ChatTypeSelector";
import type { Chat } from "@/app/[locale]/(root)/chat/_components/ChatSidebar";
import { AD } from "@/interfaces/ad";

export function useChat() {
  const { t, localePath } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session, isAuthenticated } = useAuthStore((state) => state);

  const [chats, setChats] = useState<FirebaseChat[]>([]);
  const [currentChatData, setCurrentChatData] = useState<FirebaseChat | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatType, setChatType] = useState<ChatType>("ad");
  const [onlineStatus, setOnlineStatus] = useState<{
    [userId: string]: boolean;
  }>({});
  const [typingStatus, setTypingStatus] = useState<{
    [userId: string]: boolean;
  }>({});
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

  const findOrCreateAdChat = async (ad: AD): Promise<string> => {
    if (!session.user) throw new Error("User not authenticated");

    // Get ad owner ID
    const adOwnerId = typeof ad.owner === "string" ? ad.owner : ad.owner?._id;

    if (!adOwnerId) {
      throw new Error("Ad owner not found");
    }

    const currentUserId = session.user._id;

    // Check if chat already exists
    // Get all chats for current user of type "ad"
    const userChats = await ChatService.getUserChats(currentUserId, "ad");

    // Find chat that matches this ad
    const existingChat = userChats.find(
      (chat) =>
        chat.adId === ad._id &&
        chat.participants.includes(adOwnerId) &&
        chat.participants.includes(currentUserId)
    );

    if (existingChat) {
      return existingChat.id;
    }

    // Create new chat
    const adOwner = typeof ad.owner === "string" ? null : ad.owner;
    const adOwnerName = adOwner
      ? `${adOwner.firstName} ${adOwner.lastName}`.trim() ||
        adOwner.name ||
        "Seller"
      : "Seller";
    // Assuming arabic name isn't readily available in adOwner fields shown, reusing name
    const adOwnerNameAr = adOwnerName;
    const adOwnerAvatar = adOwner?.image || "";
    const adOwnerVerified = adOwner?.emailVerified || false;

    const currentUserName =
      `${session.user.firstName} ${session.user.lastName}`.trim();
    const currentUserNameAr = currentUserName; // Fallback
    const currentUserAvatar = ""; // You may need to get this from user profile
    const currentUserVerified = session.user.emailVerified || false;

    const chatId = await ChatService.createChat({
      type: "ad",
      title: ad.title,
      titleAr: ad.titleAr || ad.title,
      image: ad.images?.[0] || "",
      participants: [currentUserId, adOwnerId],
      participantDetails: {
        [currentUserId]: {
          name: currentUserName,
          nameAr: currentUserNameAr,
          image: currentUserAvatar,
          isVerified: currentUserVerified,
        },
        [adOwnerId]: {
          name: adOwnerName,
          nameAr: adOwnerNameAr,
          image: adOwnerAvatar,
          isVerified: adOwnerVerified,
        },
      },
      adId: ad._id,
      adOwnerId: adOwnerId,
    });

    return chatId;
  };

  // Set up presence hook on mount for currentUser
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
      },
      (error) => {
        console.error("Subscription error:", error);
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
        setChatType(chatData.type);

        // Load messages
        const chatMessages = await ChatService.getMessages(urlChatId);
        setMessages(chatMessages);

        // Mark chat as read for current user if needed
        if (session.user?._id && chatData.unreadCount[session.user._id] > 0) {
          await ChatService.markChatAsRead(urlChatId, session.user._id);
        }
      } catch (error) {
        console.error("Error loading chat:", error);
        toast.error(t.chat.failedToLoadChat);
        router.push(localePath("/chat"));
      }
    };

    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlChatId, session.user?._id]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!urlChatId) return;

    const unsubscribe = ChatService.subscribeToMessages(
      urlChatId,
      (newMessages) => {
        setMessages(newMessages);
        // Mark chat as read when new messages arrive
        if (session.user?._id) {
          ChatService.markChatAsRead(urlChatId, session.user._id).catch(
            console.error
          );
        }
      }
    );

    return () => unsubscribe();
  }, [urlChatId, session.user?._id]);

  // Subscribe to typing status
  useEffect(() => {
    if (!urlChatId) return;

    const unsubscribe = ChatService.subscribeToTypingStatus(
      urlChatId,
      (typing) => {
        setTypingStatus(typing);
      }
    );

    return () => unsubscribe();
  }, [urlChatId]);

  // Subscribe to other user's online status (for current chat)
  useEffect(() => {
    if (!currentChatData || !session.user?._id) return;

    const otherParticipantId = currentChatData.participants.find(
      (id) => id !== session.user?._id
    );
    if (!otherParticipantId) return;

    const unsubscribe = ChatService.subscribeToOnlineStatus(
      otherParticipantId,
      (isOnline) => {
        setIsOtherUserOnline(isOnline);
      }
    );

    return () => unsubscribe();
  }, [currentChatData, session.user?._id]);

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
              setOnlineStatus((prev) => ({ ...prev, [participantId]: online }));
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

  // Helper function to format timestamp
  const formatTimestamp = (
    timestamp: Date | { toDate?: () => Date } | string | number | undefined
  ): string => {
    if (!timestamp) return "";

    let date: Date;

    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (
      typeof timestamp === "object" &&
      timestamp !== null &&
      "toDate" in timestamp &&
      typeof timestamp.toDate === "function"
    ) {
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

  // Convert Firebase chats to component format
  const formattedChats: Chat[] = useMemo(() => {
    const userId = session.user?._id;
    if (!userId) return [];

    return chats.map((firebaseChat) => {
      const otherParticipantId = firebaseChat.participants.find(
        (id) => id !== userId
      );
      const otherParticipant = otherParticipantId
        ? firebaseChat.participantDetails[otherParticipantId]
        : null;

      const chatType = firebaseChat.type as ChatType;

      let adDetails: any = undefined;
      if (chatType === "ad" && firebaseChat.adId) {
        adDetails = {
          adId: firebaseChat.adId,
          adTitle: firebaseChat.title,
          adImage: firebaseChat.image,
          adPrice: 0,
        };
      }

      let orgDetails: any = undefined;
      if (chatType === "organisation" && firebaseChat.organisationId) {
        orgDetails = {
          organisationId: firebaseChat.organisationId,
          orgTradeName: firebaseChat.title,
          orgImage: firebaseChat.image,
        };
      }

      if (!otherParticipant) {
        return {
          id: firebaseChat.id,
          name: "Unknown",
          avatar: "",
          lastMessage: firebaseChat.lastMessage.text || "",
          time: formatTimestamp(firebaseChat.lastMessage.createdAt),
          unreadCount: firebaseChat.unreadCount[userId] || 0,
          isVerified: false,
          isOnline: false,
          chatType: chatType,
          ad: adDetails,
          organisation: orgDetails,
        };
      }

      return {
        id: firebaseChat.id,
        name: otherParticipant.name,
        avatar: otherParticipant.image || "",
        lastMessage: firebaseChat.lastMessage.text || "",
        time: formatTimestamp(firebaseChat.lastMessage.createdAt),
        unreadCount: firebaseChat.unreadCount[userId] || 0,
        isVerified: otherParticipant.isVerified,
        isOnline: otherParticipantId
          ? onlineStatus[otherParticipantId] ||
            (firebaseChat.onlineStatus &&
              firebaseChat.onlineStatus[otherParticipantId]) ||
            false
          : false,
        chatType: chatType,
        ad: adDetails,
        organisation: orgDetails,
        amIAdOwner: userId === firebaseChat.adOwnerId,
      };
    });
  }, [chats, session.user?._id, onlineStatus]);

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

    const chatType = currentChatData.type as ChatType;

    let adDetails: any = undefined;
    if (chatType === "ad" && currentChatData.adId) {
      adDetails = {
        adId: currentChatData.adId,
        adTitle: currentChatData.title,
        adImage: currentChatData.image,
        adPrice: 0,
      };
    }

    let orgDetails: any = undefined;
    if (chatType === "organisation" && currentChatData.organisationId) {
      orgDetails = {
        organisationId: currentChatData.organisationId,
        orgTradeName: currentChatData.title,
        orgImage: currentChatData.image,
      };
    }

    return {
      id: currentChatData.id,
      name: otherParticipant.name,
      avatar: otherParticipant.image || "",
      lastMessage: currentChatData.lastMessage.text,
      time: formatTimestamp(currentChatData.lastMessage.createdAt),
      unreadCount: currentChatData.unreadCount[session.user._id] || 0,
      isVerified: otherParticipant.isVerified,
      isOnline:
        isOtherUserOnline ||
        (otherParticipantId &&
          currentChatData.onlineStatus &&
          currentChatData.onlineStatus[otherParticipantId]) ||
        false,
      chatType: chatType,
      ad: adDetails,
      organisation: orgDetails,
    };
  }, [currentChatData, session.user?._id, isOtherUserOnline]);

  // Convert Firebase Messages to component Message format
  const formattedMessages = useMemo(() => {
    return messages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      time: formatTimestamp(msg.createdAt),
      isFromUser: msg.senderId === session.user?._id,
      isRead: msg.isRead,
      type: msg.type || "text",
      fileUrl: msg.fileUrl,
      coordinates: msg.coordinates,
    }));
  }, [messages, session.user?._id]);

  const handleChatTypeChange = (type: ChatType) => {
    setChatType(type);
  };

  const handleChatSelect = (chatId: string) => {
    router.push(`${localePath("/chat")}?chatId=${chatId}&type=${chatType}`);
  };

  const handleBack = () => {
    router.push(localePath("/chat"));
  };

  const handleSendMessage = async (data?: {
    type: "text" | "location" | "file";
    text?: string;
    fileUrl?: string;
    coordinates?: { latitude: number; longitude: number };
  }) => {
    if (!urlChatId || !session.user?._id) return;

    // Default to text message from state if no data provided
    const msgText = data?.text ?? message.trim();
    const msgType = data?.type ?? "text";

    if (msgType === "text" && !msgText) return;

    try {
      await ChatService.sendMessage({
        chatId: urlChatId,
        senderId: session.user._id,
        text: msgText,
        type: msgType,
        fileUrl: data?.fileUrl,
        coordinates: data?.coordinates,
      });

      if (msgType === "text") {
        setMessage("");
      }

      await ChatService.setTypingStatus(urlChatId, session.user._id, false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t.chat.failedToSendMessage);
    }
  };

  const handleMessageChange = async (value: string) => {
    setMessage(value);
    if (session.user?._id && urlChatId) {
      await ChatService.setTypingStatus(
        urlChatId,
        session.user._id,
        !!value.trim(),
      );
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

  const handleEditMessage = async (messageId: string, newText: string) => {
    if (!urlChatId) return;
    try {
      await ChatService.editMessage(urlChatId, messageId, newText);
      toast.success(t.chat?.messageEdited || "Message edited");
    } catch (error) {
      console.error("Error editing message:", error);
      toast.error(t.chat?.failedToEditMessage || "Failed to edit message");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!urlChatId) return;
    try {
      await ChatService.deleteMessage(urlChatId, messageId);
      toast.success(t.chat?.messageDeleted || "Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(t.chat?.failedToDeleteMessage || "Failed to delete message");
    }
  };

  const handleDeleteChat = async () => {
    if (!urlChatId) return;
    try {
      await ChatService.deleteChat(urlChatId);
      toast.success(t.chat?.chatDeleted || "Chat deleted");
      router.push(localePath("/chat"));
    } catch (error) {
      console.error("Error deleting chat:", error);
      toast.error(t.chat?.failedToDeleteChat || "Failed to delete chat");
    }
  };

  return {
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
    handleEditMessage,
    handleDeleteMessage,
    handleDeleteChat,
    router,
    localePath,
    t,
    findOrCreateAdChat,
  };
}
