import { axiosInstance } from '@/services/axios-api-client';
import { adQueries } from './index';
import {
  PostAdPayload,
  PostAdResponse,
  GetAdsByIdResponse,
  GetLiveAdsResponse,
  GetAdSearchResponseType,
  UploadAdImagesResponse,
  AdStatus,
} from '@/interfaces/ad';

// Get all ads with optional filters
export const getAds = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: 'live' | 'rejected' | 'pending';
  featured?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<GetLiveAdsResponse> => {
  const response = await axiosInstance.get<GetLiveAdsResponse>(
    adQueries.ads.endpoint,
    { params },
  );
  return response.data;
};

// Get ad by ID
export const getAdById = async (
  id: string,
): Promise<GetAdsByIdResponse> => {
  const response = await axiosInstance.get<GetAdsByIdResponse>(
    adQueries.adById(id).endpoint,
  );
  return response.data;
};

// Create new ad
export const createAd = async (
  payload: PostAdPayload,
): Promise<PostAdResponse> => {
  const response = await axiosInstance.post<PostAdResponse>(
    adQueries.createAd.endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// Update ad
export const updateAd = async (
  id: string,
  payload: Partial<PostAdPayload>,
): Promise<PostAdResponse> => {
  const response = await axiosInstance.put<PostAdResponse>(
    adQueries.updateAd(id).endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// Delete ad
export const deleteAd = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await axiosInstance.delete(
    adQueries.deleteAd(id).endpoint,
  );
  return response.data;
};

// Update ad status
export const updateAdStatus = async (
  id: string,
  status: AdStatus,
  reason?: string,
): Promise<PostAdResponse> => {
  const response = await axiosInstance.patch<PostAdResponse>(
    adQueries.updateAdStatus(id).endpoint,
    { status, reason },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// Get ads by user
export const getAdsByUser = async (
  userId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: 'live' | 'rejected' | 'pending';
  },
): Promise<GetLiveAdsResponse> => {
  const response = await axiosInstance.get<GetLiveAdsResponse>(
    adQueries.adsByUser(userId).endpoint,
    { params },
  );
  return response.data;
};

// Get ads by category
export const getAdsByCategory = async (
  categoryId: string,
  params?: {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  },
): Promise<GetLiveAdsResponse> => {
  const response = await axiosInstance.get<GetLiveAdsResponse>(
    adQueries.adsByCategory(categoryId).endpoint,
    { params },
  );
  return response.data;
};

// Search ads
export const searchAds = async (params: {
  query: string;
  page?: number;
  limit?: number;
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<GetAdSearchResponseType> => {
  const response = await axiosInstance.get<GetAdSearchResponseType>(
    adQueries.searchAds.endpoint,
    { params },
  );
  return response.data;
};

// Get live ads
export const getLiveAds = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<GetLiveAdsResponse> => {
  const response = await axiosInstance.get<GetLiveAdsResponse>(
    adQueries.liveAds.endpoint,
    { params },
  );
  return response.data;
};

// Get featured ads
export const getFeaturedAds = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<GetLiveAdsResponse> => {
  const response = await axiosInstance.get<GetLiveAdsResponse>(
    adQueries.featuredAds.endpoint,
    { params },
  );
  return response.data;
};

// Get my ads (current user's ads)
export const getMyAds = async (params?: {
  page?: number;
  limit?: number;
  status?: 'live' | 'rejected' | 'pending';
}): Promise<GetLiveAdsResponse> => {
  const response = await axiosInstance.get<GetLiveAdsResponse>(
    adQueries.myAds.endpoint,
    { params },
  );
  return response.data;
};

// Upload ad images
export const uploadAdImages = async (
  files: File[],
): Promise<UploadAdImagesResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axiosInstance.post<UploadAdImagesResponse>(
    adQueries.uploadAdImages.endpoint,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

