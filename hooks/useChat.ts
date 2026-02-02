import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatService } from "@/lib/firebase/chat.service";
import { Chat as FirebaseChat, Message } from "@/lib/firebase/types";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { useLocale } from "@/hooks/useLocale";
import type { ChatType } from "@/app/[locale]/(root)/chat/_components/ChatTypeSelector";
import type { Chat } from "@/app/[locale]/(root)/chat/_components/ChatSidebar";
import { AD } from "@/interfaces/ad";
import { useSendNotification } from "@/hooks/useNotifications";

export function useChat() {
  const { t, localePath } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { session, isAuthenticated } = useAuthStore((state) => state);

  const [chats, setChats] = useState<FirebaseChat[]>([]);
  const [currentChatData, setCurrentChatData] = useState<FirebaseChat | null>(
    null,
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
  const { mutate: sendNotification } = useSendNotification();

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

    // Create new chat (deterministic ID handled in ChatService)
    const adOwner = typeof ad.owner === "string" ? null : ad.owner;
    const adOwnerName = adOwner
      ? `${adOwner.firstName} ${adOwner.lastName}`.trim() ||
        adOwner.name ||
        "Seller"
      : "Seller";
    const adOwnerNameAr = adOwnerName;
    const adOwnerAvatar = adOwner?.image || "";
    const adOwnerVerified = adOwner?.emailVerified || false;

    const currentUserName =
      `${session.user.firstName} ${session.user.lastName}`.trim();
    const currentUserNameAr = currentUserName;
    const currentUserAvatar = session.user.image || "";
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

  // Set up presence for currentUser in the current chat
  useEffect(() => {
    const userId = session.user?._id;
    const chatId = currentChatData?.id;

    if (!userId || !chatId) return;

    let isSubscribed = true;

    // Set user online when component mounts/chat changes
    const setOnline = async () => {
      try {
        console.log(
          `[Presence] Setting ONLINE: User(${userId}) Chat(${chatId})`,
        );
        await ChatService.visitChat(chatId, userId);
      } catch (err) {
        if (isSubscribed) console.error("Presence error (mount):", err);
      }
    };

    setOnline();

    const handleBeforeUnload = () => {
      ChatService.setChatOnlineStatus(chatId, userId, false).catch(() => {});
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      isSubscribed = false;
      window.removeEventListener("beforeunload", handleBeforeUnload);

      // Only mark offline if we are actually leaving this chat ID or unmounting
      console.log(
        `[Presence] Cleanup (OFFLINE): User(${userId}) Chat(${chatId})`,
      );
      ChatService.setChatOnlineStatus(chatId, userId, false).catch((err) =>
        console.error("Presence cleanup error:", err),
      );
    };
  }, [session.user?._id, currentChatData?.id]);

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
      },
    );

    return () => unsubscribe();
  }, [isAuthenticated, session.user?._id, chatType]);

  // Load current chat data when chatId is in URL
  useEffect(() => {
    if (!urlChatId || urlChatId === "undefined" || !session.user?._id) {
      setCurrentChatData(null);
      setMessages([]);
      setMessage("");
      return;
    }

    // First, try to find the chat in our already loaded 'chats' array
    const existingChat = chats.find((c) => c.id === urlChatId);
    if (existingChat) {
      if (currentChatData?.id !== existingChat.id) {
        setCurrentChatData(existingChat);
        // Load messages for this chat
        ChatService.getMessages(existingChat.id)
          .then(setMessages)
          .catch(console.error);

        // Mark as read and set online using the resolved ID
        if (session.user?._id) {
          ChatService.visitChat(existingChat.id, session.user._id).catch(
            console.error,
          );
        }
      }
      return;
    }

    const loadChat = async () => {
      try {
        // Try to get chat by ID
        let chatData = await ChatService.getChat(urlChatId);

        // Transition logic: If not found and it looks like an adId/orgId (hex ID without underscores)
        // search for a chat document that references this ad/org.
        if (!chatData && !urlChatId.includes("_")) {
          const chatByAdOrOrg = chats.find(
            (c) => c.adId === urlChatId || c.organisationId === urlChatId,
          );
          if (chatByAdOrOrg) {
            router.replace(
              `${localePath("/chat")}?chatId=${chatByAdOrOrg.id}&type=${
                chatByAdOrOrg.type
              }`,
            );
            return;
          }
        }

        if (!chatData) {
          toast.error(t.chat.chatNotFound);
          router.push(localePath("/chat"));
          return;
        }

        if (currentChatData?.id !== chatData.id) {
          setCurrentChatData(chatData);
          setChatType(chatData.type);

          // Load messages using the actual chat ID from the doc
          const chatMessages = await ChatService.getMessages(chatData.id);
          setMessages(chatMessages);

          // Mark chat as read and set online for current user using the actual ID
          if (session.user?._id) {
            await ChatService.visitChat(chatData.id, session.user._id);
          }
        }
      } catch (error) {
        console.error("Error loading chat:", error);
        toast.error(t.chat.failedToLoadChat);
        router.push(localePath("/chat"));
      }
    };

    loadChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlChatId, session.user?._id, chats.length]);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!currentChatData?.id) return;

    const unsubscribe = ChatService.subscribeToMessages(
      currentChatData.id,
      (newMessages) => {
        setMessages(newMessages);
        // Mark chat as read and set online when new messages arrive
        if (session.user?._id) {
          ChatService.visitChat(currentChatData.id, session.user._id).catch(
            console.error,
          );
        }
      },
    );

    return () => unsubscribe();
  }, [currentChatData?.id, session.user?._id]);

  // Subscribe to typing status
  useEffect(() => {
    if (!currentChatData?.id) return;

    const unsubscribe = ChatService.subscribeToTypingStatus(
      currentChatData.id,
      (typing) => {
        setTypingStatus(typing);
      },
    );

    return () => unsubscribe();
  }, [currentChatData?.id]);

  // Subscribe to other user's online status (for current chat)
  useEffect(() => {
    const participants = currentChatData?.participants;
    const userId = session.user?._id;

    if (!participants || !userId) {
      setIsOtherUserOnline(false);
      return;
    }

    const otherParticipantId = participants.find(
      (id) => String(id) !== String(userId),
    );

    if (!otherParticipantId) {
      setIsOtherUserOnline(false);
      return;
    }

    const otherStatus =
      currentChatData.onlineStatus?.[otherParticipantId] || false;

    console.log(
      `[StatusDetect] Me: ${userId}, Other: ${otherParticipantId}, online: ${otherStatus}`,
    );

    setIsOtherUserOnline(otherStatus);
  }, [
    currentChatData?.onlineStatus,
    currentChatData?.participants,
    session.user?._id,
  ]);

  // Subscribe to online status for all participants (from chat documents)
  useEffect(() => {
    if (chats.length === 0) return;

    // Online status is now part of the chat document, so we don't need separate subscriptions
    // for each participant. It's already updated in the 'chats' state when the chat doc changes.
    const userId = session.user?._id;
    if (!userId) return;

    const newOnlineStatus: { [key: string]: boolean } = {};
    chats.forEach((chat) => {
      chat.participants?.forEach((participantId) => {
        if (participantId !== userId && chat.onlineStatus) {
          newOnlineStatus[participantId] =
            chat.onlineStatus[participantId] || false;
        }
      });
    });
    setOnlineStatus(newOnlineStatus);
  }, [chats, session.user?._id]);

  // Helper function to format timestamp
  const formatTimestamp = (
    timestamp: Date | { toDate?: () => Date } | string | number | undefined,
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
      const otherParticipantId = firebaseChat.participants?.find(
        (id) => id !== userId,
      );
      const otherParticipant =
        otherParticipantId && firebaseChat.participantDetails
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
          name: firebaseChat.title || "Unknown",
          avatar: firebaseChat.image || "",
          lastMessage: firebaseChat.lastMessage?.text || "",
          time: formatTimestamp(firebaseChat.lastMessage?.createdAt),
          unreadCount: firebaseChat.unreadCount?.[userId] || 0,
          isVerified: false,
          isOnline: false,
          chatType: chatType,
          ad: adDetails,
          organisation: orgDetails,
          initiatorId: firebaseChat.initiatorId,
        };
      }

      const showOrgDetails =
        chatType === "organisation" && userId !== firebaseChat.initiatorId;

      return {
        id: firebaseChat.id,
        name: showOrgDetails
          ? firebaseChat.title || otherParticipant.name
          : otherParticipant.name,
        avatar: showOrgDetails
          ? firebaseChat.image || otherParticipant.image || ""
          : otherParticipant.image || "",
        lastMessage: firebaseChat.lastMessage?.text || "",
        time: formatTimestamp(firebaseChat.lastMessage?.createdAt),
        unreadCount: firebaseChat.unreadCount?.[userId] || 0,
        isVerified: showOrgDetails ? false : otherParticipant.isVerified,
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
        initiatorId: firebaseChat.initiatorId,
      };
    });
  }, [chats, session.user?._id, onlineStatus]);

  // Convert Firebase Chat to component Chat format (for current chat)
  const currentChat = useMemo(() => {
    if (!currentChatData?.participants || !session.user?._id) return undefined;

    const userId = session.user._id;
    const otherParticipantId = currentChatData.participants.find(
      (id) => id !== userId,
    );
    const otherParticipant =
      otherParticipantId && currentChatData.participantDetails
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

    const showOrgDetails =
      chatType === "organisation" && userId !== currentChatData.initiatorId;

    return {
      id: currentChatData.id,
      name: showOrgDetails
        ? currentChatData.title || otherParticipant.name
        : otherParticipant.name,
      avatar: showOrgDetails
        ? currentChatData.image || otherParticipant.image || ""
        : otherParticipant.image || "",
      lastMessage: currentChatData.lastMessage?.text || "",
      time: formatTimestamp(currentChatData.lastMessage?.createdAt),
      unreadCount: currentChatData.unreadCount?.[session.user._id] || 0,
      isVerified: showOrgDetails ? false : otherParticipant.isVerified,
      isOnline:
        isOtherUserOnline ||
        (otherParticipantId &&
          currentChatData.onlineStatus &&
          currentChatData.onlineStatus[otherParticipantId]) ||
        false,
      chatType: chatType,
      ad: adDetails,
      organisation: orgDetails,
      initiatorId: currentChatData.initiatorId,
    };
  }, [currentChatData, session.user?._id, isOtherUserOnline]);

  // Convert Firebase Messages to component Message format
  const formattedMessages = useMemo(() => {
    return messages.map((msg) => ({
      id: msg.id,
      text: msg.text,
      time: formatTimestamp(msg.createdAt || msg.timeStamp),
      isFromUser: msg.senderId === session.user?._id,
      isRead: msg.isRead,
      type: msg.type || "text",
      fileUrl: msg.fileUrl,
      coordinates: msg.coordinates,
    }));
  }, [messages, session.user?._id]);

  const dateHeaderText = useMemo(() => {
    if (formattedMessages.length === 0) return "Today";
    return formattedMessages[0].time
      ? `Today ${formattedMessages[0].time}`
      : "Today";
  }, [formattedMessages]);

  const handleChatTypeChange = (type: ChatType) => {
    setChatType(type);
  };

  const handleChatSelect = (chatId: string, type?: ChatType) => {
    const selectedChat = chats.find((c) => c.id === chatId);
    const finalType = type || selectedChat?.type || chatType;
    router.push(`${localePath("/chat")}?chatId=${chatId}&type=${finalType}`);
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
    if (!currentChatData?.id || !session.user?._id) return;

    // Default to text message from state if no data provided
    const msgText = data?.text ?? message.trim();
    const msgType = data?.type ?? "text";

    if (msgType === "text" && !msgText) return;

    try {
      await ChatService.sendMessage({
        chatId: currentChatData.id,
        senderId: session.user._id,
        text: msgText,
        type: msgType,
        fileUrl: data?.fileUrl,
        coordinates: data?.coordinates,
      });

      if (msgType === "text") {
        setMessage("");
      }

      await ChatService.setTypingStatus(
        currentChatData.id,
        session.user._id,
        false,
      );

      // Send push notification if other user is offline
      if (!isOtherUserOnline && currentChatData.participants) {
        const otherUserId = currentChatData.participants.find(
          (id) => id !== session.user?._id,
        );

        if (otherUserId) {
          try {
            // Get other user's token
            const otherUser = await ChatService.getUser(otherUserId);

            // Assuming the token is stored as 'fcmToken' or 'deviceToken'
            const token = otherUser?.fcmToken || otherUser?.deviceToken;

            if (token) {
              const senderName =
                `${session.user.firstName} ${session.user.lastName}`.trim();

              sendNotification({
                token,
                type: "message",
                title: senderName || "New Message",
                message: msgType === "text" ? msgText : `Sent a ${msgType}`,
              });
            }
          } catch (error) {
            console.error("Failed to send notification:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t.chat.failedToSendMessage);
    }
  };

  const handleMessageChange = async (value: string) => {
    setMessage(value);
    if (session.user?._id && currentChatData?.id) {
      await ChatService.setTypingStatus(
        currentChatData.id,
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
    if (!currentChatData?.id) return;
    try {
      await ChatService.editMessage(currentChatData.id, messageId, newText);
      toast.success(t.chat?.messageEdited || "Message edited");
    } catch (error) {
      console.error("Error editing message:", error);
      toast.error(t.chat?.failedToEditMessage || "Failed to edit message");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentChatData?.id) return;
    try {
      await ChatService.deleteMessage(currentChatData.id, messageId);
      toast.success(t.chat?.messageDeleted || "Message deleted");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error(t.chat?.failedToDeleteMessage || "Failed to delete message");
    }
  };

  const handleDeleteChat = async () => {
    if (!currentChatData?.id) return;
    try {
      await ChatService.deleteChat(currentChatData.id);
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
    dateHeaderText,
  };
}
