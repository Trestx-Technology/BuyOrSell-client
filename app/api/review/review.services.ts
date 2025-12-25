import { axiosInstance } from '@/services/axios-api-client';
import { reviewQueries } from './index';
import {
  ReviewsResponse,
  AverageRatingResponse,
} from '@/interfaces/review.types';

// Generic function to get reviews for any review object
export const getReviews = async (
  reviewObject: "User" | "Ads" | "Company" | "Organization",
  reviewObjectId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: 'latest' | 'oldest' | 'highest' | 'lowest';
  },
): Promise<ReviewsResponse> => {
  const response = await axiosInstance.get<ReviewsResponse>(
    reviewQueries.getReviews(reviewObject, reviewObjectId).endpoint,
    { params },
  );
  return response.data;
};

// Generic function to get average rating for any review object
export const getAverageRating = async (
  reviewObject: "User" | "Ads" | "Company" | "Organization",
  reviewObjectId: string,
): Promise<AverageRatingResponse> => {
  const response = await axiosInstance.get<AverageRatingResponse>(
    reviewQueries.getAverageRating(reviewObject, reviewObjectId).endpoint,
  );
  return response.data;
};

// Helper functions for backward compatibility
// Get reviews for an ad
export const getAdReviews = async (
  adId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: 'latest' | 'oldest' | 'highest' | 'lowest';
  },
): Promise<ReviewsResponse> => {
  return getReviews("Ads", adId, params);
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
  return getReviews("Organization", organizationId, params);
};

// Get average rating for an ad
export const getAdAverageRating = async (
  adId: string,
): Promise<AverageRatingResponse> => {
  return getAverageRating("Ads", adId);
};

// Get average rating for an organization
export const getOrganizationAverageRating = async (
  organizationId: string,
): Promise<AverageRatingResponse> => {
  return getAverageRating("Organization", organizationId);
};


