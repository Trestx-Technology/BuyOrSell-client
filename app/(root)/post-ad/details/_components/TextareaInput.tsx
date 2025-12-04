"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface TextareaInputProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  error?: string;
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
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="relative">
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Typing"}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              "w-full min-h-[121px] px-3 py-3 border rounded-lg",
              "text-xs font-medium text-[#8B31E1] placeholder:text-[#8B31E1]",
              "bg-white resize-none transition-all duration-200",
              maxLength && "pb-10",
              error
                ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20"
                : "border-[#F5EBFF] focus-visible:border-[#F5EBFF] focus-visible:ring-2 focus-visible:ring-[#8B31E1]/20",
              disabled && "bg-gray-100 cursor-not-allowed opacity-50"
            )}
          />
          {maxLength && (
            <div className="absolute bottom-3 right-3 text-xs font-normal text-[#8A8A8A]">
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TextareaInput.displayName = "TextareaInput";
