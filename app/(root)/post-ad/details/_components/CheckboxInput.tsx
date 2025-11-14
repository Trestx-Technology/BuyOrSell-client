"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxInputProps {
  className?: string;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
  columns?: 1 | 2 | 3 | 4;
}

export const CheckboxInput = forwardRef<HTMLDivElement, CheckboxInputProps>(
  (
    { className, value, onChange, disabled = false, options, columns = 2 },
    ref
  ) => {
    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      if (disabled) return;
      const currentValue = Array.isArray(value) ? value : [];
      if (checked) {
        onChange([...currentValue, optionValue]);
      } else {
        onChange(currentValue.filter((item) => item !== optionValue));
      }
    };

    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-3",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        {options.map((option) => {
          const isChecked = Array.isArray(value) && value.includes(option.value);
          return (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(option.value, checked === true)
                }
                disabled={disabled}
                className={cn(
                  "w-5 h-5 rounded-[4px] border-[#E2E2E2]",
                  isChecked && "bg-purple border-purple"
                )}
              />
              <span
                className={cn(
                  "text-xs capitalize leading-[2em]",
                  isChecked
                    ? "text-purple font-semibold"
                    : "text-[#8A8A8A] font-normal"
                )}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    );
  }
);

CheckboxInput.displayName = "CheckboxInput";
