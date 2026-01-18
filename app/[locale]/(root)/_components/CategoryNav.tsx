"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Heart,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Link from "next/link";
import { useMediaQuery } from "usehooks-ts";
import { motion, AnimatePresence } from "framer-motion";

import { useGetMainCategories } from "@/hooks/useCategories";
import { SubCategory } from "@/interfaces/categories.types";
import Image from "next/image";
import { SearchAnimated } from "@/components/global/ai-search-bar";
import { useRouter } from "nextjs-toploader/app";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { Typography } from "@/components/typography";
import SearchHistoryPopover from "../user/search-history/_components/SearchHistoryPopover";
import NotificationsPopover from "../user/notifications/_components/NotificationsPopover";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  fastContainerVariants,
  fastItemVariants,
  dropdownVariants,
  subcategoryVariants,
} from "@/utils/animation-variants";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Props for the main category button component
 */
interface CategoryButtonProps {
  categoryType: string; // The category ID
  label: string; // Display name
  isActive: boolean; // Whether this category's dropdown is open
  onMouseEnter: (categoryType: string) => void; // Handler for hover
  onMouseLeave: () => void; // Handler for mouse leave
}

/**
 * Props for the category dropdown component
 */
interface CategoryDropdownProps {
  isVisible: boolean; // Controls dropdown visibility
  onMouseLeave: () => void; // Handler when mouse leaves dropdown
  categoryData: SubCategory[]; // Subcategories to display in left panel
  activeCategory: SubCategory | null; // Currently hovered subcategory
  onCategoryHover: (category: SubCategory | null) => void; // Handler for subcategory hover
  isOtherCategory?: boolean; // Whether this is the "Other" category dropdown
  allCategories: SubCategory[]; // All main categories for parent lookup
}

/**
 * Props for the subcategory panel (right panel showing children)
 */
interface SubcategoryPanelProps {
  subcategories: SubCategory[]; // Subcategories to display
  allCategories: SubCategory[]; // All main categories for parent lookup
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Memoized category URL cache to avoid repeated recursive searches
 * This significantly improves performance when building URLs
 */
const categoryUrlCache = new Map<string, string>();

/**
 * Check if a category name is Jobs/Job (case-insensitive)
 */
const isJobsCategoryName = (categoryName: string): boolean => {
  const name = categoryName.toLowerCase();
  return name === "jobs" || name === "job";
};

/**
 * Builds a category URL path including parent name if parent exists
 * Optimized with memoization to prevent repeated expensive recursive searches
 * For Jobs subcategories, redirects to /jobs/listing/[...slug]
 * For other categories, uses /categories/[...slug]
 * @param category - The category/subcategory to build URL for
 * @param allCategories - All main categories to search for parent (including nested children)
 * @returns URL path like "/categories/parentName/categoryName" or "/jobs/listing/categoryName"
 */
const buildCategoryUrl = (
  category: SubCategory,
  allCategories: SubCategory[]
): string => {
  // Check cache first
  const cacheKey = `${category._id}-${category.name}`;
  if (categoryUrlCache.has(cacheKey)) {
    return categoryUrlCache.get(cacheKey)!;
  }

  // Helper function to recursively search for a category by ID
  const findCategoryById = (
    categories: SubCategory[],
    id: string
  ): SubCategory | null => {
    for (const cat of categories) {
      if (cat._id === id) {
        return cat;
      }
      // Recursively search in children
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to find the direct parent that contains this category in its children
  const findDirectParent = (
    categories: SubCategory[],
    childId: string
  ): SubCategory | null => {
    for (const cat of categories) {
      // Check if this category's children contain the target
      if (cat.children && cat.children.length > 0) {
        const childFound = cat.children.find((child) => child._id === childId);
        if (childFound) {
          // Found the direct parent!
          return cat;
        }
        // Recursively search in children
        const found = findDirectParent(cat.children, childId);
        if (found) return found;
      }
    }
    return null;
  };

  // Helper function to check if category is a Jobs subcategory by checking all parents
  const isJobsSubcategory = (
    cat: SubCategory,
    categories: SubCategory[]
  ): boolean => {
    // Don't check if this category itself is Jobs (that's handled separately)
    // Only check if it has Jobs as a parent

    // Check parentID
    if (cat.parentID) {
      const parent = findCategoryById(categories, cat.parentID);
      if (parent && isJobsCategoryName(parent.name)) {
        return true;
      }
      // Recursively check parent's parents
      if (parent && isJobsSubcategory(parent, categories)) {
        return true;
      }
    }

    // Check direct parent
    const directParent = findDirectParent(categories, cat._id);
    if (directParent) {
      if (isJobsCategoryName(directParent.name)) {
        return true;
      }
      // Recursively check parent's parents
      if (isJobsSubcategory(directParent, categories)) {
        return true;
      }
    }

    return false;
  };

  // Helper function to build the full path recursively (excluding Jobs parent)
  const buildPathRecursive = (
    cat: SubCategory,
    categories: SubCategory[],
    excludeJobs: boolean = false
  ): string[] => {
    const path: string[] = [];

    // If excluding Jobs and this is Jobs category, don't add it to path
    if (excludeJobs && isJobsCategoryName(cat.name)) {
      return path;
    }

    path.push(cat.name);

    // First try parentID if it exists
    if (cat.parentID) {
      const parent = findCategoryById(categories, cat.parentID);
      if (parent) {
        // Recursively build parent's path and prepend it
        const parentPath = buildPathRecursive(parent, categories, excludeJobs);
        return [...parentPath, ...path];
      }
    }

    // If no parentID, search for parent in the tree
    const directParent = findDirectParent(categories, cat._id);
    if (directParent) {
      // Recursively build parent's path and prepend it
      const parentPath = buildPathRecursive(
        directParent,
        categories,
        excludeJobs
      );
      return [...parentPath, ...path];
    }

    // No parent found, return just this category
    return path;
  };

  // Check if this is the Jobs category itself
  const isJobsCat = isJobsCategoryName(category.name);

  // If it's the Jobs category itself, redirect to /jobs
  if (isJobsCat) {
    const url = `/jobs`;
    categoryUrlCache.set(cacheKey, url);
    return url;
  }

  // Check if this is a Jobs subcategory (has Jobs as parent)
  const isJobSub = isJobsSubcategory(category, allCategories);

  // Build the full path
  const pathNames = buildPathRecursive(category, allCategories, isJobSub);

  // For Jobs subcategories, use /jobs/listing/[...slug]
  // For other categories, use /categories/[...slug]
  const url = isJobSub
    ? `/jobs/listing/${pathNames.join("/")}`
    : `/categories/${pathNames.join("/")}`;

  // Cache the result
  categoryUrlCache.set(cacheKey, url);
  return url;
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const CategoryLoader = () => (
  <div className="hidden md:flex gap-4 flex-1 items-center justify-between animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-9 w-24 bg-white/20 rounded-sm" />
    ))}
  </div>
);

/**
 * CategoryButton Component
 *
 * Renders a single category button in the main navigation bar.
 * Changes appearance when active (dropdown is open).
 */
const CategoryButton: React.FC<CategoryButtonProps> = ({
  categoryType,
  label,
  isActive,
  onMouseEnter,
  onMouseLeave,
}) => (
  <Button
    variant="ghost"
    size="sm"
    className={cn(
      "h-9 px-2 lg:px-5 text-xs font-regular rounded-sm text-white hover:bg-white hover:text-purple transition-colors",
      isActive && "bg-white text-purple"
    )}
    onMouseEnter={() => onMouseEnter(categoryType)}
    onMouseLeave={onMouseLeave}
  >
    {label}
  </Button>
);

/**
 * SubcategoryPanel Component
 *
 * Displays the right panel showing children of a hovered subcategory.
 * Shows only up to level 2 (children of subcategories).
 *
 * Structure:
 * 1. Subcategory (section header with "View all" link)
 * 2. Child categories (displayed in a flat 2-column grid)
 *
 * Categories without children are rendered as clickable links.
 * All children are displayed at the same level (no nesting beyond level 2).
 */
const SubcategoryPanel: React.FC<SubcategoryPanelProps> = ({
  subcategories,
  allCategories,
}) => {
  const { t, locale } = useLocale();
  return (
    <div className="w-full lg:w-[400px] flex-1 bg-purple/10 overflow-y-auto">
      <div className="flex flex-col w-full">
        {subcategories.map((subcategory) => {
          const hasChildren =
            subcategory.children && subcategory.children.length > 0;

          return (
            <motion.div
              key={subcategory._id}
              variants={subcategoryVariants}
              className="transition-colors group"
            >
              {hasChildren ? (
                <>
                  {/* Subcategory Header with "View all" link */}
                  <div className="px-5 py-2.5 flex items-center gap-2 border-b border-gray-300">
                    <Typography variant="xs-bold" className="text-gray-600">
                      {locale === "ar"
                        ? subcategory.nameAr || subcategory.name
                        : subcategory.name}
                    </Typography>
                    {/* "View all" link appears on hover */}
                    <div className="ml-auto group-hover:block hidden">
                      <Link
                        href={buildCategoryUrl(subcategory, allCategories)}
                        className="text-purple text-xs hover:text-purple/80 flex items-center gap-1"
                      >
                        <Typography
                          variant="xs-regular-inter"
                          className="text-xs"
                        >
                          {t.home.categoryNav.viewAll}
                        </Typography>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Children Grid - 2 columns, flat display (only level 2, no grandchildren) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-5 py-2.5">
                    {subcategory.children.map((child) => {
                      const childName =
                        locale === "ar"
                          ? child.nameAr || child.name
                          : child.name;
                      return (
                        <motion.div key={child._id} variants={fastItemVariants}>
                          {/* Display child as a simple link - include parent (subcategory) in URL */}
                          <Link
                            href={buildCategoryUrl(child, allCategories)}
                            className="text-sm text-grey-blue hover:text-purple hover:underline cursor-pointer transition-colors"
                          >
                            {childName}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              ) : (
                /* Subcategory without children - render as clickable link */
                <Link
                  href={buildCategoryUrl(subcategory, allCategories)}
                  className="px-5 py-2.5 flex items-center gap-2 border-b border-gray-300 hover:bg-purple/10 hover:text-purple transition-colors"
                >
                  <Typography variant="xs-bold">
                    {locale === "ar"
                      ? subcategory.nameAr || subcategory.name
                      : subcategory.name}
                  </Typography>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * CategoryDropdown Component
 *
 * The main dropdown that appears when hovering over a category button.
 * Contains two panels:
 * - Left panel: Shows subcategories of the hovered main category
 * - Right panel: Shows children of the hovered subcategory (via SubcategoryPanel)
 *
 * Also handles the "Other Categories" special case with a flat list layout.
 */
const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  isVisible,
  onMouseLeave,
  categoryData,
  activeCategory,
  onCategoryHover,
  isOtherCategory = false,
  allCategories,
}) => {
  const { locale } = useLocale();
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute w-full px-4 lg:px-0 lg:w-fit lg:mt-1 top-full flex-1 z-[9999] left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:left-0 min-w-[230px]"
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onMouseLeave={onMouseLeave}
          onMouseEnter={() => {
            // Keep dropdown open when hovering over it
            // This prevents premature closing when moving from button to dropdown
          }}
          style={{ willChange: "opacity, transform" }}
        >
          {isOtherCategory ? (
            /* ============================================================
               OTHER CATEGORIES - Flat List Layout
               ============================================================ */
            <motion.div className="bg-white rounded-xl rounded-tl-none shadow-lg border border-gray-200 overflow-hidden max-h-[500px]">
              <div className="w-full max-w-md overflow-y-auto scrollbar-hide">
                {/* Added a check for jobs to redirect to "/Jobs" */}
                {categoryData.map((category) => {
                  const categoryName =
                    locale === "ar"
                      ? category.nameAr || category.name
                      : category.name;
                  const displayName =
                    categoryName === "Jobs" ? "Job" : categoryName;
                  return (
                    <motion.div
                      key={category._id}
                      variants={fastItemVariants}
                      className="flex items-center justify-between p-3 hover:bg-purple/10 cursor-pointer transition-colors group"
                      onClick={() => onCategoryHover(category)}
                    >
                      <Link
                        href={
                          category.name.toLowerCase() === "job"
                            ? `/jobs`
                            : buildCategoryUrl(category, allCategories)
                        }
                        className="text-gray-600 group-hover:text-purple text-xs w-full"
                      >
                        {displayName}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ============================================================
               REGULAR CATEGORY DROPDOWN - Two Panel Layout
               ============================================================ */
            <motion.div className="flex mx-auto bg-white rounded-xl rounded-tl-none w-full rounded-tr-none shadow-lg border border-gray-200 overflow-hidden max-h-[500px]">
              {/* ============================================================
                  LEFT PANEL - Subcategories List
                  ============================================================
                  Shows subcategories of the hovered main category.
                  - Categories with children: Hover to show children in right panel
                  - Categories without children: Clickable link to category page
              */}
              <div className="w-60 border-r border-gray-300 overflow-y-auto">
                {categoryData.map((category) => {
                  const hasChildren =
                    category.children && category.children.length > 0;
                  const isActive = activeCategory?._id === category._id;

                  // If category has no children, make it a clickable link
                  if (!hasChildren) {
                    return (
                      <motion.div
                        key={category._id}
                        variants={fastItemVariants}
                        onMouseEnter={() => onCategoryHover(null)}
                      >
                        <Link
                          href={buildCategoryUrl(category, allCategories)}
                          className={cn(
                            "flex items-center text-xs justify-between p-3 hover:bg-purple/10 hover:text-purple cursor-pointer transition-colors group",
                            isActive && "bg-purple/10 text-purple"
                          )}
                        >
                          <Typography
                            variant="xs-regular-inter"
                            className={cn(
                              "text-gray-600 group-hover:text-purple text-xs",
                              isActive && "text-purple font-semibold"
                            )}
                          >
                            {locale === "ar"
                              ? category.nameAr || category.name
                              : category.name}
                          </Typography>
                        </Link>
                      </motion.div>
                    );
                  }

                  // If category has children, use hover behavior to show them
                  return (
                    <motion.div
                      key={category._id}
                      variants={fastItemVariants}
                      className={cn(
                        "flex items-center text-xs justify-between p-3 hover:bg-purple/10 hover:text-purple cursor-pointer transition-colors group",
                        isActive && "bg-purple/10 text-purple"
                      )}
                      onMouseEnter={() => onCategoryHover(category)}
                    >
                      <Typography
                        variant="xs-regular-inter"
                        className={cn(
                          "text-gray-600 group-hover:text-purple text-xs",
                          isActive && "text-purple font-semibold"
                        )}
                      >
                        {locale === "ar"
                          ? category.nameAr || category.name
                          : category.name}
                      </Typography>
                      {/* Chevron indicates if this subcategory is active */}
                      {isActive ? (
                        <ChevronLeft className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* ============================================================
                  RIGHT PANEL - Children of Hovered Subcategory
                  ============================================================
                  Only shows when a subcategory with children is hovered.
                  Displays the children in a structured layout with nested support.
              */}
              {activeCategory &&
                activeCategory.children &&
                activeCategory.children.length > 0 && (
                  <SubcategoryPanel
                    subcategories={activeCategory.children}
                    allCategories={allCategories}
                  />
                )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * CategoryNav Component
 *
 * Main category navigation component with hierarchical dropdown menus.
 *
 * Features:
 * - Shows 6 main categories + "Other" dropdown
 * - Two-panel dropdown system (subcategories on left, children on right)
 * - Supports 3 levels of hierarchy (category -> subcategory -> child -> grandchild)
 * - Responsive design (mobile shows search, desktop shows full nav)
 * - Smooth animations using Framer Motion
 * - Clickable links for categories without children
 *
 * State Management:
 * - activeCategoryType: Which main category button is hovered (opens dropdown)
 * - activeCategory: Which subcategory in left panel is hovered (shows right panel)
 */
const CategoryNav: React.FC<{ className?: string }> = ({ className }) => {
  const { localePath } = useLocale();
  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================

  /**
   * Tracks which subcategory in the left panel is currently hovered.
   * When set, the right panel shows that subcategory's children.
   */
  const [activeCategory, setActiveCategory] = useState<SubCategory | null>(
    null
  );

  /**
   * Tracks which main category button is currently hovered.
   * When set, the dropdown opens showing that category's subcategories.
   */
  const [activeCategoryType, setActiveCategoryType] = useState<string | null>(
    null
  );

  // Refs for debouncing hover events
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ========================================================================
  // HOOKS & DATA FETCHING
  // ========================================================================

  // Mobile detection for responsive behavior
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();

  // Fetch main categories from API
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetMainCategories();

  // ========================================================================
  // CONSTANTS
  // ========================================================================

  // Number of main categories to show before "Other" dropdown
  const VISIBLE_CATEGORIES_COUNT = 6;

  const VISIBLE_JOBS_CATEGORIES_COUNT = 5;

  // ========================================================================
  // DATA TRANSFORMATION
  // ========================================================================

  /**
   * Check if we're on the /jobs route
   */
  const isJobsPage = pathname?.includes("/jobs");

  /**
   * Find the Jobs category from the categories data
   */
  const jobsCategory = useMemo(() => {
    if (!categoriesData || !isJobsPage) return null;

    // Search for Jobs/Job category (case-insensitive)
    const findJobsCategory = (
      categories: SubCategory[]
    ): SubCategory | null => {
      for (const category of categories) {
        const categoryName = category.name.toLowerCase();
        if (categoryName === "jobs" || categoryName === "job") {
          return category;
        }
        // Recursively search in children
        if (category.children && category.children.length > 0) {
          const found = findJobsCategory(category.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findJobsCategory(categoriesData);
  }, [categoriesData, isJobsPage]);

  /**
   * Get the categories to display - Jobs subcategories if on /jobs, otherwise main categories
   */
  const categoriesToDisplay = useMemo(() => {
    if (isJobsPage && jobsCategory?.children) {
      // On /jobs page, show Jobs subcategories
      return jobsCategory.children;
    }
    // Otherwise, show main categories
    return categoriesData || [];
  }, [isJobsPage, jobsCategory, categoriesData]);

  /**
   * Transform API data to match component's expected structure
   * Maps category objects to { type: id, label: name } format
   */
  const transformedCategories: { type: string; label: string }[] =
    categoriesToDisplay.map((category: SubCategory) => {
      const isArabic = locale === "ar";
      return {
        type: category._id,
        label: isArabic ? category.nameAr || category.name : category.name,
      };
    });

  /**
   * Split categories into visible (first 6) and "other" (remaining)
   */
  const visibleCategoriesList = transformedCategories.slice(
    0,
    isJobsPage ? VISIBLE_JOBS_CATEGORIES_COUNT : VISIBLE_CATEGORIES_COUNT
  );
  const otherCategories = transformedCategories.slice(VISIBLE_CATEGORIES_COUNT);

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  /**
   * Handles hover over a subcategory in the left panel.
   * Sets it as active to show its children in the right panel.
   * Optimized with immediate update for better responsiveness.
   */
  const handleCategoryHover = useCallback((category: SubCategory | null) => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Immediate update for better UX
    setActiveCategory(category);
  }, []);

  /**
   * Handles mouse leaving the entire category navigation area.
   * Resets all dropdown states to close all dropdowns.
   */
  const handleMouseLeave = useCallback(() => {
    // Clear any pending timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setActiveCategory(null);
    setActiveCategoryType(null);
  }, []);

  /**
   * Handles hover over a main category button.
   * Opens the dropdown and resets active subcategory (user must choose).
   * Optimized with immediate update.
   */
  const handleCategoryTypeHover = useCallback((categoryType: string) => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    // Immediate update for better responsiveness
    setActiveCategoryType(categoryType);
    // Don't auto-select the first subcategory - let user choose
    setActiveCategory(null);
  }, []);

  /**
   * Handles mouse leaving a category button.
   * Uses a small delay to allow smooth transition to dropdown.
   * Only resets if not hovering over the dropdown itself.
   */
  const handleCategoryButtonLeave = useCallback(() => {
    // Clear existing timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    // Small delay to allow moving to dropdown - reduced from 150ms to 100ms
    leaveTimeoutRef.current = setTimeout(() => {
      // Only reset if we're not hovering over the dropdown
      setActiveCategoryType((prev) => {
        if (!prev) {
          setActiveCategory(null);
          return null;
        }
        return prev;
      });
    }, 100);
  }, []);

  // ========================================================================
  // DATA GETTERS
  // ========================================================================

  /**
   * Gets the subcategories to display in the left panel.
   *
   * Flow:
   * 1. User hovers over main category (e.g., "Electronics")
   * 2. This function returns that category's children (subcategories)
   * 3. Subcategories are shown in the left panel
   * 4. User hovers over a subcategory (e.g., "Mobile & Tablets")
   * 5. Right panel shows that subcategory's children
   *
   * @returns Array of subcategories for the currently hovered main category
   * Memoized for performance
   */
  const getCurrentCategoryData = useMemo((): SubCategory[] => {
    if (!activeCategoryType || !categoriesToDisplay) return [];

    // Special case: "Other" category shows remaining categories
    if (activeCategoryType === "other") {
      return categoriesToDisplay.slice(VISIBLE_CATEGORIES_COUNT);
    }

    // Find the category and return its children (subcategories)
    // On /jobs page, categoriesToDisplay contains Jobs subcategories
    // On other pages, categoriesToDisplay contains main categories
    const category = categoriesToDisplay.find(
      (cat: SubCategory) => cat._id === activeCategoryType
    );
    return category?.children || [];
  }, [activeCategoryType, categoriesToDisplay]);



  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <motion.div
      className={cn("relative md:bg-purple", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="max-w-[1080px] mx-auto px-4 xl:px-0">
        <nav
          className={cn("flex items-center justify-between py-1 w-full")}
          onMouseLeave={handleMouseLeave}
        >
          {/* ============================================================
              CATEGORIES SECTION
              ============================================================
              Main category buttons with dropdown menus.
              Hidden on mobile (shows search instead).
          */}
          {categoriesError ? (
            /* Error State */
            <div className="hidden md:flex flex-1 items-center justify-center">
              <Typography variant="sm-regular" className="text-red-500">
                Failed to load categories. Please try again.
              </Typography>
            </div>
          ) : categoriesLoading ? (
            /* Loading State */
            <CategoryLoader />
          ) : (
            /* Categories List */
            <motion.div
                  key={isJobsPage ? "jobs-nav" : "main-nav"}
              className="hidden w-full md:flex flex-1 items-center justify-between"
              variants={fastContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Main Category Buttons (first 6) */}
              {visibleCategoriesList.map(({ type, label }) => (
                <motion.div
                  key={type}
                  variants={fastItemVariants}
                  className="lg:relative"
                >
                  <CategoryButton
                    categoryType={type}
                    label={label}
                    isActive={activeCategoryType === type}
                    onMouseEnter={handleCategoryTypeHover}
                    onMouseLeave={handleCategoryButtonLeave}
                  />

                  <CategoryDropdown
                    isVisible={activeCategoryType === type}
                    onMouseLeave={handleMouseLeave}
                    categoryData={getCurrentCategoryData}
                    activeCategory={activeCategory}
                    onCategoryHover={handleCategoryHover}
                    allCategories={categoriesData || []}
                  />
                </motion.div>
              ))}

              {/* "Other" Categories Dropdown */}
              {otherCategories.length > 0 && (
                <motion.div variants={fastItemVariants} className="lg:relative">
                  <CategoryButton
                    categoryType="other"
                    label="Other"
                    isActive={activeCategoryType === "other"}
                    onMouseEnter={handleCategoryTypeHover}
                    onMouseLeave={handleCategoryButtonLeave}
                  />

                  <CategoryDropdown
                    isVisible={activeCategoryType === "other"}
                    onMouseLeave={handleMouseLeave}
                    categoryData={getCurrentCategoryData}
                    activeCategory={activeCategory}
                    onCategoryHover={handleCategoryHover}
                    isOtherCategory={true}
                    allCategories={categoriesData || []}
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ============================================================
              MOBILE SEARCH
              ============================================================
              Shows search bar on mobile instead of category buttons.
          */}
          <div className="flex md:hidden flex-1">
            <SearchAnimated />
          </div>

          {/* ============================================================
              RIGHT SIDE ICONS & ACTIONS
              ============================================================
              Action buttons: Search History, Help, Messages, Favorites,
              Notifications, and Map View.
          */}
          {categoriesLoading ? (
            /* Loading skeleton for icons */
            <div className="flex items-center justify-between gap-5 ml-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="size-8 bg-white/20 rounded-full"></div>
                </div>
              ))}
              <div className="animate-pulse">
                <div className="h-10 w-20 bg-white/20 rounded-md"></div>
              </div>
            </div>
          ) : (
            <TooltipProvider delayDuration={200}>
              <div className="min-w-fit xl:min-w-[350px] min-[1080px]:w-full min-[1080px]:flex items-center justify-between lg:gap-5 ml-2">
                {/* Search History Icon */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.1,
                  }}
                >
                  <SearchHistoryPopover />
                </motion.div>

                {/* Help Icon */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.15,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/"
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Image
                          src={
                            "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/help.svg"
                          }
                          alt="help"
                          className="size-6 hover:scale-110 transition-all duration-300"
                          width={24}
                          height={24}
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>My Ads</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Messages Icon */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.2,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={localePath("/chat")}
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Image
                          src={
                            "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/unread_chat.svg"
                          }
                          alt="unread_chat"
                          className="size-6 hover:scale-110 transition-all duration-300"
                          width={24}
                          height={24}
                        />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Messages</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Favorites Icon */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.25,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/favorites"
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Heart className="size-6 hover:scale-110 transition-all duration-300 text-white" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Favorites</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>

                {/* Notifications Icon */}
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.3,
                  }}
                >
                  <NotificationsPopover />
                </motion.div>

                {/* Map View Button */}
                <motion.div
                  hidden={isJobsPage}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 22,
                    delay: 0.35,
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        icon={<MapPin className="w-4 h-4 -mr-3" />}
                        iconPosition="center"
                        className=" hover:bg-white hover:text-purple py-5 md:py-4"
                        variant={isMobile ? "filled" : "outline"}
                        size={"sm"}
                        onClick={() => router.push("/map-view")}
                      >
                        Map View
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on Map</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </div>
            </TooltipProvider>
          )}
        </nav>
      </div>
    </motion.div>
  );
};

export default CategoryNav;
