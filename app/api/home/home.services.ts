import { axiosInstance } from "@/services/axios-api-client";
import { homeQueries } from ".";
import { HomeApiResponse } from "@/interfaces/home.types";

export const getHomeData = async (): Promise<HomeApiResponse> => {
  const response = await axiosInstance.get<HomeApiResponse>(
    homeQueries.home.endpoint
  );
  return response.data;
};
