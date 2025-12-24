"use client";

import React, { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import {
  useGetSearchHistory,
  useDeleteSearchHistory,
} from "@/hooks/useSearchHistory";
import SearchHistoryPopover from "./_components/SearchHistoryPopover";
import { ErrorCard } from "@/components/ui/error-card";
import { Table } from "@/components/table/table";
import { useSearchHistoryColumns } from "./_components/column";

export default function SearchHistoryPage() {
  const { t } = useLocale();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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

  // Get table columns
  const columns = useSearchHistoryColumns({
    onDeleteSearch: handleDeleteSearch,
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
    <div className="max-w-[1080px] mx-auto space-y-5 p-5">
      <div>
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
  );
}
