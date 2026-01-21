import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  refundPayment,
  createCheckoutSession,
  completeCheckoutSession,
  getUserPayments,
  getUserAddonPayments,
  getSubscriptionAddonPayments,
  confirmPaymentIntent,
  createPaymentIntent,
} from "@/app/api/payments/payment.services";
import {
  RefundPaymentDto,
  RefundResponse,
  CreateCheckoutSessionDto,
  CheckoutSessionResponse,
  CompleteCheckoutSessionResponse,
  ConfirmPaymentPayload,
  ConfirmPaymentResponse,
  CreatePaymentPayload,
  PaymentResponse,
  CreatePlanSubscriptionCheckoutDto,
  CreatePlanOneTimeCheckoutDto,
  CreateAdsCheckoutDto,
  CreateAddonCheckoutDto,
} from "@/interfaces/payment.types";
import { paymentQueries } from "@/app/api/payments/index";

// ============================================================================
// PAYMENT MUTATION HOOKS
// ============================================================================

export const useCreatePaymentIntent = () => {
  return useMutation<PaymentResponse, Error, CreatePaymentPayload>({
    mutationFn: createPaymentIntent,
    mutationKey: paymentQueries.createPaymentIntent.Key,
  });
};

export const useConfirmPaymentIntentWithToken = () => {
  return useMutation<ConfirmPaymentResponse, Error, ConfirmPaymentPayload>({
    mutationFn: confirmPaymentIntent,
    mutationKey: paymentQueries.confirmPaymentIntent.Key,
  });
};

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

// ============================================================================
// CHECKOUT SESSION HOOKS
// ============================================================================

export const useCreatePlanSubscriptionCheckout = () => {
  return useMutation<
    CheckoutSessionResponse,
    Error,
    CreatePlanSubscriptionCheckoutDto
  >({
    mutationFn: createCheckoutSession,
    mutationKey: [...paymentQueries.createCheckoutSession.Key, "subscription"],
  });
};

export const useCreatePlanOneTimeCheckout = () => {
  return useMutation<
    CheckoutSessionResponse,
    Error,
    CreatePlanOneTimeCheckoutDto
  >({
    mutationFn: createCheckoutSession,
    mutationKey: [...paymentQueries.createCheckoutSession.Key, "plan-onetime"],
  });
};

export const useCreateAdsCheckout = () => {
  return useMutation<CheckoutSessionResponse, Error, CreateAdsCheckoutDto>({
    mutationFn: createCheckoutSession,
    mutationKey: [...paymentQueries.createCheckoutSession.Key, "ads"],
  });
};

export const useCreateAddonCheckout = () => {
  return useMutation<CheckoutSessionResponse, Error, CreateAddonCheckoutDto>({
    mutationFn: createCheckoutSession,
    mutationKey: [...paymentQueries.createCheckoutSession.Key, "addon"],
  });
};

export const useCreateMultiAdsCheckout = () => {
  return useMutation<CheckoutSessionResponse, Error, CreateAdsCheckoutDto>({
    mutationFn: createCheckoutSession,
    mutationKey: [...paymentQueries.createCheckoutSession.Key, "multi-ads"],
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
