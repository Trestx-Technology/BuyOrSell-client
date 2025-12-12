import { useQuery } from "@tanstack/react-query";
import {
  getAdReviews,
  getOrganizationReviews,
} from '@/app/api/review/review.services';
import { ReviewsResponse } from '@/interfaces/review.types';
import { reviewQueries } from '@/app/api/review/index';

// Get reviews for an ad
export const useAdReviews = (
  adId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: 'latest' | 'oldest' | 'highest' | 'lowest';
  },
  enabled: boolean = true,
) => {
  return useQuery<ReviewsResponse, Error>({
    queryKey: [...reviewQueries.adReviews(adId).Key, params],
    queryFn: () => getAdReviews(adId, params),
    enabled: enabled && !!adId,
  });
};

// Get reviews for an organization
export const useOrganizationReviews = (
  organizationId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: 'latest' | 'oldest' | 'highest' | 'lowest';
  },
) => {
  return useQuery<ReviewsResponse, Error>({
    queryKey: [...reviewQueries.organizationReviews(organizationId).Key, params],
    queryFn: () => getOrganizationReviews(organizationId, params),
    enabled: !!organizationId,
  });
};

