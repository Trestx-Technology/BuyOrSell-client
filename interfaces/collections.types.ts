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
  adIds?: string[]; // Array of ad IDs in this collection
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
  userId?: string;
  imageURL?: string;
}

export interface UpdateCollectionPayload extends Partial<CreateCollectionPayload> {
  _id?: string;
}

export interface MyCollectionsParams {
  page?: number;
  limit?: number;
}

// ============================================================================
// COLLECTION ADS TYPES
// ============================================================================

export interface AddAdsToCollectionPayload {
  adIds: string[]; // Array of ad IDs to add to the collection
}

export interface AddAdsResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: {
    added: number;
    failed?: number;
  };
}

export interface RemoveAdResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
}

// ============================================================================
// COLLECTIONS BY AD RESPONSE TYPES
// ============================================================================

export interface CollectionByAd {
  collectionId: string;
  collectionName: string;
  description?: string;
  adCount: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionsByAdResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data: {
    adId: string;
    isAddedInCollection: boolean;
    collections: CollectionByAd[];
  };
}

