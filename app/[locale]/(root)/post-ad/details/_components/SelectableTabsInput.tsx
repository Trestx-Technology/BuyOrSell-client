"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SelectableTabsInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
}

export const SelectableTabsInput = forwardRef<HTMLDivElement, SelectableTabsInputProps>(
  (
    { className, value, onChange, disabled = false, options },
    ref
  ) => {
    return (
      <div ref={ref} className={cn(disabled && "opacity-50 pointer-events-none", className)}>
        <RadioGroup
          value={value || ""}
          onValueChange={onChange}
          disabled={disabled}
          className="flex flex-wrap gap-3"
        >
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "px-3 py-2.5 rounded-lg text-xs font-normal transition-all duration-200",
                "border h-11 flex items-center justify-center cursor-pointer",
                isSelected
                  ? "bg-[#8B31E1] text-white border-[#8B31E1] font-medium"
                  : "bg-white text-[#8A8A8A] border-[#E2E2E2] hover:border-[#8B31E1]/50",
                disabled && "cursor-not-allowed"
              )}
            >
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="sr-only"
              />
              <span className="capitalize">{option.label}</span>
            </label>
          );
        })}
        </RadioGroup>
      </div>
    );
  }
);

SelectableTabsInput.displayName = "SelectableTabsInput";

