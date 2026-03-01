import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  getAdReviews,
  getOrganizationReviews,
  getReviews,
  getAverageRating,
} from "@/app/api/review/review.services";
import {
  createAdReview,
  createOrganizationReview,
} from "@/app/api/review/create-review.services";
import {
  ReviewsResponse,
  CreateReviewResponse,
  AverageRatingResponse,
} from "@/interfaces/review.types";
import { reviewQueries } from "@/app/api/review/index";

// Get reviews for an ad
export const useAdReviews = (
  adId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: "latest" | "oldest" | "highest" | "lowest";
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
    sortBy?: "latest" | "oldest" | "highest" | "lowest";
  },
) => {
  return useQuery<ReviewsResponse, Error>({
    queryKey: [
      ...reviewQueries.organizationReviews(organizationId).Key,
      params,
    ],
    queryFn: () => getOrganizationReviews(organizationId, params),
    enabled: !!organizationId,
  });
};

// Get infinite reviews for a user
export const useInfiniteUserReviews = (
  userId: string,
  params?: {
    limit?: number;
    sortBy?: "latest" | "oldest" | "highest" | "lowest";
  },
  enabled: boolean = true,
) => {
  return useInfiniteQuery<ReviewsResponse, Error>({
    queryKey: [
      ...reviewQueries.getReviews("User", userId).Key,
      "infinite",
      params,
    ],
    queryFn: ({ pageParam = 1 }) =>
      getReviews("User", userId, { ...params, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      if (Array.isArray(lastPage)) return undefined;

      const { page, total, limit, data } = lastPage as any;
      if (
        typeof page === "number" &&
        typeof total === "number" &&
        typeof limit === "number"
      ) {
        if (page * limit < total) {
          return page + 1;
        }
      } else if (data && typeof limit === "number" && data.length === limit) {
        return (page || 1) + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: enabled && !!userId,
  });
};

// Get reviews for a user
export const useUserReviews = (
  userId: string,
  params?: {
    page?: number;
    limit?: number;
    sortBy?: "latest" | "oldest" | "highest" | "lowest";
  },
  enabled: boolean = true,
) => {
  return useQuery<ReviewsResponse, Error>({
    queryKey: [...reviewQueries.getReviews("User", userId).Key, params],
    queryFn: () => getReviews("User", userId, params),
    enabled: enabled && !!userId,
  });
};

// Get average rating for a user
export const useUserAverageRating = (
  userId: string,
  enabled: boolean = true,
) => {
  return useQuery<AverageRatingResponse, Error>({
    queryKey: [...reviewQueries.getAverageRating("User", userId).Key],
    queryFn: () => getAverageRating("User", userId),
    enabled: enabled && !!userId,
  });
};

// Create a review for an ad
export const useCreateAdReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateReviewResponse,
    Error,
    {
      adId: string;
      rating: number;
      review: string;
      reviewerId: string;
      language?: string;
      tag?: string;
    }
  >({
    mutationFn: ({ adId, rating, review, reviewerId, language, tag }) =>
      createAdReview(adId, { rating, review, reviewerId, language, tag }),
    onSuccess: (_, variables) => {
      // Invalidate and refetch reviews for this ad
      queryClient.invalidateQueries({
        queryKey: reviewQueries.adReviews(variables.adId).Key,
      });
      // Invalidate average rating
      queryClient.invalidateQueries({
        queryKey: reviewQueries.adAverageRating(variables.adId).Key,
      });
    },
  });
};

// Create a review for an organization
export const useCreateOrganizationReview = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateReviewResponse,
    Error,
    {
      organizationId: string;
      rating: number;
      review: string;
      reviewerId: string;
      language?: string;
      tag?: string;
    }
  >({
    mutationFn: ({
      organizationId,
      rating,
      review,
      reviewerId,
      language,
      tag,
    }) =>
      createOrganizationReview(organizationId, {
        rating,
        review,
        reviewerId,
        language,
        tag,
      }),
    onSuccess: (_, variables) => {
      // Invalidate and refetch reviews for this organization
      queryClient.invalidateQueries({
        queryKey: reviewQueries.organizationReviews(variables.organizationId)
          .Key,
      });
      // Invalidate average rating
      queryClient.invalidateQueries({
        queryKey: reviewQueries.organizationAverageRating(
          variables.organizationId,
        ).Key,
      });
    },
  });
};
