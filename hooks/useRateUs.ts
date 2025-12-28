import { useMutation } from "@tanstack/react-query";
import {
  submitRating,
  RateUsPayload,
  RateUsResponse,
} from "@/app/api/rate-us/rate-us.services";

// ============================================================================
// MUTATION HOOKS
// ============================================================================

// Submit rating
export const useSubmitRating = () => {
  return useMutation<RateUsResponse, Error, RateUsPayload>({
    mutationFn: submitRating,
  });
};

