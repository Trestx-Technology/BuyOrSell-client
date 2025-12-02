// Collections Types - User-created collections for organizing favorites/items

// ============================================================================
// COLLECTION DATA TYPES
// ============================================================================

export interface Collection {
  _id: string;
  name: string;
  description?: string;
  userId?: string;
  count?: number;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface SingleCollectionResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Collection;
}

export interface CollectionsListResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: Collection[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DeleteCollectionResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
}

// ============================================================================
// API PAYLOAD TYPES
// ============================================================================

export interface CreateCollectionPayload {
  name: string;
  description?: string;
}

export interface UpdateCollectionPayload extends Partial<CreateCollectionPayload> {
  _id?: string;
}

export interface MyCollectionsParams {
  page?: number;
  limit?: number;
}

