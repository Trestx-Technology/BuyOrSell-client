"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";

interface BooleanInputProps {
  className?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export const BooleanInput = forwardRef<HTMLButtonElement, BooleanInputProps>(
  (
    {
      className,
      value,
      onChange,
      disabled = false,
      trueLabel,
      falseLabel,
    },
    ref,
  ) => {
    const { t } = useLocale();
    const defaultTrueLabel = t.categories.boolean.yes;
    const defaultFalseLabel = t.categories.boolean.no;

    const displayTrueLabel = trueLabel || defaultTrueLabel;
    const displayFalseLabel = falseLabel || defaultFalseLabel;
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <button
          ref={ref}
          type="button"
          onClick={() => !disabled && onChange(!value)}
          disabled={disabled}
          className={cn(
            "relative w-[38px] cursor-pointer h-5 rounded-[25px] border transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[#8B31E1]/20",
            value
              ? "bg-[#8B31E1] border-[#8B31E1]"
              : "bg-white dark:bg-gray-900 border-[#E2E2E2] dark:border-gray-700",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          role="switch"
          aria-checked={value}
        >
          <span
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-4 h-4 border rounded-full bg-white dark:bg-gray-200 transition-all duration-200",
              value ? "right-[2px]" : "left-[2px] border-input",
            )}
          />
        </button>
        <span className="text-xs font-medium text-[#8B31E1]">
          {value ? displayTrueLabel : displayFalseLabel}
        </span>
      </div>
    );
  },
);

BooleanInput.displayName = "BooleanInput";
