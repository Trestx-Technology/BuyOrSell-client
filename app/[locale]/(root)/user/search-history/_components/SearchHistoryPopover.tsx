"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock, SearchIcon, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useDeleteSearchHistory,
  useDeleteUserSearchHistory,
} from "@/hooks/useSearchHistory";
import { useLocale } from "@/hooks/useLocale";
import { getSearchHistory } from "@/app/api/search-history/search-history.services";
import { searchHistoryQueries } from "@/app/api/search-history/index";
import { useAuthStore } from "@/stores/authStore";
import { formatDate } from "@/utils/format-date";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useSaveSearchTerm } from "@/hooks/useSearchHistory";
import { slugify } from "@/utils/slug-utils";
import { SearchHistoryItem } from "@/interfaces/search-history.types";

interface SearchHistoryPopoverProps {
  className?: string;
}

const SearchHistoryPopover: React.FC<SearchHistoryPopoverProps> = ({
  className = "",
}) => {
  // TODO: add Skeleton
  const { t, localePath } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const session = useAuthStore((state) => state.session);
  const router = useRouter();
  const { saveSearchTerm } = useSaveSearchTerm();

  const { data: searchHistory } = useQuery({
    queryKey: searchHistoryQueries.getSearchHistory({ limit: 5 }).Key,
    queryFn: () => getSearchHistory({ limit: 5, userId: session?.user?._id }),
    enabled: isAuthenticated && isOpen, // Only fetch when authenticated and popover is open
  });

  const deleteMutation = useDeleteSearchHistory();
  const deleteAllMutation = useDeleteUserSearchHistory();

  const handleDeleteSearch = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleClearAll = () => {
    if (session?.user?._id) {
      deleteAllMutation.mutate(session.user._id);
    }
  };

  const handleItemClick = (item: SearchHistoryItem) => {
    const { searchTerm, categoryId, categoryName } = item;

    // Log search history
    saveSearchTerm({
      searchTerm,
      categoryId,
      categoryName,
    });

    // Redirect to category search
    if (categoryName) {
      router.push(`/${slugify(categoryName)}`);
    } else {
      // Fallback if no category info (though user requested to log it, so it should exist)
      router.push(`/ad?query=${encodeURIComponent(searchTerm)}`);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`min-w-6 md:block hidden p-1 rounded transition-colors cursor-pointer ${className}`}
        >
          <SearchIcon className="text-purple" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-3 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        align="end"
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t.searchHistory.mySearches}
            </h3>
            {searchHistory?.data && searchHistory.data.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={deleteAllMutation.isPending}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteAllMutation.isPending
                  ? t.searchHistory.clearing
                  : t.searchHistory.clearAll}
              </button>
            )}
          </div>

          {/* Search Items */}
          <ScrollArea className="h-[250px] w-full pr-3">
            <div className="space-y-2">
              {searchHistory?.data && searchHistory.data.length > 0 ? (
                searchHistory.data.map((item) => (
                  <div
                    className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    key={item._id}
                  >
                    <div
                      className="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer"
                      onClick={() => handleItemClick(item)}
                    >
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.searchTerm}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteSearch(item._id)}
                      className="p-1 hover:bg-gray-300 dark:hover:bg-gray-600 rounded cursor-pointer shrink-0"
                    >
                      <X className="size-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.searchHistory.noRecentSearches}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {searchHistory?.total && searchHistory.total > 5 && (
            <div className="flex justify-center">
              <Link
                href={localePath("/user/search-history")}
                className="text-xs text-purple-600 hover:text-purple-700 font-medium mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View All
              </Link>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchHistoryPopover;
