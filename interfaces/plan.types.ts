export interface IPlan {
  _id: string;
  plan: string;
  price: number;
  discount: number;
  discountedPrice: number;
  validation: number;
  validationPeriod: string;
  isActive: boolean;
  categories: string[];
  addsAvailable: number;
  features: string[];
  featuresAr: string[];
  type: string;
  isPopular: boolean;
  userIds: string[];
  numberOfFeaturedAds: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  planAr: string;
  planType: string;
  description: string;
  descriptionAr: string;
}

export interface PlanListResponse {
  statusCode: number;
  timestamp: string;
  data: IPlan[];
}
