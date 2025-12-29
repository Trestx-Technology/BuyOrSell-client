"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter as useNextRouter } from "next/navigation";
import { createUrlParamHandler } from "@/utils/url-params";
import { useQueryParams } from "@/hooks/useQueryParam";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/magicui/border-beam";
import { COLORS } from "./constants";
import { SimpleSearchInput } from "./simple-search-input";
import { AISearchInput } from "./ai-search-input";
import { AISuggestions } from "./ai-suggestions";

export function SearchAnimated() {
  const [isAI, setIsAI] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const nextRouter = useNextRouter();
  const [selectedCategory, setSelectedCategory] =
    React.useState("All Categories");

  // Initialize category and search query from URL query parameters
  useQueryParams(searchParams, {
    category: { setState: setSelectedCategory },
    search: { setState: setSearchQuery },
  });

  // Update URL when search query changes
  const handleSearchQueryChange = (value: string) => {
    const handler = createUrlParamHandler(
      searchParams,
      pathname,
      nextRouter,
      "search",
      setSearchQuery
    );
    handler(value);
  };

  const handleTrigger = () => setIsAI(true);
  const handleReset = () => {
    setIsAI(false);
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      // Convert search query to URL-friendly format
      const searchTerm = query.trim().toLowerCase().replace(/\s+/g, "-");
      router.push(`/categories/${searchTerm}`);
    }
  };

  const handleSuggestionClick = (label: string) => {
    setSearchQuery(label);
    handleSearch(label);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  // Close AI mode when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsAI(false);
      }
    };

    if (isAI) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAI]);

  return (
    <div
      ref={searchRef}
      className={cn(
        "relative flex items-center  border border-gray-300 rounded-lg h-10 flex-1 z-50",
        !isAI && "overflow-hidden"
      )}
    >
      <motion.section
        layout
        aria-label="Search"
        className={cn(
          "w-full bg-transparent rounded-lg rounded-b-none h-full relative"
        )}
        animate={{
          backgroundColor: isAI ? COLORS.slate900 : "#F2F4F7",
          boxShadow: isAI
            ? "0 0 0 1px rgba(45,212,191,0.35), 0 16px 60px rgba(139,92,246,0.25)"
            : "0 2px 10px rgba(0,0,0,0.06)",
        }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        <motion.div layout className="relative overflow-visible">
          <motion.div layout aria-live="polite">
            {/* Left: leading icon or dropdown + input label */}
            <motion.div layout className="flex items-center flex-1 h-full">
              {!isAI ? (
                <SimpleSearchInput
                  onTrigger={handleTrigger}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onSearchQueryChange={handleSearchQueryChange}
                />
              ) : (
                <AISearchInput
                  searchQuery={searchQuery}
                  onSearchQueryChange={handleSearchQueryChange}
                  onKeyDown={handleKeyDown}
                  onReset={handleReset}
                />
              )}
            </motion.div>

            <AISuggestions
              isAI={isAI}
              onSuggestionClick={handleSuggestionClick}
            />

            {isAI && (
              <BorderBeam
                colorTo="#36E8B8"
                colorFrom="#8B31E1"
                borderWidth={2}
                duration={5}
                size={100}
              />
            )}
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
