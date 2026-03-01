"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useAdsByKeyword } from "@/hooks/useAds";
import { useAuthStore } from "@/stores/authStore";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Input } from "@/components/ui/input";
import { CategoryDropdown } from "./category-dropdown";
import { slugify } from "@/utils/slug-utils";

interface SearchResult {
  adCount: number;
  name: string;
  category: string;
  relatedCategories: string[];
}

interface SimpleSearchInputProps {
  onTrigger: () => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onSearchQueryChange?: (value: string) => void;
}

export function SimpleSearchInput({
  onTrigger,
  selectedCategory,
  setSelectedCategory,
}: SimpleSearchInputProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const userId = session?.user?._id;

  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Use debounced value hook - input uses localValue for immediate updates
  // The callback receives the debounced value after 500ms delay
  const [localSearchQuery, setLocalSearchQuery] = useDebouncedValue(
    "",
    (value) => {
      setDebouncedQuery(value);
    },
    500
  );

  // Fetch keyword search results with debounced query
  const {
    data: keywordData,
    isLoading: isKeywordLoading,
    error: keywordError,
  } = useAdsByKeyword(debouncedQuery.trim(), userId ? { userId } : undefined);

  const keywordResults = (keywordData?.data || []) as SearchResult[];
  const hasResults = keywordResults.length > 0;
  const showDropdown =
    localSearchQuery.trim().length > 0 &&
    (isKeywordLoading || hasResults || !!keywordError);

  // Close dropdown when clicking outside
  useOutsideClick(
    dropdownRef,
    () => {
      setLocalSearchQuery("");
      setDebouncedQuery("");
      setSelectedIndex(-1);
    },
    !!showDropdown
  );

  const handleSearch = (relatedCategories: string[]) => {
    if (relatedCategories.length > 0) {
      if (relatedCategories[0] === "Jobs") {
        router.push(`/jobs/listing/${relatedCategories.map((category) => slugify(category)).join("/")}`);
      } else {
        router.push(`/categories/${relatedCategories.map((category) => slugify(category)).join("/")}`);
      }
    }
  };

  const handleResultClick = (relatedCategories: string[]) => {
    handleSearch(relatedCategories);
    setLocalSearchQuery("");
    setDebouncedQuery("");
    setSelectedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (selectedIndex >= 0 && keywordResults[selectedIndex]) {
        handleResultClick(keywordResults[selectedIndex].relatedCategories);
      } else if (keywordResults.length > 0) {
        // If results exist but none selected, use the first one
        handleResultClick(keywordResults[0].relatedCategories);
      }
      // If no results, do nothing (prevent default navigation to /categories/query)
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (keywordResults.length > 0) {
        setSelectedIndex((prev) =>
          prev < keywordResults.length - 1 ? prev + 1 : prev
        );
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (event.key === "Escape") {
      setLocalSearchQuery("");
      setDebouncedQuery("");
      setSelectedIndex(-1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
    setSelectedIndex(-1);
  };

  return (
    <motion.div
      key="simple"
      layout
      className="flex items-center flex-1"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 1 }}
      exit={{ opacity: 0, y: -6 }}
    >
      <CategoryDropdown
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div
        className="hidden lg:block h-6 w-px bg-black/10"
        aria-hidden="true"
      />
      <div className="relative flex-1" ref={dropdownRef}>
        <div className="relative flex items-center">
          <Input
            onRightIconClick={onTrigger}
            leftIcon={<SearchIcon className="size-5 text-gray-400 -ml-2" />}
            rightIcon={
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-[10px] text-gray-400 font-sans pointer-events-none">
                  <kbd className="font-sans">Ctrl</kbd>
                  <span className="text-[8px] opacity-60">+</span>
                  <kbd className="font-sans">J</kbd>
                </div>
                <Image
                  src="https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/ai-bg-white.svg"
                  width={20}
                  height={20}
                  alt="AI Logo"
                  className="cursor-pointer"
                />
              </div>
            }
            type="text"
            inputSize="sm"
            placeholder="Search anything"
            value={localSearchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="pl-8 pr-20 flex-1 block w-full bg-transparent text-xs placeholder-gray-500 focus:outline-none focus:ring-0 border-0"
          />
        </div>

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 max-h-96 overflow-y-auto z-50">
            {isKeywordLoading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">Searching...</p>
              </div>
            ) : keywordError ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-red-500">Error loading results</p>
                <p className="text-xs text-gray-400 mt-1">Please try again</p>
              </div>
            ) : hasResults ? (
              <ul className="py-2">
                {keywordResults.map((result, index) => (
                  <li
                    key={index}
                    className={`relative px-4 py-3 cursor-pointer transition-colors ${
                      selectedIndex === index
                        ? "bg-purple/10"
                        : "hover:bg-purple/10"
                    }`}
                    onClick={() => handleResultClick(result.relatedCategories)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {result.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {result.category}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-xs font-semibold text-purple bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {result.adCount} {result.adCount === 1 ? "ad" : "ads"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">No results found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try searching for something else
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
