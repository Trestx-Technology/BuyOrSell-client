"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { AIDescriptionAssistant } from "@/components/global/ai-description-assistant";

interface TextareaInputProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  error?: string;
  showAI?: boolean;
  categoryPath?: string;
}

export const TextareaInput = forwardRef<
  HTMLTextAreaElement,
  TextareaInputProps
>(
  (
    {
      placeholder,
      className,
      value,
      onChange,
      disabled = false,
      rows = 4,
      maxLength,
      error,
      showAI = false,
      categoryPath = "General",
    },
    ref
  ) => {
    const [isAIOpen, setIsAIOpen] = useState(false);

    return (
      <div className={cn("space-y-1.5", className)}>
        <div className={cn(
          "relative flex flex-col border rounded-xl overflow-hidden bg-white transition-all duration-200",
          error
            ? "border-red-500 ring-2 ring-red-500/10"
            : "border-[#F5EBFF] focus-within:border-purple/30 focus-within:ring-4 focus-within:ring-purple/5",
          disabled && "bg-gray-100 cursor-not-allowed opacity-60"
        )}>
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Start typing..."}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              "w-full px-4 py-3 border-none ring-0 focus-visible:ring-0 resize-none",
              "text-sm leading-relaxed text-[#4A4A4A] placeholder:text-gray-400 font-medium",
              "scrollbar-thin scrollbar-thumb-purple/10 scrollbar-track-transparent",
              showAI && "min-h-[160px]"
            )}
          />

          <div className="flex items-center justify-between px-3 py-2 bg-[#FDFBFF] border-t border-[#F5EBFF] shrink-0">
            <div className="flex items-center gap-2">
              {showAI && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAIOpen(true)}
                  className="h-9 px-3 text-xs font-bold text-purple bg-purple/5 hover:bg-purple/10 border border-purple/10 rounded-lg gap-2 transition-all active:scale-95 group"
                  icon={
                    <Sparkles className="-mr-2 size-4 group-hover:rotate-12 transition-transform" />
                  }
                  iconPosition="center"
                >
                  Ask AI Assistant
                </Button>
              )}
            </div>

            {maxLength && (
              <div className={cn(
                "text-[10px] font-bold px-2 py-1 rounded-md transition-colors",
                value.length >= (maxLength * 0.9) ? "text-red-500 bg-red-50" : "text-gray-400 bg-gray-50"
              )}>
                {value.length}/{maxLength}
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="text-[11px] font-semibold text-red-500 ml-1">
            {error}
          </p>
        )}

        {showAI && (
          <AIDescriptionAssistant
            isOpen={isAIOpen}
            onClose={() => setIsAIOpen(false)}
            onApply={(desc) => onChange(desc)}
            categoryPath={categoryPath}
            currentValue={value}
          />
        )}
      </div>
    );
  }
);

TextareaInput.displayName = "TextareaInput";
