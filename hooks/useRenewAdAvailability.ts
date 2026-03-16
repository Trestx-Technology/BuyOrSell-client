import { useMemo, useState, useEffect, useCallback } from "react";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useGetPlans } from "./usePlans";
import { ISubscription } from "@/interfaces/subscription.types";
import { isSubscriptionValidForType } from "@/utils/subscription-match";

export type RenewAdMode = "no_plans" | "insufficient" | "select_plan" | "has_credits";

export interface RenewAdDialogState {
  isOpen: boolean;
  mode: RenewAdMode;
  categoryName?: string;
  categoryType?: string;
  matchedSubscription?: ISubscription;
  compatibleSubscriptions?: ISubscription[];
}

export const useRenewAdAvailability = () => {
  const {
    subscriptions,
    fetchSubscriptions,
    isLoading: subscriptionsLoading,
    getActiveSubscriptions,
  } = useSubscriptionStore();

  const { data: plansData, isLoading: plansLoading } = useGetPlans();

  const [dialogState, setDialogState] = useState<RenewAdDialogState>({
    isOpen: false,
    mode: "no_plans",
  });

  useEffect(() => {
    if (subscriptions.length === 0) {
      fetchSubscriptions();
    }
  }, [fetchSubscriptions, subscriptions.length]);

  const activeSubscriptions = useMemo(
    () => getActiveSubscriptions(),
    [subscriptions, getActiveSubscriptions],
  );

  /**
   * Returns true when the system has at least one active plan entry for the given type.
   * Mirrors the logic in useAdAvailability.ts
   */
  const plansExistForType = useCallback(
    (type: string): boolean => {
      if (!plansData?.data) return true; // Default to true while loading
      const typeLower = type.toLowerCase();
      return plansData.data.some((plan) => {
        if (!plan.isActive) return false;
        const planType = (plan.type || "Ads").toLowerCase();
        const isDefaultPlan = planType === "basic" || plan.isDefault;
        return planType === typeLower || isDefaultPlan;
      });
    },
    [plansData],
  );

  /**
   * Core check for renewal.
   * @returns true if the renewal dialog should be shown directly (1 credit found)
   *          false if another dialog (NoPlans, Selection, etc.) is shown.
   */
  const checkRenewAvailability = useCallback(
    (categoryType: string, categoryName: string): boolean => {
      // 1. System Check: are there any plans for this category?
      const hasPlansInSystem = plansExistForType(categoryType);

      // 2. Filter valid active subscriptions
      const matchingSubscriptions = activeSubscriptions.filter((sub) =>
        isSubscriptionValidForType(sub, categoryType),
      );

      // Scenario: No system plans or no active matching sub
      if (!hasPlansInSystem || matchingSubscriptions.length === 0) {
        setDialogState({
          isOpen: true,
          mode: "no_plans",
          categoryType,
          categoryName,
        });
        return false;
      }

      // 3. Filter for available credits
      const subsWithAdCredits = matchingSubscriptions.filter(
        (sub) => (sub.addsAvailable || 0) - (sub.adsUsed || 0) > 0,
      );

      if (subsWithAdCredits.length === 0) {
        // Matching plan exists, but user is out of credits
        setDialogState({
          isOpen: true,
          mode: "insufficient",
          categoryType,
          categoryName,
        });
        return false;
      }

      // 4. Handle multiple vs single
      if (subsWithAdCredits.length > 1) {
        setDialogState({
          isOpen: true,
          mode: "select_plan",
          categoryType,
          categoryName,
          compatibleSubscriptions: subsWithAdCredits,
        });
        return false;
      }

      // 5. Exactly one subscription found with credits
      setDialogState({
        isOpen: true,
        mode: "has_credits",
        categoryType,
        categoryName,
        matchedSubscription: subsWithAdCredits[0],
      });
      return true;
    },
    [activeSubscriptions, plansExistForType],
  );

  return {
    checkRenewAvailability,
    isLoading: subscriptionsLoading || plansLoading,
    dialogState,
    setDialogState,
    closeDialog: () => setDialogState((prev) => ({ ...prev, isOpen: false })),
  };
};
