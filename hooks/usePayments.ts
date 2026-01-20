import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  refundPayment,
  createCheckoutSession,
  completeCheckoutSession,
  getUserPayments,
  getUserAddonPayments,
  getSubscriptionAddonPayments,
} from "@/app/api/payments/payment.services";
import {
  RefundPaymentDto,
  RefundResponse,
  CreateCheckoutSessionDto,
  CheckoutSessionResponse,
  CompleteCheckoutSessionResponse,
} from "@/interfaces/payment.types";
import { paymentQueries } from "@/app/api/payments/index";

// ============================================================================
// PAYMENT MUTATION HOOKS
// ============================================================================

export const useRefundPayment = () => {
  const queryClient = useQueryClient();
  return useMutation<RefundResponse, Error, RefundPaymentDto>({
    mutationFn: refundPayment,
    mutationKey: paymentQueries.refundPayment.Key,
    onSuccess: (data) => {
      // Invalidate related queries to refresh data
      if (data.paymentIntentId) {
        // e.g., invalidate user payments if needed
      }
    },
  });
};

export const useCreateCheckoutSession = () => {
  return useMutation<CheckoutSessionResponse, Error, CreateCheckoutSessionDto>({
    mutationFn: createCheckoutSession,
    mutationKey: paymentQueries.createCheckoutSession.Key,
  });
};

// ============================================================================
// PAYMENT QUERY HOOKS
// ============================================================================

export const useCompleteCheckoutSession = (sessionId: string) => {
  return useQuery<CompleteCheckoutSessionResponse, Error>({
    queryKey: paymentQueries.completeCheckoutSession(sessionId).Key,
    queryFn: () => completeCheckoutSession(sessionId),
    enabled: !!sessionId,
    retry: false, // Don't retry if confirmation fails, usually means invalid session or network
  });
};

export const useUserPayments = (userId: string) => {
  return useQuery({
    queryKey: paymentQueries.getUserPayments(userId).Key,
    queryFn: () => getUserPayments(userId),
    enabled: !!userId,
  });
};

export const useUserAddonPayments = (userId: string) => {
  return useQuery({
    queryKey: paymentQueries.getUserAddonPayments(userId).Key,
    queryFn: () => getUserAddonPayments(userId),
    enabled: !!userId,
  });
};

export const useSubscriptionAddonPayments = (subscriptionId: string) => {
  return useQuery({
    queryKey: paymentQueries.getSubscriptionAddonPayments(subscriptionId).Key,
    queryFn: () => getSubscriptionAddonPayments(subscriptionId),
    enabled: !!subscriptionId,
  });
};
