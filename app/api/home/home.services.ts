import { axiosInstance } from "@/services/axios-api-client";
import { homeQueries } from ".";
import { HomeApiResponse } from "@/interfaces/home.types";

export const getHomeData = async (userId?: string): Promise<HomeApiResponse> => {
  const endpoint = userId 
    ? `${homeQueries.home.endpoint}?userId=${userId}`
    : homeQueries.home.endpoint;
  
  const response = await axiosInstance.get<HomeApiResponse>(endpoint);
  return response.data;
};