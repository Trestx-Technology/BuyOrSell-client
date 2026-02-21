import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiTokensService, AI_TOKENS_QUERY_KEYS } from "@/app/api/ai-tokens";
import {
  PurchaseTokensDto,
  ConsumeTokensDto,
} from "@/interfaces/ai-tokens.types";
import { CreateCheckoutSessionDto } from "@/interfaces/payment.types";

export const useAITokenBalance = () => {
  return useQuery({
    queryKey: AI_TOKENS_QUERY_KEYS.balance,
    queryFn: aiTokensService.getBalance,
    retry: false,
  });
};

export const useAITokenPackages = (activeOnly: boolean = true) => {
  return useQuery({
    queryKey: AI_TOKENS_QUERY_KEYS.packages,
    queryFn: () => aiTokensService.getPackages(activeOnly),
  });
};

export const usePurchaseTokens = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: PurchaseTokensDto) => aiTokensService.purchaseTokens(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_TOKENS_QUERY_KEYS.balance });
    },
  });
};

export const useConsumeTokens = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ConsumeTokensDto) => aiTokensService.consumeTokens(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_TOKENS_QUERY_KEYS.balance });
    },
  });
};

export const useInitiateTokenPurchase = () => {
  return useMutation({
    mutationFn: (dto: CreateCheckoutSessionDto) =>
      aiTokensService.initiatePurchase(dto),
  });
};

export const useCompleteTokenPurchase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiTokensService.completePurchase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_TOKENS_QUERY_KEYS.balance });
    },
  });
};
