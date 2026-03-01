"use client";

import * as React from "react";
import { ResponsiveModal, ResponsiveModalContent } from "@/components/ui/responsive-modal";
import { useRouter } from "nextjs-toploader/app";
import { BorderBeam } from "@/components/magicui/border-beam";
import { COLORS } from "./constants";
import { AISearchInput } from "./ai-search-input";
import { AISuggestions } from "./ai-suggestions";
import { AISearchResults } from "./ai-search-results";
import { searchWithAI } from "@/lib/ai/searchWithAI";
import { toast } from "sonner";
import { AD } from "@/interfaces/ad";
import { slugify } from "@/utils/slug-utils";
import { useAITokenBalance, useConsumeTokens } from "@/hooks/useAITokens";
import { NoCreditsDialog } from "@/components/global/NoCreditsDialog";
import { cn } from "@/lib/utils";

interface AISearchAdsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AISearchAdsDialog({ open, onOpenChange }: AISearchAdsDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [aiResults, setAiResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isNoCreditsOpen, setIsNoCreditsOpen] = React.useState(false);
  const router = useRouter();

  const { data: tokenBalance } = useAITokenBalance();
  const { mutateAsync: consumeTokens } = useConsumeTokens();

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setAiResults([]);
      setIsSearching(false);
    }
  }, [open]);

  const handleSearchQueryChange = (value: string) => {
    setSearchQuery(value);
    if (aiResults.length > 0 && value !== searchQuery) {
      setAiResults([]);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    const currentBalance = tokenBalance?.data?.tokensRemaining ?? 0;
    if (currentBalance < 1) {
      setIsNoCreditsOpen(true);
      onOpenChange(false);
      return;
    }

    setIsSearching(true);
    try {
      const { results, success } = await searchWithAI(query.trim());

      if (success) {
        await consumeTokens({ tokens: 1, purpose: "ai_search" });

        if (results && results.length > 0) {
          setAiResults(results);
          toast.success(`Found ${results.length} results using AI search`);
          // Automatically redirect to the first result
          setTimeout(() => {
            handleResultSelect(results[0]);
          }, 500);
        } else {
          toast.info("No matching ads found with AI search.");
          setAiResults([]);
        }
      } else {
        toast.error("AI Search failed. Please try again.");
      }
    } catch (error) {
      console.error("AI search error:", error);
      toast.error("AI Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultSelect = (ad: AD) => {
    if (ad._id) {
      router.push(`/ad/${ad._id}`); 
    } else {
      router.push(`/categories/${ad.relatedCategories.map((category) => slugify(category)).join("/")}`); 
    }
    onOpenChange(false);
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

  return (
    <>
      <ResponsiveModal open={open} onOpenChange={onOpenChange}>
        <ResponsiveModalContent 
          showCloseButton={false}
          className={cn("p-0 overflow-hidden border-none shadow-[0_16px_60px_rgba(139,92,246,0.25)] max-w-2xl ring-1 ring-teal-400/30")} 
          style={{ backgroundColor: COLORS.slate900 }}
        >
          <div className="relative w-full h-full">
            <div className="relative" aria-live="polite">
              <div className="flex items-center flex-1 h-full">
                <AISearchInput
                  searchQuery={searchQuery}
                  onSearchQueryChange={handleSearchQueryChange}
                  onKeyDown={handleKeyDown}
                  onReset={() => onOpenChange(false)}
                  onSearch={() => handleSearch(searchQuery)}
                  isSearching={isSearching}
                />
              </div>

              {isSearching ? (
                <div className="mt-3 flex flex-col items-center justify-center p-8 rounded-lg rounded-t-none">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mb-3"></div>
                  <span className="text-sm text-gray-300">Analyzer thinking...</span>
                </div>
              ) : aiResults.length > 0 ? (
                <AISearchResults
                  results={aiResults}
                  onSelect={handleResultSelect}
                />
              ) : (
                <AISuggestions
                  isAI={true}
                  onSuggestionClick={handleSuggestionClick}
                />
              )}

              <BorderBeam
                colorTo="#36E8B8"
                colorFrom="#8B31E1"
                borderWidth={2}
                duration={5}
                size={100}
              />
            </div>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
      <NoCreditsDialog
        isOpen={isNoCreditsOpen}
        onClose={() => setIsNoCreditsOpen(false)}
        requiredCredits={1}
        currentBalance={tokenBalance?.data?.tokensRemaining ?? 0}
      />
    </>
  );
}
