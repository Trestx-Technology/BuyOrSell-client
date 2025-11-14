"use client";

import Image from "next/image";
import React, { ReactNode, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "../_components/ProgressBar";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useAdPostingStore } from "@/stores/adPostingStore";
import Link from "next/link";

// Re-export types from the store
export type {
  CategoryBreadcrumbItem,
} from "@/stores/adPostingStore";

// Context type (now just re-exports from store)
export type AdPostingContextType = ReturnType<typeof useAdPostingStore>;

// ============================================================================
// PROVIDER COMPONENT (now just provides UI layout)
// ============================================================================
interface AdPostingProviderProps {
  children: ReactNode;
}

export const AdPostingProvider: React.FC<AdPostingProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { 
    categoryArray, 
    clearCategoryArray,
    addToCategoryArray,
    setActiveCategory
  } = useAdPostingStore((state)=>state);

  // Build breadcrumb items - simple: just id and name from categoryArray
  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const validCategories = categoryArray.filter((cat) => cat.name !== cat.id);

    return validCategories.map((category, index) => {
      const slugPath = validCategories
        .slice(0, index + 1)
        .map((cat) => cat.id)
        .join("/");

      return {
        id: category.id,
        label: category.name,
        href: `/post-ad/${slugPath}`,
        isActive: index === validCategories.length - 1,
      };
    });
  }, [categoryArray]);




  // Handle breadcrumb click - simple: just use the index
  const handleBreadcrumbClick = (item: BreadcrumbItem, index: number) => {
    // Filter out categories with IDs as names
    const validCategories = categoryArray.filter(cat => cat.name !== cat.id);
    
    // Update categoryArray to match the clicked breadcrumb path
    if (index >= 0 && index < validCategories.length) {
      // Clear and rebuild categoryArray up to the clicked item
      clearCategoryArray();
      
      // Rebuild array up to clicked category
      const categoriesToKeep = validCategories.slice(0, index + 1);
      categoriesToKeep.forEach((cat) => {
        addToCategoryArray(cat);
      });
      
      // Set active category to the clicked one
      const clickedCategory = categoriesToKeep[index];
      if (clickedCategory) {
        setActiveCategory(clickedCategory.id);
        // Build slug path and navigate
        const slugPath = categoriesToKeep.map(cat => cat.id);
        router.push(`/post-ad/${slugPath.join("/")}`);
      }
    }
  };

  return (
    <main className="min-h-dvh bg-[#F7F8FA] w-full border">
      <section className="flex h-full overflow-y-auto flex-col max-w-[1080px] mx-auto bg-white px-6">
        <Link href={"/"} className="pt-6">
          <Image
            src="/images/category-icons/logo.png"
            alt="BuyOrSell Logo"
            width={155}
            height={49}
            className="mb-8"
          />
        </Link>
        <div className="w-full max-w-[888px] mb-4 mx-auto">
          <ProgressBar totalSteps={4} />
          {/* Title Section */}
          <div className="mt-6">
            <h1 className="text-xl font-semibold text-[#1D2939] mb-2">
              Place Ad Manually
            </h1>
            <p className="text-xs text-[#8A8A8A] mb-4">Choose ad category</p>

            {/* Divider Line */}
            <div className="w-full h-px bg-[#F0F0F1] mb-6"></div>
          </div>

          {/* Breadcrumbs */}
          <div className="mb-6 w-full overflow-hidden">
            <Breadcrumbs
              items={breadcrumbItems}
              onItemClick={handleBreadcrumbClick}
            />
          </div>
        </div>

        {children}
      </section>
    </main>
  );
};
