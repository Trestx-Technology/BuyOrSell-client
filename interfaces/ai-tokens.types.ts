export interface AITokenResponseDto {
  statusCode: number;
  timestamp: string;
  data: {
    userId: string;
    tokensIssued: number;
    tokensConsumed: number;
    tokensRemaining: number;
    lastPurchaseAt: string;
  };
}

export interface ConsumeTokensDto {
  tokens: number;
  purpose: string;
  metadata?: Record<string, any>;
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
