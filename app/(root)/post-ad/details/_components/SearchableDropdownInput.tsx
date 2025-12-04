"use client";

import { forwardRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";

interface SearchableDropdownInputProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
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

    return (
      <div ref={ref} className={cn("relative w-full", className)}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full h-11 px-3 py-2.5 rounded-t-lg border bg-white",
            "flex items-center justify-between text-xs font-medium text-[#8B31E1]",
            "focus:outline-none focus:ring-2 transition-all duration-200",
            !isOpen && "rounded-b-lg",
            error
              ? "border-red-500 focus:ring-red-500/20"
              : !isOpen
                ? "border-[#F5EBFF]"
                : "border-purple",
            selectedOption && !error && "border-purple/50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="w-full flex items-center">
            <Search className="w-5 h-5 text-[#8B31E1]" />
            <Input
              type="text"
              value={isOpen ? searchQuery : selectedOption?.label || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={selectedOption?.label || placeholder}
              onFocus={(e) => {
                e.stopPropagation();
                setIsOpen(true);
              }}
              className="w-full h-9 px-3 py-2 text-xs border-0 rounded-lg outline-none focus-visible:border-0 focus-visible:ring-0 focus:border-0 focus:ring-0"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-[#8B31E1] transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown Content */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 bg-white border border-t-0 rounded-b-lg max-h-[400px] overflow-hidden flex flex-col shadow-[0px_9.71px_24px_0px_rgba(139,49,225,0.15)] border-[#D8B1FF]">
            {/* Options List */}
            <div className="overflow-y-auto max-h-32">
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={cn(
                    "w-full text-left p-3 cursor-pointer  text-xs font-normal text-[#1D2939]",
                    "hover:text-white hover:bg-purple/50 transition-colors",
                    value === option.value && "text-white bg-purple font-medium"
                  )}
                >
                  {option.label}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="text-xs text-[#8A8A8A] px-2 py-4">
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

