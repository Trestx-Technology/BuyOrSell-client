import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAds,
  getAdById,
  createAd,
  updateAd,
  deleteAd,
  updateAdStatus,
  getAdsByUser,
  getAdsByCategory,
  searchAds,
  getFeaturedAds,
  getMyAds,
  uploadAdImages,
  filterAds,
} from '@/app/api/ad/ad.services';
import {
  PostAdPayload,
  PostAdResponse,
  GetAdsByIdResponse,
  GetLiveAdsResponse,
  GetAdSearchResponseType,
  UploadAdImagesResponse,
  AdStatus,
  AdFilters,
  AdFilterPayload,
} from '@/interfaces/ad';
import { adQueries } from '@/app/api/ad/index';

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get all ads with optional filters
export const useAds = (params?: AdFilters) => {
  return useQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.ads.Key, params],
    queryFn: () => getAds(params),
  });
};

// Get ad by ID
export const useAdById = (id: string) => {
  return useQuery<GetAdsByIdResponse, Error>({
    queryKey: [...adQueries.adById(id).Key],
    queryFn: () => getAdById(id),
    enabled: !!id,
  });
};

// Get ads by user
export const useAdsByUser = (
  userId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: "live" | "rejected" | "pending";
  }
) => {
  return useQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.adsByUser(userId).Key, params],
    queryFn: () => getAdsByUser(userId, params),
    enabled: !!userId,
  });
};

// Get ads by category
export const useAdsByCategory = (
  categoryId: string,
  params?: {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
) => {
  return useQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.adsByCategory(categoryId).Key, params],
    queryFn: () => getAdsByCategory(categoryId, params),
    enabled: !!categoryId,
  });
};

// Search ads
export const useSearchAds = (params: {
  query: string;
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  return useQuery<GetAdSearchResponseType, Error>({
    queryKey: [...adQueries.searchAds.Key, params],
    queryFn: () => searchAds(params),
    enabled: !!params.query && params.query.trim() !== '',
  });
};


// Get featured ads
export const useFeaturedAds = (params?: {
  page?: number;
  limit?: number;
  category?: string;
}) => {
  return useQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.featuredAds.Key, params],
    queryFn: () => getFeaturedAds(params),
  });
};

// Get my ads (current user's ads)
export const useMyAds = (params?: {
  page?: number;
  limit?: number;
  status?: "live" | "rejected" | "pending";
}) => {
  return useQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.myAds.Key, params],
    queryFn: () => getMyAds(params),
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

// Create new ad
export const useCreateAd = () => {
  const queryClient = useQueryClient();

  return useMutation<PostAdResponse, Error, PostAdPayload>({
    mutationFn: createAd,
    onSuccess: () => {
      // Invalidate and refetch ads
      queryClient.invalidateQueries({ queryKey: adQueries.ads.Key });
      queryClient.invalidateQueries({ queryKey: adQueries.myAds.Key });
      queryClient.invalidateQueries({ queryKey: adQueries.liveAds.Key });
    },
  });
};

// Update ad
export const useUpdateAd = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PostAdResponse,
    Error,
    { id: string; payload: Partial<PostAdPayload> }
  >({
    mutationFn: ({ id, payload }) => updateAd(id, payload),
    onSuccess: (_, variables) => {
      // Invalidate and refetch ads
      queryClient.invalidateQueries({ queryKey: adQueries.ads.Key });
      queryClient.invalidateQueries({
        queryKey: [...adQueries.adById(variables.id).Key],
      });
      queryClient.invalidateQueries({ queryKey: adQueries.myAds.Key });
      queryClient.invalidateQueries({ queryKey: adQueries.liveAds.Key });
    },
  });
};

// Delete ad
export const useDeleteAd = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteAd,
    onSuccess: () => {
      // Invalidate and refetch ads
      queryClient.invalidateQueries({ queryKey: adQueries.ads.Key });
      queryClient.invalidateQueries({ queryKey: adQueries.myAds.Key });
      queryClient.invalidateQueries({ queryKey: adQueries.liveAds.Key });
    },
  });
};

// Update ad status
export const useUpdateAdStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PostAdResponse,
    Error,
    { id: string; status: AdStatus; reason?: string }
  >({
    mutationFn: ({ id, status, reason }) => updateAdStatus(id, status, reason),
    onSuccess: (_, variables) => {
      // Invalidate and refetch ads
      queryClient.invalidateQueries({ queryKey: adQueries.ads.Key });
      queryClient.invalidateQueries({
        queryKey: [...adQueries.adById(variables.id).Key],
      });
      queryClient.invalidateQueries({ queryKey: adQueries.myAds.Key });
      queryClient.invalidateQueries({ queryKey: adQueries.liveAds.Key });
    },
  });
};

// Upload ad images
export const useUploadAdImages = () => {
  return useMutation<UploadAdImagesResponse, Error, File[]>({
    mutationFn: uploadAdImages,
  });
};

// Filter ads with advanced filters
export const useFilterAds = (payload: AdFilterPayload, enabled: boolean = true) => {
  return useQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.filterAds.Key, payload],
    queryFn: () => filterAds(payload),
    enabled: enabled && Object.keys(payload).length > 0, // Only run if enabled and payload has at least one filter
  });
};

