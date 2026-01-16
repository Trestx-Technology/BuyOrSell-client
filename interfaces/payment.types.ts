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
    clientSecret?: string;
    paymentIntentId?: string;
    // Add other relevant response fields based on Stripe/Provider response
    _id: string;
    amount: number;
    currency: string;
    status: string;
    type: string;
    typeId: string;
    userId: string;
    createdAt: string;
  };
}

export interface ConfirmPaymentResponse {
  statusCode: number;
  message: string;
  data: unknown; // Replace with specific confirmation response if known
}
