/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { Slider } from "@/components/ui/slider";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { cn } from "@/lib/utils";
import { NaturalLanguageCalendar } from "@/components/ui/natural-language-calendar";

export interface FilterOption {
      value: string;
      label: string;
}

export interface FilterConfig {
      key: string;
      label: string;
      type: "select" | "range" | "multiselect" | "search" | "calendar";
      options?: FilterOption[];
      placeholder?: string;
      min?: number;
      max?: number;
      step?: number;
      isStatic?: boolean;
}

export interface CommonFiltersProps {
      filters: Record<string, any>; // Current applied filters
      staticFilters: FilterConfig[];
      dynamicFilters: FilterConfig[];
      onStaticFilterChange: (key: string, value: any) => void;
      onApplyDynamicFilters: (newFilters: Record<string, any>) => void;
      onClearFilters: () => void;
      searchQuery?: string;
      onSearchChange?: (query: string) => void;
      searchPlaceholder?: string;
      locationQuery?: string;
      onLocationChange?: (query: string) => void;
      locationPlaceholder?: string;
      className?: string;
}

export const CommonFilters = ({
      filters,
      staticFilters,
      dynamicFilters,
      onStaticFilterChange,
      onApplyDynamicFilters,
      onClearFilters,
      searchQuery = "",
      onSearchChange,
      searchPlaceholder = "Search...",
      locationQuery,
      onLocationChange,
      locationPlaceholder = "Location...",
      className,
}: CommonFiltersProps) => {
      const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
      const [pendingDynamicFilters, setPendingDynamicFilters] = useState<Record<string, any>>({});

      // Use debounced value hook for search input
      const [localSearchQuery, setLocalSearchQuery] = useDebouncedValue(
            searchQuery,
            (value) => {
                  if (onSearchChange) {
                        onSearchChange(value);
                  }
            },
            500
      );

      // Initialize pending filters when dialog opens
      useEffect(() => {
            if (isAdvancedOpen) {
                  // Create a subset of filters that match dynamic keys
                  const initialPending: Record<string, any> = {};
                  dynamicFilters.forEach(config => {
                        if (filters[config.key] !== undefined) {
                              initialPending[config.key] = filters[config.key];
                        }
                  });
                  setPendingDynamicFilters(initialPending);
            }
      }, [isAdvancedOpen, filters, dynamicFilters]);


      const activeFilters = Object.entries(filters).filter(
            ([, value]) =>
                  value && value !== "" && (Array.isArray(value) ? value.length > 0 : true)
      );

      const renderFilterControl = (
            filterConfig: FilterConfig,
            currentValues: Record<string, any>,
            onChange: (key: string, value: any) => void
      ) => {
            const {
                  key,
                  type,
                  options = [],
                  placeholder,
                  min = 0,
                  max = 100,
                  step = 1,
            } = filterConfig;
            const value = currentValues[key];

            switch (type) {
                  case "select":
                        return (
                              <FormField
                                    className="text-sm w-full"
                                    label={filterConfig.label}
                                    required={false}
                              >
                                    <Select
                                          value={value || ""}
                                          onValueChange={(newValue) => onChange(key, newValue)}
                                    >
                                          <SelectTrigger className="w-full bg-gray-100 border-none text-black font-semibold hover:bg-gray-200 cursor-pointer">
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
                        );

                  case "range":
                        return (
                              <FormField
                                    label={filterConfig.label}
                                    required={false}
                                    className="-space-y-2"
                              >
                                    <div className="w-40">
                                          <div className="py-2  rounded-md bg-white">
                                                <div className="text-xs text-gray-600 mb-2">
                                                      {value && Array.isArray(value) && value.length === 2
                                                            ? `${value[0].toLocaleString()} - ${value[1].toLocaleString()}`
                                                            : `${min.toLocaleString()} - ${max.toLocaleString()}`}
                                                </div>
                                                <Slider
                                                      value={value || [min, max]}
                                                      onValueChange={(newValue) => onChange(key, newValue)}
                                                      min={min}
                                                      max={max}
                                                      step={step}
                                                      className="w-full"
                                                />
                                          </div>
                                    </div>
                              </FormField>
                        );

                  case "multiselect":
                        return (
                              <FormField label={filterConfig.label} required={false}>
                                    <div className="w-full">
                                          <Select
                                                value=""
                                                onValueChange={(newValue) => {
                                                      const currentValuesList = Array.isArray(value) ? value : [];
                                                      if (!currentValuesList.includes(newValue)) {
                                                            onChange(key, [...currentValuesList, newValue]);
                                                      }
                                                }}
                                          >
                                                <SelectTrigger className="w-full">
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
                                          {Array.isArray(value) && value.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                      {value.map((selectedValue: string) => (
                                                            <Badge
                                                                  key={selectedValue}
                                                                  variant="secondary"
                                                                  className="text-xs"
                                                            >
                                                                  {selectedValue}
                                                                  <button
                                                                        onClick={() => {
                                                                              const newValues = value.filter(
                                                                                    (v: string) => v !== selectedValue
                                                                              );
                                                                              onChange(key, newValues);
                                                                        }}
                                                                        className="ml-1 hover:text-red-500"
                                                                  >
                                                                        ×
                                                                  </button>
                                                            </Badge>
                                                      ))}
                                                </div>
                                          )}
                                    </div>
                              </FormField>
                        );

                  case "search":
                        return (
                              <FormField label={filterConfig.label} required={false}>
                                    <Input
                                          placeholder={placeholder}
                                          value={value || ""}
                                          onChange={(e) => onChange(key, e.target.value)}
                                          className="w-40"
                                    />
                              </FormField>
                        );

                  case "calendar":
                        return (
                              <FormField label={filterConfig.label} required={false}>
                                    <div className="min-w-40">
                                          <NaturalLanguageCalendar
                                                value={value || ""}
                                                onChange={(newValue) => onChange(key, newValue)}
                                                placeholder={placeholder || "Tomorrow"}
                                          />
                                    </div>
                              </FormField>
                        );

                  default:
                        return null;
            }
      };

      const handlePendingFilterChange = (key: string, value: any) => {
            setPendingDynamicFilters((prev) => ({
                  ...prev,
                  [key]: value,
            }));
      };

      const handleApplyFilters = () => {
            onApplyDynamicFilters(pendingDynamicFilters);
            setIsAdvancedOpen(false);
      };

      const handleClearAll = () => {
            onClearFilters();
            setPendingDynamicFilters({});
      }

      return (
            <Card
                  className={cn(
                        "mx-4 lg:mx-0 shadow-none bg-transparent sm:bg-white sm:shadow-sm border border-none sm:border sm:border-[#F5EBFF] rounded-xl",
                        className
                  )}
            >
                  <CardContent className=" p-0">
                        <div className="border-b p-4 hidden sm:block">
                              <div className="flex gap-3">
                                    {/* Search Bar */}
                                    {onSearchChange && (
                                          <Input
                                                leftIcon={<Search className="h-4 w-4" />}
                                                placeholder={searchPlaceholder}
                                                value={localSearchQuery}
                                                onChange={(e) => setLocalSearchQuery(e.target.value)}
                                                className="pl-10 bg-gray-100 border-0 flex-1"
                                          />
                                    )}
                                    {/* Location Bar */}
                                    {onLocationChange && (
                                          <Input
                                                leftIcon={<MapPin className="h-4 w-4" />}
                                                placeholder={locationPlaceholder}
                                                value={locationQuery}
                                                onChange={(e) => onLocationChange(e.target.value)}
                                                className="pl-10 bg-gray-100 border-0 flex-1"
                                          />
                                    )}
                              </div>
                        </div>

                        {/* Filter Controls - Static Filters Outside Dialog */}
                        <div className="min-w-full flex items-end gap-3 pb-4 sm:p-4 border-b sm:border-none whitespace-nowrap relative">
                              <div className="flex flex-1 gap-3 overflow-x-auto scrollbar-hide">
                                    {staticFilters.map((filterConfig) => (
                                          <div key={filterConfig.key} className="min-w-40 shrink-0">
                                                {renderFilterControl(filterConfig, filters, onStaticFilterChange)}
                                          </div>
                                    ))}
                              </div>

                              {/* Advanced Filters Dialog - Dynamic Filters Inside */}
                              <ResponsiveDialogDrawer
                                    open={isAdvancedOpen}
                                    onOpenChange={setIsAdvancedOpen}
                                    title="Advanced Filters"
                                    trigger={
                                          <Button
                                                icon={<SlidersHorizontal className="h-4 w-4 -mr-3 sm:-mr-2" />}
                                                iconPosition="left"
                                                className="w-40 border-purple-200 sticky top-0 right-0"
                                          >
                                                <span className="sm:block hidden">More Filters</span>
                                          </Button>
                                    }
                                    dialogContentClassName="max-w-full overflow-y-auto max-h-[80vh]"
                                    drawerContentClassName="max-h-[80vh] overflow-y-auto"
                              >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 w-full">
                                          {dynamicFilters.length > 0 ? (
                                                dynamicFilters.map((filterConfig) => (
                                                      <div key={filterConfig.key} className="space-y-2 w-full">
                                                            {renderFilterControl(
                                                                  filterConfig,
                                                                  pendingDynamicFilters,
                                                                  handlePendingFilterChange
                                                            )}
                                                      </div>
                                                ))
                                          ) : (
                                                <div className="text-center text-gray-500 py-8">
                                                      No additional filters available
                                                </div>
                                          )}
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4 border-t sticky bottom-0 bg-white">
                                          <Button
                                                variant="outline"
                                                onClick={() => setPendingDynamicFilters({})}
                                          >
                                                Clear Dialog
                                          </Button>
                                          <Button onClick={handleApplyFilters}>Apply Filters</Button>
                                    </div>
                              </ResponsiveDialogDrawer>
                        </div>

                        {/* Active Filters */}
                        {activeFilters.length > 0 && (
                              <div className="flex items-center border-t p-2">
                                    <div className="flex flex-wrap gap-2">
                                          {activeFilters.map(([key, value]) => {
                                                const filterConfig = [
                                                      ...staticFilters,
                                                      ...dynamicFilters,
                                                ].find((c) => c.key === key);

                                                // Format display value
                                                let displayValue: string;
                                                if (Array.isArray(value)) {
                                                      // Handle range arrays (e.g., price range)
                                                      if (
                                                            value.length === 2 &&
                                                            typeof value[0] === "number" &&
                                                            typeof value[1] === "number"
                                                      ) {
                                                            // Format as price range if it's a numeric range
                                                            const isPriceFilter = key === "price";
                                                            if (isPriceFilter) {
                                                                  displayValue = `${value[0].toLocaleString()} - ${value[1].toLocaleString()}`;
                                                            } else {
                                                                  displayValue = `${value[0]} - ${value[1]}`;
                                                            }
                                                      } else {
                                                            displayValue = value.join(", ");
                                                      }
                                                } else if (value === "true" || value === true) {
                                                      displayValue = "YES";
                                                } else if (value === "false" || value === false) {
                                                      displayValue = "NO";
                                                } else {
                                                      displayValue = String(value);
                                                }

                                                // Get filter label - use config label, or format the key as fallback
                                                const filterLabel =
                                                      filterConfig?.label ||
                                                      key.charAt(0).toUpperCase() +
                                                      key.slice(1).replace(/([A-Z])/g, " $1");

                                                return (
                                                      <Badge
                                                            key={key}
                                                            variant="secondary"
                                                            className="bg-purple-100 text-purple-700"
                                                      >
                                                            {filterLabel}: {displayValue}
                                                            <button
                                                                  onClick={() =>
                                                                        // For clear individual, we treat it as static change (immediate)
                                                                        onStaticFilterChange(
                                                                              key,
                                                                              filterConfig?.type === "multiselect" ? [] : ""
                                                                        )
                                                                  }
                                                                  className="ml-2 hover:text-purple-900"
                                                            >
                                                                  ×
                                                            </button>
                                                      </Badge>
                                                );
                                          })}
                                    </div>
                                    <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={handleClearAll}
                                          className="text-gray-500 h-6"
                                    >
                                          Clear all
                                    </Button>
                              </div>
                        )}
                  </CardContent>
            </Card>
      );
};
