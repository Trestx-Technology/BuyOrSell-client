import { useQuery } from "@tanstack/react-query";
import {
  getEmirates,
  getAreas,
  getCities,
  getCountries,
} from "@/app/api/location/location.services";
import {
  LocationApiResponse,
  AreasApiResponse,
  CitiesApiResponse,
  CountriesApiResponse,
  Emirate,
} from "@/interfaces/location.types";
import { locationQueries } from "@/app/api/location/index";

// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useEmirates = (params?: { search?: string }) => {
  return useQuery<LocationApiResponse, Error, Emirate[]>({
    queryKey: [...locationQueries.emirates.Key, params],
    queryFn: () => getEmirates(params),
    select: (data: LocationApiResponse) => {
      // Handle both object array and string array formats
      const rawData = data.data || [];
      // If it's already an array of objects, return as is
      if (rawData.length > 0 && typeof rawData[0] === "object") {
        return rawData as Emirate[];
      }
      // If it's a string array, convert to Emirate format
      return (rawData as string[]).map((emirate) => ({
        emirate,
        emirateAr: emirate, // Fallback to same value if no Arabic
      }));
    },
  });
};

export const useAreas = (emirate?: string) => {
  return useQuery<AreasApiResponse, Error, string[]>({
    queryKey: [...locationQueries.areas.Key, emirate],
    queryFn: () => getAreas(emirate),
    enabled: !!emirate,
    select: (data: AreasApiResponse) => data.data || [],
  });
};

export const useCities = (params?: { emirate?: string; country?: string }) => {
  return useQuery<CitiesApiResponse, Error, string[]>({
    queryKey: [...locationQueries.cities.Key, params],
    queryFn: () => getCities(params),
    select: (data: CitiesApiResponse) => data.data || [],
  });
};

export const useCountries = () => {
  return useQuery<CountriesApiResponse, Error, string[]>({
    queryKey: locationQueries.countries.Key,
    queryFn: getCountries,
    select: (data: CountriesApiResponse) => data.data || [],
  });
};
