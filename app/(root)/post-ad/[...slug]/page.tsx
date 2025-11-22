"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOTORS_ICONS } from "@/constants/icons";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCategoryTreeById } from "@/hooks/useCategories";
import { SubCategory } from "@/interfaces/categories.types";
import { getCategoryById } from '@/app/api/categories/categories.services';
import { useAdPostingStore } from "@/stores/adPostingStore";

export default function CategoryTraversalPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { 
    addToCategoryArray, 
    setActiveCategory, 
    setStep, 
    categoryArray,
    clearCategoryArray 
  } = useAdPostingStore((state)=>state);
  const {slug} = useParams<{ slug: string[] }>();
  const router = useRouter();

  const currentCategoryId = slug?.length > 0 ? slug[slug.length - 1] : null;

  // Fetch the category tree by current category ID
  const {
    data: categoryData,
    isLoading,
    error,
  } = useCategoryTreeById(currentCategoryId || "");

  // Get the current category (which includes its children)
  const currentCategory = categoryData;

  // Fetch category names for all categories in slugArray
  const fetchCategoryNames = async (categoryIds: string[]) => {
    const categoryPromises = categoryIds.map(async (categoryId) => {
      try {
        const response = await getCategoryById(categoryId);
        const category = response.data;
        return {
          id: categoryId,
          name: category?.name || categoryId, // Fallback to ID only if fetch fails
        };
      } catch (error) {
        console.error(`Failed to fetch category ${categoryId}:`, error);
        return {
          id: categoryId,
          name: categoryId, // Will be updated later
        };
      }
    });
    
    return Promise.all(categoryPromises);
  };

  // Sync categoryArray with slugArray from URL and fetch missing category names
  useEffect(() => {
    if (slug?.length > 0) {
      // Check if categoryArray matches the current slugArray
      const currentCategoryIds = categoryArray.map(cat => cat.id);
      const slugIds = slug;
      
      // If arrays don't match, rebuild categoryArray from slugArray
      const arraysMatch = 
        currentCategoryIds.length === slugIds.length &&
        currentCategoryIds.every((id, index) => id === slugIds[index]);
      
      if (!arraysMatch) {
        // Store existing categories for lookup (only keep those with proper names, not IDs)
        const existingCategoriesMap = new Map(
          categoryArray
            .filter(cat => cat.name !== cat.id) // Only keep categories with real names
            .map(cat => [cat.id, cat])
        );
        
        // Identify categories that need names fetched
        const categoriesNeedingNames = slug.filter(
          (categoryId) => !existingCategoriesMap.has(categoryId)
        );
        
        // Fetch names for missing categories
        if (categoriesNeedingNames.length > 0) {
          fetchCategoryNames(categoriesNeedingNames).then((fetchedCategories) => {
            // Clear and rebuild categoryArray with all categories
            clearCategoryArray();
            
            slug.forEach((categoryId) => {
              // Check if category exists in existing categoryArray or fetched categories
              const existingCategory = existingCategoriesMap.get(categoryId);
              const fetchedCategory = fetchedCategories.find(cat => cat.id === categoryId);
              
              if (existingCategory) {
                addToCategoryArray(existingCategory);
              } else if (categoryId === currentCategory?._id && currentCategory) {
                // Use current category if it matches
                addToCategoryArray({
                  id: currentCategory._id,
                  name: currentCategory.name,
                });
              } else if (fetchedCategory && fetchedCategory.name !== fetchedCategory.id) {
                // Use fetched category if it has a proper name
                addToCategoryArray(fetchedCategory);
              }
              // Skip categories that still don't have names (don't add ID as name)
            });
            
            // Set active category to the last one in slugArray
            setActiveCategory(slug[slug.length - 1]);
          });
        } else {
          // All categories already have names, just rebuild array
          clearCategoryArray();
          slug.forEach((categoryId) => {
            const existingCategory = existingCategoriesMap.get(categoryId);
            if (existingCategory) {
              addToCategoryArray(existingCategory);
            } else if (categoryId === currentCategory?._id && currentCategory) {
              addToCategoryArray({
                id: currentCategory._id,
                name: currentCategory.name,
              });
            }
          });
          setActiveCategory(slug[slug.length - 1]);
        }
      }
    } else {
      // If slugArray is empty, clear categoryArray
      if (categoryArray.length > 0) {
        clearCategoryArray();
        setActiveCategory(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug?.join(","), currentCategory?._id, currentCategory?.name, clearCategoryArray]);
  

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
      router.push(`/post-ad/details/${leafCategoryId}`);
    } 
  }, [currentCategory, selectedCategory, router, setStep, setActiveCategory]);

  // Transform children subcategories for display
  const displayCategories = useMemo(() => {
    if (!childCategories || childCategories.length === 0) return [];

    return childCategories.map((category: SubCategory, index: number) => {
        // Icon mapping based on category name
        const getIcon = (name: string) => {
          const iconMap: Record<string, string> = {
            cars: MOTORS_ICONS.cars,
            bikes: MOTORS_ICONS.motorcycle,
            motorcycles: MOTORS_ICONS.motorcycle,
            boats: MOTORS_ICONS.cruiseShip,
            "heavy vehicles": MOTORS_ICONS.crane,
            trucks: MOTORS_ICONS.crane,
            others: MOTORS_ICONS.others,
          };

          const normalizedName = name.toLowerCase();
          for (const [key, icon] of Object.entries(iconMap)) {
            if (normalizedName.includes(key)) {
              return icon;
            }
          }

          // Default fallback icon
          return MOTORS_ICONS.others;
        };

        // Color mapping based on index for variety
        const colorSchemes = [
          { color: "text-red-500", bgColor: "bg-red-50" },
          { color: "text-blue-500", bgColor: "bg-blue-50" },
          { color: "text-cyan-500", bgColor: "bg-cyan-50" },
          { color: "text-yellow-500", bgColor: "bg-yellow-50" },
          { color: "text-amber-600", bgColor: "bg-amber-50" },
          { color: "text-green-500", bgColor: "bg-green-50" },
          { color: "text-purple-500", bgColor: "bg-purple-50" },
          { color: "text-pink-500", bgColor: "bg-pink-50" },
        ];

        const colorScheme = colorSchemes[index % colorSchemes.length];

        return {
          id: category._id,
          name: category.name,
          icon: category.icon || getIcon(category.name),
          color: colorScheme.color,
          bgColor: colorScheme.bgColor,
          hasChildren:
            category.children && category.children.length > 0,
          category: category,
        };
      }
    );
  }, [childCategories]);

  // Handle category selection - just select, don't navigate or add to array
  const handleCategorySelect = (category: {
    id: string;
    name: string;
    icon: string;
    color: string;
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
    color: string;
    bgColor: string;
    hasChildren: boolean;
    category: SubCategory;
  }) => {
    handleCategorySelect(category);
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
            <p className="text-sm text-gray-500 mb-4">
              Please try again later
            </p>
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
    <section className="h-full md:h-[420px] md:overflow-y-auto">
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
                            className={`size-[50px] bg-[#F7F8FA] rounded-lg flex items-center justify-center`}
                          >
                            <Image
                              src={category.icon}
                              alt={category.name}
                              width={50}
                              height={50}
                              className={`object-cover ${category.color}`}
                            />
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

          {/* Right Column - Image Upload Area */}
          <div className="sticky top-0 bg-gray-100 hidden md:flex flex-1 p-6 w-1/3 max-h-[420px] min-h-[380px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
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
      <footer className="w-full bg-white sticky md:fixed bottom-0 left-0 right-0 max-w-[1080px] mx-auto md:border-t px-5 py-5">
        <div className="flex w-full justify-between max-w-[888px] mx-auto gap-3">
          <Button
            className="w-full"
            onClick={() => {
              // Go back to parent category by removing last slug from path
                if (slug?.length > 1) {
                // Remove last item from categoryArray
                const parentCategoryArray = categoryArray.slice(0, -1);
                clearCategoryArray();
                parentCategoryArray.forEach(cat => addToCategoryArray(cat));
                
                // Set active category to the new last item
                if (parentCategoryArray.length > 0) {
                  setActiveCategory(parentCategoryArray[parentCategoryArray.length - 1].id);
                }
                
                // Remove last slug to go to parent
                const parentSlugPath = slug.slice(0, -1);
                router.push(`/post-ad/${parentSlugPath.join("/")}`);
                setSelectedCategory(null);
              } else if (slug?.length === 1) {
                // Go back to select page
                clearCategoryArray();
                setActiveCategory(null);
                setStep(1);
                router.push("/post-ad/select");
              } else {
                clearCategoryArray();
                setActiveCategory(null);
                setStep(1);
                router.push("/post-ad/select");
              }
            }}
            variant={"outline"}
          >
            Back
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              // If a category is selected, navigate to it
              if (selectedCategory) {
                const selectedCategoryData = displayCategories.find(
                  (cat) => cat.id === selectedCategory
                );
                
                if (selectedCategoryData) {
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
                    router.push(`/post-ad/${newSlugPath.join("/")}`);
                  }
                }
              }
            }}
            variant={"primary"}
            disabled={!selectedCategory}
          >
            Next
          </Button>
        </div>
      </footer>
    </section>
  );
}
