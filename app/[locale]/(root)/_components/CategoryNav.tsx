"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Heart,
  MapPin,
  MessageSquare,
  UserPlus,
  MapPinIcon,
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
import { useIsAuthenticated } from "@/hooks/useAuth";
import { toSlug, slugify } from "@/utils/slug-utils";
import PostAdDialog from "@/app/[locale]/(root)/post-ad/_components/PostAdDialog";
import { ICONS } from "@/constants/icons";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface CategoryButtonProps {
  categoryType: string;
  label: string;
  url: string;
  children: React.ReactNode;
}

interface CategoryDropdownContentProps {
  categoryData: SubCategory[];
  isOtherCategory?: boolean;
  allCategories: SubCategory[];
  onClose?: () => void;
}

interface SubcategoryPanelProps {
  subcategories: SubCategory[];
  allCategories: SubCategory[];
  onClose?: () => void;
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
  allCategories: SubCategory[],
): string => {
  const cacheKey = `${category._id}-${category.name}`;
  if (categoryUrlCache.has(cacheKey)) {
    return categoryUrlCache.get(cacheKey)!;
  }

  const findCategoryById = (
    categories: SubCategory[],
    id: string,
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
    childId: string,
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
    categories: SubCategory[],
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
    excludeJobs: boolean = false,
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
        excludeJobs,
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

  const slugifiedPath = slugify(...pathNames);

  const url = isJobSub
    ? `/jobs/listing/jobs/${slugifiedPath}`
    : `/${slugifiedPath}`;

  categoryUrlCache.set(cacheKey, url);
  return url;
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const CategoryLoader = () => (
  <div className="hidden md:flex gap-4 flex-1 items-center justify-between animate-pulse">
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-sm"
      />
    ))}
  </div>
);

const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  url,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard
      open={open}
      onOpenChange={setOpen}
      openDelay={0}
      closeDelay={100}
    >
      <HoverCardTrigger asChild>
        <Link
          href={url}
          className="h-9 px-2 flex items-center cursor-pointer text-[13px] font-semibold rounded-sm text-gray-500 dark:text-white hover:bg-white dark:hover:bg-gray-800 hover:text-purple dark:hover:text-white transition-colors  data-[state=open]:text-purple"
          onClick={() => setOpen(false)}
        >
          {label}
        </Link>
      </HoverCardTrigger>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            onClose: () => setOpen(false),
          })
        : children}
    </HoverCard>
  );
};

const SubcategoryPanel: React.FC<SubcategoryPanelProps> = ({
  subcategories,
  allCategories,
  onClose,
}) => {
  const { t, locale } = useLocale();

  const sortedSubcategories = useMemo(() => {
    return [...subcategories].sort((a, b) => {
      const nameA = locale === "ar" ? a.nameAr || a.name : a.name;
      const nameB = locale === "ar" ? b.nameAr || b.name : b.name;
      return (nameA || "").localeCompare(nameB || "", locale);
    });
  }, [subcategories, locale]);

  return (
    <div className="w-full min-w-[400px] flex-1 bg-purple/10 dark:bg-purple/5 overflow-y-auto max-h-[40vh]">
      <div className="flex flex-col w-full">
        {sortedSubcategories.map((subcategory) => {
          const hasChildren =
            subcategory.children && subcategory.children.length > 0;

          return (
            <div
              key={subcategory._id}
              className="transition-colors group w-full"
            >
              {hasChildren ? (
                <>
                  <div className="px-5 py-2.5 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700">
                    <Typography
                      variant="xs-bold"
                      className="text-gray-600 dark:text-white"
                    >
                      {locale === "ar"
                        ? subcategory.nameAr || subcategory.name
                        : subcategory.name}
                    </Typography>
                    <div className="ml-auto group-hover:block hidden">
                      <Link
                        href={buildCategoryUrl(subcategory, allCategories)}
                        className="text-purple text-xs hover:text-purple/80 flex items-center gap-1"
                        onClick={onClose}
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
                    {[...subcategory.children]
                      .sort((a, b) => {
                        const nameA =
                          locale === "ar" ? a.nameAr || a.name : a.name;
                        const nameB =
                          locale === "ar" ? b.nameAr || b.name : b.name;
                        return (nameA || "").localeCompare(nameB || "", locale);
                      })
                      .map((child) => {
                        const childName =
                          locale === "ar"
                            ? child.nameAr || child.name
                            : child.name;
                        return (
                          <div key={child._id}>
                            <Link
                              href={buildCategoryUrl(child, allCategories)}
                              className="text-sm text-grey-blue dark:text-white hover:text-purple hover:underline cursor-pointer transition-colors"
                              onClick={onClose}
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
                  className="px-5 py-2.5 flex items-center gap-2 border-b border-gray-300 dark:border-gray-700 text-gray-600 dark:text-white hover:bg-purple/10 hover:text-purple transition-colors"
                  onClick={onClose}
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
  onClose,
}) => {
  const { locale } = useLocale();
  const [activeCategory, setActiveCategory] = useState<SubCategory | null>(
    null,
  );

  if (isOtherCategory) {
    return (
      <HoverCardContent
        className="bg-white dark:bg-gray-900 rounded-none rounded-b-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[80vh] p-0 w-fit"
        align={locale === "ar" ? "end" : "start"}
        sideOffset={4}
      >
        <div className="w-full max-w-md overflow-y-auto max-h-[80vh]">
          {categoryData.map((category) => {
            const categoryName =
              locale === "ar"
                ? category.nameAr || category.name
                : category.name;
            const displayName = categoryName === "Jobs" ? "Job" : categoryName;
            return (
              <div
                key={category._id}
                className="flex items-center text-purple justify-between p-3 hover:bg-purple/10 cursor-pointer transition-colors group"
              >
                <Link
                  href={
                    category.name.toLowerCase() === "job"
                      ? `/jobs`
                      : buildCategoryUrl(category, allCategories)
                  }
                  className="text-gray-600 dark:text-white group-hover:text-purple text-sm w-full"
                  onClick={onClose}
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
      className="bg-white dark:bg-gray-900 rounded-none rounded-b-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden max-h-[40vh] p-0 w-fit"
      align={locale === "ar" ? "end" : "start"}
      sideOffset={0}
    >
      <div className={cn("flex w-full", locale === "ar" && "flex-row-reverse")}>
        <div
          className={cn(
            "w-60 border-gray-300 dark:border-gray-700 overflow-y-auto max-h-[40vh]",
            locale === "ar" ? "border-l" : "border-r",
          )}
        >
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
                      isActive && "bg-purple/10 text-purple",
                    )}
                    onClick={onClose}
                  >
                    <Typography
                      variant="xs-regular-inter"
                      className={cn(
                        "text-gray-600 dark:text-white group-hover:text-purple text-xs",
                        isActive && "text-purple font-semibold",
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
              <Link
                key={category._id}
                href={buildCategoryUrl(category, allCategories)}
                className={cn(
                  "flex items-center text-xs justify-between p-3 hover:bg-purple/10 hover:text-purple cursor-pointer transition-colors group",
                  isActive && "bg-purple/10 text-purple",
                )}
                onMouseEnter={() => setActiveCategory(category)}
                onClick={(e) => {
                  onClose?.();
                }}
              >
                <Typography
                  variant="xs-regular-inter"
                  className={cn(
                    "text-gray-600 dark:text-white group-hover:text-purple text-xs",
                    isActive && "text-purple font-semibold",
                  )}
                >
                  {locale === "ar"
                    ? category.nameAr || category.name
                    : category.name}
                </Typography>
                {isActive ? (
                  locale === "ar" ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )
                ) : locale === "ar" ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Link>
            );
          })}
        </div>

        {activeCategory &&
          activeCategory.children &&
          activeCategory.children.length > 0 && (
            <SubcategoryPanel
              subcategories={activeCategory.children}
              allCategories={allCategories}
              onClose={onClose}
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
  const { t, locale, localePath } = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetMainCategories();

  const VISIBLE_CATEGORIES_COUNT = 7;
  const VISIBLE_JOBS_CATEGORIES_COUNT = 5;

  const isJobsPage = pathname?.includes("/jobs");

  const jobsCategory = useMemo(() => {
    if (!categoriesData || !isJobsPage) return null;

    const findJobsCategory = (
      categories: SubCategory[],
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

  const transformedCategories: { type: string; label: string; url: string }[] =
    categoriesToDisplay.map((category: SubCategory) => {
      const isArabic = locale === "ar";
      return {
        type: category._id,
        label: isArabic ? category.nameAr || category.name : category.name,
        url: buildCategoryUrl(category, categoriesData || []),
      };
    });

  const visibleCategoriesList = transformedCategories.slice(
    0,
    isJobsPage ? VISIBLE_JOBS_CATEGORIES_COUNT : VISIBLE_CATEGORIES_COUNT,
  );
  const otherCategories = transformedCategories.slice(VISIBLE_CATEGORIES_COUNT);

  const getCategoryData = (categoryType: string): SubCategory[] => {
    if (!categoriesToDisplay) return [];

    if (categoryType === "other") {
      return categoriesToDisplay.slice(VISIBLE_CATEGORIES_COUNT);
    }

    const category = categoriesToDisplay.find(
      (cat: SubCategory) => cat._id === categoryType,
    );
    return category?.children || [];
  };

  return (
    <nav
      className={cn(
        "animate-fade-in flex gap-2 w-full items-center justify-between py-1",
        className,
      )}
    >
      {categoriesError ? (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <Typography variant="sm-regular" className="text-red-500">
            Note: Failed to load categories. Please try again.
          </Typography>
        </div>
      ) : categoriesLoading ? (
        <CategoryLoader />
      ) : (
        <div
          key={isJobsPage ? "jobs-nav" : "main-nav"}
          className="hidden w-full md:flex flex-1 gap-6 items-center"
        >
          {visibleCategoriesList.map(({ type, label, url }) => (
            <div key={type}>
              <CategoryButton categoryType={type} label={label} url={url}>
                <CategoryDropdownContent
                  categoryData={getCategoryData(type)}
                  allCategories={categoriesData || []}
                />
              </CategoryButton>
            </div>
          ))}

          {otherCategories.length > 0 && (
            <div>
              <CategoryButton
                categoryType="other"
                label="Other"
                url={isJobsPage ? "/jobs" : "/categories"}
              >
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

      <div className="flex gap-3 items-center">
        {categoriesLoading ? (
          <div className="flex items-center justify-between gap-5 ml-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="size-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            ))}
            <div className="animate-pulse">
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          </div>
        ) : (
          <div className="max-[1000px]:hidden flex gap-3 items-center">
            <TooltipProvider delayDuration={200}>
              <div
                className="animate-fade-in"
                style={{ animationDelay: "100ms" }}
              >
                <SearchHistoryPopover />
              </div>

              <div
                className="animate-fade-in"
                style={{ animationDelay: "150ms" }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => router.push(localePath("/user/my-ads"))}
                      className="min-w-6 md:block hidden cursor-pointer"
                    >
                      <UserPlus className="text-purple hover:scale-110 transition-all duration-300" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>My Ads</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div
                className="animate-fade-in"
                style={{ animationDelay: "200ms" }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => router.push(localePath("/chat"))}
                      className="min-w-6 md:block hidden cursor-pointer"
                    >
                      <MessageSquare className="text-purple hover:scale-110 transition-all duration-300" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Messages</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div
                className="animate-fade-in"
                style={{ animationDelay: "250ms" }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => router.push(localePath("/favorites"))}
                      className="min-w-6 md:block hidden cursor-pointer"
                    >
                      <Heart className="size-6 hover:scale-110 transition-all duration-300 text-purple" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Favorites</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div
                className="animate-fade-in"
                style={{ animationDelay: "300ms" }}
              >
                <NotificationsPopover />
              </div>
            </TooltipProvider>
          </div>
        )}
        <div
          className="animate-fade-in shrink-0 ml-1 md:hidden"
          style={{ animationDelay: "350ms" }}
        >
          <PostAdDialog>
            <Button
              variant="filled"
              size="sm"
              iconPosition="right"
              icon={
                <Image
                  src={ICONS.ai.aiPurpleBg}
                  alt="AI Logo"
                  width={16}
                  height={16}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              }
              className={cn(
                "h-[40px] px-2.5 sm:px-4 text-[11px] sm:text-xs md:h-[42px] whitespace-nowrap",
              )}
            >
              {t.home.navbar.placeAdShort}
            </Button>
          </PostAdDialog>
        </div>

        <div
          className="animate-fade-in shrink-0 ml-1 hidden md:block"
          style={{ animationDelay: "350ms" }}
        >
          <Button
            variant="filled"
            size="sm"
            iconPosition="center"
            icon={<MapPinIcon className="-mr-2" />}
            onClick={() => router.push(localePath("/map-view"))}
          >
            Map View
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
