"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaInputProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
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
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-2", className)}>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none",
            disabled && "bg-gray-100 cursor-not-allowed"
          )}
        />
        {maxLength && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {value.length}/{maxLength} characters
            </span>
          </div>
        )}
      </div>
    );
  }
);

TextareaInput.displayName = "TextareaInput";
