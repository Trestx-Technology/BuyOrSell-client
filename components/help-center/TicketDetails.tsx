"use client";

import { useEffect, useState } from "react";
import { useTicket } from "@/hooks/useTickets";
import { ChatService } from "@/lib/firebase/chat.service";
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

interface TicketDetailsProps {
  ticketId: string;
}

export function TicketDetails({ ticketId }: TicketDetailsProps) {
  const { ticket, isLoading, resolve, close, reopen } = useTicket(ticketId);
  const session = useAuthStore((state) => state.session);
  const userId = session?.user?._id
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    if (!ticket?.chatId || !userId) return;

    // Subscribe to messages
    const unsubscribe = ChatService.subscribeToMessages(ticket.chatId, (newMessages) => {
      // Map to UI format required by MessagesList
      const uiMessages = newMessages.map(msg => ({
        id: msg.id,
        text: msg.text,
        time: msg.createdAt ? new Date((msg.createdAt as any).toDate ? (msg.createdAt as any).toDate() : msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        isFromUser: msg.senderId === userId,
        isRead: msg.isRead
      }));
      // Note: ChatService returns chronological (oldest -> newest) as confirmed in logic review

      setMessages(uiMessages);
    });

    return () => unsubscribe();
  }, [ticket?.chatId, userId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !ticket?.chatId || !userId) return;

    try {
      await ChatService.sendMessage({
        chatId: ticket.chatId,
        senderId: userId,
        text: inputText,
        type: "text"
      });
      setInputText("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message");
    }
  };

  if (isLoading) return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  if (!ticket) return <div className="p-8 text-center text-gray-500">Ticket not found</div>;

  const handleResolve = async () => {
    if (!userId) return;
    await resolve(userId);
    toast.success("Ticket resolved");
  }

  const handleClose = async () => {
    if (!userId) return;
    await close(userId);
    toast.success("Ticket closed");
  }

  const handleReopen = async () => {
    if (!userId) return;
    await reopen(userId);
    toast.success("Ticket reopened");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] lg:h-[calc(100vh-120px)] bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b bg-white gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold flex items-center gap-2 flex-wrap">
              <span className="truncate">#{ticket.id.slice(0, 8)} - {ticket.subject}</span>
              <TicketStatusBadge status={ticket.status} />
            </h1>
            <p className="text-xs text-gray-500">Created on {formatDate(ticket.createdAt as any)} &bull; <span className="capitalize">{ticket.queryType.replace('_', ' ')}</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
            <Button
              icon={<CheckCircle className="h-4 w-4 -mr-2" />}
              iconPosition="center"
              size="sm" variant="successOutlined" onClick={handleResolve}>
              Resolve
            </Button>
          )}
          {(ticket.status === 'resolved' || ticket.status === 'closed') && (
            <Button
              icon={<RotateCcw className="h-4 w-4 -mr-2" />}
              iconPosition="center"
              size="sm" variant="warningOutlined" onClick={handleReopen}>
              Reopen
            </Button>
          )}
          {ticket.status !== 'closed' && (
            <Button
              icon={<XCircle className="h-4 w-4 -mr-2" />}
              iconPosition="center"

              size="sm" variant="dangerOutlined" onClick={handleClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Ticket Info & Chat */}
        <div className="flex-1 flex flex-col bg-gray-50 relative">

          <div className="flex-1 overflow-y-auto">
            {/* Initial Description Block */}
            <div className="p-4 mx-4 mt-4 bg-white rounded-lg shadow-sm border border-purple-100 mb-4">
              <h3 className="text-xs uppercase font-semibold text-gray-400 mb-2">Original Request</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{ticket.message}</p>
            </div>

            <MessagesList
              messages={messages}
              dateHeaderText="Ticket Conversation"
            />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t">
            {ticket.status === 'closed' ? (
              <div className="text-center text-gray-500 py-6 bg-gray-50">
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
