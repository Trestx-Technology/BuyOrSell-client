import { axiosInstance } from '@/services/axios-api-client';
import { planQueries } from './index';
import type { PlanListResponse } from '@/interfaces/plan.types';

// ============================================================================
// PLAN OPERATIONS
// ============================================================================

export const getPlans = async (): Promise<PlanListResponse> => {
  const response = await axiosInstance.get<PlanListResponse>(
    planQueries.getPlans.endpoint
  );
  return response.data;
};
