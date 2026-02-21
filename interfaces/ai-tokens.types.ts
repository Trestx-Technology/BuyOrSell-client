export interface AITokenResponseDto {
  balance: number;
  userId: string;
}

export interface PurchaseTokensDto {
  packageId: string;
}

export interface ConsumeTokensDto {
  tokens: number;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface CreateTokenPackageDto {
  name: string;
  nameAr?: string;
  tokens: number;
  price: number;
  isActive?: boolean;
  description?: string;
  descriptionAr?: string;
}

export interface UpdateTokenPackageDto {
  name?: string;
  nameAr?: string;
  tokens?: number;
  price?: number;
  isActive?: boolean;
  description?: string;
  descriptionAr?: string;
}

export interface InitiateTokenPurchaseDto {
  packageId: string;
  paymentMethod: string;
  successUrl: string;
  cancelUrl: string;
}

export interface TokenPackage {
  _id: string;
  name: string;
  nameAr?: string;
  tokens: number;
  price: number;
  description?: string;
  descriptionAr?: string;
  currency?: string;
  discount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InitiateTokenPurchaseResponseDto {
  statusCode: number;
  timestamp: string;
  data: {
    method: string;
    sessionId: string;
    checkoutUrl: string;
    amount: number;
    currency: string;
    tokens: number;
  };
}
