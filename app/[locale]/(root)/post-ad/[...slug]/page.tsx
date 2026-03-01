"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronRight, ImageOffIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCategoryFromTree } from "@/hooks/useCategories";
import { SubCategory } from "@/interfaces/categories.types";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { findCategoryInTree } from "@/validations/post-ad.validation";
import { useLocale } from "@/hooks/useLocale";

export default function CategoryTraversalPage() {
  const { localePath } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    addToCategoryArray,
    setActiveCategory,
    setStep,
    categoryArray,
    clearCategoryArray,
  } = useAdPostingStore((state) => state);
  const { slug } = useParams<{ slug: string[] }>();
  const router = useRouter();

  const currentCategoryId = slug?.length > 0 ? slug[slug.length - 1] : null;
  const mainCategoryId = slug?.length > 0 ? slug[0] : null;

  // Derive the main category subtree from the already-cached /categories/tree
  // response (populated on the select page). useCategoryFromTree shares the same
  // TanStack Query key so no extra network request is ever made here.
  const {
    data: mainCategoryTree,
    isLoading,
    error,
  } = useCategoryFromTree(mainCategoryId || "");

  // Get the current/active category from the main tree (includes its children)
  // The active category is the last one in the slug array (slug[slug.length - 1])
  const currentCategory = useMemo(() => {
    if (!currentCategoryId || !mainCategoryTree) return null;
    return findCategoryInTree(mainCategoryTree, currentCategoryId);
  }, [currentCategoryId, mainCategoryTree]);

  /**
   * Extract category names from the main category tree
   * This avoids making individual API calls for each category
   */
  const getCategoryNamesFromTree = (categoryIds: string[]) => {
    return categoryIds.map((categoryId) => {
      const category = findCategoryInTree(mainCategoryTree, categoryId);
      return {
        id: categoryId,
        name: category?.name,
      };
    });
  };

  // Sync categoryArray with slugArray from URL - only update if slug is longer
  useEffect(() => {
    if (!slug || slug.length === 0) {
      // If slug is empty, clear categoryArray
      if (categoryArray.length > 0) {
        clearCategoryArray();
        setActiveCategory(null);
      }
      return;
    }

    // Only update if slug length is greater than categoryArray length
    if (slug.length > categoryArray.length && mainCategoryTree) {
      // Get category names from the main category tree
      const categoriesFromTree = getCategoryNamesFromTree(slug);

      // Clear and rebuild categoryArray with all categories from slug (only those with names)
      clearCategoryArray();

      categoriesFromTree
        .filter((category) => category.name) // Only add categories with names
        .forEach((category) => {
          addToCategoryArray({
            id: category.id,
            name: category.name as string, // Type assertion safe after filter
          });
        });

      // Set active category to the last one in slugArray
      setActiveCategory(slug[slug.length - 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug?.join(","), mainCategoryTree?._id, clearCategoryArray]);

  // Extract children subcategories from the current category
  const childCategories = useMemo(() => {
    if (!currentCategory?.children) return [];
    return currentCategory.children;
  }, [currentCategory]);

  // Redirect to details page if current category has no children but has fields
  useEffect(() => {
    if (
      currentCategory &&
      (!currentCategory.children || currentCategory.children.length === 0) &&
      currentCategory.fields &&
      currentCategory.fields.length > 0 &&
      selectedCategory === currentCategory._id
    ) {
      // Set active category to current leaf category
      const leafCategoryId = currentCategory._id;
      setActiveCategory(leafCategoryId);
      // Move to step 3 (leaf category selected)
      setStep(3);
      // Redirect to details page with active category ID
      router.push(localePath(`/post-ad/details/${leafCategoryId}`));
    }
  }, [currentCategory, selectedCategory, router, setStep, setActiveCategory]);

  // Transform children subcategories for display
  const displayCategories = useMemo(() => {
    if (!childCategories || childCategories.length === 0) return [];

    return childCategories.map((category: SubCategory) => {
      return {
        id: category._id,
        name: category.name,
        icon: category.icon || "",
        bgColor: category.bgColor || "",
        hasChildren: category.children && category.children.length > 0,
        category: category,
      };
    });
  }, [childCategories]);

  // Handle category selection - just select, don't navigate or add to array
  const handleCategorySelect = (category: {
    id: string;
    name: string;
    icon: string;
    bgColor: string;
    hasChildren: boolean;
    category: SubCategory;
  }) => {
    setSelectedCategory(category.id);
    // Don't add to categoryArray here - only when Next is clicked
  };

  // Handle category card click - update immediately
  const handleCategoryClick = (category: {
    id: string;
    name: string;
    icon: string;
    bgColor: string;
    hasChildren: boolean;
    category: SubCategory;
  }) => {
    handleCategorySelect(category);
  };

  // Handle back button click - navigate to parent category or select page
  const handleBackClick = () => {
    if (!slug || slug.length === 0) {
      // No slug, go to select page
      clearCategoryArray();
      setActiveCategory(null);
      setStep(1);
      router.push(localePath("/post-ad/select"));
      return;
    }

    if (slug.length > 1) {
      // Remove last item from categoryArray to go to parent
      const parentCategoryArray = categoryArray.slice(0, -1);
      clearCategoryArray();
      parentCategoryArray.forEach((cat) => addToCategoryArray(cat));

      // Set active category to the new last item
      if (parentCategoryArray.length > 0) {
        setActiveCategory(
          parentCategoryArray[parentCategoryArray.length - 1].id
        );
      }

      // Remove last slug to go to parent
      const parentSlugPath = slug.slice(0, -1);
      router.push(localePath(`/post-ad/${parentSlugPath.join("/")}`));
      setSelectedCategory(null);
    } else {
      // At root category, go back to select page
      clearCategoryArray();
      setActiveCategory(null);
      setStep(1);
      router.push(localePath("/post-ad/select"));
    }
  };

  // Handle next button click - navigate to selected category or details page
  const handleNextClick = () => {
    if (!selectedCategory) return;

    const selectedCategoryData = displayCategories.find(
      (cat) => cat.id === selectedCategory
    );

    if (!selectedCategoryData) return;

    // Add to categoryArray when Next is clicked
    addToCategoryArray({
      id: selectedCategoryData.id,
      name: selectedCategoryData.name,
    });

    // Set as active category
    setActiveCategory(selectedCategoryData.id);

    // If category has no children, redirect to details page
    if (!selectedCategoryData.hasChildren) {
      // Move to step 3 (leaf category selected)
      setStep(3);
      // Redirect to details page with active category ID
      router.push(`/post-ad/details/${selectedCategory}`);
    } else {
      // Build new slug path by appending the selected category ID
      const newSlugPath = [...slug, selectedCategory];
      // Navigate to the new slug path
      router.push(localePath(`/post-ad/${newSlugPath.join("/")}`));
    }
  };

  if (isLoading) {
    return (
      <section className="h-full md:h-[420px] md:overflow-y-auto">
        <div className="flex-1 w-full max-w-[888px] mx-auto mb-5">
          <div className="flex h-full gap-10">
            <div className="w-full md:w-2/3 h-full">
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="w-full p-2 rounded-lg border-2 border-gray-200 bg-gray-50 animate-pulse"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="size-[50px] bg-gray-200 rounded-lg"></div>
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="h-full md:h-[420px] md:overflow-y-auto">
        <div className="flex-1 w-full max-w-[888px] mx-auto mb-5">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load category</p>
            <p className="text-sm text-gray-500 mb-4">Please try again later</p>
            <Button
              onClick={() => router.push("/post-ad/select")}
              variant="outline"
            >
              Back to Categories
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!currentCategory) {
    return (
      <section className="h-full md:h-[420px] md:overflow-y-auto">
        <div className="flex-1 w-full max-w-[888px] mx-auto mb-5">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Category not found</p>
            <Button
              onClick={() => router.push("/post-ad/select")}
              variant="outline"
            >
              Back to Categories
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-full overflow-y-auto">
      <div className="flex-1 w-full max-w-[888px] mx-auto mb-5">
        <div className="flex h-full gap-10">
          {/* Left Column - Categories */}
          <div className="w-full md:w-2/3 h-full">
            {displayCategories.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">No subcategories found</p>
                  <p className="text-sm text-gray-400">
                    Redirecting to details...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[500px]">
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <div className="space-y-3 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
                  {displayCategories
                    .filter((category) => category.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((category) => {
                  const isSelected = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
                        isSelected
                          ? "border-purple bg-purple/10 dark:bg-purple/20"
                          : "border-gray-200 bg-white hover:border-gray-300 dark:bg-gray-900 dark:border-gray-800 dark:hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`size-[50px] ${
                              category.bgColor || "bg-[#F7F8FA]"
                            } rounded-lg flex items-center justify-center dark:bg-gray-800`}
                          >
                            {category.icon ? (
                              <Image
                                src={category.icon}
                                alt={category.name}
                                width={50}
                                height={50}
                                className="object-cover"
                              />
                            ) : (
                              <ImageOffIcon className="size-5 text-gray-400" />
                            )}
                          </div>
                          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {category.name}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      </div>
                    </button>
                  );
                })}
                {displayCategories.filter((category) => category.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No categories match your search.
                  </div>
                )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Image Upload Area */}
          <div className="sticky top-0 bg-gray-100 dark:bg-gray-800 hidden md:flex flex-1 p-6 w-1/3 max-h-[420px] min-h-[380px] rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="w-full bg-white dark:bg-gray-950 sticky bottom-0 left-0 right-0 flex justify-between gap-3 p-4 border-t dark:border-gray-800">
        <Button
          className="w-full"
          onClick={handleBackClick}
          variant={"outline"}
        >
          Back
        </Button>
        <Button
          className="w-full"
          onClick={handleNextClick}
          variant={"primary"}
          disabled={!selectedCategory}
        >
          Next
        </Button>
      </footer>
    </section>
  );
}
