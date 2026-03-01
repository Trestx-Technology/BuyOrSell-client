"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface TextInputProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: "text" | "email" | "tel" | "url";
  error?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      placeholder,
      className,
      value,
      onChange,
      disabled = false,
      type = "text",
      error,
    },
    ref,
  ) => {
    return (
      <Input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Typing"}
        disabled={disabled}
        className={cn(
          "w-full h-11 px-3 py-2.5 border rounded-lg",
          "text-xs font-medium text-[#8B31E1] placeholder:text-[#8B31E1]",
          "bg-white dark:bg-gray-900 transition-all duration-200",
          error
            ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/20"
            : "border-[#F5EBFF] focus-visible:border-[#F5EBFF] focus-visible:ring-2 focus-visible:ring-[#8B31E1]/20",
          disabled && "bg-gray-100 cursor-not-allowed opacity-50",
          className,
        )}
      />
    );
  },
);

TextInput.displayName = "TextInput";
