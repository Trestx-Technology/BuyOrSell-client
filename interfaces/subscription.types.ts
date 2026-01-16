export interface ISubscription {
  _id: string;
  userID: string;
  plan: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive' | 'expired';
  paymentId: string;
  adsUsed: number;
  createdAt: string;
  updatedAt: string;
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

export interface UpdateSubscriptionPayload extends Partial<CreateSubscriptionPayload> {}

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
