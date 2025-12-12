import { axiosInstance } from '@/services/axios-api-client';
import { reviewQueries } from './index';
import { ReviewsResponse, AverageRatingResponse } from '@/interfaces/review.types';

// Get reviews for an ad
export const getAdReviews = async (
  adId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: 'latest' | 'oldest' | 'highest' | 'lowest';
  },
): Promise<ReviewsResponse> => {
  const response = await axiosInstance.get<ReviewsResponse>(
    reviewQueries.adReviews(adId).endpoint,
    { params },
  );
  return response.data;
};

// Get reviews for an organization
export const getOrganizationReviews = async (
  organizationId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: 'latest' | 'oldest' | 'highest' | 'lowest';
  },
): Promise<ReviewsResponse> => {
  const response = await axiosInstance.get<ReviewsResponse>(
    reviewQueries.organizationReviews(organizationId).endpoint,
    { params },
  );
  return response.data;
};

// Get average rating for an ad
export const getAdAverageRating = async (
  adId: string,
): Promise<AverageRatingResponse> => {
  const response = await axiosInstance.get<AverageRatingResponse>(
    reviewQueries.adAverageRating(adId).endpoint,
  );
  return response.data;
};

// Get average rating for an organization
export const getOrganizationAverageRating = async (
  organizationId: string,
): Promise<AverageRatingResponse> => {
  const response = await axiosInstance.get<AverageRatingResponse>(
    reviewQueries.organizationAverageRating(organizationId).endpoint,
  );
  return response.data;
};

