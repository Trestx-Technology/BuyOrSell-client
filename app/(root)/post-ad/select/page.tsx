"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAdPosting } from "../_context/AdPostingContext";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useGetMainCategories } from "@/hooks/useCategories";

export default function SelectCategoryPage() {
  const router = useRouter();
  const { addCategoryName } = useAdPosting();

  // Fetch categories using the hook
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetMainCategories();

  // Use API data directly
  const categories = categoriesData || [];

  const handleCategorySelect = (categoryId: string) => {
    // Find the selected category to get its name
    const selectedCategory = categories.find(cat => cat._id === categoryId);

    // Add category name to the categoryNames array
    addCategoryName(selectedCategory?.name || categoryId);

    // Navigate to the category name slug route
    const categoryName = selectedCategory?.name?.toLowerCase().replace(/\s+/g, '-') || categoryId;
    router.push(`/post-ad/${encodeURIComponent(categoryName)}`);
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Post Ad", href: "/post-ad" },
    { label: "Select Category", isActive: true },
  ];

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div className=" w-full max-w-[888px] flex-1 mx-auto bg-white">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={breadcrumbItems}
          onItemClick={handleBreadcrumbClick}
        />
      </div>

      {/* Main Container */}
      <div className="w-full mx-auto bg-white">
        {/* Main Content */}
        <div className="pb-8">
          {/* Categories Grid */}
          <div className="space-y-[13px]">
            {/* First Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[13px]">
              {categoriesLoading ? (
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
                  className="bg-[#F7F8FA] rounded-lg p-[10px_18px] w-full h-[140px] flex flex-col items-center justify-center gap-4 hover:bg-gray-100 hover:bg-purple/10 hover:scale-105 cursor-pointer transition-all duration-300"
                >
                   {category.icon && <div className="w-[70px] h-[70px] relative">
                    <Image
                      src={category.icon}
                      alt={category.name}
                      fill
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
  );
}
