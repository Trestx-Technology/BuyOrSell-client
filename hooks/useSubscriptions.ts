import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSubscription,
  getAllSubscriptions,
  getMyActiveSubscription,
  getMySubscription,
  getSubscriptionUsers,
  updateSubscription,
} from "@/app/api/subscription/subscription.services";
import {
  CreateSubscriptionPayload,
  SingleSubscriptionResponse,
  SubscriptionListResponse,
  SubscriptionUserListResponse,
  UpdateSubscriptionPayload,
} from "@/interfaces/subscription.types";
import { subscriptionQueries } from "@/app/api/subscription/index";

// ============================================================================
// SUBSCRIPTION QUERY HOOKS
// ============================================================================

export const useGetAllSubscriptions = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery<SubscriptionListResponse, Error>({
    queryKey: [...subscriptionQueries.getAllSubscriptions.Key, params],
    queryFn: () => getAllSubscriptions(params),
  });
};

export const useGetMySubscription = () => {
  return useQuery<SingleSubscriptionResponse, Error>({
    queryKey: subscriptionQueries.getMySubscription.Key,
    queryFn: () => getMySubscription(),
  });
};

export const useGetMyActiveSubscription = () => {
  return useQuery<SingleSubscriptionResponse, Error>({
    queryKey: subscriptionQueries.getMyActiveSubscription.Key,
    queryFn: () => getMyActiveSubscription(),
  });
};

export const useGetSubscriptionUsers = (planId: string) => {
  return useQuery<SubscriptionUserListResponse, Error>({
    queryKey: subscriptionQueries.getSubscriptionUsers(planId).Key,
    queryFn: () => getSubscriptionUsers(planId),
    enabled: !!planId,
  });
};

// ============================================================================
// SUBSCRIPTION MUTATION HOOKS
// ============================================================================

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<SingleSubscriptionResponse, Error, CreateSubscriptionPayload>({
    mutationFn: createSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionQueries.getAllSubscriptions.Key,
      });
      queryClient.invalidateQueries({
        queryKey: subscriptionQueries.getMySubscription.Key,
      });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SingleSubscriptionResponse,
    Error,
    { id: string; data: UpdateSubscriptionPayload }
  >({
    mutationFn: ({ id, data }) => updateSubscription(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionQueries.getAllSubscriptions.Key,
      });
      queryClient.invalidateQueries({
        queryKey: subscriptionQueries.getMySubscription.Key,
      });
      // Invalidate specific if needed, though getMySubscription might cover it
    },
  });
};
