"use client";

import { useState, useMemo } from "react";
import { mockAds } from "@/constants/sample-listings";
import { ChatSidebar } from "./_components/ChatSidebar";
import { ChatArea } from "./_components/ChatArea";
import { ChatType } from "./_components/ChatTypeSelector";
import { cn } from "@/lib/utils";

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
    chatType: "ad" as ChatType,
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
    chatType: "dm" as ChatType,
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
    chatType: "ad" as ChatType,
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
    chatType: "organisation" as ChatType,
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
    chatType: "dm" as ChatType,
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
    chatType: "ad" as ChatType,
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
    chatType: "dm" as ChatType,
  },
  {
    id: "8",
    name: "Tech Solutions Inc.",
    avatar: mockAds[7].images[0],
    lastMessage: "Let's see.",
    time: "10/16/20",
    unreadCount: 0,
    isVerified: false,
    isOnline: false,
    isRead: true,
    chatType: "organisation" as ChatType,
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
  const [chatType, setChatType] = useState<ChatType>("ad");

  // Filter chats based on selected chat type
  const filteredChats = useMemo(() => {
    return mockChats.filter((chat) => chat.chatType === chatType);
  }, [chatType]);

  const currentChat = filteredChats.find((chat) => chat.id === activeChat);

  // Reset active chat when chat type changes
  const handleChatTypeChange = (type: ChatType) => {
    setChatType(type);
    setActiveChat(""); // Reset active chat when switching types
  };

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
      {/* Sidebar - Hidden on mobile when chat is selected, always visible on desktop */}
      <div
        className={cn(
          "border-r border-gray-200 flex flex-col h-full bg-white",
          !currentChat ? "flex w-full sm:w-80 sm:flex lg:w-96" : "hidden sm:flex sm:w-80 lg:w-96"
        )}
      >
        <ChatSidebar
          chats={filteredChats}
          activeChat={activeChat}
          chatType={chatType}
          onChatSelect={handleChatSelect}
          onChatTypeChange={handleChatTypeChange}
          onBack={handleBack}
        />
      </div>

      <ChatArea
        currentChat={currentChat}
        messages={messages}
        message={message}
        isTyping={isTyping}
        onMessageChange={setMessage}
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
