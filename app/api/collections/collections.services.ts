import { axiosInstance } from '@/services/axios-api-client';
import { collectionsQueries } from './index';
import type {
  SingleCollectionResponse,
  CollectionsListResponse,
  DeleteCollectionResponse,
  CreateCollectionPayload,
  UpdateCollectionPayload,
  MyCollectionsParams,
} from '@/interfaces/collections.types';

// ============================================================================
// COLLECTION CRUD OPERATIONS
// ============================================================================

export const createCollection = async (
  payload: CreateCollectionPayload,
): Promise<SingleCollectionResponse> => {
  const response = await axiosInstance.post<SingleCollectionResponse>(
    collectionsQueries.createCollection.endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const getMyCollections = async (
  params?: MyCollectionsParams,
): Promise<CollectionsListResponse> => {
  const response = await axiosInstance.get<CollectionsListResponse>(
    collectionsQueries.getMyCollections.endpoint,
    { params },
  );
  return response.data;
};

export const getCollectionById = async (
  id: string,
): Promise<SingleCollectionResponse> => {
  const response = await axiosInstance.get<SingleCollectionResponse>(
    collectionsQueries.getCollectionById(id).endpoint,
  );
  return response.data;
};

export const updateCollection = async (
  id: string,
  payload: UpdateCollectionPayload,
): Promise<SingleCollectionResponse> => {
  const response = await axiosInstance.patch<SingleCollectionResponse>(
    collectionsQueries.updateCollection(id).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const deleteCollection = async (
  id: string,
): Promise<DeleteCollectionResponse> => {
  const response = await axiosInstance.delete<DeleteCollectionResponse>(
    collectionsQueries.deleteCollection(id).endpoint,
  );
  return response.data;
};

