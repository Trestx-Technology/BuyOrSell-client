"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Send } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Message = {
  role: "assistant" | "user";
  content: string;
  action?: { label: string; url: string };
};

import { searchWithAI } from "@/lib/ai/searchWithAI";
import { findResolution } from "@/constants/app-context";

export default function FloatingChatCTA() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I’m your AI assistant. I can help you find products, navigate the site, or answer questions about BuyOrSell.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  const logRef = React.useRef<HTMLDivElement | null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);

  // Framer Motion animation variants - smooth zoom-in pattern
  const askMeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        duration: 0.5,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 280,
        damping: 20,
        duration: 0.6,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        duration: 0.4,
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        duration: 0.5,
        delay: 0.2,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15,
        duration: 0.2,
      },
    },
  };

  // Auto scroll to bottom on new messages
  React.useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const processQuery = async (text: string): Promise<{ content: string; action?: { label: string; url: string } }> => {
    const lower = text.toLowerCase();

    // 1. App Knowledge Base (Resolutions)
    // This handles most platform intents: jobs, selling, account, support, etc.
    const resolution = findResolution(text);
    if (resolution) {
      return {
        content: resolution.response,
        action: resolution.action
      };
    }

    // 2. Search Logic (Products & General)
    if (lower.includes("find") || lower.includes("search") || lower.includes("looking for") || lower.includes("buy")) {
      try {
        const { success, results, searchQuery } = await searchWithAI(text);

        if (success) {
          if (results && results.length > 0) {
            const count = results.length;
            const firstItem = results[0];

            // Intelligent routing based on result type
            let targetUrl = `/search?search=${encodeURIComponent(searchQuery)}`;
            let label = `View ${count} Results`;

            if (firstItem.adType === "JOB" || (firstItem.category && firstItem.category.toLowerCase().includes("job"))) {
              targetUrl = `/jobs/listing?search=${encodeURIComponent(searchQuery)}`;
              label = "View Job Matches";
            } else if (firstItem.category) {
              // If robust category slug is available, use it, else fallback to search
              // targetUrl = `/categories/${firstItem.category.toLowerCase()}`;
            }

            const topNames = results.slice(0, 2).map((item: any) => item.title).join(", ");

            return {
              content: `I found ${count} items matching "${searchQuery}", such as: ${topNames}...`,
              action: { label: label, url: targetUrl }
            };
          } else {
            return {
              content: `I couldn't find exact matches for "${searchQuery}". Try browsing our categories.`,
              action: { label: "Browse Categories", url: "/categories" }
            };
          }
        } else {
          return {
            content: `I couldn't find exact matches for "${searchQuery}". Try browsing our categories.`,
            action: { label: "Browse Categories", url: "/categories" }
          };
        }

      } catch (err) {
        console.error("AI Search in Chat failed", err);
        return {
          content: "I'm having trouble searching specifically right now. Please try our main search.",
          action: { label: "Search", url: "/search" }
        };
      }
    }

    // Final Fallback
    return {
      content: "I'm not sure specifically, but you can explore our main sections.",
      action: { label: "Go Home", url: "/" }
    };
  };

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);

    // Process asynchronously
    // Use an IIFE or similar to handle the async promise without blocking the UI updates above
    (async () => {
      // Minimum delay for realism
      const startTime = Date.now();
      const response = await processQuery(trimmed);
      const elapsedTime = Date.now() - startTime;
      const remainingDelay = Math.max(0, 800 - elapsedTime);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            ...response
          },
        ]);
        setIsTyping(false);
      }, remainingDelay);
    })();
  }

  // Audio notification function
  const playNotificationSound = React.useCallback(() => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext: typeof AudioContext;
            }
          ).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      }

      const audioContext = audioContextRef.current;

      // Create oscillator for the notification tone
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure the notification tone (pleasant chime sound)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Base frequency
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1); // Rise
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2); // Fall

      // Configure gain for smooth fade in/out
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.05
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      // Set oscillator type and start
      oscillator.type = "sine";
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      console.log("Audio notification not supported or blocked by browser");
    }
  }, []);

  // Play notification sound when component mounts
  React.useEffect(() => {
    // Small delay to ensure smooth user experience
    const timer = setTimeout(() => {
      playNotificationSound();
    }, 500);

    return () => clearTimeout(timer);
  }, [playNotificationSound]);

  return (
    <div className="sticky bottom-6 right-10 z-50">
      {/* Chat panel */}

      {/* Floating CTA */}
      <div className="group relative flex items-end justify-end mb-2">
        {/* Ask me pill */}
        {!open && (
          <motion.div
            variants={askMeVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              "mr-0 mb-6 select-none rounded-lg rounded-br-none bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow",
              "border border-gray-200",
              "dark:bg-gray-900 dark:text-white dark:border-gray-800"
            )}
            aria-hidden="true"
          >
            Ask me
          </motion.div>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "sticky bottom-6 right-10 z-50 mb-3 w-[min(22rem,calc(100vw-2rem))] rounded-xl border bg-white text-gray-900 shadow-xl",
                "dark:border-gray-800 dark:bg-gray-900 dark:text-white"
              )}
              role="dialog"
              aria-modal="true"
              aria-label="AI Assistant chat"
            >
              <div className="flex items-center justify-between gap-2 border-b px-3 py-2 text-sm font-medium dark:border-gray-800">
                <span>AI Assistant</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:text-white"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                ref={logRef}
                className="max-h-64 overflow-y-auto px-3 py-3"
                role="log"
                aria-live="polite"
                aria-relevant="additions"
              >
                <ul className="space-y-2">
                  {/* Messages */}
                  {messages.map((m, i) => (
                    <li
                      key={i}
                      className={cn(
                        "text-sm leading-relaxed",
                        m.role === "user" ? "text-right" : "text-left"
                      )}
                    >
                      <div
                        className={cn(
                          "inline-block rounded-lg px-3 py-2",
                          m.role === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                        )}
                      >
                        {m.content}
                      </div>

                      {/* Action Link */}
                      {m.role === "assistant" && m.action && (
                        <div className="mt-1 text-left">
                          <Link href={m.action.url} className="inline-flex items-center text-xs text-purple-600 hover:text-purple-700 font-medium bg-purple-50 px-2 py-1 rounded-full border border-purple-100 transition-colors">
                            {m.action.label} ↗
                          </Link>
                        </div>
                      )}
                    </li>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <li className="text-left">
                      <div className="inline-block rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 border-t px-3 py-2 dark:border-gray-800"
              >
                <label htmlFor="ai-chat-input" className="sr-only">
                  Type your message
                </label>
                <input
                  id="ai-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything..."
                  className={cn(
                    "flex-1 rounded-md border bg-white px-3 py-2 text-sm outline-none",
                    "placeholder:text-gray-400",
                    "focus-visible:ring-2 focus-visible:ring-purple-500",
                    "dark:border-gray-800 dark:bg-gray-900"
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    "inline-flex items-center justify-center gap-1 rounded-md bg-purple-600 p-2 text-sm font-medium text-white",
                    "hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  )}
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Purple button */}
        <motion.button
          type="button"
          aria-label={open ? "Close AI chat" : "Open AI chat"}
          aria-expanded={open}
          aria-controls="ai-chat-panel"
          onClick={() => setOpen((v) => !v)}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className={cn(
            "size-8 rounded-full relative inline-flex items-center justify-center shadow-lg"
          )}
        >
          <Image
            src={
              "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/ai-bg-white.svg"
            }
            alt="AI Logo"
            className="object-cover size-full"
            width={32}
            height={32}
          />
          <span className="sr-only">AI chat</span>
        </motion.button>
      </div>
    </div>
  );
}
