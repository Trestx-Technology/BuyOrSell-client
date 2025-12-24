import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSearchHistory,
  createSearchHistory,
  deleteSearchHistory,
  deleteUserSearchHistory,
} from "@/app/api/search-history/search-history.services";
import type {
  CreateSearchHistoryPayload,
  SearchHistoryResponse,
  SearchHistoryListResponse,
  DeleteSearchHistoryResponse,
  BulkDeleteSearchHistoryResponse,
} from "@/interfaces/search-history.types";
import { searchHistoryQueries } from "@/app/api/search-history/index";
import { useAuthStore } from "@/stores/authStore";

// ============================================================================
// SEARCH HISTORY QUERY HOOKS
// ============================================================================

/**
 * Get search history for the current user
 */
export const useGetSearchHistory = (
  params?: {
    page?: number;
    limit?: number;
  },
  options?: {
    enabled?: boolean;
  }
) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<SearchHistoryListResponse, Error>({
    queryKey: searchHistoryQueries.getSearchHistory(params).Key,
    queryFn: () => getSearchHistory(params),
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
};

// ============================================================================
// SEARCH HISTORY MUTATION HOOKS
// ============================================================================

/**
 * Create a new search history entry
 */
export const useCreateSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation<SearchHistoryResponse, Error, CreateSearchHistoryPayload>({
    mutationFn: createSearchHistory,
    onSuccess: () => {
      // Invalidate search history queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: searchHistoryQueries.getSearchHistory().Key,
      });
    },
  });
};

/**
 * Delete a specific search history item
 */
export const useDeleteSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteSearchHistoryResponse, Error, string>({
    mutationFn: deleteSearchHistory,
    onSuccess: () => {
      // Invalidate search history queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: searchHistoryQueries.getSearchHistory().Key,
      });
    },
  });
};

/**
 * Delete all search history for a specific user
 */
export const useDeleteUserSearchHistory = () => {
  const queryClient = useQueryClient();

  return useMutation<BulkDeleteSearchHistoryResponse, Error, string>({
    mutationFn: deleteUserSearchHistory,
    onSuccess: () => {
      // Invalidate search history queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: searchHistoryQueries.getSearchHistory().Key,
      });
    },
  });
};

// ============================================================================
// SEARCH HISTORY UTILITY HOOKS
// ============================================================================

/**
 * Hook to save a search term to history
 * Automatically creates the entry with current timestamp
 */
export const useSaveSearchTerm = () => {
  const createMutation = useCreateSearchHistory();
  const { session } = useAuthStore();

  const saveSearchTerm = (searchTerm: string) => {
    if (!session?.user?._id || !searchTerm.trim()) return;

    return createMutation.mutate({
      userId: session.user._id,
      searchTerm: searchTerm.trim(),
      timestamp: new Date().toISOString(),
    });
  };

  return {
    saveSearchTerm,
    ...createMutation,
  };
};
