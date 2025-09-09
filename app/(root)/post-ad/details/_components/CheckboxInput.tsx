"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

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
          "grid gap-3",
          gridCols[columns],
          disabled && "opacity-50 pointer-events-none",
          className
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={
                Array.isArray(value) ? value.includes(option.value) : false
              }
              onChange={(e) =>
                handleCheckboxChange(option.value, e.target.checked)
              }
              disabled={disabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    );
  }
);

CheckboxInput.displayName = "CheckboxInput";
