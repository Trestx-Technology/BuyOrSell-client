import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBanners,
  getBannerById,
  getActiveBanners,
  getBannersByPosition,
  createBanner,
  updateBanner,
  deleteBanner,
  updateBannerStatus,
} from '@/app/api/banner/banner.services';
import {
  BannerApiResponse,
  BannersApiResponse,
  BannersListApiResponse,
  CreateBannerPayload,
  UpdateBannerPayload,
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

// Get active banners
export const useActiveBanners = (params?: {
  position?: string;
  limit?: number;
}) => {
  return useQuery<BannersApiResponse, Error>({
    queryKey: [...bannerQueries.activeBanners.Key, params],
    queryFn: () => getActiveBanners(params),
  });
};

// Get banners by position
export const useBannersByPosition = (
  position: string,
  params?: {
    limit?: number;
    isActive?: boolean;
  }
) => {
  return useQuery<BannersApiResponse, Error>({
    queryKey: [...bannerQueries.bannersByPosition(position).Key, params],
    queryFn: () => getBannersByPosition(position, params),
    enabled: !!position,
  });
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
      queryClient.invalidateQueries({ queryKey: bannerQueries.activeBanners.Key });
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
      queryClient.invalidateQueries({ queryKey: bannerQueries.activeBanners.Key });
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
      queryClient.invalidateQueries({ queryKey: bannerQueries.activeBanners.Key });
    },
  });
};

// Update banner status
export const useUpdateBannerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    BannerApiResponse,
    Error,
    { id: string; isActive: boolean }
  >({
    mutationFn: ({ id, isActive }) => updateBannerStatus(id, isActive),
    onSuccess: (_, variables) => {
      // Invalidate and refetch banners
      queryClient.invalidateQueries({ queryKey: bannerQueries.banners.Key });
      queryClient.invalidateQueries({
        queryKey: [...bannerQueries.bannerById(variables.id).Key],
      });
      queryClient.invalidateQueries({ queryKey: bannerQueries.activeBanners.Key });
    },
  });
};

