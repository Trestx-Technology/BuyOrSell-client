import {
  LocationApiResponse,
  AreasApiResponse,
  CitiesApiResponse,
  CountriesApiResponse,
} from "@/interfaces/location.types";
import { locationQueries } from "@/api-queries/location.query";
import { axiosInstance } from "@/services/axios-api-client";

// Get all emirates
export const getEmirates = async (): Promise<LocationApiResponse> => {
  const response = await axiosInstance.get(locationQueries.emirates.endpoint);
  return response.data;
};

// Get areas by emirate
export const getAreas = async (
  emirate?: string
): Promise<AreasApiResponse> => {
  const response = await axiosInstance.get(locationQueries.areas.endpoint, {
    params: emirate ? { emirate } : undefined,
  });
  return response.data;
};

// Get cities
export const getCities = async (
  params?: {
    emirate?: string;
    country?: string;
  }
): Promise<CitiesApiResponse> => {
  const response = await axiosInstance.get(locationQueries.cities.endpoint, {
    params,
  });
  return response.data;
};

// Get countries
export const getCountries = async (): Promise<CountriesApiResponse> => {
  const response = await axiosInstance.get(locationQueries.countries.endpoint);
  return response.data;
};
