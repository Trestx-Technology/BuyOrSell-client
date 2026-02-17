import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
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
  const [typingStatus, setTypingStatus] = useState<{
    [userId: string]: boolean;
  }>({});
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const { mutate: sendNotification } = useSendNotification();

  const urlChatType = searchParams.get("type") as ChatType | null;
  const urlChatId = searchParams.get("chatId");

  useEffect(() => {
    if (urlChatType && ["ad", "dm", "organisation"].includes(urlChatType)) {
      setChatType(urlChatType);
    }
  }, [urlChatType]);

  // Presence & Visit Update
  useEffect(() => {
    const userId = session.user?._id;
    if (!userId || !urlChatId) return;

    // Run this async without blocking or triggering immediate deep re-renders if possible
    ChatService.visitChat(urlChatId, userId).catch(console.error);

    const handleBeforeUnload = () => {
      ChatService.setChatOnlineStatus(urlChatId, userId, false).catch(() => {});
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      ChatService.setChatOnlineStatus(urlChatId, userId, false).catch(
        console.error,
      );
    };
  }, [session.user?._id, urlChatId]);

  // Subscribe to user chats
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

  // Manage Current Chat Data & Messages
  useEffect(() => {
    if (!urlChatId || urlChatId === "undefined") {
      setCurrentChatData(null);
      setMessages([]);
      return;
    }

    const found = chats.find((c) => c.id === urlChatId);
    if (found) {
      setCurrentChatData(found);
    } else {
      ChatService.getChat(urlChatId)
        .then((data) => {
          if (data) setCurrentChatData(data);
        })
        .catch(console.error);
    }

    const unsubMsg = ChatService.subscribeToMessages(urlChatId, setMessages);
    const unsubTyping = ChatService.subscribeToTypingStatus(
      urlChatId,
      setTypingStatus,
    );

    return () => {
      unsubMsg();
      unsubTyping();
    };
  }, [urlChatId, chats]);

  // Derive Other User Online Status
  useEffect(() => {
    const userId = session.user?._id;
    if (!currentChatData || !userId) {
      setIsOtherUserOnline(false);
      return;
    }
    const otherId = currentChatData.participants?.find(
      (id) => String(id) !== String(userId),
    );
    setIsOtherUserOnline(
      !!(otherId && currentChatData.onlineStatus?.[otherId]),
    );
  }, [currentChatData, session.user?._id]);

  const formatTimestamp = (timestamp: any): string => {
    if (!timestamp) return "";
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    if (isNaN(date.getTime())) return "";
    const hours = (new Date().getTime() - date.getTime()) / 3600000;
    if (hours < 24)
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    if (hours < 168)
      return date.toLocaleDateString("en-US", { weekday: "short" });
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  };

  const formatLastSeen = (timestamp: any): string => {
    if (!timestamp) return "Recently";
    const date = timestamp?.toDate
      ? timestamp.toDate()
      : timestamp?.seconds
        ? new Date(timestamp.seconds * 1000)
        : new Date(timestamp);
    return isNaN(date.getTime())
      ? "Recently"
      : formatDistanceToNow(date, { addSuffix: true });
  };

  const formattedChats: Chat[] = useMemo(() => {
    const userId = session.user?._id;
    if (!userId) return [];

    return chats.map((firebaseChat) => {
      const otherId = firebaseChat.participants?.find((id) => id !== userId);
      const other = otherId ? firebaseChat.participantDetails?.[otherId] : null;
      const type = firebaseChat.type as ChatType;
      const showOrg =
        type === "organisation" && userId !== firebaseChat.initiatorId;

      return {
        id: firebaseChat.id,
        name: showOrg
          ? firebaseChat.title || other?.name || "Unknown"
          : other?.name || "Unknown",
        avatar: showOrg
          ? firebaseChat.image || other?.image || ""
          : other?.image || "",
        lastMessage: firebaseChat.lastMessage?.text || "",
        time: formatTimestamp(firebaseChat.lastMessage?.createdAt),
        unreadCount: firebaseChat.unreadCount?.[userId] || 0,
        isVerified: showOrg ? false : !!other?.isVerified,
        isOnline: !!(otherId && firebaseChat.onlineStatus?.[otherId]),
        chatType: type,
        ad:
          type === "ad"
            ? {
                adId: firebaseChat.adId!,
                adTitle: firebaseChat.title!,
                adImage: firebaseChat.image!,
                adPrice: 0,
              }
            : undefined,
        organisation:
          type === "organisation"
            ? {
                organisationId: firebaseChat.organisationId!,
                orgTradeName: firebaseChat.title!,
                orgImage: firebaseChat.image!,
              }
            : undefined,
        amIAdOwner: userId === firebaseChat.adOwnerId,
        initiatorId: firebaseChat.initiatorId,
        lastSeen: formatLastSeen(firebaseChat.lastSeen?.[otherId || ""]),
      };
    });
  }, [chats, session.user?._id]);

  const currentChat = useMemo(() => {
    const userId = session.user?._id;
    if (!currentChatData || !userId) return undefined;
    const otherId = currentChatData.participants?.find((id) => id !== userId);
    const other = otherId
      ? currentChatData.participantDetails?.[otherId]
      : null;
    const type = currentChatData.type as ChatType;
    const showOrg =
      type === "organisation" && userId !== currentChatData.initiatorId;

    return {
      id: currentChatData.id,
      name: showOrg
        ? currentChatData.title || other?.name || "Unknown"
        : other?.name || "Unknown",
      avatar: showOrg
        ? currentChatData.image || other?.image || ""
        : other?.image || "",
      lastMessage: currentChatData.lastMessage?.text || "",
      time: formatTimestamp(currentChatData.lastMessage?.createdAt),
      unreadCount: currentChatData.unreadCount?.[userId] || 0,
      isVerified: showOrg ? false : !!other?.isVerified,
      isOnline: isOtherUserOnline,
      chatType: type,
      ad:
        type === "ad"
          ? {
              adId: currentChatData.adId!,
              adTitle: currentChatData.title!,
              adImage: currentChatData.image!,
              adPrice: 0,
            }
          : undefined,
      organisation:
        type === "organisation"
          ? {
              organisationId: currentChatData.organisationId!,
              orgTradeName: currentChatData.title!,
              orgImage: currentChatData.image!,
            }
          : undefined,
      initiatorId: currentChatData.initiatorId,
      lastSeen: formatLastSeen(currentChatData.lastSeen?.[otherId || ""]),
    };
  }, [currentChatData, session.user?._id, isOtherUserOnline]);

  const formattedMessages = useMemo(
    () =>
      messages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        time: formatTimestamp(msg.createdAt || msg.timeStamp),
        createdAt: msg.createdAt || msg.timeStamp,
        isFromUser: msg.senderId === session.user?._id,
        isRead: msg.isRead,
        type: msg.type || "text",
        fileUrl: msg.fileUrl,
        coordinates: msg.coordinates,
      })),
    [messages, session.user?._id],
  );

  const handleSendMessage = async (data?: any) => {
    if (!currentChatData?.id || !session.user?._id) return;
    const text = data?.text ?? message.trim();
    const type = data?.type ?? "text";
    if (type === "text" && !text) return;

    try {
      await ChatService.sendMessage({
        chatId: currentChatData.id,
        senderId: session.user._id,
        text,
        type,
        ...data,
      });
      if (type === "text") setMessage("");
      ChatService.setTypingStatus(currentChatData.id, session.user._id, false);

      if (!isOtherUserOnline) {
        const otherId = currentChatData.participants?.find(
          (id) => id !== session.user?._id,
        );
        const otherUser = otherId ? await ChatService.getUser(otherId) : null;
        const token = otherUser?.fcmToken || otherUser?.deviceToken;
        if (token)
          sendNotification({
            token,
            type: "message",
            title: `${session.user.firstName} ${session.user.lastName}`.trim(),
            message: type === "text" ? text : `Sent a ${type}`,
          });
      }
    } catch {
      toast.error(t.chat.failedToSendMessage);
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
    handleChatTypeChange: setChatType,
    handleChatSelect: (id: string, type?: ChatType) => {
      const sel = chats.find((c) => c.id === id);
      router.push(
        `${localePath("/chat")}?chatId=${id}&type=${type || sel?.type || chatType}`,
      );
    },
    handleBack: () => router.push(localePath("/chat")),
    handleSendMessage,
    handleMessageChange: (val: string) => {
      setMessage(val);
      if (session.user?._id && currentChatData)
        ChatService.setTypingStatus(
          currentChatData.id,
          session.user._id,
          !!val.trim(),
        );
    },
    handleAIMessageGenerated: setMessage,
    handleBackToSidebar: () => router.push(localePath("/chat")),
    handleSearch: () => {},
    handleCall: () => {},
    handleMoreOptions: () => {},
    handleEditMessage: (id: string, t: string) =>
      currentChatData && ChatService.editMessage(currentChatData.id, id, t),
    handleDeleteMessage: (id: string) =>
      currentChatData && ChatService.deleteMessage(currentChatData.id, id),
    handleDeleteChat: () =>
      currentChatData &&
      ChatService.deleteChat(currentChatData.id).then(() =>
        router.push(localePath("/chat")),
      ),
    router,
    localePath,
    t,
    findOrCreateAdChat: async (ad: AD) => {
      const id = await ChatService.createChat({
        type: "ad",
        title: ad.title,
        titleAr: ad.titleAr || ad.title,
        image: ad.images?.[0] || "",
        participants: [
          session.user!._id,
          typeof ad.owner === "string" ? ad.owner : ad.owner._id,
        ],
        participantDetails: {
          [session.user!._id]: {
            name: session.user!.firstName,
            image: session.user!.image || "",
            isVerified: !!session.user!.emailVerified,
          },
        },
        adId: ad._id,
        adOwnerId: typeof ad.owner === "string" ? ad.owner : ad.owner._id,
        initiatorId: session.user!._id,
      });
      return id;
    },
  };
}
