import { axiosInstance } from '@/services/axios-api-client';
import { bannerQueries } from './index';
import {
  BannerApiResponse,
  BannersApiResponse,
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
  sortOrder?: 'asc' | 'desc';
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

// Get active banners
export const getActiveBanners = async (params?: {
  position?: string;
  limit?: number;
}): Promise<BannersApiResponse> => {
  const response = await axiosInstance.get<BannersApiResponse>(
    bannerQueries.activeBanners.endpoint,
    { params },
  );
  return response.data;
};

// Get banners by position
export const getBannersByPosition = async (
  position: string,
  params?: {
    limit?: number;
    isActive?: boolean;
  },
): Promise<BannersApiResponse> => {
  const response = await axiosInstance.get<BannersApiResponse>(
    bannerQueries.bannersByPosition(position).endpoint,
    { params },
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

// Update banner status
export const updateBannerStatus = async (
  id: string,
  isActive: boolean,
): Promise<BannerApiResponse> => {
  const response = await axiosInstance.patch<BannerApiResponse>(
    bannerQueries.updateBannerStatus(id).endpoint,
    { isActive },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

