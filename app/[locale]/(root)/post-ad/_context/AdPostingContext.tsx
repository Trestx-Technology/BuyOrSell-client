"use client";

import React, { ReactNode, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "../_components/ProgressBar";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";

// Re-export types from the store
export type { CategoryBreadcrumbItem } from "@/stores/adPostingStore";

// Context type (now just re-exports from store)
export type AdPostingContextType = ReturnType<typeof useAdPostingStore>;

// ============================================================================
// PROVIDER COMPONENT (now just provides UI layout)
// ============================================================================
// ... (imports remain)
// ... (imports remain)
interface AdPostingProviderProps {
  children: ReactNode;
}

export const AdPostingProvider: React.FC<AdPostingProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const { localePath } = useLocale();
  const {
    categoryArray,
    clearCategoryArray,
    addToCategoryArray,
    setActiveCategory,
  } = useAdPostingStore((state) => state);

  // Build breadcrumb items - collapse middle items if more than 3 categories
  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const validCategories = categoryArray.filter((cat) => cat.name !== cat.id);

    // If 3 or fewer categories, show all
    if (validCategories.length <= 3) {
      return validCategories.map((category, index) => {
        const slugPath = validCategories
          .slice(0, index + 1)
          .map((cat) => cat.id)
          .join("/");

        return {
          id: category.id,
          label: category.name,
          href: localePath(`/post-ad/${slugPath}`),
          isActive: index === validCategories.length - 1,
        };
      });
    }

    // If more than 3 categories, show: first, ..., second-to-last, last
    const firstCategory = validCategories[0];
    const secondToLastCategory = validCategories[validCategories.length - 2];
    const lastCategory = validCategories[validCategories.length - 1];

    const items: BreadcrumbItem[] = [];

    // First category
    items.push({
      id: firstCategory.id,
      label: firstCategory.name,
      href: `/post-ad/${firstCategory.id}`,
      isActive: false,
    });

    // Ellipsis (non-clickable)
    items.push({
      id: "ellipsis",
      label: "...",
      href: "#",
      isActive: false,
      isEllipsis: true,
    });

    // Second-to-last category (previous)
    const secondToLastPath = validCategories
      .slice(0, validCategories.length - 1)
      .map((cat) => cat.id)
      .join("/");
    items.push({
      id: secondToLastCategory.id,
      label: secondToLastCategory.name,
      href: `/post-ad/${secondToLastPath}`,
      isActive: false,
    });

    // Last category (current)
    const lastPath = validCategories.map((cat) => cat.id).join("/");
    items.push({
      id: lastCategory.id,
      label: lastCategory.name,
      href: `/post-ad/${lastPath}`,
      isActive: true,
    });

    return items;
  }, [categoryArray, localePath]);

  // Handle breadcrumb click - find category by ID and remove all after it
  const handleBreadcrumbClick = (item: BreadcrumbItem, index: number) => {
    // Find the index of the clicked category in categoryArray by its ID
    const clickedIndex = categoryArray.findIndex((cat) => cat.id === item.id);

    // If category found, remove all categories after it
    if (clickedIndex >= 0) {
      // Keep only categories up to and including the clicked one
      const categoriesToKeep = categoryArray.slice(0, clickedIndex + 1);

      // Clear and rebuild categoryArray with only the categories to keep
      clearCategoryArray();
      categoriesToKeep.forEach((cat) => {
        addToCategoryArray(cat);
      });

      // Set active category to the clicked one
      setActiveCategory(item.id);

      // Build slug path and navigate
      const slugPath = categoriesToKeep.map((cat) => cat.id);
      router.push(localePath(`/post-ad/${slugPath.join("/")}`));
    }
  };

  return (
    <Container1080 className="bg-white min-h-[calc(100vh-200px)] flex flex-col md:px-20 px-5 relative pt-10 space-y-8">
      <div className="w-full sticky top-0 space-y-4">
        <ProgressBar totalSteps={4} />
        <Breadcrumbs
          items={breadcrumbItems}
          onItemClick={handleBreadcrumbClick}
        />
      </div>

      <section className="flex-grow">{children}</section>
    </Container1080>
  );
};
