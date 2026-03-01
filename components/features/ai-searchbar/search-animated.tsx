"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter as useNextRouter } from "next/navigation";
import { createUrlParamHandler } from "@/utils/url-params";
import { useQueryParams } from "@/hooks/useQueryParam";
import { cn } from "@/lib/utils";
import { SimpleSearchInput } from "./simple-search-input";
import { AISearchAdsDialog } from "./ai-search-ads-dialog";

export function SearchAnimated() {
  const [isAIOpen, setIsAIOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const nextRouter = useNextRouter();
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");

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

  const handleTrigger = () => setIsAIOpen(true);

  return (
    <div
      className={cn(
        "relative flex items-center shadow rounded-lg flex-col flex-1 z-50 "
      )}
    >
      <div className="h-fit absolute top-0 left-0 right-0">
        <motion.section
          layout
          aria-label="Search"
          className={cn(
            "w-full bg-transparent rounded-lg h-full relative"
          )}
          animate={{
            backgroundColor: "transparent",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
        >
          <motion.div layout
            className="relative flex items-center flex-1 h-full"
            aria-live="polite">
            <SimpleSearchInput
              onTrigger={handleTrigger}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onSearchQueryChange={handleSearchQueryChange}
            />
          </motion.div>
        </motion.section>
      </div>
      <AISearchAdsDialog open={isAIOpen} onOpenChange={setIsAIOpen} />
    </div>
  );
}

