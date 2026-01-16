import { useQuery } from "@tanstack/react-query";
import { getPlans } from "@/app/api/plans/plan.services";
import { PlanListResponse } from "@/interfaces/plan.types";
import { planQueries } from "@/app/api/plans/index";

export const useGetPlans = () => {
  return useQuery<PlanListResponse, Error>({
    queryKey: planQueries.getPlans.Key,
    queryFn: getPlans,
  });
};
