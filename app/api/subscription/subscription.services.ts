import { axiosInstance } from '@/services/axios-api-client';
import { subscriptionQueries } from './index';
import type {
  CreateSubscriptionPayload,
  ISubscription,
  SingleSubscriptionResponse,
  SubscriptionListResponse,
  SubscriptionUserListResponse,
  UpdateSubscriptionPayload,
} from '@/interfaces/subscription.types';

// ============================================================================
// SUBSCRIPTION CRUD OPERATIONS
// ============================================================================

export const createSubscription = async (
  payload: CreateSubscriptionPayload
): Promise<SingleSubscriptionResponse> => {
  const response = await axiosInstance.post<SingleSubscriptionResponse>(
    subscriptionQueries.createSubscription.endpoint,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const getAllSubscriptions = async (params?: {
  page?: number;
  limit?: number;
}): Promise<SubscriptionListResponse> => {
  const response = await axiosInstance.get<SubscriptionListResponse>(
    subscriptionQueries.getAllSubscriptions.endpoint,
    { params }
  );
  return response.data;
};

export const updateSubscription = async (
  // id: string, // The image implies /subscriptions endpoint without ID in path, maybe in body or query?
  // Assuming typically ID is needed. If the endpoint is strictly /subscriptions for specific update, 
  // maybe it updates the "current" one? But the description says "Update a subscription by ID"
  // If usually REST, it should be /subscriptions/:id.
  // I will assume the payload contains the ID or the ID is passed as a query param if not in path.
  // HOWEVER, practically, I should probably append the ID to the URL if it's a standard ID update.
  // Given I defined the endpoint as `/subscriptions` in index.ts, I will append slash ID here if I must.
  // But let's look at `getMySubscription`... that's specific.
  // "Update a subscription by ID" -> likely `/subscriptions/:id`. 
  // I'll trust the textual description "by ID" over the potentially simplified label.
  id: string,
  payload: UpdateSubscriptionPayload
): Promise<SingleSubscriptionResponse> => {
  // If the stored endpoint is just '/subscriptions', I'll append the ID.
  const response = await axiosInstance.put<SingleSubscriptionResponse>(
    `${subscriptionQueries.updateSubscription.endpoint}/${id}`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

// ============================================================================
// SUBSCRIPTION QUERIES
// ============================================================================

export const getSubscriptionUsers = async (
  planId: string
): Promise<SubscriptionUserListResponse> => {
  const response = await axiosInstance.get<SubscriptionUserListResponse>(
    subscriptionQueries.getSubscriptionUsers(planId).endpoint
  );
  return response.data;
};

export const getMySubscription =
  async (): Promise<SubscriptionListResponse> => {
    const response = await axiosInstance.get<SubscriptionListResponse>(
      subscriptionQueries.getMySubscription.endpoint
    );
    return response.data;
  };

export const getMyActiveSubscription = async (): Promise<SingleSubscriptionResponse> => {
  const response = await axiosInstance.get<SingleSubscriptionResponse>(
    subscriptionQueries.getMyActiveSubscription.endpoint
  );
  return response.data;
};

export const incrementAiUsage = async (
  subscriptionId: string,
): Promise<any> => {
  const response = await axiosInstance.post(
    subscriptionQueries.incrementAiUsage(subscriptionId).endpoint,
  );
  return response.data;
};

export const stopRecurringSubscription = async (
  subscriptionId: string,
): Promise<any> => {
  const response = await axiosInstance.put(
    subscriptionQueries.stopRecurringSubscription(subscriptionId).endpoint,
  );
  return response.data;
};
