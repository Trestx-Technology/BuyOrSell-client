import { useQuery } from "@tanstack/react-query";
import { getHomeData } from '@/app/api/home/home.services';
import { HomeApiResponse } from '@/interfaces/home.types';
import { homeQueries } from '@/app/api/home/index';
import { useAuthStore } from '@/stores/authStore';

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get home page data
export const useHome = () => {
  const { session, isAuthenticated } = useAuthStore();
  const userId = isAuthenticated && session.user ? session.user._id : undefined;

  return useQuery<HomeApiResponse, Error>({
    queryKey: [...homeQueries.home.Key, userId],
    queryFn: () => getHomeData(userId),
  });
};

