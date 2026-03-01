// Review Types

export interface Review {
  _id: string;
  rating: number;
  review: string;
  reviewerId: string;
  reviewObject: ReviewObject;
  reviewObjectId: string;
  language?: string;
  tag?: string;
  reviewerName?: string;
  reviewerEmail?: string;
  reviewerPhoneNumber?: string;
  reviewerImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Structured response format (for ads/organizations)
export interface ReviewsResponseObject {
  statusCode?: number;
  timestamp?: string;
  data?: Review[];
  total?: number;
  page?: number;
  limit?: number;
}

// Union type: API can return array directly OR structured object
export type ReviewsResponse = ReviewsResponseObject;

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
