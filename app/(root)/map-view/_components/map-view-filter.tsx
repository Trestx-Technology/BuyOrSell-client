"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronDown,
  MapPin,

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

export interface MapViewFilterProps {
  className?: string;
  onFilterChange?: (filters: MapViewFilters) => void;
}

export interface MapViewFilters {
  buyType: string;
  location: string;
  propertyType: string;
  residential: string;
  bedsBaths: string;
  price: string;
  area: string;
  showMap: boolean;
}

export default function MapViewFilter({
  className,
  onFilterChange,
}: MapViewFilterProps) {
  const [filters, setFilters] = useState<MapViewFilters>({
    buyType: "Buy",
    location: "",
    propertyType: "Location",
    residential: "Residential",
    bedsBaths: "",
    price: "",
    area: "",
    showMap: true,
  });

  const [activePropertyType, setActivePropertyType] = useState("Location");

  const handleFilterChange = (
    key: keyof MapViewFilters,
    value: string | boolean
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handlePropertyTypeChange = (type: string) => {
    setActivePropertyType(type);
    handleFilterChange("propertyType", type);
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

  // Filter options data
  const buyTypeOptions = ["Buy", "Rent"];
  const residentialOptions = ["Residential", "Commercial"];
  const bedsBathsOptions = ["1B 1B", "2B 2B", "3B 2B", "4B 3B", "5B 4B", "Any"];
  const priceOptions = [
    "Any",
    "Under 500K",
    "500K - 1M",
    "1M - 2M",
    "2M - 5M",
    "5M+",
  ];
  const areaOptions = [
    "Any",
    "Under 500 sqft",
    "500-1000 sqft",
    "1000-2000 sqft",
    "2000-5000 sqft",
    "5000+ sqft",
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "flex items-center justify-between max-w-[1080px] mx-auto gap-2.5 xl:px-0 px-5 py-2  bg-white  border-gray-200 overflow-x-auto",
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

      {/* Buy Filter */}
      <motion.div variants={itemVariants}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={!filters.buyType ? "outline" : "secondary"}
              className={cn(
                "flex items-center gap-2.5 px-3 h-10 rounded-lg cursor-pointer transition-colors text-xs border-gray-300",
                !filters.buyType && "text-gray-500"
              )}
              icon={<ChevronDown className="size-5 -ml-2" />}
              iconPosition="right"
              size="small"
            >
              {filters.buyType}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            {buyTypeOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleFilterChange("buyType", option)}
                className="cursor-pointer"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Property Type Filter */}
      <motion.div variants={itemVariants}>
        <Tabs
          value={activePropertyType}
          onValueChange={handlePropertyTypeChange}
          className="w-full"
        >
          <TabsList className="flex gap-2 w-full  h-10 border border-[#E7E7E7] rounded-lg p-1">
            <TabsTrigger
              value="Location"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter"
            >
              Location
            </TabsTrigger>
            <TabsTrigger
              value="Ready"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter"
            >
              Ready
            </TabsTrigger>
            <TabsTrigger
              value="Off-Plan"
              className="data-[state=active]:bg-[#E8D7F9] data-[state=active]:text-[#8B31E1] rounded-lg py-2 text-xs font-normal font-inter"
            >
              Off-Plan
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Residential Filter */}
      <motion.div variants={itemVariants}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={!filters.residential ? "outline" : "secondary"}
              className={cn(
                "flex items-center gap-2.5 px-3 h-10 rounded-lg cursor-pointer transition-colors text-xs border-gray-300",
                !filters.residential && "text-gray-500"
              )}
              icon={<ChevronDown className="size-5 -ml-2" />}
              iconPosition="right"
              size="small"
            >
              {filters.residential}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            {residentialOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleFilterChange("residential", option)}
                className="cursor-pointer"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Beds & Baths Filter */}
      <motion.div variants={itemVariants}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={!filters.bedsBaths ? "outline" : "secondary"}
              className={cn(
                "flex items-center gap-2.5 px-3 h-10 rounded-lg cursor-pointer transition-colors text-xs border-gray-300",
                !filters.bedsBaths && "text-gray-500"
              )}
              icon={<ChevronDown className="size-5 -ml-2" />}
              iconPosition="right"
              size="small"
            >
              {filters.bedsBaths || "Beds & Baths"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-32">
            {bedsBathsOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleFilterChange("bedsBaths", option)}
                className="cursor-pointer"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Price Filter */}
      <motion.div variants={itemVariants}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={!filters.price ? "outline" : "secondary"}
              className={cn(
                "flex items-center gap-2.5 px-3 h-10 rounded-lg cursor-pointer transition-colors text-xs border-gray-300",
                !filters.price && "text-gray-500"
              )}
              icon={<ChevronDown className="size-5 -ml-2" />}
              iconPosition="right"
              size="small"
            >
              {filters.price || "Price (AED)"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {priceOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleFilterChange("price", option)}
                className="cursor-pointer"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Area Filter */}
      <motion.div variants={itemVariants}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={!filters.area ? "outline" : "secondary"}
              className={cn(
                "flex items-center gap-2.5 px-3 h-10 rounded-lg cursor-pointer transition-colors text-xs border-gray-300",
                !filters.area && "text-gray-500"
              )}
              icon={<ChevronDown className="size-5 -ml-2" />}
              iconPosition="right"
              size="small"
            >
              {filters.area || "Area (sqft)"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            {areaOptions.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleFilterChange("area", option)}
                className="cursor-pointer"
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

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
