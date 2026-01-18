"use client";

import { useEffect, useRef } from "react";
import { Typography } from "@/components/typography";

interface Message {
  id: string;
  text: string;
  time: string;
  isFromUser: boolean;
  isRead: boolean;
}

interface MessagesListProps {
  messages: Message[];
  showDateHeader?: boolean;
  dateHeaderText?: string;
  isTyping?: boolean;
}

export function MessagesList({
  messages,
  showDateHeader = true,
  dateHeaderText = "Today 2:04 pm",
  isTyping = false,
}: MessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
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
          className={`flex ${msg.isFromUser ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              msg.isFromUser
                ? "bg-purple-100 rounded-br-md"
                : "bg-gray-100 rounded-bl-md"
            }`}
          >
            <Typography
              variant="body-small"
              className={"text-gray-900 text-ellipsis"}
            >
              {msg.text}
            </Typography>
            <div className="flex items-center justify-end gap-1 mt-1">
              <Typography
                variant="caption"
                className={`${
                  msg.isFromUser ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {msg.time}
              </Typography>
              {msg.isFromUser && (
                <div
                  className={`w-3 h-3 ${
                    msg.isRead ? "text-gray-900" : "text-gray-400"
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
  );
}
