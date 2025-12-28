/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { cn } from "@/lib/utils";

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
}

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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const activeFilters = Object.entries(filters).filter(
    ([_, value]) =>
      value && value !== "" && (Array.isArray(value) ? value.length > 0 : true)
  );

  const renderFilterControl = (filterConfig: FilterConfig) => {
    const {
      key,
      type,
      options = [],
      placeholder,
      min = 0,
      max = 100,
      step = 1,
    } = filterConfig;
    const value = filters[key];

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
              onValueChange={(newValue) => onFilterChange(key, newValue)}
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
          <FormField label={filterConfig.label} required={false}>
            <div className="w-40">
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-white">
                <div className="text-sm text-gray-600 mb-2">
                  {value ? `${value[0]} - ${value[1]}` : `${min} - ${max}`}
                </div>
                <Slider
                  value={value || [min, max]}
                  onValueChange={(newValue) => onFilterChange(key, newValue)}
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
            <div className="w-40">
              <Select
                value=""
                onValueChange={(newValue) => {
                  const currentValues = Array.isArray(value) ? value : [];
                  if (!currentValues.includes(newValue)) {
                    onFilterChange(key, [...currentValues, newValue]);
                  }
                }}
              >
                <SelectTrigger>
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
                  {value.map((selectedValue) => (
                    <Badge
                      key={selectedValue}
                      variant="secondary"
                      className="text-xs"
                    >
                      {selectedValue}
                      <button
                        onClick={() => {
                          const newValues = value.filter(
                            (v) => v !== selectedValue
                          );
                          onFilterChange(key, newValues);
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
              onChange={(e) => onFilterChange(key, e.target.value)}
              className="w-40"
            />
          </FormField>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "mx-4 lg:mx-0 shadow-none bg-transparent sm:bg-white sm:shadow-sm border border-none sm:border sm:border-[#F5EBFF] rounded-xl",
        className
      )}
    >
      <CardContent className="p-0">
        {/* Search Inputs */}
        <div className="border-b p-4 hidden sm:block">
          <div className="flex gap-3">
            <Input
              leftIcon={<Search className="h-4 w-4" />}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-gray-100 border-0 flex-1"
            />
            <Input
              leftIcon={<MapPin className="h-4 w-4" />}
              placeholder={locationPlaceholder}
              value={locationQuery}
              onChange={(e) => onLocationChange(e.target.value)}
              className="pl-10 bg-gray-100 border-0 flex-1"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="min-w-full flex items-end gap-3 pb-4 sm:p-4 border-b sm:border-none whitespace-nowrap overflow-x-auto scrollbar-hide relative">
          {config.map((filterConfig) => (
            <div key={filterConfig.key} className="w-40 shrink-0">
              {renderFilterControl(filterConfig)}
            </div>
          ))}

          {/* Advanced Filters Dialog */}
          <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <DialogTrigger asChild>
              <Button
                icon={
                  <SlidersHorizontal className="h-4 w-4 -mr-3 sm:-mr-2" />
                }
                iconPosition="left"
                className="w-40 border-purple-200 sticky top-0 right-0"
              >
                <span className="sm:block hidden">More Filters</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Advanced Filters</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {config.map((filterConfig) => (
                  <div key={filterConfig.key} className="space-y-2">
                    {renderFilterControl(filterConfig)}
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={onClearFilters}>
                  Clear All
                </Button>
                <Button onClick={() => setIsAdvancedOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center border-t p-2">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => {
                const filterConfig = config.find((c) => c.key === key);
                const displayValue = Array.isArray(value)
                  ? value.join(", ")
                  : value;

                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700"
                  >
                    {filterConfig?.label}: {displayValue}
                    <button
                      onClick={() =>
                        onFilterChange(
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
              onClick={onClearFilters}
              className="text-gray-500 h-6"
            >
              Clear all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

