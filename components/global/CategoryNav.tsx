"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Heart,
  Bell,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "../typography";
import { cn } from "@/lib/utils";
import Link from "next/link";
import mystery from "@/public/icons/mystery.svg";
import help from "@/public/icons/help.svg";
import unread_chat from "@/public/icons/unread_chat.svg";
import { useMediaQuery, useWindowSize } from "usehooks-ts";

import {
  motorsData,
  propertyData,
  jobsData,
  classifiedsData,
  furnitureData,
  electronicsData,
  communityData,
  othersData,
  NavItem,
} from "@/constants/navigationData";
import Image from "next/image";
import AiSearch from "./ai-search";

// Types
interface CategoryButtonProps {
  categoryType: string;
  label: string;
  isActive: boolean;
  onMouseEnter: (categoryType: string) => void;
}

interface CategoryDropdownProps {
  isVisible: boolean;
  onMouseLeave: () => void;
  categoryData: NavItem[];
  activeCategory: NavItem | null;
  onCategoryHover: (category: NavItem) => void;
}

interface SubcategoryPanelProps {
  subcategories: NavItem[];
  activeCategoryId: string;
}

// Reusable Components
const CategoryButton: React.FC<CategoryButtonProps> = ({
  categoryType,
  label,
  isActive,
  onMouseEnter,
}) => (
  <Button
    variant="ghost"
    size="sm"
    className={cn(
      "h-9 px-2 lg:px-5 text-xs font-regular rounded-sm text-white hover:bg-white hover:text-purple transition-colors",
      isActive && "bg-white text-purple"
    )}
    onMouseEnter={() => onMouseEnter(categoryType)}
  >
    {label}
  </Button>
);

const SubcategoryPanel: React.FC<SubcategoryPanelProps> = ({
  subcategories,
  activeCategoryId,
}) => (
  <div className="w-full lg:w-[400px] flex-1 bg-purple/10 max-h-[300px] md:max-h-[500px] overflow-y-auto">
    <div className="flex flex-col w-full flex-1">
      {subcategories.map((subcategory) => (
        <div key={subcategory.id} className="transition-colors group">
          <div className="px-5 py-2.5 flex items-center gap-2 border-b border-gray-300">
            <Typography variant="xs-bold" className="text-gray-600">
              {subcategory.name}
            </Typography>
            <div className="ml-auto group-hover:block hidden">
              <Link
                href={`/category/${activeCategoryId}`}
                className="text-purple text-xs hover:text-purple/80 flex items-center gap-1"
              >
                <Typography variant="xs-regular-inter" className="text-xs">
                  View all
                </Typography>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {subcategory.children && (
            <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2 px-5 py-2.5">
              {subcategory.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${subcategory.id}/${child.id}`}
                  className="text-sm text-grey-blue hover:text-purple hover:underline cursor-pointer transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  isVisible,
  onMouseLeave,
  categoryData,
  activeCategory,
  onCategoryHover,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="absolute w-full px-4 lg:px-0 lg:w-fit lg:mt-1 top-full flex-1 z-50 left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-0"
      onMouseLeave={onMouseLeave}
    >
      <div className="flex mx-auto   bg-white rounded-xl rounded-tl-none w-full rounded-tr-none shadow-lg border border-gray-200 overflow-hidden">
        {/* Main Categories Panel */}
        <div className="w-60 border-r border-gray-300 max-h-[500px] overflow-y-auto">
          {categoryData
            .filter(
              (category) => category.children && category.children.length > 0
            )
            .map((category) => (
              <div
                key={category.id}
                className={cn(
                  "flex items-center text-xs justify-between p-3 hover:bg-purple/10 cursor-pointer transition-colors group",
                  activeCategory?.id === category.id &&
                    "bg-purple/10 text-purple"
                )}
                onMouseEnter={() => onCategoryHover(category)}
              >
                <Typography
                  variant="xs-regular-inter"
                  className={cn(
                    "text-gray-600 group-hover:text-gray-900 text-xs",
                    activeCategory?.id === category.id &&
                      "text-purple font-semibold"
                  )}
                >
                  {category.name}
                </Typography>
                {activeCategory?.id === category.id ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            ))}
        </div>

        {/* Subcategories Panel */}
        {activeCategory && activeCategory.children && (
          <SubcategoryPanel
            subcategories={activeCategory.children}
            activeCategoryId={activeCategory.id}
          />
        )}
      </div>
    </div>
  );
};

const CategoryNav: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<NavItem | null>(null);
  const [activeCategoryType, setActiveCategoryType] = useState<string | null>(
    null
  );

  // Use the useWindowSize hook to get current window width
  const { width: windowWidth } = useWindowSize();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Calculate visible categories - remove "Others" if less than 870px
  const getVisibleCategoriesCount = () => {
    if (!windowWidth || windowWidth >= 870) return 8;
    return 7; // Remove "Others" category below 870px
  };

  const visibleCategories = getVisibleCategoriesCount();

  // Category data mapping
  const categoryDataMap = {
    motors: motorsData,
    property: propertyData,
    jobs: jobsData,
    classifieds: classifiedsData,
    furniture: furnitureData,
    electronics: electronicsData,
    community: communityData,
    others: othersData,
  };

  // Event handlers
  const handleCategoryHover = (category: NavItem) => {
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
    setActiveCategoryType(null);
  };

  const handleCategoryTypeHover = (categoryType: string) => {
    setActiveCategoryType(categoryType);
    const categoryData =
      categoryDataMap[categoryType as keyof typeof categoryDataMap];
    if (categoryData && categoryData.length > 0) {
      setActiveCategory(categoryData[0]);
    }
  };

  const getCurrentCategoryData = () => {
    if (!activeCategoryType) return motorsData;
    return (
      categoryDataMap[activeCategoryType as keyof typeof categoryDataMap] ||
      motorsData
    );
  };

  // Category configurations
  const categories = [
    { type: "motors", label: "Motors" },
    { type: "property", label: "Property" },
    { type: "jobs", label: "Jobs" },
    { type: "classifieds", label: "Classifieds" },
    { type: "furniture", label: "Furniture" },
    { type: "electronics", label: "Electronics" },
    { type: "community", label: "Community" },
    { type: "others", label: "Others" },
  ];

  // Filter categories based on responsive hook
  const visibleCategoriesList = categories.slice(0, visibleCategories);

  return (
    <>
      <div className="relative md:bg-purple">
        <div className="max-w-[1080px] mx-auto px-4 xl:px-0">
          <nav className="flex items-center justify-between py-1 w-full">
            {/* Categories Section - Horizontal Scrollable on small screens */}
            <div className="hidden w-full md:flex flex-1 items-center justify-between">
              {visibleCategoriesList.map(({ type, label }) => (
                <div key={type} className="lg:relative">
                  <CategoryButton
                    categoryType={type}
                    label={label}
                    isActive={activeCategoryType === type}
                    onMouseEnter={handleCategoryTypeHover}
                  />

                  <CategoryDropdown
                    isVisible={activeCategoryType === type}
                    onMouseLeave={handleMouseLeave}
                    categoryData={getCurrentCategoryData()}
                    activeCategory={activeCategory}
                    onCategoryHover={handleCategoryHover}
                  />
                </div>
              ))}
            </div>

            <div className="flex md:hidden flex-1">
              <AiSearch />
            </div>

            {/* Right Side Icons and Map View Button */}
            <div
              className="flex items-center justify-between gap-5 ml-2"
              onMouseEnter={handleMouseLeave}
            >
              <Link href="/" className="min-w-6 min-[1080px]:block hidden">
                <Image
                  src={mystery}
                  alt="mystery"
                  className="size-6 hover:scale-110 transition-all duration-300"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="/" className="min-w-6 min-[1080px]:block hidden">
                <Image
                  src={help}
                  alt="help"
                  className="size-6 hover:scale-110 transition-all duration-300"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="/" className="min-w-6 min-[1080px]:block hidden">
                <Image
                  src={unread_chat}
                  alt="unread_chat"
                  className="size-6 hover:scale-110 transition-all duration-300"
                  width={24}
                  height={24}
                />
              </Link>
              <Link href="/" className="min-w-6 min-[1080px]:block hidden">
                <Heart className="size-6 hover:scale-110 transition-all duration-300 text-white" />
              </Link>
              <Link href="/" className="min-w-6 min-[1080px]:block hidden">
                <Bell className="size-6 hover:scale-110 transition-all duration-300 text-white" />
              </Link>
              <Button
                icon={<MapPin className="w-4 h-4 -mr-3" />}
                iconPosition="center"
                className=" hover:bg-white hover:text-purple py-5 md:py-4"
                variant={isMobile ? "filled" : "outline"}
                size={"sm"}
              >
                Map View
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default CategoryNav;
