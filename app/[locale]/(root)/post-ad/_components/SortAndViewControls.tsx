"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Menu, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import SortDropdown, { SortOption } from "./SortDropdown";

export type ViewMode = "grid" | "list";

export interface SortAndViewControlsProps {
  // Sort props
  sortOptions: SortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortPlaceholder?: string;
  sortLabel?: string;

  // View mode props
  viewMode?: ViewMode;
  onViewChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean;

  // Filter props
  onFilterClick?: () => void;
  showFilterButton?: boolean;
  filterButtonText?: string;
  variant?: "light" | "dark";

  // General props
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "fit";
}

const SortAndViewControls: React.FC<SortAndViewControlsProps> = ({
  sortOptions,
  sortValue,
  variant = "light",
  onSortChange,
  sortPlaceholder = "Sort by",
  sortLabel = "Sort:",
  viewMode = "grid",
  onViewChange,
  showViewToggle = true,
  onFilterClick,
  showFilterButton = false,
  filterButtonText = "Filters",
  className,
  disabled = false,
  size = "fit",
}) => {
  const handleViewChange = (mode: ViewMode) => {
    onViewChange?.(mode);
  };

  const handleFilterClick = () => {
    onFilterClick?.();
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Sort Dropdown */}
      <SortDropdown
        options={sortOptions}
        value={sortValue}
        onValueChange={onSortChange}
        placeholder={sortPlaceholder}
        label={sortLabel}
        disabled={disabled}
        size={size}
        labelClassName={variant === "dark" ? "text-white" : "text-dark-blue"}
      />

      {/* View Mode Toggle */}
      {showViewToggle && (
        <div className="flex items-center gap-2">
          <Button
            icon={<LayoutGrid />}
            iconPosition="left"
            variant={viewMode === "grid" ? "primary" : "ghost"}
            size="icon-sm"
            className={cn(
              "rounded-lg w-8",
              viewMode !== "grid" && "border text-dark-blue",
              variant === "dark" && "text-white"
            )}
            onClick={() => handleViewChange("grid")}
            disabled={disabled}
          />
          {/* TODO: Add list view toggle back in */}
          <Button
            icon={<Menu />}
            iconPosition="left"
            variant={viewMode === "list" ? "primary" : "ghost"}
            size="icon-sm"
            className={cn(
              "rounded-lg w-8",
              viewMode !== "list" && "border text-dark-blue",
              variant === "dark" && "text-white"
            )}
            onClick={() => handleViewChange("list")}
            disabled={disabled}
          />
        </div>
      )}

      {/* Filter Button */}
      {showFilterButton && (
        <Button
          icon={<SlidersHorizontal />}
          iconPosition="left"
          variant="outline"
          size="sm"
          className="rounded-lg w-8"
          onClick={handleFilterClick}
          disabled={disabled}
        >
          {filterButtonText}
        </Button>
      )}
    </div>
  );
};

export default SortAndViewControls;
