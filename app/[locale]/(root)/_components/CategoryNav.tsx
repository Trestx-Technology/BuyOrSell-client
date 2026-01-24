"use client";

import React, { useState, useMemo } from "react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import Link from "next/link";

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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CategoryButtonProps {
  categoryType: string;
  label: string;
  children: React.ReactNode;
}

interface CategoryDropdownContentProps {
  categoryData: SubCategory[];
  isOtherCategory?: boolean;
  allCategories: SubCategory[];
}

interface SubcategoryPanelProps {
  subcategories: SubCategory[];
  allCategories: SubCategory[];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const categoryUrlCache = new Map<string, string>();

const isJobsCategoryName = (categoryName: string): boolean => {
  const name = categoryName.toLowerCase();
  return name === "jobs" || name === "job";
};

const buildCategoryUrl = (
  category: SubCategory,
  allCategories: SubCategory[]
): string => {
  const cacheKey = `${category._id}-${category.name}`;
  if (categoryUrlCache.has(cacheKey)) {
    return categoryUrlCache.get(cacheKey)!;
  }

  const findCategoryById = (
    categories: SubCategory[],
    id: string
  ): SubCategory | null => {
    for (const cat of categories) {
      if (cat._id === id) {
        return cat;
      }
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryById(cat.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findDirectParent = (
    categories: SubCategory[],
    childId: string
  ): SubCategory | null => {
    for (const cat of categories) {
      if (cat.children && cat.children.length > 0) {
        const childFound = cat.children.find((child) => child._id === childId);
        if (childFound) {
          return cat;
        }
        const found = findDirectParent(cat.children, childId);
        if (found) return found;
      }
    }
    return null;
  };

  const isJobsSubcategory = (
    cat: SubCategory,
    categories: SubCategory[]
  ): boolean => {
    if (cat.parentID) {
      const parent = findCategoryById(categories, cat.parentID);
      if (parent && isJobsCategoryName(parent.name)) {
        return true;
      }
      if (parent && isJobsSubcategory(parent, categories)) {
        return true;
      }
    }

    const directParent = findDirectParent(categories, cat._id);
    if (directParent) {
      if (isJobsCategoryName(directParent.name)) {
        return true;
      }
      if (isJobsSubcategory(directParent, categories)) {
        return true;
      }
    }

    return false;
  };

  const buildPathRecursive = (
    cat: SubCategory,
    categories: SubCategory[],
    excludeJobs: boolean = false
  ): string[] => {
    const path: string[] = [];

    if (excludeJobs && isJobsCategoryName(cat.name)) {
      return path;
    }

    path.push(cat.name);

    if (cat.parentID) {
      const parent = findCategoryById(categories, cat.parentID);
      if (parent) {
        const parentPath = buildPathRecursive(parent, categories, excludeJobs);
        return [...parentPath, ...path];
      }
    }

    const directParent = findDirectParent(categories, cat._id);
    if (directParent) {
      const parentPath = buildPathRecursive(
        directParent,
        categories,
        excludeJobs
      );
      return [...parentPath, ...path];
    }

    return path;
  };

  const isJobsCat = isJobsCategoryName(category.name);

  if (isJobsCat) {
    const url = `/jobs`;
    categoryUrlCache.set(cacheKey, url);
    return url;
  }

  const isJobSub = isJobsSubcategory(category, allCategories);
  const pathNames = buildPathRecursive(category, allCategories, isJobSub);

  const url = isJobSub
    ? `/jobs/listing/Jobs/${pathNames.join("/")}`
    : `/categories/${pathNames.join("/")}`;

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

const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  children,
}) => (
  <HoverCard openDelay={0} closeDelay={100}>
    <HoverCardTrigger asChild>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-2 lg:px-5 text-xs font-regular rounded-sm text-white hover:bg-white hover:text-purple transition-colors data-[state=open]:bg-white data-[state=open]:text-purple"
      >
        {label}
      </Button>
    </HoverCardTrigger>
    {children}
  </HoverCard>
);

const SubcategoryPanel: React.FC<SubcategoryPanelProps> = ({
  subcategories,
  allCategories,
}) => {
  const { t, locale } = useLocale();
  return (
    <div className="w-full min-w-[400px] flex-1 bg-purple/10 overflow-y-auto">
      <div className="flex flex-col w-full">
        {subcategories.map((subcategory) => {
          const hasChildren =
            subcategory.children && subcategory.children.length > 0;

          return (
            <div
              key={subcategory._id}
              className="transition-colors group w-full"
            >
              {hasChildren ? (
                <>
                  <div className="px-5 py-2.5 flex items-center gap-2 border-b border-gray-300">
                    <Typography variant="xs-bold" className="text-gray-600">
                      {locale === "ar"
                        ? subcategory.nameAr || subcategory.name
                        : subcategory.name}
                    </Typography>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-5 py-2.5">
                    {subcategory.children.map((child) => {
                      const childName =
                        locale === "ar"
                          ? child.nameAr || child.name
                          : child.name;
                      return (
                        <div key={child._id}>
                          <Link
                            href={buildCategoryUrl(child, allCategories)}
                            className="text-sm text-grey-blue hover:text-purple hover:underline cursor-pointer transition-colors"
                          >
                            {childName}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
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
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CategoryDropdownContent: React.FC<CategoryDropdownContentProps> = ({
  categoryData,
  isOtherCategory = false,
  allCategories,
}) => {
  const { locale } = useLocale();
  const [activeCategory, setActiveCategory] = useState<SubCategory | null>(
    null
  );

  if (isOtherCategory) {
    return (
      <HoverCardContent
        className="bg-white rounded-none rounded-b-xl shadow-lg border border-gray-200 overflow-hidden max-h-[500px] p-0 w-fit"
        align="start"
        sideOffset={4}
      >
        <div className="w-full max-w-md overflow-y-auto scrollbar-hide">
          {categoryData.map((category) => {
            const categoryName =
              locale === "ar"
                ? category.nameAr || category.name
                : category.name;
            const displayName =
              categoryName === "Jobs" ? "Job" : categoryName;
            return (
              <div
                key={category._id}
                className="flex items-center justify-between p-3 hover:bg-purple/10 cursor-pointer transition-colors group"
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
              </div>
            );
          })}
        </div>
      </HoverCardContent>
    );
  }

  return (
    <HoverCardContent
      className="bg-white rounded-none rounded-b-xl shadow-lg border border-gray-200 overflow-hidden max-h-[500px] p-0 w-fit"
      align="start"
      sideOffset={0}
    >
      <div className="flex w-full">
        <div className="w-60 border-r border-gray-300 overflow-y-auto">
          {categoryData.map((category) => {
            const hasChildren =
              category.children && category.children.length > 0;
            const isActive = activeCategory?._id === category._id;

            if (!hasChildren) {
              return (
                <div
                  key={category._id}
                  onMouseEnter={() => setActiveCategory(null)}
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
                </div>
              );
            }

            return (
              <div
                key={category._id}
                className={cn(
                  "flex items-center text-xs justify-between p-3 hover:bg-purple/10 hover:text-purple cursor-pointer transition-colors group",
                  isActive && "bg-purple/10 text-purple"
                )}
                onMouseEnter={() => setActiveCategory(category)}
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
                {isActive ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            );
          })}
        </div>

        {activeCategory &&
          activeCategory.children &&
          activeCategory.children.length > 0 && (
            <SubcategoryPanel
              subcategories={activeCategory.children}
              allCategories={allCategories}
            />
          )}
      </div>
    </HoverCardContent>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CategoryNav: React.FC<{ className?: string }> = ({ className }) => {
  const { localePath } = useLocale();
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetMainCategories();

  const VISIBLE_CATEGORIES_COUNT = 6;
  const VISIBLE_JOBS_CATEGORIES_COUNT = 5;

  const isJobsPage = pathname?.includes("/jobs");

  const jobsCategory = useMemo(() => {
    if (!categoriesData || !isJobsPage) return null;

    const findJobsCategory = (
      categories: SubCategory[]
    ): SubCategory | null => {
      for (const category of categories) {
        const categoryName = category.name.toLowerCase();
        if (categoryName === "jobs" || categoryName === "job") {
          return category;
        }
        if (category.children && category.children.length > 0) {
          const found = findJobsCategory(category.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findJobsCategory(categoriesData);
  }, [categoriesData, isJobsPage]);

  const categoriesToDisplay = useMemo(() => {
    if (isJobsPage && jobsCategory?.children) {
      return jobsCategory.children;
    }
    return categoriesData || [];
  }, [isJobsPage, jobsCategory, categoriesData]);

  const transformedCategories: { type: string; label: string }[] =
    categoriesToDisplay.map((category: SubCategory) => {
      const isArabic = locale === "ar";
      return {
        type: category._id,
        label: isArabic ? category.nameAr || category.name : category.name,
      };
    });

  const visibleCategoriesList = transformedCategories.slice(
    0,
    isJobsPage ? VISIBLE_JOBS_CATEGORIES_COUNT : VISIBLE_CATEGORIES_COUNT
  );
  const otherCategories = transformedCategories.slice(VISIBLE_CATEGORIES_COUNT);

  const getCategoryData = (categoryType: string): SubCategory[] => {
    if (!categoriesToDisplay) return [];

    if (categoryType === "other") {
      return categoriesToDisplay.slice(VISIBLE_CATEGORIES_COUNT);
    }

    const category = categoriesToDisplay.find(
      (cat: SubCategory) => cat._id === categoryType
    );
    return category?.children || [];
  };

  return (
    <div
      className={cn("relative md:bg-purple animate-fade-in", className)}
    >
      <div className="max-w-[1080px] mx-auto px-4 xl:px-0">
        <nav className={cn("flex items-center bg-white sm:bg-transparent justify-between py-1 w-full")}>
          {categoriesError ? (
            <div className="hidden md:flex flex-1 items-center justify-center">
              <Typography variant="sm-regular" className="text-red-500">
                Failed to load categories. Please try again.
              </Typography>
            </div>
          ) : categoriesLoading ? (
            <CategoryLoader />
          ) : (
            <div
              key={isJobsPage ? "jobs-nav" : "main-nav"}
                  className="hidden w-full md:flex gap-1 flex-1 items-center justify-between"
            >
              {visibleCategoriesList.map(({ type, label }) => (
                <div key={type}>
                  <CategoryButton categoryType={type} label={label}>
                    <CategoryDropdownContent
                      categoryData={getCategoryData(type)}
                      allCategories={categoriesData || []}
                    />
                  </CategoryButton>
                </div>
              ))}

              {otherCategories.length > 0 && (
                <div>
                  <CategoryButton categoryType="other" label="Other">
                    <CategoryDropdownContent
                      categoryData={getCategoryData("other")}
                      allCategories={categoriesData || []}
                      isOtherCategory={true}
                    />
                  </CategoryButton>
                </div>
              )}
            </div>
          )}

          <div className="flex md:hidden flex-1">
            <SearchAnimated />
          </div>

          {categoriesLoading ? (
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
                <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <SearchHistoryPopover />
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href="/user/profile"
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Image
                          src="https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/help.svg"
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
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={localePath("/chat")}
                        className="min-w-6 min-[1080px]:block hidden"
                      >
                        <Image
                          src="https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/unread_chat.svg"
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
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
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
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <NotificationsPopover />
                </div>

                <div
                  hidden={isJobsPage}
                  className="animate-fade-in"
                  style={{ animationDelay: '350ms' }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        icon={<MapPin className="w-4 h-4 -mr-3" />}
                        iconPosition="center"
                          className={cn("hidden sm:flex", "text-purple py-5 md:py-4")}
                        variant={isMobile ? "filled" : "outline"}
                        size="sm"
                        onClick={() => router.push("/map-view")}
                      >
                          <span className="hidden sm:block">Map View</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on Map</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </TooltipProvider>
          )}
        </nav>
      </div>
    </div>
  );
};

export default CategoryNav;