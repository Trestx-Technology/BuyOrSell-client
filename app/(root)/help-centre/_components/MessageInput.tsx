"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIFeaturesPopover } from "./AIFeaturesPopover";
import { AutosizeTextarea } from "@/components/global/autosize-textarea";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onAIMessageGenerated: (message: string) => void;
  itemTitle?: string;
  itemPrice?: string;
  placeholder?: string;
  maxRows?: number;
  minRows?: number;
}

export function MessageInput({
  value,
  onChange,
  onSend,
  onAIMessageGenerated,
  itemTitle = "Item",
  itemPrice = "",
  maxRows = 5,
  minRows = 1,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [, setRows] = useState(minRows);

  // Auto-resize textarea based on content
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate the number of rows needed
    const lineHeight = 24; // Approximate line height in pixels
    const padding = 16; // Total padding (8px top + 8px bottom)
    const scrollHeight = textarea.scrollHeight;

    // If content is empty, reset to minRows
    if (!value.trim()) {
      setRows(minRows);
      textarea.style.height = `${minRows * lineHeight + padding}px`;
      return;
    }

    const newRows = Math.max(
      minRows,
      Math.min(maxRows, Math.ceil((scrollHeight - padding) / lineHeight))
    );

    setRows(newRows);
    textarea.style.height = `${newRows * lineHeight + padding}px`;
  }, [value, minRows, maxRows]);

  // Adjust height when value changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  // Reset height when component mounts or value becomes empty
  useEffect(() => {
    if (!value.trim()) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = `${minRows * 24 + 16}px`;
        setRows(minRows);
      }
    }
  }, [value, minRows]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="border-t border-gray-200 bg-purple/10 p-4">
      <div className="flex items-center gap-3">
        <AIFeaturesPopover
          onMessageGenerated={onAIMessageGenerated}
          currentMessage={value}
          itemTitle={itemTitle}
          itemPrice={itemPrice}
        />

        <div className="flex-1 relative">
          <AutosizeTextarea
            placeholder="Enter your message"
            maxHeight={200}
            minHeight={42}
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />

          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
          >
            <Smile className="h-5 w-5 text-gray-400" />
          </Button>
        </div>

        <Button
          onClick={onSend}
          disabled={!value.trim()}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 p-3"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
