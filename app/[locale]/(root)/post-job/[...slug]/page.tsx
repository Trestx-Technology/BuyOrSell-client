"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronRight, ImageOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCategoryTreeById } from "@/hooks/useCategories";
import { SubCategory } from "@/interfaces/categories.types";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { findCategoryInTree } from "@/validations/post-ad.validation";
import { useLocale } from "@/hooks/useLocale";

export default function JobCategoryTraversalPage() {
  const { localePath } = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Fetch the category tree by main category ID to get the full tree
  const {
    data: mainCategoryTree,
    isLoading,
    error,
  } = useCategoryTreeById(mainCategoryId || "");

  // Get the current/active category from the main tree (includes its children)
  const currentCategory = useMemo(() => {
    if (!currentCategoryId || !mainCategoryTree) return null;
    return findCategoryInTree(mainCategoryTree, currentCategoryId);
  }, [currentCategoryId, mainCategoryTree]);

  /**
   * Extract category names from the main category tree
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

  // Sync categoryArray with slugArray from URL
  useEffect(() => {
    if (!slug || slug.length === 0) {
      if (categoryArray.length > 0) {
        clearCategoryArray();
        setActiveCategory(null);
      }
      return;
    }

    if (slug.length > categoryArray.length && mainCategoryTree) {
      const categoriesFromTree = getCategoryNamesFromTree(slug);

      clearCategoryArray();

      categoriesFromTree
        .filter((category) => category.name)
        .forEach((category) => {
          addToCategoryArray({
            id: category.id,
            name: category.name as string,
          });
        });

      setActiveCategory(slug[slug.length - 1]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug?.join(","), mainCategoryTree?._id, clearCategoryArray]);

  // Extract children subcategories
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
      const leafCategoryId = currentCategory._id;
      setActiveCategory(leafCategoryId);
      setStep(3);
      router.push(localePath(`/post-job/details/${leafCategoryId}`));
    }
  }, [currentCategory, selectedCategory, router, setStep, setActiveCategory, localePath]);

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

  const handleCategorySelect = (category: {
    id: string;
    name: string;
    icon: string;
    bgColor: string;
    hasChildren: boolean;
    category: SubCategory;
  }) => {
    setSelectedCategory(category.id);
  };

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

  // Handle back button click
  const handleBackClick = () => {
    if (!slug || slug.length === 0) {
      clearCategoryArray();
      setActiveCategory(null);
      setStep(1);
      router.push(localePath("/post-job/select"));
      return;
    }

    if (slug.length > 1) {
      const parentCategoryArray = categoryArray.slice(0, -1);
      clearCategoryArray();
      parentCategoryArray.forEach((cat) => addToCategoryArray(cat));

      if (parentCategoryArray.length > 0) {
        setActiveCategory(
          parentCategoryArray[parentCategoryArray.length - 1].id
        );
      }

      const parentSlugPath = slug.slice(0, -1);
      router.push(localePath(`/post-job/${parentSlugPath.join("/")}`));
      setSelectedCategory(null);
    } else {
      clearCategoryArray();
      setActiveCategory(null);
      setStep(1);
      router.push(localePath("/post-job/select"));
    }
  };

  // Handle next button click
  const handleNextClick = () => {
    if (!selectedCategory) return;

    const selectedCategoryData = displayCategories.find(
      (cat) => cat.id === selectedCategory
    );

    if (!selectedCategoryData) return;

    addToCategoryArray({
      id: selectedCategoryData.id,
      name: selectedCategoryData.name,
    });

    setActiveCategory(selectedCategoryData.id);

    if (!selectedCategoryData.hasChildren) {
      setStep(3);
      router.push(localePath(`/post-job/details/${selectedCategory}`));
    } else {
      const newSlugPath = [...slug, selectedCategory];
      router.push(localePath(`/post-job/${newSlugPath.join("/")}`));
    }
  };

  if (isLoading) {
    return (
      <section className="h-full md:h-[420px] md:overflow-y-auto">
        <div className="flex-1 w-full max-w-[888px] mx-auto mb-5">
           {/* Skeleton */}
            <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="w-full p-2 rounded-lg border-2 border-gray-200 bg-gray-50 animate-pulse h-16"></div>
            ))}
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
            <Button
              onClick={() => router.push(localePath("/post-job/select"))}
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
              onClick={() => router.push(localePath("/post-job/select"))}
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
    <section className="relative  h-full overflow-y-auto">
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
              <div className="space-y-3">
                {displayCategories.map((category) => {
                  const isSelected = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
                        isSelected
                          ? "border-purple bg-purple/10"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`size-[50px] ${
                              category.bgColor || "bg-[#F7F8FA]"
                            } rounded-lg flex items-center justify-center`}
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
                          <span className="text-lg font-medium text-gray-900">
                            {category.name}
                          </span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {/* Right Column (Instructions or Info) */}
          <div className="sticky top-0 bg-gray-100 hidden md:flex flex-1 p-6 w-1/3 max-h-[420px] min-h-[380px] rounded-lg border-2 border-dashed border-gray-300 items-center justify-center">
              <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">Post a Job</h3>
                  <p className="text-sm text-gray-500">Select the sub-category that best matches the job role.</p>
              </div>
          </div>
        </div>
      </div>
      <footer className="w-full bg-white sticky bottom-0 left-0 right-0 flex justify-between gap-3 p-4">
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
