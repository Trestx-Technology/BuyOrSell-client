"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "../details/_components/FormField";
import { cn } from "@/lib/utils";

export interface SortOption {
  value: string;
  label: string;
}

export interface SortDropdownProps {
  options: SortOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "fit";
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Sort by",
  label = "Sort:",
  className,
  disabled = false,
  size = "md",
}) => {
  const handleValueChange = (newValue: string) => {
    onValueChange?.(newValue);
  };

  const sizeClasses = {
    sm: "w-32",
    md: "w-40",
    lg: "w-48",
    fit: "w-fit",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <FormField label={label} className="flex items-end gap-2">
          <Select
            value={value}
            onValueChange={handleValueChange}
            disabled={disabled}
          >
            <SelectTrigger className={cn(sizeClasses[size])}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}
    </div>
  );
};

export default SortDropdown;
