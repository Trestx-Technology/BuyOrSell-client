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
    },
    ref
  ) => {
    return (
      <Input
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg",
          disabled && "bg-gray-100 cursor-not-allowed",
          className
        )}
      />
    );
  }
);

TextInput.displayName = "TextInput";
