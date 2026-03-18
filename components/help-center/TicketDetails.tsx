"use client";

import { useEffect, useState } from "react";
import { useTicket } from "@/hooks/useTickets";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { Button } from "@/components/ui/button";
import { MessagesList } from "@/app/[locale]/(root)/help-centre/_components/MessagesList";
import { MessageInput } from "@/app/[locale]/(root)/help-centre/_components/MessageInput";
import { useAuthStore } from "@/stores/authStore";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import { ChatService } from "@/lib/firebase/chat.service";
import { Message } from "@/lib/firebase/types";

interface TicketDetailsProps {
  ticketId: string;
}

export function TicketDetails({ ticketId }: TicketDetailsProps) {
  const { ticket, isLoading, resolve, close, reopen } = useTicket(ticketId);
  const session = useAuthStore((state) => state.session);
  const userId = session?.user?._id;
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);

  // Initialize Chat ID and Presence
  useEffect(() => {
    if (!ticketId || !userId) return;

    let activeChatId: string | null = null;

    const initChat = async () => {
      try {
        const id = await ChatService.createChat({
          type: "ticket",
          title: ticket?.subject || "Ticket Chat",
          titleAr: ticket?.subject || "Ticket Chat",
          image: "",
          participants: [userId, "support_team"],
          participantDetails: {
            [userId]: {
              name: session?.user?.firstName || "User",
              nameAr: session?.user?.firstName || "User",
              image: session?.user?.image || "",
              isVerified: !!session?.user?.emailVerified,
            },
            "support_team": {
              name: "Support Team",
              nameAr: "فريق الدعم",
              image: "/images/support-avatar.png",
              isVerified: true,
            }
          },
          context: {
            ticketId: ticketId,
            initiatorId: userId,
          }
        });
        
        setChatId(id);
        activeChatId = id;

        // Initial visit: mark as read and set online
        await ChatService.visitChat(id, userId);
      } catch (err) {
        console.error("Failed to init ticket chat:", err);
      }
    };

    initChat();

    const handleBeforeUnload = () => {
      if (activeChatId) {
        ChatService.setChatOnlineStatus(activeChatId, userId, false).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (activeChatId) {
        ChatService.setChatOnlineStatus(activeChatId, userId, false).catch(console.error);
      }
    };
  }, [ticketId, userId, ticket?.subject]);

  // Subscribe to Messages via ChatService
  useEffect(() => {
    if (!chatId || !userId) return;

    const unsubscribe = ChatService.subscribeToMessages(chatId, (newMessages: Message[]) => {
      // Map to UI format required by MessagesList
      const uiMessages = newMessages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        time: msg.createdAt
          ? new Date(
              (msg.createdAt as any).toDate ? (msg.createdAt as any).toDate() : msg.createdAt,
            ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "",
        isFromUser: msg.senderId === userId,
        isRead: msg.isRead,
      }));

      setMessages(uiMessages);
    });

    return () => unsubscribe();
  }, [chatId, userId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !chatId || !userId) return;

    try {
      await ChatService.sendMessage({
        chatId,
        senderId: userId,
        text: inputText,
        type: "text",
      });
      setInputText("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  if (isLoading)
    return (
      <div className="p-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  if (!ticket)
    return (
      <div className="p-8 text-center text-gray-500">Ticket not found</div>
    );

  const handleResolve = async () => {
    if (!userId) return;
    await resolve(userId);
    toast.success("Ticket resolved");
  };

  const handleClose = async () => {
    if (!userId) return;
    await close(userId);
    toast.success("Ticket closed");
  };

  const handleReopen = async () => {
    if (!userId) return;
    await reopen(userId);
    toast.success("Ticket reopened");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)] bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold flex items-center gap-2 flex-wrap text-gray-900 dark:text-gray-100">
              <span className="truncate">
                #{ticket.id.slice(0, 8)} - {ticket.subject}
              </span>
              <TicketStatusBadge status={ticket.status} />
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Created on {formatDate(ticket.createdAt as any)} &bull;{" "}
              <span className="capitalize">
                {ticket.queryType.replace("_", " ")}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {ticket.status !== "resolved" && ticket.status !== "closed" && (
            <Button
              icon={<CheckCircle className="h-4 w-4 -mr-2" />}
              iconPosition="center"
              size="sm"
              variant="successOutlined"
              onClick={handleResolve}
            >
              Resolve
            </Button>
          )}
          {(ticket.status === "resolved" || ticket.status === "closed") && (
            <Button
              icon={<RotateCcw className="h-4 w-4 -mr-2" />}
              iconPosition="center"
              size="sm"
              variant="warningOutlined"
              onClick={handleReopen}
            >
              Reopen
            </Button>
          )}
          {ticket.status !== "closed" && (
            <Button
              icon={<XCircle className="h-4 w-4 -mr-2" />}
              iconPosition="center"
              size="sm"
              variant="dangerOutlined"
              onClick={handleClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Ticket Info & Chat */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-950 relative">
          <div className="flex-1 overflow-y-auto">
            {/* Initial Description Block */}
            <div className="p-4 mx-4 mt-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-purple-100 dark:border-purple-900/50 mb-4">
              <h3 className="text-xs uppercase font-semibold text-gray-400 dark:text-gray-500 mb-2">
                Original Request
              </h3>
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                {ticket.message}
              </p>
            </div>

            <MessagesList
              messages={messages}
              dateHeaderText="Ticket Conversation"
            />
          </div>

          {/* Input Area */}
          <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
            {ticket.status === "closed" ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-6 bg-gray-50 dark:bg-gray-950/50">
                This ticket is closed. Reopen to send messages.
              </div>
            ) : (
              <MessageInput
                value={inputText}
                onChange={setInputText}
                onSend={handleSendMessage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
