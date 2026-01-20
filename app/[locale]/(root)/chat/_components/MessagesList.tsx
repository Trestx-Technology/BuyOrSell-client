"use client";

import { useEffect, useRef, useState } from "react";
import { Typography } from "@/components/typography";
import Image from "next/image";
import { MapPin, MoreVertical, Edit2, Trash2 } from "lucide-react";
import LocationMessage from "./LocationMessage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  time: string;
  isFromUser: boolean;
  isRead: boolean;
  type?: "text" | "location" | "file";
  fileUrl?: string;
  coordinates?: { latitude: number; longitude: number };
}

interface MessagesListProps {
  messages: Message[];
  showDateHeader?: boolean;
  dateHeaderText?: string;
  isTyping?: boolean;
  onEditMessage?: (messageId: string, newText: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

export function MessagesList({
  messages,
  showDateHeader = true,
  dateHeaderText = "Today 2:04 pm",
  isTyping = false,
  onEditMessage,
  onDeleteMessage,
}: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleEditClick = (msg: Message) => {
    setEditingMessage(msg);
    setEditedText(msg.text);
  };

  const confirmEdit = () => {
    if (editingMessage && onEditMessage) {
      onEditMessage(editingMessage.id, editedText);
      setEditingMessage(null);
    }
  };

  const confirmDelete = () => {
    if (deletingMessageId && onDeleteMessage) {
      onDeleteMessage(deletingMessageId);
      setDeletingMessageId(null);
    }
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.type === "file" && msg.fileUrl) {
      return (
        <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-lg overflow-hidden my-2">
          <Image
            src={msg.fileUrl}
            alt="Shared image"
            fill
            className="object-cover"
          />
        </div>
      );
    }

    if (msg.type === "location" && msg.coordinates) {
      return (
        <LocationMessage
          latitude={msg.coordinates.latitude}
          longitude={msg.coordinates.longitude}
          placeName="Shared Location" // Can be enhanced if we store address in message
          timestamp=""
        />
      );
    }

    return (
      <Typography
        variant="body-small"
        className={
          "text-gray-900 text-ellipsis break-words whitespace-pre-wrap"
        }
      >
        {msg.text}
      </Typography>
    );
  };

  return (
    <>
      <div className="h-full overflow-y-auto p-4 space-y-4">
        {showDateHeader && (
          <div className="text-center">
            <Typography variant="body-small" className="text-gray-500">
              {dateHeaderText}
            </Typography>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isFromUser ? "justify-end" : "justify-start"} group relative`}
          >
            {/* Options Menu for User's Messages */}
            {msg.isFromUser && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center mr-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {msg.type === "text" && (
                      <DropdownMenuItem onClick={() => handleEditClick(msg)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => setDeletingMessageId(msg.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.isFromUser
                ? "bg-purple-100 rounded-br-md"
                : "bg-gray-100 rounded-bl-md"
                } ${msg.type === "file" ? "p-1" : ""}`}
            >
              {renderMessageContent(msg)}
              <div className="flex items-center justify-end gap-1 mt-1">
                <Typography
                  variant="caption"
                  className={`${msg.isFromUser ? "text-gray-900" : "text-gray-500"
                    }`}
                >
                  {msg.time}
                </Typography>
                {msg.isFromUser && (
                  <div
                    className={`w-3 h-3 ${msg.isRead ? "text-gray-900" : "text-gray-400"
                      }`}
                  >
                    <svg viewBox="0 0 14 14" fill="currentColor">
                      <path d="M1.76 3.51l10.19 7.58L1.76 3.51z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-gray-100 rounded-bl-md">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <Typography variant="caption" className="text-gray-500 ml-2">
                  typing...
                </Typography>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Message Dialog */}
      <Dialog open={!!editingMessage} onOpenChange={(open) => !open && setEditingMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              placeholder="Edit your message..."
              onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMessage(null)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingMessageId} onOpenChange={(open) => !open && setDeletingMessageId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingMessageId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
