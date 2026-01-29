/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GlobalMoreFilters } from "./global-more-filters";
import { FilterControl, FilterConfig } from "./filter-control";
import { useUrlParams } from "@/hooks/useUrlParams";

export interface CommonFiltersProps {
      filters: Record<string, any>; // Current applied filters
      staticFilters: FilterConfig[];
      onStaticFilterChange: (key: string, value: any) => void;
      onClearFilters: () => void;
      searchQuery?: string;
      onSearchChange?: (query: string) => void;
      searchPlaceholder?: string;
      locationQuery?: string;
      onLocationChange?: (query: string) => void;
      locationPlaceholder?: string;
      className?: string;
      dontValidate?: boolean;
}

export const CommonFilters = ({
      filters,
      staticFilters,
      onStaticFilterChange,
      searchQuery = "",
      onSearchChange,
      searchPlaceholder = "Search...",
      locationQuery,
      onLocationChange,
      locationPlaceholder = "Location...",
      className,
      dontValidate,
}: CommonFiltersProps) => {
      const { updateUrlParam, searchParams } = useUrlParams();

      // Wrapper for static filter changes
      const handleStaticChange = (key: string, value: any) => {
            onStaticFilterChange(key, value);
      };

      // Wrapper for location changes
      const handleLocationChange = (value: string) => {
            if (onLocationChange) onLocationChange(value);
      };

      // Initialize from URL on mount
      useEffect(() => {
            // Sync static filters
            staticFilters.forEach((config) => {
                  const urlValue = searchParams.get(config.key);
                  if (urlValue && filters[config.key] !== urlValue) {
                        // specialized parsing for array types could go here if needed
                        // for now treating as string which works for most 'select' types
                        // For ranges/multiselect, 'urlValue' string "a,b" needs splitting
                        if (config.type === "multiselect" || config.type === "range") {
                              const arr = urlValue.split(",");
                              // converting numbers for range?
                              if (config.type === "range") {
                                    const nums = arr.map(Number);
                                    onStaticFilterChange(config.key, nums);
                              } else {
                                    onStaticFilterChange(config.key, arr);
                              }
                        } else {
                              onStaticFilterChange(config.key, urlValue);
                        }
                  }
            });

            // Sync Search
            const urlSearch = searchParams.get("search");
            if (urlSearch && urlSearch !== searchQuery && onSearchChange) {
                  onSearchChange(urlSearch);
            }

            // Sync Location
            const urlLocation = searchParams.get("location");
            if (urlLocation && urlLocation !== locationQuery && onLocationChange) {
                  onLocationChange(urlLocation);
            }
      }, []);

      // Use debounced value hook for search input
      const [localSearchQuery, setLocalSearchQuery] = useDebouncedValue(
            searchQuery,
            (value) => {
                  updateUrlParam("search", value);
                  if (onSearchChange) {
                        onSearchChange(value);
                  }
            },
            500
      );

      // Sync local search query if initialized from URL (via prop change)
      useEffect(() => {
            if (searchQuery !== localSearchQuery) {
                  setLocalSearchQuery(searchQuery);
            }
      }, [searchQuery]); 

      return (
            <Card
                  className={cn(
                        "shadow-none bg-transparent sm:bg-white sm:shadow-sm border border-none sm:border sm:border-[#F5EBFF] rounded-xl",
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
                                                onChange={(e) => handleLocationChange(e.target.value)}
                                                className="pl-10 bg-gray-100 border-0 flex-1"
                                          />
                                    )}
                              </div>
                        </div>

                        {/* Filter Controls - Static Filters Outside Dialog */}
                        <div className="min-w-full flex items-end gap-3 border-b sm:border-none whitespace-nowrap relative">
                              <div className="flex flex-1 items-end gap-3 overflow-x-auto pb-4 sm:p-4 scrollbar-hide relative">
                                    {staticFilters.map((filterConfig) => (
                                          <div key={filterConfig.key} className="min-w-40 shrink-0">
                                                <FilterControl
                                                      filterConfig={filterConfig}
                                                      currentValues={filters}
                                                      onChange={handleStaticChange}
                                                />
                                          </div>
                                    ))}
                              {/* Advanced Filters Dialog - GlobalMoreFilters */}
                                    <GlobalMoreFilters dontValidate={dontValidate} />
                              </div>

                        </div>
                  </CardContent>
            </Card>
      );
};
