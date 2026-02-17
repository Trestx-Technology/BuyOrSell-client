import { IPlan } from "./plan.types";

export interface ISubscription {
  _id: string;
  userID: string;
  isActive: boolean;
  paymentId: string;
  addOns: any[]; // Or define specific Interface if known
  plan: IPlan; // Use IPlan if it matches, otherwise define strict shape here
  startDate: string;
  endDate: string;
  status: "created" | "active" | "inactive" | "expired" | "confirmed"; // Updated status enum based on sample 'confirmed'
  addsAvailable: number;
  adsUsed: number;
  featuredAdsAvailable?: number;
  featuredAdsUsed?: number;
  aiAvailable: number;
  numberOfAiUsed: number;
  paymentType?: string;
  cancelAtPeriodEnd?: boolean;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateSubscriptionPayload {
  userID: string;
  plan: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  status: string;
  paymentId: string;
}

export interface UpdateSubscriptionPayload
  extends Partial<CreateSubscriptionPayload> {}

export interface SingleSubscriptionResponse {
  data: ISubscription;
  message: string;
  status: number;
}

export interface SubscriptionListResponse {
  data: ISubscription[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  status: number;
}

export interface SubscriptionUser {
  _id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

export interface SubscriptionUserListResponse {
  data: SubscriptionUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
  status: number;
}
