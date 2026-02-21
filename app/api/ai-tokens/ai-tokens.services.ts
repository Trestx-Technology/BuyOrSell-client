import { axiosInstance } from "@/services/axios-api-client";

import {
  AITokenResponseDto,
  PurchaseTokensDto,
  ConsumeTokensDto,
  CreateTokenPackageDto,
  UpdateTokenPackageDto,
  TokenPackage,
} from "@/interfaces/ai-tokens.types";
import {
  CreateCheckoutSessionDto,
  CheckoutSessionResponse,
} from "@/interfaces/payment.types";
import { createCheckoutSession } from "@/app/api/payments/payment.services";

export const aiTokensService = {
  getBalance: async (): Promise<AITokenResponseDto> => {
    const response = await axiosInstance.get("/ai-tokens/balance");
    return response.data;
  },

  purchaseTokens: async (
    dto: PurchaseTokensDto,
  ): Promise<AITokenResponseDto> => {
    const response = await axiosInstance.post("/ai-tokens/purchase", dto);
    return response.data;
  },

  consumeTokens: async (dto: ConsumeTokensDto): Promise<AITokenResponseDto> => {
    const response = await axiosInstance.post("/ai-tokens/consume", dto);
    return response.data;
  },

  getUserBalance: async (userId: string): Promise<AITokenResponseDto> => {
    const response = await axiosInstance.get(`/ai-tokens/user/${userId}`);
    return response.data;
  },

  addTokensToUser: async (userId: string): Promise<AITokenResponseDto> => {
    const response = await axiosInstance.post(`/ai-tokens/user/${userId}/add`);
    return response.data;
  },

  getPackages: async (activeOnly?: boolean): Promise<TokenPackage[]> => {
    const response = await axiosInstance.get("/ai-tokens/packages", {
      params: { activeOnly },
    });
    return response.data.data;
  },

  createPackage: async (dto: CreateTokenPackageDto): Promise<TokenPackage> => {
    const response = await axiosInstance.post("/ai-tokens/packages", dto);
    return response.data;
  },

  getPackageById: async (packageId: string): Promise<TokenPackage> => {
    const response = await axiosInstance.get(
      `/ai-tokens/packages/${packageId}`,
    );
    return response.data;
  },

  updatePackage: async (
    packageId: string,
    dto: UpdateTokenPackageDto,
  ): Promise<TokenPackage> => {
    const response = await axiosInstance.put(
      `/ai-tokens/packages/${packageId}`,
      dto,
    );
    return response.data;
  },

  deletePackage: async (packageId: string): Promise<void> => {
    await axiosInstance.delete(`/ai-tokens/packages/${packageId}`);
  },

  initiatePurchase: async (
    dto: CreateCheckoutSessionDto,
  ): Promise<CheckoutSessionResponse> => {
    return await createCheckoutSession(dto);
  },

  completePurchase: async (): Promise<AITokenResponseDto> => {
    const response = await axiosInstance.post("/ai-tokens/purchase/complete");
    return response.data;
  },
};
