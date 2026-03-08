"use client";

import React, { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import {
  useGetSearchHistory,
  useDeleteSearchHistory,
  useSaveSearchTerm,
} from "@/hooks/useSearchHistory";
import SearchHistoryPopover from "./_components/SearchHistoryPopover";
import { ErrorCard } from "@/components/ui/error-card";
import { Table } from "@/components/table/table";
import { useSearchHistoryColumns } from "./_components/column";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { useRouter } from "nextjs-toploader/app";
import { slugify } from "@/utils/slug-utils";
import { SearchHistoryItem } from "@/interfaces/search-history.types";

export default function SearchHistoryPage() {
  const { t } = useLocale();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const router = useRouter();
  const { saveSearchTerm } = useSaveSearchTerm();

  const {
    data: searchHistory,
    isLoading,
    error,
  } = useGetSearchHistory({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const deleteMutation = useDeleteSearchHistory();

  const handleDeleteSearch = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSelectSearch = (item: SearchHistoryItem) => {
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
      router.push(`/ad?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Get table columns
  const columns = useSearchHistoryColumns({
    onDeleteSearch: handleDeleteSearch,
    onSelectSearch: handleSelectSearch,
    isDeleting: deleteMutation.isPending,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
            <p className="text-gray-600">
              {t.searchHistory.loadingSearchHistory}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorCard
          variant="error"
          title={t.searchHistory.failedToLoad}
          description={t.searchHistory.failedToLoadDescription}
          className="max-w-md mx-auto"
        />
      </div>
    );
  }

  return (
    <Container1080>
      <MobileStickyHeader title={t.searchHistory.pageTitle} />
      <div className="px-4 py-8 space-y-6">
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {t.searchHistory.pageTitle}
          </h1>
          <p className="text-sm text-gray-600">
            {t.searchHistory.pageDescription}
          </p>
        </div>
        {/* Search History Table */}
        <Table
          data={searchHistory?.data || []}
          columns={columns}
          loading={isLoading}
          pagination={pagination}
          onPaginationChange={setPagination}
          showPagination={true}
          rowCount={searchHistory?.total || 0}
        />
      </div>
    </Container1080>
  );
}
