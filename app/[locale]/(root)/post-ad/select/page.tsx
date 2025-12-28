"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useGetMainCategories } from "@/hooks/useCategories";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { useRouter } from "nextjs-toploader/app";
import { useMyOrganization } from "@/hooks/useOrganizations";
import OrganizationRequiredDialog from "../_components/OrganizationRequiredDialog";
import { isJobCategory, hasOrganization } from "@/validations/post-ad.validation";

export default function SelectCategoryPage() {
  const router = useRouter();
  const { addToCategoryArray, setActiveCategory, setStep, categoryArray, clearCategoryArray } = useAdPostingStore((state)=>state);
  const [showOrgDialog, setShowOrgDialog] = useState(false);

  // Fetch categories using the hook
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetMainCategories();

  // Fetch user organizations
  const { data: organizationsData, isLoading: organizationsLoading } = useMyOrganization();
  const organizations = organizationsData?.data || [];

  // Use API data directly
  const categories = categoriesData || [];

  const handleCategorySelect = (categoryId: string) => {
    // Find the selected category to get its name
    const selectedCategory = categories.find(cat => cat._id === categoryId);

    if (selectedCategory) {
      // Check if it's a job category
      if (isJobCategory(selectedCategory.name)) {
        // Check if user has organizations
        if (!hasOrganization(organizations)) {
          // Show dialog if no organizations
          setShowOrgDialog(true);
          return; // Don't proceed
        }
        // If user has organizations, proceed normally
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
    if(categoryArray.length > 0) {
      clearCategoryArray()
    }
  }, [categoryArray, clearCategoryArray])

  return (
    <div>
      <OrganizationRequiredDialog
        isOpen={showOrgDialog}
        onClose={() => setShowOrgDialog(false)}
      />
      <div className=" w-full max-w-[888px] flex-1 mx-auto bg-white">
        {/* Main Container */}
        <div className="w-full mx-auto bg-white">
          {/* Main Content */}
          <div className="pb-8">
            {/* Categories Grid */}
            <div className="space-y-[13px]">
              {/* First Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[13px]">
                {categoriesLoading || organizationsLoading ? (
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
                    <p className="text-gray-500 mb-2">Failed to load categories</p>
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
                  className="bg-[#F7F8FA] rounded-lg p-[10px_18px] w-full h-[140px] flex flex-col items-center justify-center gap-4 hover:bg-purple/10 hover:scale-105 cursor-pointer transition-all duration-300"
                >
                   {category.icon && <div className="w-[70px] h-[70px] relative">
                    <Image
                      src={category.icon}
                      alt={category.name}
                        fill
                        unoptimized
                      className="object-cover rounded"
                    />
                    </div>}
                  <span className="text-sm font-semibold text-black text-center max-w-[130px] truncate whitespace-nowrap leading-tight">
                    {category.name}
                  </span>
                </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
