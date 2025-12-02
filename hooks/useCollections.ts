import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCollection,
  getMyCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} from '@/app/api/collections/collections.services';
import {
  SingleCollectionResponse,
  CollectionsListResponse,
  DeleteCollectionResponse,
  CreateCollectionPayload,
  UpdateCollectionPayload,
  MyCollectionsParams,
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

