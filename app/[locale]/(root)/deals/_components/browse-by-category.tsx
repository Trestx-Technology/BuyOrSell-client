"use client";

import React from "react";
import { useGetMainCategories } from "@/hooks/useCategories";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/typography";
import {
  useCategoryAdsCount,
  useDealsAdsCount,
  useExchangeAdsCount,
} from "@/hooks/useAds";
import { CarouselWrapper } from "@/components/global/carousel-wrapper";

interface BrowseByCategoryProps {
  selectedCategory?: string;
  onCategoryChange: (categoryName: string) => void;
  totalAds: number;
  mode?: "deals" | "exchange" | "regular";
}

export const BrowseByCategory: React.FC<BrowseByCategoryProps> = ({
  selectedCategory,
  onCategoryChange,
  totalAds,
  mode = "regular",
}) => {
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetMainCategories();
  const { locale, t } = useLocale();

  const { data: dealsCounts, isLoading: isDealsLoading } = useDealsAdsCount();
  const { data: exchangeCounts, isLoading: isExchangeLoading } =
    useExchangeAdsCount();
  const { data: regularCounts, isLoading: isRegularLoading } =
    useCategoryAdsCount();

  const isDataLoading =
    isCategoriesLoading ||
    isDealsLoading ||
    isExchangeLoading ||
    isRegularLoading;

  const currentCounts =
    mode === "deals"
      ? dealsCounts?.data
      : mode === "exchange"
        ? exchangeCounts?.data
        : regularCounts?.data;

  const getCountForCategory = (categoryId: string) => {
    return currentCounts?.find((c) => c.categoryId === categoryId)?.count || 0;
  };

  const getLabel = () => {
    if (mode === "deals") return "All Deals";
    if (mode === "exchange") return "All Exchange";
    return "All Ads";
  };

  // Filter out categories with 0 count
  const categoriesWithAds = categories?.filter(
    (cat) => getCountForCategory(cat._id) > 0
  );

  // If loading, don't show the "All" button or categories to avoid layout shift/flashes
  if (isDataLoading) {
    return (
      <div className="space-y-4 px-4 sm:px-0">
        <Typography
          variant="body-small"
          className="text-zinc-600 dark:text-zinc-400 font-medium font-inter"
        >
          Browse by Category
        </Typography>
        <div className="h-[42px] w-full animate-pulse bg-white/5 rounded-lg" />
      </div>
    );
  }

  // If no ads at all (totalAds is 0), we might still want to show the "All" button
  // But if there are no categories with ads, and totalAds is 0, maybe hide the whole section?
  // Let's assume we want to show it if there's any data.

  return (
    <div className="space-y-4 px-4 sm:px-0">
      <Typography
        variant="body-small"
        className="text-zinc-600 dark:text-zinc-400 font-medium font-inter"
      >
        Browse by Category
      </Typography>

      <CarouselWrapper
        shadowColorClassName="from-gray-50 dark:from-gray-950"
        className="pb-2"
        containerClassName="gap-3"
      >
        {/* All Ads Button */}
        <button
          onClick={() => onCategoryChange("")}
          className={cn(
            "flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all duration-300 whitespace-nowrap group",
            !selectedCategory
              ? "bg-purple border-purple text-white shadow-lg shadow-purple/20 scale-[1.02]"
              : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-purple/30 dark:hover:border-purple/30 shadow-sm hover:shadow-md hover:text-purple dark:hover:text-purple-400"
          )}
        >
          <span className="text-sm font-bold tracking-tight">{getLabel()}</span>
          <span
            className={cn(
              "text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors",
              !selectedCategory
                ? "bg-white/20 text-white"
                : "bg-purple/10 text-purple dark:bg-purple/20 dark:text-purple-300"
            )}
          >
            {totalAds}
          </span>
        </button>

        {/* Category Buttons */}
        {categoriesWithAds?.map((category) => {
          const categoryName = category.name;
          const isActive = selectedCategory === categoryName;
          const displayName =
            locale === "ar" ? category.nameAr || category.name : category.name;
          const count = getCountForCategory(category._id);
          const icon = category.icon || category.image;

          return (
            <button
              key={category._id}
              onClick={() => onCategoryChange(categoryName)}
              className={cn(
                "flex items-center gap-3 px-5 py-2.5 rounded-xl border transition-all duration-300 whitespace-nowrap group",
                isActive
                  ? "bg-purple border-purple text-white shadow-lg shadow-purple/20 scale-[1.02]"
                  : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-purple/30 dark:hover:border-purple/30 shadow-sm hover:shadow-md hover:text-purple dark:hover:text-purple-400"
              )}
            >
              {icon && (
                <div className={cn(
                  "w-5 h-5 flex items-center justify-center transition-all duration-300",
                  isActive ? "brightness-0 invert" : "group-hover:scale-110"
                )}>
                  <img src={icon} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              <span className="text-sm font-bold tracking-tight">{displayName}</span>
              <span
                className={cn(
                  "text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors",
                  isActive 
                    ? "bg-white/20 text-white" 
                    : "bg-purple/10 text-purple dark:bg-purple/20 dark:text-purple-300"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </CarouselWrapper>
    </div>
  );
};
