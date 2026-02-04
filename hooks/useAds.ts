import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
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
  searchAdsAI,
  getFeaturedAds,
  getMyAds,
  uploadAdImages,
  filterAds,
  getSimilarAds,
  getAdsByKeyword,
  renewAd,
} from "@/app/api/ad/ad.services";
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
  GetKeywordSearchResponse,
} from "@/interfaces/ad";
import { adQueries } from "@/app/api/ad/index";

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get all ads with optional filters
export const useAds = (params?: AdFilters, options?: { enabled?: boolean }) => {
  return useQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.ads.Key, params],
    queryFn: () => getAds(params),
    ...options,
  });
};

// Infinite scroll ads
export const useInfiniteAds = (
  params?: AdFilters,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.ads.Key, "infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      getAds({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data?.page || lastPage.page || 1;
      const totalPages = Math.ceil(
        (lastPage.data?.total || lastPage.total || 0) /
          (lastPage.data?.limit || lastPage.limit || 10),
      );
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    ...options,
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
  },
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
  },
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
    enabled: !!params.query && params.query.trim() !== "",
  });
};

// Search ads using AI
export const useSearchAdsAI = () => {
  return useMutation<
    any, // Response type - likely { filters: AdFilters, ads: ... }
    Error,
    { query: string; userId?: string }
  >({
    mutationFn: ({ query, userId }) => searchAdsAI(query, userId),
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
export const useMyAds = (params?: AdFilters) => {
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

// Renew ad
export const useRenewAd = () => {
  const queryClient = useQueryClient();

  return useMutation<PostAdResponse, Error, { id: string; days: number }>({
    mutationFn: ({ id, days }) => renewAd(id, days),
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
export const useFilterAds = (
  payload: AdFilterPayload,
  page?: number,
  limit?: number,
  enabled: boolean = true,
) => {
  return useQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.filterAds.Key, payload, page, limit],
    queryFn: () => filterAds(payload, page, limit),
    enabled: enabled && Object.keys(payload).length > 0, // Only run if enabled and payload has at least one filter
  });
};

// Get ads by keyword
export const useAdsByKeyword = (
  keyword: string,
  params?: {
    userId?: string;
  },
) => {
  return useQuery<GetKeywordSearchResponse, Error>({
    queryKey: [...adQueries.adsByKeyword(keyword, params).Key],
    queryFn: () => getAdsByKeyword(keyword, params),
    enabled: !!keyword && keyword.trim() !== "",
  });
};

// Get similar ads by ad ID
export const useSimilarAds = (
  id: string,
  params?: {
    viewerId?: string;
    page?: number;
    limit?: number;
  },
) => {
  return useQuery<GetLiveAdsResponse, Error>({
    queryKey: [...adQueries.similarAds(id).Key, params],
    queryFn: () => getSimilarAds(id, params),
    enabled: !!id,
  });
};
