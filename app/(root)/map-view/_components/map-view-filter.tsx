"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronDown,
  MapPin,
  Home,
  Bed,
  DollarSign,
  Ruler,
  Map,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        "flex items-center justify-center gap-2.5 px-4 py-2  bg-white  border-gray-200",
        className
      )}
    >
      {/* Buy Filter */}
      <motion.div variants={itemVariants}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 px-3 py-2.5 h-10 bg-[#F2F4F7] border border-[#E7E7E7] rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-xs font-normal text-[#475467] font-inter">
                {filters.buyType}
              </span>
              <ChevronDown className="w-4 h-4 text-[#475467]" />
            </button>
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

      {/* Property Type Filter */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 px-1 py-2.5 h-10 bg-[#F2F4F7] border border-[#E7E7E7] rounded-lg shadow-sm">
          {/* Location Option */}
          <div
            className={cn(
              "px-2 py-0 h-8 rounded-lg cursor-pointer transition-colors",
              activePropertyType === "Location"
                ? "bg-[#E8D7F9] text-[#8B31E1]"
                : "bg-[#8B31E1] text-white"
            )}
            onClick={() => handlePropertyTypeChange("Location")}
          >
            <span className="text-xs font-normal font-inter">Location</span>
          </div>

          {/* Ready Option */}
          <div
            className={cn(
              "px-2 py-0 h-8 rounded-lg cursor-pointer transition-colors",
              activePropertyType === "Ready"
                ? "bg-[#E8D7F9] text-[#8B31E1]"
                : "bg-[#8B31E1] text-white"
            )}
            onClick={() => handlePropertyTypeChange("Ready")}
          >
            <span className="text-xs font-normal font-inter">Ready</span>
          </div>

          {/* Off-Plan Option */}
          <div
            className={cn(
              "px-2 py-0 h-8 rounded-lg cursor-pointer transition-colors",
              activePropertyType === "Off-Plan"
                ? "bg-[#E8D7F9] text-[#8B31E1]"
                : "bg-[#8B31E1] text-white"
            )}
            onClick={() => handlePropertyTypeChange("Off-Plan")}
          >
            <span className="text-xs font-normal font-inter">Off-Plan</span>
          </div>
        </div>
      </motion.div>

      {/* Residential Filter */}
      <motion.div variants={itemVariants}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2.5 px-3 py-2.5 h-10 bg-[#F2F4F7] border border-[#E7E7E7] rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-xs font-normal text-[#475467] font-inter">
                {filters.residential}
              </span>
              <Home className="w-[22px] h-[22px] text-[#475467]" />
            </button>
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
            <button className="flex items-center gap-2.5 px-3 py-2.5 h-10 bg-[#F2F4F7] border border-[#E7E7E7] rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-xs font-normal text-[#475467] font-inter">
                {filters.bedsBaths || "Beds & Baths"}
              </span>
              <Bed className="w-[22px] h-[22px] text-[#475467]" />
            </button>
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
            <button className="flex items-center gap-2.5 px-3 py-2.5 h-10 bg-[#F2F4F7] border border-[#E7E7E7] rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-xs font-normal text-[#475467] font-inter">
                {filters.price || "Price (AED)"}
              </span>
              <DollarSign className="w-[22px] h-[22px] text-[#475467]" />
            </button>
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
            <button className="flex items-center gap-2.5 px-3 py-2.5 h-10 bg-[#F2F4F7] border border-[#E7E7E7] rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-xs font-normal text-[#475467] font-inter">
                {filters.area || "Area (sqft)"}
              </span>
              <Ruler className="w-[22px] h-[22px] text-[#475467]" />
            </button>
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
        <button
          onClick={() => handleFilterChange("showMap", !filters.showMap)}
          className="flex items-center gap-1 px-3 py-2.5 h-10 bg-[#E8D7F9] rounded-lg shadow-sm cursor-pointer hover:bg-purple-100 transition-colors"
        >
          <Map className="w-6 h-6 text-[#8B31E1]" />
          <span className="text-xs font-normal text-[#8B31E1] font-inter">
            Map
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
