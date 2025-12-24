/**
 * Search History Types
 */

export interface SearchHistoryItem {
  _id: string;
  userId: string;
  searchTerm: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSearchHistoryPayload {
  userId: string;
  searchTerm: string;
  timestamp: string;
}

export interface SearchHistoryResponse {
  success: boolean;
  data: SearchHistoryItem;
  message?: string;
}

export interface SearchHistoryListResponse {
  success: boolean;
  data: SearchHistoryItem[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface DeleteSearchHistoryResponse {
  success: boolean;
  message: string;
}

export interface BulkDeleteSearchHistoryResponse {
  success: boolean;
  message: string;
  deletedCount: number;
}
