"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Send } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { findResolution } from "@/constants/app-context";

type Message = {
  role: "assistant" | "user";
  content: string;
  action?: { label: string; url: string };
};

export default function FloatingChatCTA() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m Nora, your App Navigation Assistant. I can answer queries regarding the platform and where to find any features, but I will not find products for you. Please use the main Search Bar at the top of the page for finding items.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  const logRef = React.useRef<HTMLDivElement | null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null);

  // Auto scroll to bottom on new messages
  React.useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const processQuery = async (
    text: string,
  ): Promise<{ content: string; action?: { label: string; url: string } }> => {
    const lower = text.toLowerCase();

    // 1. App Knowledge Base (Resolutions)
    const resolution = findResolution(text);
    if (resolution) {
      return {
        content: resolution.response,
        action: resolution.action,
      };
    }

    // 2. Search Logic (Products & General) bounds limit
    if (
      lower.includes("find") ||
      lower.includes("search") ||
      lower.includes("looking for") ||
      lower.includes("buy")
    ) {
      return {
        content:
          "I am Nora, your app navigation assistant. Please note that I will not find products for you. To search for ads (including using AI search), please close this chat and use the 'Search anything' bar at the top of the page.",
      };
    }

    // Final Fallback
    return {
      content:
        "I'm not sure about that. Please contact BuyOrSell team for more info.",
      action: { label: "Go Home", url: "/" },
    };
  };

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsTyping(true);

    (async () => {
      const startTime = Date.now();
      const response = await processQuery(trimmed);
      const elapsedTime = Date.now() - startTime;
      const remainingDelay = Math.max(0, 800 - elapsedTime);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            ...response,
          },
        ]);
        setIsTyping(false);
      }, remainingDelay);
    })();
  }

  // Audio notification function
  const playNotificationSound = React.useCallback(() => {
    try {
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
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.3,
        audioContext.currentTime + 0.05,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );

      oscillator.type = "sine";
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      console.log("Audio notification not supported or blocked by browser");
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      playNotificationSound();
    }, 500);

    return () => clearTimeout(timer);
  }, [playNotificationSound]);

  return (
    <div className="fixed bottom-6 right-10 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="group relative flex items-end justify-end mb-2">
          <PopoverContent
            side="top"
            align="end"
            sideOffset={12}
            className={cn(
              "z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border bg-white p-0 text-gray-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-bottom-5 duration-300",
              "dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:shadow-none",
            )}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex items-center justify-between gap-3 border-b px-4 py-4 dark:border-gray-800 bg-purple/5">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-full bg-white p-1 border border-purple/20 shadow-sm">
                  <Image
                    src="/nora.svg"
                    alt="Nora"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-purple-700 dark:text-purple-400 leading-none">
                    Nora
                  </span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1">
                    AI Navigation Assistant
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-white hover:text-gray-900 transition-colors dark:hover:bg-gray-800 dark:text-gray-500 shadow-sm"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              ref={logRef}
              className="max-h-[20rem] min-h-[300px] overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-thumb-purple/10"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
            >
              <ul className="space-y-5">
                {messages.map((m, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300",
                      m.role === "user" ? "items-end" : "items-start",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                        m.role === "user"
                          ? "bg-purple-600 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-200/50 dark:border-gray-700/50",
                      )}
                    >
                      {m.content}
                    </div>

                    {m.role === "assistant" && m.action && (
                      <div className="mt-2 text-left">
                        <Link
                          href={m.action.url}
                          className="inline-flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-bold bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 transition-all hover:scale-105 active:scale-95 shadow-sm"
                        >
                          {m.action.label}
                          <Send className="size-3" />
                        </Link>
                      </div>
                    )}
                  </li>
                ))}

                {isTyping && (
                  <li className="text-left animate-in fade-in duration-300">
                    <div className="inline-block rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-800 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex gap-1.5">
                        <span
                          className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t px-4 py-4 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50"
            >
              <label htmlFor="ai-chat-input" className="sr-only">
                Type your message
              </label>
              <div className="relative flex-1 group">
                <input
                  id="ai-chat-input"
                  value={input}
                  autoComplete="off"
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Nora anything..."
                  className={cn(
                    "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-all duration-300",
                    "placeholder:text-gray-400 font-medium",
                    "focus:ring-4 focus:ring-purple/5 focus:border-purple/30",
                    "dark:border-gray-800 dark:bg-gray-950",
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-purple/40 pointer-events-none">
                  <Send className="h-4 w-4" />
                </div>
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg transition-all active:scale-90 disabled:opacity-50 disabled:scale-100",
                  "hover:bg-purple-700 hover:shadow-purple/30",
                )}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </PopoverContent>

          <PopoverTrigger asChild>
            <motion.button
              type="button"
              aria-label={open ? "Close AI chat" : "Open AI chat"}
              aria-expanded={open}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-3 px-6 py-4 rounded-full bg-white border-2 border-purple-600 shadow-[0_15px_40px_rgba(147,51,234,0.15)] transition-all duration-300",
                "hover:shadow-[0_20px_50px_rgba(147,51,234,0.3)] hover:bg-purple-50/30",
                "dark:bg-gray-900 dark:border-purple-500 dark:hover:bg-purple-950/20",
                open &&
                  "shadow-none hover:shadow-none border-purple-200 dark:border-purple-800",
              )}
            >
              <div className="relative size-8 shrink-0">
                <Image
                  src="/nora.svg"
                  alt="Ask Nora"
                  className="object-contain size-full"
                  width={32}
                  height={32}
                  priority
                />
              </div>
              <span className="text-purple-600 dark:text-purple-400 font-bold text-lg tracking-tight whitespace-nowrap">
                Ask Nora
              </span>
            </motion.button>
          </PopoverTrigger>
        </div>
      </Popover>
    </div>
  );
}

