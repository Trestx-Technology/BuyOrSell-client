"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ColorPickerInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const PRESET_COLORS = [
  "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
  "#000000", "#FFFFFF", "#808080", "#FFA500", "#800080", "#FFC0CB",
  "#A52A2A", "#000080", "#008000", "#800000", "#FFD700", "#4B0082",
];

export const ColorPickerInput = forwardRef<HTMLButtonElement, ColorPickerInputProps>(
  (
    { className, value, onChange, disabled = false },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            className={cn(
              "w-full h-11 px-3 py-2.5 rounded-lg border border-[#F5EBFF] bg-white",
              "flex items-center gap-2 text-xs font-medium text-[#8B31E1]",
              "focus:outline-none focus:ring-2 focus:ring-[#8B31E1]/20",
              "transition-all duration-200",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <div
              className="w-5 h-5 rounded border border-[#E2E2E2]"
              style={{ backgroundColor: value || "#FFFFFF" }}
            />
            <span>{value || "Select color"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <div className="space-y-3">
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-8 h-8 rounded border-2 transition-all",
                    "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#8B31E1]/20",
                    value === color ? "border-[#8B31E1]" : "border-[#E2E2E2]"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            <div className="pt-2 border-t border-[#E2E2E2]">
              <label className="text-xs font-medium text-[#1D2939] mb-2 block">
                Custom Color
              </label>
              <input
                type="color"
                value={value || "#FFFFFF"}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-10 rounded border border-[#E2E2E2] cursor-pointer"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

ColorPickerInput.displayName = "ColorPickerInput";

