"use client";

import { forwardRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full h-11 px-3 py-2.5 rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-foreground",
              "flex items-center justify-between text-xs font-medium",
              "focus:outline-none focus:ring-2 focus:ring-purple/20 transition-all duration-200",
              isOpen && "border-purple ring-2 ring-purple/20",
              error && "border-destructive focus:ring-destructive/20",
              (selectedOption || (isMulti && Array.isArray(value) && value.length > 0)) && !error && "border-purple/50",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            <div className="w-full flex items-center">
              <Search className="w-4 h-4 text-purple mr-2 shrink-0" />
              <div className="flex-1 text-left truncate">
                {isOpen ? (
                  <span className="text-muted-foreground">{searchQuery || placeholder}</span>
                ) : (
                  (isMulti && Array.isArray(value) && value.length > 0) ? (
                    <span className="text-purple font-semibold">{value.length} selected</span>
                  ) : (
                    selectedOption?.label || <span className="text-muted-foreground">{placeholder}</span>
                  )
                )}
              </div>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-purple transition-transform ml-2 shrink-0",
                isOpen && "rotate-180"
              )}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[var(--radix-popover-trigger-width)] bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl"
          align="start"
          sideOffset={4}
        >
          {/* Search Input inside Popover */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search options..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-gray-50 dark:bg-gray-900 border-none focus-visible:ring-1 focus-visible:ring-purple/30"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto max-h-60 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                          "w-full text-left p-3 cursor-pointer text-xs font-normal border-b border-gray-50 dark:border-gray-800 last:border-0",
                          "flex items-center gap-3 transition-colors",
                          "hover:bg-purple/5 dark:hover:bg-purple/10 text-foreground",
                          isSelected(option.value) && "bg-purple/10 text-purple font-medium"
                        )}
                  >
                    {isMulti && (
                      <div className={cn(
                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                              isSelected(option.value) ? "bg-purple border-purple" : "border-gray-300 dark:border-gray-600"
                            )}>
                        {isSelected(option.value) && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    )}
                    {option.label}
                  </button>
                ))
            ) : (
              <div className="text-xs text-muted-foreground px-4 py-8 italic text-center">
                No options found
                </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

SearchableDropdownInput.displayName = "SearchableDropdownInput";
