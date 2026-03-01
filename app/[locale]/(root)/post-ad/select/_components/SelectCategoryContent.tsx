"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGetMainCategories } from "@/hooks/useCategories";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { useRouter } from "nextjs-toploader/app";
import { Container1080 } from "@/components/layouts/container-1080";
import { useAdAvailability } from "@/hooks/useAdAvailability";
import { InsufficientAdsDialog } from "@/components/global/InsufficientAdsDialog";
import { PageBannerCarousel } from "@/components/global/page-banner-carousel";

export default function SelectCategoryContent() {
  const router = useRouter();
  const {
    addToCategoryArray,
    setActiveCategory,
    setStep,
    categoryArray,
    clearCategoryArray,
  } = useAdPostingStore((state) => state);

  // Availability Hook
  const {
    checkAvailability,
    dialogProps,
    isLoading: subscriptionsLoading,
  } = useAdAvailability();

  // Fetch categories using the hook
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetMainCategories();

  // Use API data directly
  const categories = categoriesData?.filter((cat) => cat.name !== "Jobs") || [];

  const handleCategorySelect = (categoryId: string) => {
    // Find the selected category to get its name
    const selectedCategory = categories.find((cat) => cat._id === categoryId);

    if (selectedCategory) {
      // Determine the plan type based on the category name
      const categoryName = selectedCategory.name.toLowerCase();
      let typeToPass = "Ads"; // Default for most categories

      if (categoryName.includes("property") || categoryName === "properties") {
        typeToPass = "Properties";
      } else if (
        categoryName.includes("motor") ||
        categoryName === "motors" ||
        categoryName === "cars" ||
        categoryName === "vehicles"
      ) {
        typeToPass = "Motors";
      }

      // Check ad availability for the determined plan type and this category
      if (!checkAvailability(typeToPass, selectedCategory.name)) {
        return;
      }

      // Add to category array for breadcrumbs
      addToCategoryArray({
        id: selectedCategory._id,
        name: selectedCategory.name,
      });

      // Set as active category
      setActiveCategory(selectedCategory._id);

      // Update step to 2 (traverse categories after selecting)
      setStep(2);
    }

    // Navigate to the category ID route
    router.push(`/post-ad/${categoryId}`);
  };

  useEffect(() => {
    if (categoryArray.length > 0) {
      clearCategoryArray();
    }
  }, [categoryArray, clearCategoryArray]);

  return (
    <Container1080>
      <InsufficientAdsDialog {...dialogProps} />

      <div className=" w-full max-w-[888px] flex-1 mx-auto bg-transparent">
        {/* Main Container */}
        <div className="w-full mx-auto bg-transparent">
          {/* Main Content */}
          <div className="pb-8 ">
            <div className="mb-8">
              <PageBannerCarousel slug="post-ad-page" />
            </div>

            {/* First Row */}
            <div className="flex flex-wrap justify-center items-center gap-[13px]">
              {categoriesLoading || subscriptionsLoading ? (
                // Loading skeleton
                Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-[#F7F8FA] rounded-lg p-[10px_18px] w-full h-[140px] flex flex-col items-center justify-center gap-4 animate-pulse"
                  >
                    <div className="w-[70px] h-[70px] bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded"></div>
                  </div>
                ))
              ) : categoriesError ? (
                // Error state
                <div className="col-span-full flex items-center justify-center py-8">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">
                      Failed to load categories
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-purple-600 hover:text-purple-700 text-sm underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : (
                // Categories
                categories.map((category) => (
                  <button
                    key={category._id}
                    onClick={() => handleCategorySelect(category._id)}
                    className="bg-[#F7F8FA] dark:bg-gray-800 rounded-lg p-5 w-full sm:w-[150px] min-h-[140px] flex flex-col items-center justify-center gap-4 hover:bg-purple/10 dark:hover:bg-purple/20 hover:scale-105 cursor-pointer transition-all duration-300"
                  >
                    {category.icon && (
                      <div className="w-[70px] h-[70px] relative">
                        <Image
                          src={category.icon}
                          alt={category.name}
                          fill
                          unoptimized
                          className="object-contain rounded"
                        />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-black dark:text-white text-center line-clamp-2 leading-tight">
                      {category.name}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Container1080>
  );
}
