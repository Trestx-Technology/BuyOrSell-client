import { LocationApiResponse } from "@/interfaces/location.types";
import { locationQueries } from "@/api-queries/location.query";
import { axiosInstance } from "@/services/axios-api-client";

export const getEmirates = async (): Promise<LocationApiResponse> => {
  const response = await axiosInstance.get(locationQueries.emirates.endpoint);
  return response.data;
};
