"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOTORS_ICONS } from "@/constants/icons";
import Image from "next/image";
import { useAdPosting } from "../_context/AdPostingContext";
import { useParams, useRouter } from "next/navigation";
import { useCategoriesTree } from "@/hooks/useCategories";
import { SubCategory } from "@/interfaces/categories.types";

export default function CategoryTraversalPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addCategoryName } = useAdPosting();
  const { slug } = useParams<{ slug: string[] }>();
  const router = useRouter();

  // Fetch the complete category tree
  const { data, isLoading, error } = useCategoriesTree();

  // Convert slug segments back to category names (reverse the transformation)
  const pathSegments = useMemo(() => {
    if (!slug) return [];
    return slug.map(segment => {
      // Decode URL component
      const decoded = decodeURIComponent(segment);
      // Split by hyphens and capitalize first letter of each word
      return decoded.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    });
  }, [slug]);
  
  // Debug logging
  console.log("pathSegments: ", pathSegments);
  console.log("slug: ", slug);
  console.log("data available: ", !!data);

  // Find the current category based on path segments
  const currentCategory = useMemo(() => {
    if (!data) return undefined;

    console.log("Finding current category for pathSegments:", pathSegments);
    
    let current: SubCategory | undefined = undefined;
    for (const segment of pathSegments) {
      const searchIn: SubCategory[] = current ? (current.children || []) : data;
      console.log(`Searching for "${segment}" in ${searchIn.length} categories`);
      console.log("Available categories:", searchIn.map(c => c.name));
      
      // Case-insensitive comparison for category names
      current = searchIn.find((c: SubCategory) => 
        c.name.toLowerCase() === segment.toLowerCase()
      );
      
      if (current) {
        console.log(`Found category: "${current.name}"`);
      } else {
        console.log(`Category "${segment}" not found`);
      }
      
      if (!current) break;
    }

    console.log("Final current category:", current?.name);
    return current;
  }, [pathSegments, data]);

  // Redirect to details if current category has no children
  useEffect(() => {
    if (currentCategory && (!currentCategory.children || currentCategory.children.length === 0)) {
      router.push('/post-ad/details');
    }
  }, [currentCategory, router]);
  
  // Transform current category's children for display
  const childCategories = useMemo(() => {
    if (!currentCategory?.children) return [];

    return currentCategory.children.map((category: SubCategory, index: number) => {
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
        hasChildren: category.children && category.children.length > 0,
        category: category,
      };
    });
  }, [currentCategory]);

  // Handle category selection - navigate deeper into the slug
  const handleCategorySelect = (category: { id: string; name: string; icon: string; color: string; bgColor: string; hasChildren: boolean; category: SubCategory }) => {
    setSelectedCategory(category.id);
    addCategoryName(category.name);

    // Create new slug path by adding the selected category name
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
    const newSlug = [...slug, encodeURIComponent(categorySlug)];
    router.push(`/post-ad/${newSlug.join('/')}`);
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
            <p className="text-red-500 mb-2">Failed to load categories</p>
            <p className="text-sm text-gray-500">Please try again later</p>
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
            {childCategories.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">No subcategories found</p>
                  <p className="text-sm text-gray-400">Redirecting to details...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {childCategories.map((category) => {
                  const isSelected = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
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
          <div className="sticky top-0 bg-gray-100 hidden md:flex flex-1 p-6 w-1/3 max-h-[420px] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
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
              // Go back to the previous level or to main selection
              if (slug.length > 1) {
                const parentSlug = slug.slice(0, -1);
                router.push(parentSlug.length > 0 ? `/post-ad/${parentSlug.map(s => encodeURIComponent(s)).join('/')}` : '/post-ad/select');
              } else {
                router.push('/post-ad/select');
              }
            }}
            variant={"outline"}
          >
            Back
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              // If a category is selected, proceed to next level
              // Otherwise, just stay on current page
              if (selectedCategory) {
                // The navigation is handled in handleCategorySelect
                // This button could be disabled until selection
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
