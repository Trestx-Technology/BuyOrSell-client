export interface AITokenResponseDto {
  balance: number;
  userId: string;
}

export interface ConsumeTokensDto {
  tokens: number;
  reason?: string;
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
