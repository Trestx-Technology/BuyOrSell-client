import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} from '@/app/api/banner/banner.services';
import {
  BannerApiResponse,
  BannersListApiResponse,
  CreateBannerPayload,
  UpdateBannerPayload,
  Banner,
} from '@/interfaces/banner.types';
import { bannerQueries } from '@/app/api/banner/index';

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get all banners with optional filters
export const useBanners = (params?: {
  page?: number;
  limit?: number;
  position?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  slug?: string;
}) => {
  return useQuery<BannersListApiResponse, Error>({
    queryKey: [...bannerQueries.banners.Key, params],
    queryFn: () => getBanners(params),
  });
};

// Get banner by ID
export const useBannerById = (id: string) => {
  return useQuery<BannerApiResponse, Error>({
    queryKey: [...bannerQueries.bannerById(id).Key],
    queryFn: () => getBannerById(id),
    enabled: !!id,
  });
};

// Get banners by slug (server-side filtering)
export const useBannersBySlug = (
  slug: string,
  params?: {
    page?: number;
    limit?: number;
    position?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    slug?: string;
  },
) => {
  return useBanners({ ...params, slug });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

// Create new banner
export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<BannerApiResponse, Error, CreateBannerPayload>({
    mutationFn: createBanner,
    onSuccess: () => {
      // Invalidate and refetch banners
      queryClient.invalidateQueries({ queryKey: bannerQueries.banners.Key });
    },
  });
};

// Update banner
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BannerApiResponse,
    Error,
    { id: string; payload: UpdateBannerPayload }
  >({
    mutationFn: ({ id, payload }) => updateBanner(id, payload),
    onSuccess: (_, variables) => {
      // Invalidate and refetch banners
      queryClient.invalidateQueries({ queryKey: bannerQueries.banners.Key });
      queryClient.invalidateQueries({
        queryKey: [...bannerQueries.bannerById(variables.id).Key],
      });
    },
  });
};

// Delete banner
export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: deleteBanner,
    onSuccess: () => {
      // Invalidate and refetch banners
      queryClient.invalidateQueries({ queryKey: bannerQueries.banners.Key });
    },
  });
};

