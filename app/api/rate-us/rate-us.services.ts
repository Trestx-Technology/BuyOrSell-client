import { axiosInstance } from "@/services/axios-api-client";
import { rateUsQueries } from "./index";

export interface RateUsPayload {
  rating: number; // 1-5
  title: string;
  comment: string;
}

export interface RateUsResponse {
  statusCode: number;
  timestamp: string;
  message?: string;
  data?: {
    _id?: string;
    rating: number;
    title: string;
    comment: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

// Submit rating
export const submitRating = async (
  data: RateUsPayload
): Promise<RateUsResponse> => {
  const response = await axiosInstance.post<RateUsResponse>(
    rateUsQueries.submitRating.endpoint,
    data
  );
  return response.data;
};

