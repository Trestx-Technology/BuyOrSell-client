"use client";

import React, { useState, useRef, type KeyboardEvent, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ChipsInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  maxChips?: number;
  disabled?: boolean;
  readOnly?: boolean;
  allowDuplicates?: boolean;
  validate?: (value: string) => boolean;
  onBlur?: () => void;
  className?: string;
  chipClassName?: string;
  inputClassName?: string;
  showClearAll?: boolean;
}

export const ChipsInput = React.forwardRef<HTMLDivElement, ChipsInputProps>(
  (
    {
      value = [],
      onChange,
      placeholder = "Add item...",
      maxChips,
      disabled = false,
      readOnly = false,
      allowDuplicates = false,
      validate,
      onBlur,
      className,
      chipClassName,
      inputClassName,
      showClearAll = false,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    // Helper function to parse comma-separated values
    const parseCommaSeparatedValues = (text: string): string[] => {
      // Split by comma, handle various spacing patterns
      // This regex handles: "Apple, Dell", "Apple,  Dell", "Apple , Dell", "Apple , Dell ,"
      return text
        .split(',')
        .map(val => val.trim())
        .filter(val => val.length > 0); // Remove empty strings
    };

    const addChip = (chipValue: string) => {
      const trimmedValue = chipValue.trim();
      if (!trimmedValue) return;
      if (maxChips && value.length >= maxChips) return;
      if (!allowDuplicates && value.includes(trimmedValue)) return;
      if (validate && !validate(trimmedValue)) return;

      onChange([...value, trimmedValue]);
      setInputValue("");
    };

    // Add multiple chips from comma-separated string
    const addMultipleChips = (text: string) => {
      const values = parseCommaSeparatedValues(text);
      const currentValues = [...value];
      
      values.forEach((val) => {
        if (!val) return;
        if (maxChips && currentValues.length >= maxChips) return;
        if (!allowDuplicates && currentValues.includes(val)) return;
        if (validate && !validate(val)) return;
        
        currentValues.push(val);
      });
      
      onChange(currentValues);
      setInputValue("");
    };

    const removeChip = (index: number) => {
      const newValue = [...value];
      newValue.splice(index, 1);
      onChange(newValue);
    };

    const clearAll = () => {
      onChange([]);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue) {
        e.preventDefault();
        // Check if input contains commas
        if (inputValue.includes(',')) {
          addMultipleChips(inputValue);
        } else {
          addChip(inputValue);
        }
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        removeChip(value.length - 1);
      } else if (e.key === "," && inputValue) {
        e.preventDefault();
        // When comma is pressed, add everything before comma as chip(s)
        const beforeComma = inputValue.substring(0, inputValue.length - 1);
        if (beforeComma.includes(',')) {
          addMultipleChips(beforeComma);
        } else {
          addChip(beforeComma);
        }
      }
    };

    const handleContainerClick = () => {
      if (!disabled && !readOnly && inputRef.current) {
        inputRef.current.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text");
      
      // Parse comma-separated values with our enhanced parser
      if (pastedData.includes(',')) {
        addMultipleChips(pastedData);
      } else {
        // Handle other separators (semicolon, newline, tab)
        const values = pastedData.split(/[;\n\t]/).filter(Boolean);
        values.forEach((val) => {
          addChip(val.trim());
        });
      }
    };

    useEffect(() => {
      // Scroll to the end when new chips are added
      if (containerRef.current) {
        containerRef.current.scrollLeft = containerRef.current.scrollWidth;
      }
    }, [value]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-1.5 rounded-md border-grey-500 border bg-background px-3 py-2 text-sm ring-offset-purple focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={handleContainerClick}
        {...props}
      >
        <div
          ref={containerRef}
          className="flex flex-wrap items-center gap-1.5 max-w-full overflow-x-auto scrollbar-hide"
        >
          {value.map((chip, index) => (
            <div
              key={`${chip}-${index}`}
              className={cn(
                "group flex cursor-pointer h-7 items-center gap-1 rounded-md bg-purple/20 px-2 py-1 text-sm text-purple transition-colors",
                !readOnly && !disabled && "hover:bg-purple hover:text-white",
                chipClassName
              )}
            >
              <span className="max-w-[200px] truncate">{chip}</span>
              {!readOnly && !disabled && (
                <button
                  type="button"
                  className="flex h-4 w-4 items-center justify-center rounded-full text-purple group-hover:text-white opacity-70 transition-opacity hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChip(index);
                  }}
                  aria-label={`Remove ${chip}`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}

          {!readOnly && !disabled && (!maxChips || value.length < maxChips) && (
            <input
              ref={inputRef}
              type="text"
              className={cn(
                "flex-1 bg-transparent outline-none placeholder:text-purple min-w-[120px] h-7",
                inputClassName
              )}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onBlur={() => {
                if (inputValue) {
                  // Check if input contains commas
                  if (inputValue.includes(',')) {
                    addMultipleChips(inputValue);
                  } else {
                    addChip(inputValue);
                  }
                }
                onBlur?.();
              }}
              placeholder={value.length === 0 ? placeholder : ""}
              disabled={disabled}
            />
          )}
        </div>

        {showClearAll && value.length > 0 && !readOnly && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              clearAll();
            }}
            className="ml-2 h-7 px-2 text-xs text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>
    );
  }
);

ChipsInput.displayName = "ChipsInput";

