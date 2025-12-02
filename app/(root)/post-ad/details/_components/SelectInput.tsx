"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface SelectInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: SelectOption[];
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
              "w-full h-12 border-[#D8B1FF] bg-white text-[#8B31E1] font-medium text-xs",
              "data-[placeholder]:text-[#8B31E1]",
              "focus-visible:border-[#D8B1FF] focus-visible:ring-2 focus-visible:ring-[#8B31E1]/20",
              "hover:bg-white hover:border-[#D8B1FF]",
              "rounded-lg px-3 py-5",
              "[&_svg]:text-[#8B31E1]",
            className
          )}
        >
          <SelectValue placeholder={placeholder}>
            {value && (() => {
              const selectedOption = options.find(opt => opt.value === value);
              if (!selectedOption) return value;
              return (
                <div className="flex items-center gap-2">
                  {selectedOption.icon ? (
                    <div className="size-5 relative flex-shrink-0">
                      <Image
                        src={selectedOption.icon}
                        alt={selectedOption.label}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ) : (
                    <div className="size-5 flex items-center justify-center flex-shrink-0">
                      <ImageOff className="size-4 text-gray-400" />
                    </div>
                  )}
                  <span>{selectedOption.label}</span>
                </div>
              );
            })()}
          </SelectValue>
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
              disabled={option.disabled}
              className={cn(
                "h-auto min-h-[40px] px-3 py-2 text-xs leading-[2em]",
                "text-[#1D2939] font-normal",
                "data-[state=checked]:bg-purple data-[state=checked]:text-white data-[state=checked]:font-medium",
                "hover:bg-purple/50 focus:text-purple focus:bg-purple/50",
                "rounded-none first:rounded-t-lg last:rounded-b-lg",
                "cursor-pointer",
                option.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent"
              )}
            >
              <div className="flex items-center gap-2">
                {option.icon ? (
                  <div className="size-6 relative flex-shrink-0">
                    <Image
                      src={option.icon}
                      alt={option.label}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ) : (
                  <div className="size-6 flex items-center justify-center flex-shrink-0">
                    <ImageOff className="size-4 text-gray-400" />
                  </div>
                )}
                <span className="flex-1">{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

SelectInput.displayName = "SelectInput";
