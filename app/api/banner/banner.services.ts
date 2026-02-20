import { axiosInstance } from '@/services/axios-api-client';
import { bannerQueries } from './index';
import {
  BannerApiResponse,
  BannersListApiResponse,
  CreateBannerPayload,
  UpdateBannerPayload,
} from '@/interfaces/banner.types';

// Get all banners with optional filters
export const getBanners = async (params?: {
  page?: number;
  limit?: number;
  position?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  slug?: string;
}): Promise<BannersListApiResponse> => {
  const response = await axiosInstance.get<BannersListApiResponse>(
    bannerQueries.banners.endpoint,
    { params },
  );
  return response.data;
};

// Get banner by ID
export const getBannerById = async (
  id: string,
): Promise<BannerApiResponse> => {
  const response = await axiosInstance.get<BannerApiResponse>(
    bannerQueries.bannerById(id).endpoint,
  );
  return response.data;
};

// Create new banner
export const createBanner = async (
  payload: CreateBannerPayload,
): Promise<BannerApiResponse> => {
  const response = await axiosInstance.post<BannerApiResponse>(
    bannerQueries.createBanner.endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// Update banner
export const updateBanner = async (
  id: string,
  payload: UpdateBannerPayload,
): Promise<BannerApiResponse> => {
  const response = await axiosInstance.put<BannerApiResponse>(
    bannerQueries.updateBanner(id).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// Delete banner
export const deleteBanner = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(
    bannerQueries.deleteBanner(id).endpoint,
  );
  return response.data;
};

