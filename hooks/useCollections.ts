import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCollection,
  getMyCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addAdsToCollection,
  removeAdFromCollection,
  getCollectionsByAd,
} from '@/app/api/collections/collections.services';
import {
  SingleCollectionResponse,
  CollectionsListResponse,
  DeleteCollectionResponse,
  CreateCollectionPayload,
  UpdateCollectionPayload,
  MyCollectionsParams,
  AddAdsToCollectionPayload,
  AddAdsResponse,
  RemoveAdResponse,
  CollectionsByAdResponse,
} from '@/interfaces/collections.types';
import { collectionsQueries } from '@/app/api/collections/index';

// ============================================================================
// COLLECTION QUERY HOOKS
// ============================================================================

export const useGetMyCollections = (params?: MyCollectionsParams) => {
  return useQuery<CollectionsListResponse, Error>({
    queryKey: [...collectionsQueries.getMyCollections.Key, params],
    queryFn: () => getMyCollections(params),
  });
};

export const useGetCollectionById = (id: string) => {
  return useQuery<SingleCollectionResponse, Error>({
    queryKey: collectionsQueries.getCollectionById(id).Key,
    queryFn: () => getCollectionById(id),
    enabled: !!id,
  });
};

// ============================================================================
// COLLECTION MUTATION HOOKS
// ============================================================================

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleCollectionResponse, Error, CreateCollectionPayload>({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getMyCollections.Key,
      });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleCollectionResponse,
    Error,
    { id: string; data: UpdateCollectionPayload }
  >({
    mutationFn: ({ id, data }) => updateCollection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getCollectionById(variables.id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getMyCollections.Key,
      });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteCollectionResponse, Error, string>({
    mutationFn: deleteCollection,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getCollectionById(id).Key,
      });
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getMyCollections.Key,
      });
    },
  });
};

// ============================================================================
// COLLECTION ADS HOOKS
// ============================================================================

export const useGetCollectionsByAd = (adId: string) => {
  return useQuery<CollectionsByAdResponse, Error>({
    queryKey: collectionsQueries.getCollectionsByAd(adId).Key,
    queryFn: () => getCollectionsByAd(adId),
    enabled: !!adId,
  });
};

export const useAddAdsToCollection = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AddAdsResponse,
    Error,
    { collectionId: string; payload: AddAdsToCollectionPayload }
  >({
    mutationFn: ({ collectionId, payload }) =>
      addAdsToCollection(collectionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getCollectionById(variables.collectionId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getMyCollections.Key,
      });
    },
  });
};

export const useRemoveAdFromCollection = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RemoveAdResponse,
    Error,
    { collectionId: string; adId: string }
  >({
    mutationFn: ({ collectionId, adId }) =>
      removeAdFromCollection(collectionId, adId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getCollectionById(variables.collectionId).Key,
      });
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getMyCollections.Key,
      });
    },
  });
};

