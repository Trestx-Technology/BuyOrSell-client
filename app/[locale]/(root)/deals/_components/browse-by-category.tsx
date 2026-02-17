"use client";

import React from "react";
import { useGetMainCategories } from "@/hooks/useCategories";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography";

interface BrowseByCategoryProps {
  selectedCategory?: string;
  onCategoryChange: (categoryName: string) => void;
  totalAds: number;
}

export const BrowseByCategory: React.FC<BrowseByCategoryProps> = ({
  selectedCategory,
  onCategoryChange,
  totalAds,
}) => {
  const { data: categories } = useGetMainCategories();
  const { locale, t } = useLocale();

  return (
    <div className="space-y-4 px-4 sm:px-0">
      <Typography variant="body-small" className="text-white/70 font-medium">
        Browse by Category
      </Typography>
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2">
        {/* All Deals Button */}
        <button
          onClick={() => onCategoryChange("")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap",
            !selectedCategory
              ? "bg-purple border-purple text-white"
              : "bg-transparent border-white/20 text-white/70 hover:border-white/40 hover:text-white"
          )}
        >
          <span className="text-sm font-semibold">All Deals</span>
          <span
            className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-md font-bold",
              !selectedCategory ? "bg-white text-purple" : "bg-white/20 text-white"
            )}
          >
            {totalAds}
          </span>
        </button>

        {/* Category Buttons */}
        {categories?.map((category) => {
          const categoryName = category.name;
          const isActive = selectedCategory === categoryName;
          const displayName =
            locale === "ar" ? category.nameAr || category.name : category.name;

          return (
            <button
              key={category._id}
              onClick={() => onCategoryChange(categoryName)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-purple border-purple text-white"
                  : "bg-transparent border-white/20 text-white/70 hover:border-white/40 hover:text-white"
              )}
            >
              <span className="text-sm font-semibold">{displayName}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-md font-bold",
                  isActive ? "bg-white text-purple" : "bg-white/20 text-white"
                )}
              >
                {totalAds} {/* Using totalAds as a mock count for now */}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
