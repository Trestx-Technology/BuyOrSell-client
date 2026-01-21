export interface CreatePaymentPayload {
  amount: number;
  currency: string;
  status?: "pending" | "success" | "failed";
  type: string; // 'PLAN' | 'ADS' etc.
  typeId: string;
  userId: string;
  redirectUrl?: string;
  planType?: string; // Optional field for subscription plan duration (WEEKLY, MONTHLY, YEARLY)
}

export interface CreatePaymentDto {
  amount: number;
  currency: string;
  type: string;
  typeId: string;
  userId: string;
  requestType?: "payment"; // or something if needed
}

export interface PaymentResponse {
  statusCode: number;
  message: string;
  data: {
    secret?: string;
    paymentIntent?: any;
    paymentIntentId?: string;
    amount: number;
    currency: string;
    status: string;
  };
}

export interface ConfirmPaymentResponse {
  statusCode: number;
  message: string;
  data: unknown;
}

export interface ConfirmPaymentPayload {
  paymentIntentId: string;
  accessToken?: string;
}

export interface RefundPaymentDto {
  paymentIntentId?: string;
  checkoutSessionId?: string;
  amount?: number; // Optional for partial refund
  reason?: string;
}

export interface RefundResponse {
  message: string;
  refundId: string;
  paymentIntentId?: string;
  checkoutSessionId?: string;
  amountRefunded: number;
  currency: string;
  status: string;
}

// 1. Subscription Checkout
export interface CreatePlanSubscriptionCheckoutDto {
  successUrl: string;
  cancelUrl: string;
  type: "PLAN";
  typeId: string;
  userId: string;
  customerEmail: string;
  mode: "subscription";
}

// 2. One-time Payment Checkout for Plan
export interface CreatePlanOneTimeCheckoutDto {
  lineItems: {
    name: string;
    amount: number;
    currency: string;
    quantity: number;
  }[];
  successUrl: string;
  cancelUrl: string;
  type: "PLAN";
  typeId: string;
  userId: string;
  customerEmail: string;
  mode: "payment";
}

// 3. Custom Line Items (Ads) Checkout
// Covers both single and multiple custom line items for ADS type
export interface CreateAdsCheckoutDto {
  lineItems: {
    name: string;
    amount: number;
    currency: string;
    quantity: number;
  }[];
  successUrl: string;
  cancelUrl: string;
  type: "ADS";
  typeId: string;
  userId: string;
  customerEmail: string;
  mode: "payment";
}

// 4. Add-on Purchase Checkout
export interface CreateAddonCheckoutDto {
  lineItems: {
    name: string;
    amount: number;
    currency: string;
    quantity: number;
  }[];
  successUrl: string;
  cancelUrl: string;
  type: "ADDON";
  typeId: string;
  userId: string;
  customerEmail: string;
  mode: "payment";
  metadata?: {
    subscriptionId: string;
    [key: string]: string;
  };
}

// Union Type for use in services/hooks
export type CreateCheckoutSessionDto =
  | CreatePlanSubscriptionCheckoutDto
  | CreatePlanOneTimeCheckoutDto
  | CreateAdsCheckoutDto
  | CreateAddonCheckoutDto;

export interface CheckoutSessionResponse {
  message: string;
  sessionId: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CompleteCheckoutSessionResponse {
  message: string;
  sessionId: string;
  paymentIntentId: string;
  status: string;
  amount: number;
  currency: string;
}
