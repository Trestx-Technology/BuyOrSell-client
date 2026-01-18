import React from "react";
import { CommonFilters, FilterConfig } from "@/components/common/common-filters";

export interface JobsFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  locationQuery: string;
  onLocationChange: (query: string) => void;
  locationPlaceholder?: string;
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onClearFilters: () => void;
  config: FilterConfig[];
  className?: string;
}

export default function JobsFilter({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search jobs...",
  locationQuery,
  onLocationChange,
  locationPlaceholder = "Dubai",
  filters,
  onFilterChange,
  onClearFilters,
  config,
  className,
}: JobsFilterProps) {

  const staticFilters = config.filter((c) => c.isStatic !== false);
  const dynamicFilters = config.filter((c) => c.isStatic === false);

  const handleApplyDynamicFilters = (newFilters: Record<string, any>) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      onFilterChange(key, value);
    });
  };

  return (
    <CommonFilters
      filters={filters}
      staticFilters={staticFilters}
      dynamicFilters={dynamicFilters}
      onStaticFilterChange={onFilterChange}
      onApplyDynamicFilters={handleApplyDynamicFilters}
      onClearFilters={onClearFilters}
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      locationQuery={locationQuery}
      onLocationChange={onLocationChange}
      locationPlaceholder={locationPlaceholder}
      className={className}
    />
  );
}
