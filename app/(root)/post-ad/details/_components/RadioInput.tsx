"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
}

export const RadioInput = forwardRef<HTMLDivElement, RadioInputProps>(
  (
    { className, value, onChange, disabled = false, options },
    ref
  ) => {
    return (
      <RadioGroup
        ref={ref}
        value={value || ""}
        onValueChange={onChange}
        disabled={disabled}
        className={cn(
          "flex flex-wrap gap-3",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="w-4 h-4"
              />
              <Label
                htmlFor={option.value}
                className={cn(
                  "text-xs font-normal cursor-pointer",
                  isSelected ? "text-[#8B31E1] font-medium" : "text-[#1D2939]"
                )}
              >
                {option.label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  }
);

RadioInput.displayName = "RadioInput";

