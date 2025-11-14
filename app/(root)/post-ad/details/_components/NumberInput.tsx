"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ChevronUp, ChevronDown } from "lucide-react";

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
    const handleIncrement = () => {
      if (disabled) return;
      const newValue = (value || 0) + step;
      if (max === undefined || newValue <= max) {
        onChange(newValue);
      }
    };

    const handleDecrement = () => {
      if (disabled) return;
      const newValue = (value || 0) - step;
      if (min === undefined || newValue >= min) {
        onChange(newValue);
      }
    };

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type="number"
          value={value || ""}
          onChange={(e) => {
            const numValue = e.target.value === "" ? 0 : Number(e.target.value);
            onChange(numValue);
          }}
          placeholder={placeholder || "0"}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={cn(
            "h-11 pr-10 border-[#D8B1FF] text-[#8B31E1] font-medium text-xs placeholder:text-[#8B31E1]",
            unit && "pr-20",
            className
          )}
        />
        
        {/* Unit label (if provided) */}
        {unit && (
          <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs text-[#8B31E1] font-medium pointer-events-none">
            {unit}
          </span>
        )}

        {/* Increment/Decrement buttons */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col h-[34px] w-4">
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && (value || 0) >= max)}
            className={cn(
              "flex items-center justify-center h-4 w-4 p-1 rounded-t-[4px] bg-[#8B31E1] text-white transition-colors",
              "hover:bg-[#7A2BC8] disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-[#8B31E1]/20"
            )}
            aria-label="Increment"
          >
            <ChevronUp className="w-3 h-2" />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || (min !== undefined && (value || 0) <= min)}
            className={cn(
              "flex items-center justify-center h-4 w-4 p-1 rounded-b-[4px] bg-[#8B31E1] text-white transition-colors",
              "hover:bg-[#7A2BC8] disabled:opacity-50 disabled:cursor-not-allowed",
              "focus:outline-none focus:ring-2 focus:ring-[#8B31E1]/20"
            )}
            aria-label="Decrement"
          >
            <ChevronDown className="w-3 h-2" />
          </button>
        </div>
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
