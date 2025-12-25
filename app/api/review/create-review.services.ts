import { axiosInstance } from '@/services/axios-api-client';
import { reviewQueries } from './index';
import { CreateReviewPayload, CreateReviewResponse } from '@/interfaces/review.types';

// Create a review (POST /ratings)
export const createReview = async (
  payload: CreateReviewPayload,
): Promise<CreateReviewResponse> => {
  const response = await axiosInstance.post<CreateReviewResponse>(
    reviewQueries.createReview().endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

// Create a review for an ad
export const createAdReview = async (
  adId: string,
  payload: {
    rating: number;
    review: string;
    reviewerId: string;
    language?: string;
    tag?: string;
  },
): Promise<CreateReviewResponse> => {
  return createReview({
    reviewObject: "Ads",
    reviewObjectId: adId,
    rating: payload.rating,
    reviewerId: payload.reviewerId,
    review: payload.review,
    language: payload.language,
    tag: payload.tag,
  });
};

// Create a review for an organization
export const createOrganizationReview = async (
  organizationId: string,
  payload: {
    rating: number;
    review: string;
    reviewerId: string;
    language?: string;
    tag?: string;
  },
): Promise<CreateReviewResponse> => {
  return createReview({
    reviewObject: "Organization",
    reviewObjectId: organizationId,
    rating: payload.rating,
    reviewerId: payload.reviewerId,
    review: payload.review,
    language: payload.language,
    tag: payload.tag,
  });
};

