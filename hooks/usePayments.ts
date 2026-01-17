import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createPaymentIntent,
  confirmPaymentIntent,
  confirmPaymentIntentWithToken,
} from "@/app/api/payments/payment.services";
import {
  CreatePaymentPayload,
  PaymentResponse,
  ConfirmPaymentResponse,
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

export const useConfirmPaymentIntent = () => {
  return useMutation<ConfirmPaymentResponse, Error, string>({
    mutationFn: confirmPaymentIntent,
    onSuccess: (_, paymentIntentId) => {
      // Invalidate relevant queries if needed, e.g., subscription status or order status
      // queryClient.invalidateQueries({ queryKey: [...] });
    },
  });
};

export const useConfirmPaymentIntentWithToken = () => {
  return useMutation<
    ConfirmPaymentResponse,
    Error,
    { paymentIntentId: string; accessToken: string }
  >({
    mutationFn: ({ paymentIntentId, accessToken }) =>
      confirmPaymentIntentWithToken(paymentIntentId, accessToken),
  });
};


