import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aiTokensService, AI_TOKENS_QUERY_KEYS } from "@/app/api/ai-tokens";
import { ConsumeTokensDto } from "@/interfaces/ai-tokens.types";

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

export const useConsumeTokens = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: ConsumeTokensDto) => aiTokensService.consumeTokens(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AI_TOKENS_QUERY_KEYS.balance });
    },
  });
};
