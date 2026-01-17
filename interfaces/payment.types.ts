export interface CreatePaymentPayload {
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  type: string; // 'PLAN' | 'ADS' etc.
  typeId: string;
  userId: string;
  redirectUrl?: string;
  planType?: string; // Optional field for subscription plan duration (WEEKLY, MONTHLY, YEARLY)
}

export interface PaymentResponse {
  statusCode: number;
  message: string;
  data: {
    secret?: string;
    paymentIntent?: any;
    paymentIntentId?: string;
    // Add other relevant response fields based on Stripe/Provider response
    amount: number;
    currency: string;
    status: string;
  };
}

export interface ConfirmPaymentResponse {
  statusCode: number;
  message: string;
  data: unknown; // Replace with specific confirmation response if known
}
