"use client";

import { useState } from "react";
import { mockAds } from "@/constants/sample-listings";
import { ChatSidebar } from "./_components/ChatSidebar";
import { ChatHeader } from "./_components/ChatHeader";
import { MessagesList } from "./_components/MessagesList";
import { MessageInput } from "./_components/MessageInput";

// Mock chat data
const mockChats = [
  {
    id: "1",
    name: "Premium Auto Collection",
    avatar: mockAds[0].images[0],
    lastMessage: "Dubai, I/A. Sharjah...",
    time: "00:13",
    unreadCount: 1,
    isVerified: true,
    isOnline: true,
  },
  {
    id: "2",
    name: "Giana Carder",
    avatar: mockAds[1].images[0],
    lastMessage: "Hey",
    time: "00:17",
    unreadCount: 0,
    isVerified: false,
    isOnline: false,
  },
  {
    id: "3",
    name: "Alena Passaquindici Ar..",
    avatar: mockAds[2].images[0],
    lastMessage: "Hey",
    time: "18:56",
    unreadCount: 1,
    isVerified: false,
    isOnline: false,
  },
  {
    id: "4",
    name: "Jocelyn Carder",
    avatar: mockAds[3].images[0],
    lastMessage: "Please join.",
    time: "Yesterday",
    unreadCount: 0,
    isVerified: false,
    isOnline: false,
    isRead: true,
  },
  {
    id: "5",
    name: "Kaylynn Vetrovs",
    avatar: mockAds[4].images[0],
    lastMessage: "Thank you.",
    time: "Yesterday",
    unreadCount: 0,
    isVerified: false,
    isOnline: false,
    isRead: true,
  },
  {
    id: "6",
    name: "Mira Passaquindici Ar..",
    avatar: mockAds[5].images[0],
    lastMessage: "Okay.",
    time: "Yesterday",
    unreadCount: 1,
    isVerified: false,
    isOnline: false,
  },
  {
    id: "7",
    name: "Giana Carder",
    avatar: mockAds[6].images[0],
    lastMessage: "Fine.",
    time: "10/16/20",
    unreadCount: 0,
    isVerified: false,
    isOnline: false,
    isRead: true,
  },
  {
    id: "8",
    name: "Giana Carder",
    avatar: mockAds[7].images[0],
    lastMessage: "Let's see.",
    time: "10/16/20",
    unreadCount: 0,
    isVerified: false,
    isOnline: false,
    isRead: true,
  },
];

// Initial messages for the active chat
const initialMessages = [
  {
    id: "1",
    text: "Thanks!",
    time: "18:16",
    isFromUser: true,
    isRead: true,
  },
  {
    id: "2",
    text: "What's your shop address?",
    time: "18:16",
    isFromUser: true,
    isRead: true,
  },
  {
    id: "3",
    text: "What's the price?",
    time: "18:16",
    isFromUser: false,
    isRead: true,
  },
  {
    id: "4",
    text: "Okay wil reach there 😄",
    time: "18:16",
    isFromUser: true,
    isRead: true,
  },
  {
    id: "5",
    text: "Dubai, 1/A, Sharjah street",
    time: "18:12",
    isFromUser: false,
    isRead: true,
  },
];

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  const currentChat = mockChats.find((chat) => chat.id === activeChat);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        time: getCurrentTime(),
        isFromUser: true,
        isRead: false,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");

      // Show typing indicator
      setIsTyping(true);

      // Simulate a response after 1-2 seconds
      setTimeout(
        () => {
          setIsTyping(false);

          const responses = [
            "Thanks for your message!",
            "I'll get back to you soon.",
            "Let me check that for you.",
            "That sounds good!",
            "I understand. Let me help you with that.",
          ];

          const randomResponse =
            responses[Math.floor(Math.random() * responses.length)];
          const responseMessage = {
            id: (Date.now() + 1).toString(),
            text: randomResponse,
            time: getCurrentTime(),
            isFromUser: false,
            isRead: true,
          };

          setMessages((prev) => [...prev, responseMessage]);
        },
        1000 + Math.random() * 1000
      );
    }
  };

  const handleAIMessageGenerated = (generatedMessage: string) => {
    setMessage(generatedMessage);
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
  };

  const handleBackToSidebar = () => {
    setActiveChat(""); // Reset to no chat selected
  };

  const handleBack = () => {
    // Handle back navigation
    console.log("Navigate back");
  };

  const handleSearch = () => {
    // Handle search functionality
    console.log("Search messages");
  };

  const handleCall = () => {
    // Handle call functionality
    console.log("Start call");
  };

  const handleMoreOptions = () => {
    // Handle more options
    console.log("Show more options");
  };

  return (
    <div className="h-full flex relative">
      {/* Full Width Sidebar - When no chat is selected */}
      {!currentChat && (
        <div className="w-full flex h-full bg-white">
          {/* Sidebar */}
          <div className="w-80 lg:w-96 border-r border-gray-200">
            <ChatSidebar
              chats={mockChats}
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
              onBack={handleBack}
            />
          </div>

          {/* Empty State Message */}
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Select a chat to continue
              </h3>
              <p className="text-gray-500 max-w-sm">
                Choose a conversation from the left sidebar to start chatting
                with other users.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout - When chat is selected */}
      {currentChat && (
        <>
          <div className=" lg:flex w-80 lg:w-96 border-r border-gray-200 flex flex-col h-full bg-white">
            <ChatSidebar
              chats={mockChats}
              activeChat={activeChat}
              onChatSelect={handleChatSelect}
              onBack={handleBack}
            />
          </div>

          {/* Chat Area */}
          <div className="flex-1 w-full flex flex-col min-h-0 bg-white">
            <ChatHeader
              currentChat={currentChat}
              onSearch={handleSearch}
              onCall={handleCall}
              onMoreOptions={handleMoreOptions}
              onBackToSidebar={handleBackToSidebar}
              showBackButton={true}
            />

            <div className="flex-1 min-h-0">
              <MessagesList messages={messages} isTyping={isTyping} />
            </div>

            <MessageInput
              value={message}
              onChange={setMessage}
              onSend={handleSendMessage}
              onAIMessageGenerated={handleAIMessageGenerated}
              itemTitle={currentChat.name}
              itemPrice="$15,000"
              maxRows={5}
              minRows={1}
            />
          </div>
        </>
      )}
    </div>
  );
}
