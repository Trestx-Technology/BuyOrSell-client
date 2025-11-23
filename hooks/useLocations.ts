import { useQuery } from '@tanstack/react-query';
import {
  getEmirates,
  getAreas,
  getCities,
  getCountries,
} from '@/app/api/location/location.services';
import {
  LocationApiResponse,
  AreasApiResponse,
  CitiesApiResponse,
  CountriesApiResponse,
} from '@/interfaces/location.types';
import { locationQueries } from '@/app/api/location/index';

// ============================================================================
// QUERY HOOKS
// ============================================================================

export const useEmirates = () => {
  return useQuery<LocationApiResponse, Error, string[]>({
    queryKey: locationQueries.emirates.Key,
    queryFn: getEmirates,
    select: (data: LocationApiResponse) => data.data || [],
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

export const useCities = (params?: {
  emirate?: string;
  country?: string;
}) => {
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

