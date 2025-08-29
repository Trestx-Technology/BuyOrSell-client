"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import white_AI_logo from "@/public/icons/ai-bg-white.svg";
import Image from "next/image";

type Message = { role: "assistant" | "user"; content: string };

export default function FloatingChatCTA() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I’m your AI assistant. How can I help today?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const logRef = React.useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom on new messages
  React.useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    // Mock assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Thanks! I’m a demo chat. Connect me to your backend or AI SDK when you’re ready.",
        },
      ]);
    }, 600);
  }

  return (
    <div className="sticky bottom-6 right-10 z-50">
      {/* Chat panel */}
      {open && (
        <div
          className={cn(
            "mb-3 w-[min(22rem,calc(100vw-2rem))] rounded-xl border bg-white text-gray-900 shadow-xl",
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
                </li>
              ))}
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
                "inline-flex items-center gap-1 rounded-md bg-purple-600 px-3 py-2 text-sm font-medium text-white",
                "hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
              )}
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Floating CTA */}
      <div className="group relative flex items-center justify-end">
        {/* Ask me pill */}
        {!open && (
          <div
            className={cn(
              "mr-2 mb-8 select-none rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow",
              "border border-gray-200",
              "dark:bg-gray-900 dark:text-white dark:border-gray-800"
            )}
            aria-hidden="true"
          >
            Ask me
          </div>
        )}

        {/* Purple button */}
        <button
          type="button"
          aria-label={open ? "Close AI chat" : "Open AI chat"}
          aria-expanded={open}
          aria-controls="ai-chat-panel"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "size-8 rounded-full relative inline-flex items-center justify-center   shadow-lg"
          )}
        >
          <Image
            src={white_AI_logo}
            alt="AI Logo"
            className="object-cover size-full"
          />
          <span className="sr-only">AI chat</span>
        </button>
      </div>
    </div>
  );
}
