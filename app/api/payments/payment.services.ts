import axios from "axios";
import { axiosInstance } from "@/services/axios-api-client";
import { paymentQueries } from "./index";
import type {
  RefundPaymentDto,
  RefundResponse,
  CreateCheckoutSessionDto,
  CheckoutSessionResponse,
  CompleteCheckoutSessionResponse,
} from "@/interfaces/payment.types";

// ============================================================================
// PAYMENT OPERATIONS
// ============================================================================

export const refundPayment = async (
  payload: RefundPaymentDto,
): Promise<RefundResponse> => {
  const response = await axiosInstance.post<RefundResponse>(
    paymentQueries.refundPayment.endpoint,
    payload,
  );
  return response.data;
};

export const createCheckoutSession = async (
  payload: CreateCheckoutSessionDto,
): Promise<CheckoutSessionResponse> => {
  const response = await axiosInstance.post<CheckoutSessionResponse>(
    paymentQueries.createCheckoutSession.endpoint,
    payload,
  );
  return response.data;
};

export const completeCheckoutSession = async (
  sessionId: string,
): Promise<CompleteCheckoutSessionResponse> => {
  const response = await axiosInstance.get<CompleteCheckoutSessionResponse>(
    paymentQueries.completeCheckoutSession(sessionId).endpoint,
  );
  return response.data;
};

export const getUserPayments = async (userId: string): Promise<any> => {
  const response = await axiosInstance.get(
    paymentQueries.getUserPayments(userId).endpoint,
  );
  return response.data;
};

export const getUserAddonPayments = async (userId: string): Promise<any> => {
  const response = await axiosInstance.get(
    paymentQueries.getUserAddonPayments(userId).endpoint,
  );
  return response.data;
};

export const getSubscriptionAddonPayments = async (
  subscriptionId: string,
): Promise<any> => {
  const response = await axiosInstance.get(
    paymentQueries.getSubscriptionAddonPayments(subscriptionId).endpoint,
  );
  return response.data;
};
