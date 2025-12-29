"use client";

import * as React from "react";
import { Loader2, Package } from "lucide-react";
import { Typography } from "@/components/typography";
import { KeywordSearchResult } from "@/interfaces/ad";
import { cn } from "@/lib/utils";

interface KeywordDropdownProps {
  keywordResults: KeywordSearchResult[];
  isLoading: boolean;
  showNoResults: boolean;
  hasResults: boolean;
  error: Error | null;
  debouncedSearchQuery: string;
  selectedIndex: number;
  onKeywordClick: (keyword: string) => void;
  onMouseEnter: (index: number) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function KeywordDropdown({
  keywordResults,
  isLoading,
  showNoResults,
  hasResults,
  error,
  debouncedSearchQuery,
  selectedIndex,
  onKeywordClick,
  onMouseEnter,
  dropdownRef,
}: KeywordDropdownProps) {
  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] max-h-[400px] overflow-y-auto"
    >
      {isLoading ? (
        <div className="p-4 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-purple" />
          <Typography variant="body-small" className="text-gray-600">
            Searching...
          </Typography>
        </div>
      ) : showNoResults ? (
        <div className="p-4 text-center">
          <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <Typography variant="body-small" className="text-gray-500">
            No ads found for "{debouncedSearchQuery}"
          </Typography>
        </div>
      ) : error ? (
        <div className="p-4 text-center">
          <Typography variant="body-small" className="text-red-500">
            Error loading results. Please try again.
          </Typography>
        </div>
      ) : hasResults ? (
        <>
          {keywordResults.map(
            (result: KeywordSearchResult, index: number) => (
              <button
                key={`${result.name}-${index}`}
                type="button"
                onClick={() => onKeywordClick(result.name)}
                className={cn(
                  "w-full p-3 hover:bg-purple/5 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors text-left",
                  selectedIndex === index ? "bg-purple/10" : ""
                )}
                onMouseEnter={() => onMouseEnter(index)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Package className="w-4 h-4 text-purple flex-shrink-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography
                      variant="body-large"
                      className="font-semibold text-dark-blue line-clamp-1"
                    >
                      {result.name}
                    </Typography>
                    <div className="flex items-center gap-2 mt-1">
                      <Typography
                        variant="body-small"
                        className="text-gray-600 text-xs"
                      >
                        {result.category}
                      </Typography>
                      <span className="text-gray-400">•</span>
                      <Typography
                        variant="body-small"
                        className="text-purple text-xs font-medium"
                      >
                        {result.adCount} {result.adCount === 1 ? "ad" : "ads"}
                      </Typography>
                    </div>
                  </div>
                </div>
              </button>
            )
          )}
        </>
      ) : null}
    </div>
  );
}

