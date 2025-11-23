import { useQuery } from "@tanstack/react-query";
import { getHomeData } from '@/app/api/home/home.services';
import { HomeApiResponse } from '@/interfaces/home.types';
import { homeQueries } from '@/app/api/home/index';

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get home page data
export const useHome = () => {
  return useQuery<HomeApiResponse, Error>({
    queryKey: homeQueries.home.Key,
    queryFn: () => getHomeData(),
  });
};

