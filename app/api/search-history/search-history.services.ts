import { axiosInstance } from "@/services/axios-api-client";
import { searchHistoryQueries } from "./index";
import type {
  CreateSearchHistoryPayload,
  SearchHistoryResponse,
  SearchHistoryListResponse,
  DeleteSearchHistoryResponse,
  BulkDeleteSearchHistoryResponse,
} from "@/interfaces/search-history.types";

/**
 * Get search history for the current user
 */
export const getSearchHistory = async (params?: {
  page?: number;
  limit?: number;
}): Promise<SearchHistoryListResponse> => {
  const response = await axiosInstance.get<SearchHistoryListResponse>(
    searchHistoryQueries.getSearchHistory(params).endpoint,
    { params }
  );
  return response.data;
};

/**
 * Create a new search history entry
 */
export const createSearchHistory = async (
  data: CreateSearchHistoryPayload
): Promise<SearchHistoryResponse> => {
  const response = await axiosInstance.post<SearchHistoryResponse>(
    searchHistoryQueries.createSearchHistory.endpoint,
    data
  );
  return response.data;
};

/**
 * Delete a specific search history item by ID
 */
export const deleteSearchHistory = async (
  id: string
): Promise<DeleteSearchHistoryResponse> => {
  const response = await axiosInstance.delete<DeleteSearchHistoryResponse>(
    searchHistoryQueries.deleteSearchHistory(id).endpoint
  );
  return response.data;
};

/**
 * Delete all search history for a specific user
 */
export const deleteUserSearchHistory = async (
  userId: string
): Promise<BulkDeleteSearchHistoryResponse> => {
  const response = await axiosInstance.delete<BulkDeleteSearchHistoryResponse>(
    searchHistoryQueries.deleteUserSearchHistory(userId).endpoint
  );
  return response.data;
};
