"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAdsByKeyword } from "@/hooks/useAds";
import { Input } from "@/components/ui/input";
import { CategoryDropdown } from "./category-dropdown";
import { KeywordDropdown } from "./keyword-dropdown";

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
  onSearchQueryChange,
}: SimpleSearchInputProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Debounce search query for API calls
  //   React.useEffect(() => {
  //     const timer = setTimeout(() => {
  //       setDebouncedSearchQuery(searchQuery);
  //       onSearchQueryChange?.(searchQuery);
  //     }, 500);

  //     return () => clearTimeout(timer);
  //   }, [searchQuery, onSearchQueryChange]);

  // Fetch keyword search results
  const {
    data: keywordData,
    isLoading: isKeywordLoading,
    error: keywordError,
  } = useAdsByKeyword(debouncedSearchQuery.trim(), {});

  const keywordResults = keywordData?.data || [];
  const hasResults = keywordResults.length > 0;
  const showNoResults = Boolean(
    debouncedSearchQuery.trim() &&
      !isKeywordLoading &&
      !hasResults &&
      !keywordError
  );

  // Show dropdown when there's a query and we have results/loading/error
  const shouldShowDropdown =
    searchQuery.trim() &&
    (isKeywordLoading || hasResults || showNoResults || keywordError);

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    setSelectedIndex(-1);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Convert search query to URL-friendly format
      const searchTerm = query.trim().toLowerCase().replace(/\s+/g, "-");
      router.push(`/categories/${searchTerm}`);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
    setDebouncedSearchQuery(keyword);
    handleSearch(keyword);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (selectedIndex >= 0 && keywordResults[selectedIndex]) {
        handleKeywordClick(keywordResults[selectedIndex].name);
      } else {
        handleSearch(searchQuery);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (shouldShowDropdown && keywordResults.length > 0) {
        setSelectedIndex((prev) =>
          prev < keywordResults.length - 1 ? prev + 1 : prev
        );
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (event.key === "Escape") {
      setSearchQuery("");
      setDebouncedSearchQuery("");
      setSelectedIndex(-1);
    }
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
      <div className="relative flex-1">
        <Input
          onRightIconClick={onTrigger}
          leftIcon={<SearchIcon className="size-5 text-gray-400 -ml-2" />}
          rightIcon={
            <Image
              src="https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/ai-bg-white.svg"
              width={20}
              height={20}
              alt="AI Logo"
            />
          }
          type="text"
          inputSize="sm"
          placeholder="Search any product.."
          value={searchQuery}
          onChange={(e) => handleSearchQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-8 flex-1 block w-full bg-transparent text-xs placeholder-gray-500 focus:outline-none focus:ring-0 border-0"
        />
        {shouldShowDropdown && (
          <KeywordDropdown
            keywordResults={keywordResults}
            isLoading={isKeywordLoading}
            showNoResults={showNoResults}
            hasResults={hasResults}
            error={keywordError}
            debouncedSearchQuery={debouncedSearchQuery}
            selectedIndex={selectedIndex}
            onKeywordClick={handleKeywordClick}
            onMouseEnter={setSelectedIndex}
            dropdownRef={dropdownRef}
          />
        )}
      </div>
    </motion.div>
  );
}
