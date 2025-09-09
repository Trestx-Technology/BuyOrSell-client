"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  placeholder?: string;
  className?: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      placeholder,
      className,
      value,
      onChange,
      disabled = false,
      min,
      max,
      step = 1,
      unit,
    },
    ref
  ) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          type="number"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
            disabled && "bg-gray-100 cursor-not-allowed",
            unit && "pr-8",
            className
          )}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
