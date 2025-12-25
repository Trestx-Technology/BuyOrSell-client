// Review Types

export interface Review {
  _id: string;
  rating: number;
  review: string;
  reviewerId: string;
  reviewObject: ReviewObject;
  reviewObjectId: string;
  language?: string;
  reviewerName?: string;
  reviewerEmail?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  // Legacy fields for backward compatibility
  adId?: string;
  organizationId?: string;
  userId?: string;
  userName?: string;
  userImage?: string;
  comment?: string;
  fullComment?: string;
}

export interface ReviewsResponse {
  statusCode?: number;
  timestamp?: string;
  data?: {
    reviews?: Review[];
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    overallRating?: number;
    ratingCount?: number;
  };
  // Handle case where API returns array directly
  reviews?: Review[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  overallRating?: number;
  ratingCount?: number;
}

// Type guard to check if response is an array
export function isReviewArray(response: any): response is Review[] {
  return Array.isArray(response);
}

export interface ReviewSortOption {
  value: "latest" | "oldest" | "highest" | "lowest";
  label: string;
}

export interface AverageRatingResponse {
  statusCode: number;
  timestamp: string;
  data: number; // Average rating value
}

export type ReviewObject = "User" | "Ads" | "Company" | "Organization";

export interface CreateReviewPayload {
  rating: number;
  reviewerId: string;
  review: string;
  reviewObject: ReviewObject;
  reviewObjectId: string;
  language?: string;
  tag?: string;
}

export interface CreateReviewPayloadWithoutIds {
  rating: number;
  reviewerId: string;
  review: string;
  language?: string;
  tag?: string;
}

export interface CreateReviewResponse {
  message: string;
  data: Review;
}
