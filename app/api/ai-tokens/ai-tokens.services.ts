import { axiosInstance } from "@/services/axios-api-client";

import {
  AITokenResponseDto,
  ConsumeTokensDto,
  TokenPackage,
} from "@/interfaces/ai-tokens.types";

export const aiTokensService = {
  getBalance: async (): Promise<AITokenResponseDto> => {
    const response = await axiosInstance.get("/ai-tokens/balance");
    return response.data;
  },

  consumeTokens: async (dto: ConsumeTokensDto): Promise<AITokenResponseDto> => {
    const response = await axiosInstance.post("/ai-tokens/consume", dto);
    return response.data;
  },

  getPackages: async (activeOnly?: boolean): Promise<TokenPackage[]> => {
    const response = await axiosInstance.get("/ai-tokens/packages", {
      params: { activeOnly },
    });
    return response.data.data;
  },
};
