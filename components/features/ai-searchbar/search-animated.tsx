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
import { AISearchResults } from "./ai-search-results";
import { searchWithAI } from "@/lib/ai/searchWithAI";
import { toast } from "sonner";
import { AD } from "@/interfaces/ad";
import { slugify } from "@/utils/slug-utils";
import { useAITokenBalance, useConsumeTokens } from "@/hooks/useAITokens";

export function SearchAnimated() {
  const [isAI, setIsAI] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [aiResults, setAiResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [extractedKeywords, setExtractedKeywords] = React.useState<string[]>([]);
  const [optimizedQuery, setOptimizedQuery] = React.useState("");
  const searchRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const nextRouter = useNextRouter();
  const [selectedCategory, setSelectedCategory] = React.useState("All Categories");

  const { data: tokenBalance } = useAITokenBalance();
  const { mutateAsync: consumeTokens } = useConsumeTokens();

  // Initialize category and search query from URL query parameters
  useQueryParams(searchParams, {
    category: { setState: setSelectedCategory },
    search: { setState: setSearchQuery },
  });

  // Update URL when search query changes
  const handleSearchQueryChange = (value: string) => {
    if (isAI) {
      setSearchQuery(value); // Only update local state for AI search
      if (aiResults.length > 0 && value !== searchQuery) {
        setAiResults([]); // Clear previous results when typing new query
        setExtractedKeywords([]); // Clear keywords
        setOptimizedQuery(""); // Clear optimized query
      }
    } else {
      const handler = createUrlParamHandler(
        searchParams,
        pathname,
        nextRouter,
        "search",
        setSearchQuery
      );
      handler(value);
    }
  };

  const handleTrigger = () => setIsAI(true);

  const handleReset = () => {
    setIsAI(false);
    setAiResults([]);
    setExtractedKeywords([]);
    setOptimizedQuery("");
  };


  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    if (isAI) {
      if (!tokenBalance || tokenBalance.balance <= 0) {
        toast.error("No AI tokens available. Please purchase more tokens.");
        setIsAI(false);
        return;
      }

      setIsSearching(true);
      try {
        // Call the AI search function
        const { keywords, searchQuery: optimized, results, success } = await searchWithAI(query.trim());

        if (success) {
          // Consume 1 token on success
          await consumeTokens({ tokens: 1, reason: "AI Integrated Search" });

          if (results && results.length > 0) {
            setAiResults(results);
            setExtractedKeywords(keywords);
            setOptimizedQuery(optimized);
            toast.success(`Found ${results.length} results using AI search`);
          } else {
            toast.info("No matching ads found with AI search.");
            setAiResults([]);
            setExtractedKeywords(keywords);
            setOptimizedQuery(optimized);
          }
        } else {
          // Fallback to regular search if AI search fails
          toast.error("AI Search failed. Falling back to regular search.");
          const searchTerm = query.trim().toLowerCase().replace(/\s+/g, "-");
          router.push(`/categories/${searchTerm}`);
        }
      } catch (error) {
        console.error("AI search error:", error);
        toast.error("AI Search failed. Please try again.");
        // Fallback to regular search
        const searchTerm = query.trim().toLowerCase().replace(/\s+/g, "-");
        router.push(`/categories/${searchTerm}`);
      } finally {
        setIsSearching(false);
      }
    } else {
      // Regular search
      const searchTerm = query.trim().toLowerCase().replace(/\s+/g, "-");
      router.push(`/categories/${searchTerm}`);
    }
  };

  const handleResultSelect = (ad: AD) => {
    console.log(ad);

    // Navigate to ad details or category
    if (ad._id) {
      router.push(`/ad/${ad._id}`); // Navigate to ad detail page
    } else {
      router.push(`/categories/${ad.relatedCategories.map((category) => slugify(category)).join("/")}`); // Navigate to category
    }

    setIsAI(false); // Close search
    setAiResults([]); // Clear results
    setExtractedKeywords([]); // Clear keywords
    setOptimizedQuery(""); // Clear optimized query
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
      // Don't close if currently searching (waiting for AI response)
      if (isSearching) return;

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        handleReset();
      }
    };

    if (isAI) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAI, isSearching]);

  return (
    <div
      ref={searchRef}
      className={cn(
        "relative flex items-center shadow rounded-lg flex flex-col flex-1 z-50 "
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
          backgroundColor: isAI ? COLORS.slate900 : "transparent",
          boxShadow: isAI
            ? "0 0 0 1px rgba(45,212,191,0.35), 0 16px 60px rgba(139,92,246,0.25)"
            : "0 2px 10px rgba(0,0,0,0.06)",
        }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
          <motion.div layout
            className="relative"
            aria-live="polite">
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
                      onSearch={() => handleSearch(searchQuery)}
                      isSearching={isSearching}
                />
              )}
            </motion.div>

              {isSearching ? (
                <div className="bg-dark-blue mt-3 flex flex-col items-center justify-center p-8 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mb-3"></div>
                  <span className="text-sm text-gray-300">Analyzer thinking...</span>
                </div>
              ) : aiResults.length > 0 ? (
                <AISearchResults
                  results={aiResults}
                  onSelect={handleResultSelect}
                // keywords={extractedKeywords}
                />
              ) : (
                    <AISuggestions
                      isAI={isAI}
                      onSuggestionClick={handleSuggestionClick}
                    />
              )}

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
      </motion.section>
    </div>
    </div>
  );
}
