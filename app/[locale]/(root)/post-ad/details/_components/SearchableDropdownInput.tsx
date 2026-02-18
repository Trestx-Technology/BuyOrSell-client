"use client";

import { forwardRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";

interface SearchableDropdownInputProps {
  className?: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
  isMulti?: boolean;
}

export const SearchableDropdownInput = forwardRef<HTMLDivElement, SearchableDropdownInputProps>(
  (
    {
      className,
      value,
      onChange,
      disabled = false,
      options,
      placeholder = "Item",
      error,
      isMulti = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOptions = useMemo(() => {
      if (!searchQuery) return options;
      return options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }, [options, searchQuery]);

    const selectedOption = options.find((opt) => opt.value === value);

    const isSelected = (val: string) => {
      if (isMulti && Array.isArray(value)) {
        return value.includes(val);
      }
      return value === val;
    };

    const handleSelect = (optionValue: string) => {
      if (isMulti) {
        const currentValues = Array.isArray(value) ? value : [];
        if (currentValues.includes(optionValue)) {
          onChange(currentValues.filter(v => v !== optionValue));
        } else {
          onChange([...currentValues, optionValue]);
        }
      } else {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    return (
      <div ref={ref} className={cn("relative w-full", className)}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full h-11 px-3 py-2.5 rounded-t-lg border bg-background text-foreground",
            "flex items-center justify-between text-xs font-medium",
            "focus:outline-none focus:ring-2 transition-all duration-200",
            !isOpen && "rounded-b-lg",
            error
              ? "border-destructive focus:ring-destructive/20"
              : !isOpen
                ? "border-border"
                : "border-purple",
            (selectedOption || (isMulti && Array.isArray(value) && value.length > 0)) && !error && "border-purple/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="w-full flex items-center">
            <Search className="w-5 h-5 text-purple" />
            <Input
              type="text"
              value={isOpen ? searchQuery : (isMulti ? "" : selectedOption?.label || "")}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={!isOpen && isMulti && Array.isArray(value) && value.length > 0 ? `${value.length} selected` : (selectedOption?.label || placeholder)}
              onFocus={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              className="w-full h-9 px-3 py-2 text-xs border-0 rounded-lg outline-none focus-visible:border-0 focus-visible:ring-0 focus:border-0 focus:ring-0 bg-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-purple transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 bg-card border border-t-0 rounded-b-lg max-h-[400px] overflow-hidden flex flex-col shadow-[0px_9.71px_24px_0px_rgba(139,49,225,0.15)] border-purple/30">
            {/* Options List */}
            <div className="overflow-y-auto max-h-48 custom-scrollbar">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full text-left p-3 cursor-pointer text-xs font-normal border-b border-border last:border-0",
                    "flex items-center gap-3 transition-colors",
                    "hover:bg-accent/50 text-foreground",
                    isSelected(option.value) && "bg-purple/10 text-purple font-medium"
                  )}
                >
                  {isMulti && (
                    <div className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      isSelected(option.value) ? "bg-purple border-purple" : "border-border"
                    )}>
                      {isSelected(option.value) && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  )}
                  {option.label}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="text-xs text-muted-foreground px-4 py-4 italic text-center">
                  No options found
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overlay to close dropdown */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setSearchQuery("");
            }}
          />
        )}
      </div>
    );
  }
);

SearchableDropdownInput.displayName = "SearchableDropdownInput";

