"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { Search } from "lucide-react";
import { ResponsiveModal, ResponsiveModalContent } from "@/components/ui/responsive-modal";
import { useAdsByKeyword } from "@/hooks/useAds";
import { useAuthStore } from "@/stores/authStore";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { slugify } from "@/utils/slug-utils";
import { cn } from "@/lib/utils";

interface SearchResult {
  adCount: number;
  name: string;
  category: string;
  relatedCategories: string[];
}

export function SearchAdsDialog() {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const session = useAuthStore((state) => state.session);
  const userId = session?.user?._id;

  const [debouncedQuery, setDebouncedQuery] = useState("");
  
  const [localSearchQuery, setLocalSearchQuery] = useDebouncedValue(
    "",
    (value) => {
      setDebouncedQuery(value);
    },
    500
  );

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { data: keywordData, isLoading } = useAdsByKeyword(
    debouncedQuery.trim(),
    userId ? { userId } : undefined
  );

  const keywordResults = (keywordData?.data || []) as SearchResult[];

  useEffect(() => {
    setSelectedIndex(0);
    itemRefs.current = [];
  }, [debouncedQuery, open, keywordResults.length]);

  useEffect(() => {
    if (open && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [selectedIndex, open]);

  const handleSearch = (relatedCategories: string[]) => {
    if (relatedCategories.length > 0) {
      if (relatedCategories[0] === "Jobs") {
        router.push(`/jobs/listing/${relatedCategories.map((category) => slugify(category)).join("/")}`);
      } else {
        router.push(`/categories/${relatedCategories.map((category) => slugify(category)).join("/")}`);
      }
      setOpen(false);
      setLocalSearchQuery("");
      setDebouncedQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (keywordResults.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (keywordResults.length || 1)) % (keywordResults.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = keywordResults[selectedIndex];
      if (selected) {
        handleSearch(selected.relatedCategories);
      }
    }
  };

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalContent showCloseButton={false} className="p-0 overflow-hidden border-none shadow-2xl max-w-lg bg-white dark:bg-gray-950">
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            placeholder="Search ads by keyword..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-[10px] text-gray-400 flex items-center gap-1">
            <kbd className="font-sans">ESC</kbd>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="max-h-[350px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800"
        >
          {localSearchQuery.trim() === "" ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Type to search for ads...</p>
            </div>
          ) : isLoading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          ) : keywordResults.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">No results found for "{debouncedQuery}"</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {keywordResults.map((result, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <li key={index}>
                    <button
                      ref={(el) => {
                        itemRefs.current[index] = el;
                      }}
                      onClick={() => handleSearch(result.relatedCategories)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left outline-none",
                        isSelected
                          ? "bg-purple/10 text-purple"
                          : "text-gray-700 dark:text-gray-300 hover:bg-purple/5 hover:text-purple"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium truncate", isSelected ? "text-purple" : "text-gray-900 dark:text-white")}>
                          {result.name}
                        </p>
                        <p className={cn("text-xs mt-1", isSelected ? "text-purple/70" : "text-gray-500")}>
                          {result.category}
                        </p>
                      </div>
                      <span className={cn(
                        "flex-shrink-0 text-xs font-semibold px-2 py-1 rounded",
                        isSelected ? "text-purple bg-purple/20" : "text-purple bg-gray-100 dark:bg-gray-800"
                      )}>
                        {result.adCount} {result.adCount === 1 ? "ad" : "ads"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[10px] text-gray-400">
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">↵</kbd>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">↑↓</kbd>
              <span>to navigate</span>
            </div>
          </div>
          <div className="text-[10px] font-medium text-purple/60">
            Search Ads
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
