/**
 * Search History Types
 */

export interface SearchHistoryItem {
  _id: string;
  userId: string;
  searchTerm: string;
  categoryId?: string;
  categoryName?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateSearchHistoryPayload {
  userId: string;
  searchTerm: string;
  categoryId?: string;
  categoryName?: string;
  timestamp?: string;
}

export interface SearchHistoryResponse {
  success: boolean;
  data: SearchHistoryItem;
  message?: string;
}

export interface SearchHistoryListResponse {
  statusCode: number;
  timestamp: string;
  data: {
    items: SearchHistoryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
