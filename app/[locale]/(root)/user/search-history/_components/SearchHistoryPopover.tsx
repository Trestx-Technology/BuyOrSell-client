"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Clock, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

  const { data: searchHistory } = useQuery({
    queryKey: searchHistoryQueries.getSearchHistory({ limit: 5 }).Key,
    queryFn: () => getSearchHistory({ limit: 5 }),
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={`min-w-6 min-[1080px]:block hidden p-1 rounded transition-colors cursor-pointer ${className}`}
        >
          <Image
            src={
              "https://dev-buyorsell.s3.me-central-1.amazonaws.com/icons/mystery.svg"
            }
            alt="search history"
            className="size-6 hover:scale-110 transition-all duration-300"
            width={24}
            height={24}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              {t.searchHistory.mySearches}
            </h3>
            <button
              onClick={handleClearAll}
              disabled={deleteAllMutation.isPending}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleteAllMutation.isPending
                ? t.searchHistory.clearing
                : t.searchHistory.clearAll}
            </button>
          </div>

          {/* Search Items */}
          <div className="space-y-3">
            {searchHistory?.data && searchHistory.data.length > 0 ? (
              searchHistory.data.map((item) => (
                <div
                  className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                  key={item._id}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.searchTerm}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteSearch(item._id)}
                    className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                  >
                    <X className="size-4 text-gray-400" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500">
                  {t.searchHistory.noRecentSearches}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Link
              href={localePath("/user/search-history")}
              className="text-xs text-purple-600 hover:text-purple-700 font-medium mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View All
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchHistoryPopover;
