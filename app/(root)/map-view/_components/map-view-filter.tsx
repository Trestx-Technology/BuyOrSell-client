"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProductExtraFields } from "@/interfaces/ad";
import { useMemo } from "react";
import { format } from "date-fns";

export interface MapViewFilters {
  location: string;
  price: string;
  datePosted: string;
  priceFrom?: string;
  priceTo?: string;
  deal?: boolean;
  fromDate?: string;
  toDate?: string;
  isFeatured?: boolean;
  hasVideo?: boolean;
  showMap: boolean;
  // Dynamic extraFields filters - key is the field name, value is the selected value
  extraFields?: Record<string, string>;
}

export interface MapViewFilterProps {
  className?: string;
  extraFields?: ProductExtraFields; // Array of extraFields from ads
  onFilterChange?: (filters: MapViewFilters) => void;
}

export default function MapViewFilter({
  className,
  extraFields,
  onFilterChange,
}: MapViewFilterProps) {
  const [filters, setFilters] = useState<MapViewFilters>({
    location: "",
    price: "",
    datePosted: "",
    priceFrom: "",
    priceTo: "",
    deal: undefined,
    fromDate: "",
    toDate: "",
    isFeatured: undefined,
    hasVideo: undefined,
    showMap: true,
    extraFields: {},
  });

  // Extract extraFields and use optionalArray for filter options
  const dynamicFilters = useMemo(() => {
    if (!extraFields || !Array.isArray(extraFields) || extraFields.length === 0) {
      return [];
    }

    // Filter fields that have optionalArray (dropdown, searchableDropdown, checkboxes)
    // and exclude boolean fields (they don't need dropdown filters)
    return extraFields
      .filter((field) => {
        // Only include fields that have optionalArray and are not boolean type
        return (
          field.optionalArray &&
          Array.isArray(field.optionalArray) &&
          field.optionalArray.length > 0 &&
          field.type !== 'bool'
        );
      })
      .map((field) => ({
        name: field.name,
        options: field.optionalArray as string[],
        type: field.type,
      }));
  }, [extraFields]);

  const handleFilterChange = (
    key: keyof MapViewFilters,
    value: string | boolean | Record<string, string> | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleExtraFieldChange = (fieldName: string, value: string) => {
    const newExtraFields = {
      ...(filters.extraFields || {}),
      [fieldName]: value,
    };
    handleFilterChange("extraFields", newExtraFields);
  };

  const clearExtraField = (fieldName: string) => {
    const newExtraFields = { ...(filters.extraFields || {}) };
    delete newExtraFields[fieldName];
    handleFilterChange("extraFields", newExtraFields);
  };

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        duration: 0.5,
      },
    },
    
  };

  // Common filter options
  const priceOptions = [
    "Any",
    "Under 500K",
    "500K - 1M",
    "1M - 2M",
    "2M - 5M",
    "5M+",
  ];
  
  const datePostedOptions = [
    "Any",
    "Last 24 hours",
    "Last 7 days",
    "Last 30 days",
    "Last 3 months",
  ];

  // Helper function to render filter as tabs (2-3 options) or dropdown (more options)
  const renderFilter = (
    filterKey: keyof MapViewFilters,
    filterName: string,
    options: string[],
    currentValue: string
  ) => {
    const shouldUseTabs = options.length >= 2 && options.length <= 3;
    const displayOptions = options.filter(opt => opt !== "Any");
    const allOptions = ["Any", ...displayOptions];
    
    if (shouldUseTabs) {
      return (
        <Tabs
          value={currentValue || "Any"}
          onValueChange={(value) => handleFilterChange(filterKey, value === "Any" ? "" : value)}
          className="w-full"
        >
          <TabsList className="flex gap-2 h-10 border border-[#E7E7E7] rounded-lg p-1 bg-transparent">
            {allOptions.map((option) => (
              <TabsTrigger
                key={option}
                value={option}
                className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
              >
                {option}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      );
    }

    // Use dropdown for more than 3 options
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={!currentValue ? "outline" : "secondary"}
            className={cn(
              "flex items-center gap-2.5 px-3 h-10 rounded-lg cursor-pointer transition-colors text-xs border-gray-300",
              !currentValue && "text-gray-500"
            )}
            icon={<ChevronDown className="size-5 -ml-2" />}
            iconPosition="right"
            size="small"
          >
            {currentValue || filterName}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          {allOptions.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleFilterChange(filterKey, option === "Any" ? "" : option)}
              className="cursor-pointer"
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Helper function to render dynamic extraField filter
  const renderDynamicFilter = (
    filterName: string,
    options: string[],
    currentValue: string | undefined
  ) => {
    const shouldUseTabs = options.length >= 2 && options.length <= 3;
    const allOptions = ["Any", ...options];
    
    if (shouldUseTabs) {
      return (
        <Tabs
          value={currentValue || "Any"}
          onValueChange={(value) => {
            if (value === "Any") {
              clearExtraField(filterName);
            } else {
              handleExtraFieldChange(filterName, value);
            }
          }}
          className="w-full"
        >
          <TabsList className="flex gap-2 h-10 border border-[#E7E7E7] rounded-lg p-1 bg-transparent">
            {allOptions.map((option) => (
              <TabsTrigger
                key={option}
                value={option}
                className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
              >
                {option}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      );
    }

    // Use dropdown for more than 3 options
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={!currentValue ? "outline" : "secondary"}
            className={cn(
              "flex items-center gap-2.5 px-3 h-10 rounded-lg cursor-pointer transition-colors text-xs border-gray-300",
              !currentValue && "text-gray-500"
            )}
            icon={<ChevronDown className="size-5 -ml-2" />}
            iconPosition="right"
            size="small"
          >
            {currentValue || filterName}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 max-h-[300px] overflow-y-auto">
          <DropdownMenuItem
            onClick={() => clearExtraField(filterName)}
            className="cursor-pointer text-gray-500"
          >
            Any
          </DropdownMenuItem>
          {options.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => handleExtraFieldChange(filterName, option)}
              className="cursor-pointer"
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "flex items-center justify-start max-w-[1080px] mx-auto gap-2.5 xl:px-0 px-5 py-2  bg-white scrollbar-hide border-gray-200 overflow-x-auto",
        className
      )}
    >
      {/* Location Input */}
      <motion.div variants={itemVariants}>
        <Input
          type="text"
          placeholder="Enter Location"
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
          className="w-32 h-10 bg-[#F2F4F7] border-[#E7E7E7] text-[#475467] placeholder:text-[#929292] text-xs"
          rightIcon={<MapPin className="w-5 h-5 text-[#929292]" />}
        />
      </motion.div>

      {/* Price Filter */}
      <motion.div variants={itemVariants}>
        {renderFilter("price", "Price (AED)", priceOptions, filters.price)}
      </motion.div>

      {/* Date Posted Filter */}
      <motion.div variants={itemVariants}>
        {renderFilter("datePosted", "Date Posted", datePostedOptions, filters.datePosted)}
      </motion.div>

      {/* Price From Input */}
      <motion.div variants={itemVariants}>
        <Input
          type="number"
          placeholder="Price From"
          value={filters.priceFrom || ""}
          onChange={(e) => handleFilterChange("priceFrom", e.target.value)}
          className="w-28 h-10 bg-[#F2F4F7] border-[#E7E7E7] text-[#475467] placeholder:text-[#929292] text-xs"
        />
      </motion.div>

      {/* Price To Input */}
      <motion.div variants={itemVariants}>
        <Input
          type="number"
          placeholder="Price To"
          value={filters.priceTo || ""}
          onChange={(e) => handleFilterChange("priceTo", e.target.value)}
          className="w-28 h-10 bg-[#F2F4F7] border-[#E7E7E7] text-[#475467] placeholder:text-[#929292] text-xs"
        />
      </motion.div>

      {/* Deal Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs
          value={filters.deal === undefined ? "Any" : filters.deal ? "Yes" : "No"}
          onValueChange={(value) => {
            if (value === "Any") {
              handleFilterChange("deal", undefined);
            } else {
              handleFilterChange("deal", value === "Yes");
            }
          }}
          className="w-full"
        >
          <TabsList className="flex gap-2 h-10 border border-[#E7E7E7] rounded-lg p-1 bg-transparent">
            <TabsTrigger
              value="Any"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
            >
              Any
            </TabsTrigger>
            <TabsTrigger
              value="Yes"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
            >
              Deal
            </TabsTrigger>
            <TabsTrigger
              value="No"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
            >
              No Deal
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* From Date Calendar */}
      <motion.div variants={itemVariants}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-fit h-10 font-normal text-xs",
                "bg-[#F2F4F7] border-[#E7E7E7] text-[#475467]",
                !filters.fromDate && "text-[#929292]"
              )}
              icon={<CalendarIcon />}
              iconPosition="left"
            >
              {filters.fromDate ? format(new Date(filters.fromDate), "MMM dd, yyyy") : "From Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.fromDate ? new Date(filters.fromDate) : undefined}
              onSelect={(date) => {
                handleFilterChange("fromDate", date ? format(date, "yyyy-MM-dd") : "");
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </motion.div>

      {/* To Date Calendar */}
      <motion.div variants={itemVariants}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-fit h-10 font-normal text-xs",
                "bg-[#F2F4F7] border-[#E7E7E7] text-[#475467]",
                !filters.toDate && "text-[#929292]"
              )}
              icon={<CalendarIcon />}
              iconPosition="left"
            >
              {filters.toDate ? format(new Date(filters.toDate), "MMM dd, yyyy") : "To Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.toDate ? new Date(filters.toDate) : undefined}
              onSelect={(date) => {
                handleFilterChange("toDate", date ? format(date, "yyyy-MM-dd") : "");
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </motion.div>

      {/* Is Featured Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs
          value={filters.isFeatured === undefined ? "Any" : filters.isFeatured ? "Yes" : "No"}
          onValueChange={(value) => {
            if (value === "Any") {
              handleFilterChange("isFeatured", undefined);
            } else {
              handleFilterChange("isFeatured", value === "Yes");
            }
          }}
          className="w-full"
        >
          <TabsList className="flex gap-2 h-10 border border-[#E7E7E7] rounded-lg p-1 bg-transparent">
            <TabsTrigger
              value="Any"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
            >
              Any
            </TabsTrigger>
            <TabsTrigger
              value="Yes"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger
              value="No"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
            >
              Not Featured
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Has Video Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs
          value={filters.hasVideo === undefined ? "Any" : filters.hasVideo ? "Yes" : "No"}
          onValueChange={(value) => {
            if (value === "Any") {
              handleFilterChange("hasVideo", undefined);
            } else {
              handleFilterChange("hasVideo", value === "Yes");
            }
          }}
          className="w-full"
        >
          <TabsList className="flex gap-2 h-10 border border-[#E7E7E7] rounded-lg p-1 bg-transparent">
            <TabsTrigger
              value="Any"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
            >
              Any
            </TabsTrigger>
            <TabsTrigger
              value="Yes"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
            >
              Has Video
            </TabsTrigger>
            <TabsTrigger
              value="No"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter flex-1"
            >
              No Video
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Dynamic ExtraFields Filters */}
      {dynamicFilters.length > 0 && dynamicFilters.map((filter) => (
        <motion.div key={filter.name} variants={itemVariants}>
          {renderDynamicFilter(
            filter.name,
            filter.options,
            filters.extraFields?.[filter.name]
          )}
        </motion.div>
      ))}

      {/* Map Toggle Button */}
      <motion.div variants={itemVariants}>
        <Button
          variant={filters.showMap ? "outline" : "secondary"}
          onClick={() => handleFilterChange("showMap", !filters.showMap)}
          className={cn(
            "flex items-center gap-1 px-3 h-10 rounded-lg cursor-pointer transition-colors border-gray-300 text-xs",
            filters.showMap && "text-gray-500"
          )}
          icon={<MapPin className="size-5 -mr-2" />}
          iconPosition="left"
          size="small"
        >
          Map
        </Button>
      </motion.div>
    </motion.div>
  );
}
