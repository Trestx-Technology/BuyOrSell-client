import { axiosInstance } from "@/services/axios-api-client";
import { paymentQueries } from "./index";
import type {
  CreatePaymentPayload,
  PaymentResponse,
  ConfirmPaymentResponse,
} from "@/interfaces/payment.types";

// ============================================================================
// PAYMENT OPERATIONS
// ============================================================================

export const createPaymentIntent = async (
  payload: CreatePaymentPayload
): Promise<PaymentResponse> => {
  const response = await axiosInstance.post<PaymentResponse>(
    paymentQueries.createPaymentIntent.endpoint,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const confirmPaymentIntent = async (
  paymentIntentId: string
): Promise<ConfirmPaymentResponse> => {
  const response = await axiosInstance.patch<ConfirmPaymentResponse>(
    paymentQueries.confirmPaymentIntent(paymentIntentId).endpoint
  );
  return response.data;
};

export const getPaymentIntent = async (
  paymentIntentId: string
): Promise<PaymentResponse> => {
  const response = await axiosInstance.get<PaymentResponse>(
    paymentQueries.getPaymentIntent(paymentIntentId).endpoint
  );
  return response.data;
};
