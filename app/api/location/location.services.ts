import {
  LocationApiResponse,
  AreasApiResponse,
  CitiesApiResponse,
  CountriesApiResponse,
} from '@/interfaces/location.types';
import { locationQueries } from './index';
import { axiosInstance } from '@/services/axios-api-client';

// Get all emirates
export const getEmirates = async (
  params?: { search?: string }
): Promise<LocationApiResponse> => {
  const response = await axiosInstance.get<LocationApiResponse>(
    locationQueries.emirates.endpoint,
    { params },
  );
  return response.data;
};

// Get areas by emirate
export const getAreas = async (
  emirate?: string,
): Promise<AreasApiResponse> => {
  const response = await axiosInstance.get<AreasApiResponse>(
    locationQueries.areas.endpoint,
    {
      params: emirate ? { emirate } : undefined,
    },
  );
  return response.data;
};

// Get cities
export const getCities = async (params?: {
  emirate?: string;
  country?: string;
}): Promise<CitiesApiResponse> => {
  const response = await axiosInstance.get<CitiesApiResponse>(
    locationQueries.cities.endpoint,
    { params },
  );
  return response.data;
};

// Get countries
export const getCountries = async (): Promise<CountriesApiResponse> => {
  const response = await axiosInstance.get<CountriesApiResponse>(
    locationQueries.countries.endpoint,
  );
  return response.data;
};

