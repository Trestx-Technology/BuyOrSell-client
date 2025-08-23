import { LocationApiResponse } from "@/interfaces/location";
import { locationQueries } from "@/api-queries/location";
import { axiosInstance } from "@/services/axios-api-client";

export const getEmirates = async (): Promise<LocationApiResponse> => {
  const response = await axiosInstance.get(locationQueries.emirates.endpoint);
  return response.data;
};
