"use client";

import { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const SelectInput = forwardRef<HTMLButtonElement, SelectInputProps>(
  (
    {
      className,
      value,
      onChange,
      disabled = false,
      options,
      placeholder = "Select an option",
    },
    ref
  ) => {
    return (
      <Select
        value={value || undefined}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          ref={ref}
          className={cn(
              "w-full h-11 border-[#D8B1FF] bg-white text-[#8B31E1] font-medium text-xs",
              "data-[placeholder]:text-[#8B31E1]",
              "focus-visible:border-[#D8B1FF] focus-visible:ring-2 focus-visible:ring-[#8B31E1]/20",
              "hover:bg-white hover:border-[#D8B1FF]",
              "rounded-lg px-3 py-4",
              "[&_svg]:text-[#8B31E1]",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "bg-white border-[#D8B1FF] rounded-lg",
            "shadow-[0px_9.71px_24px_0px_rgba(139,49,225,0.15)]",
            "p-0 overflow-hidden"
          )}
        >
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                "h-10 px-3 py-0 text-xs leading-[2em]",
                "text-[#1D2939] font-normal",
                "data-[state=checked]:bg-purple data-[state=checked]:text-white data-[state=checked]:font-medium",
                "hover:bg-purple/50 focus:text-purple focus:bg-purple/50",
                "rounded-none first:rounded-t-lg last:rounded-b-lg",
                "cursor-pointer"
              )}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectInput.displayName = "SelectInput";
