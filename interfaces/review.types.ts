// Review Types

export interface Review {
  _id: string;
  adId?: string;
  organizationId?: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  fullComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  statusCode: number;
  timestamp: string;
  data: {
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
    overallRating?: number;
    ratingCount?: number;
  };
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

