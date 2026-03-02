import { useQuery } from "@tanstack/react-query";
import { getHomeData } from '@/app/api/home/home.services';
import { HomeApiResponse } from '@/interfaces/home.types';
import { homeQueries } from '@/app/api/home/index';
import { useAuthStore } from '@/stores/authStore';
import { useEmirateStore } from '@/stores/emirateStore';

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get home page data
export const useHome = () => {
  const { session } = useAuthStore();
  const { selectedEmirate } = useEmirateStore();

  return useQuery<HomeApiResponse, Error>({
    queryKey: [...homeQueries.home.Key, session, selectedEmirate],
    queryFn: () => getHomeData(),
  });
};

