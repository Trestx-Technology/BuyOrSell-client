import { useMemo, useState, useEffect, useCallback } from "react";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useGetPlans } from "./usePlans";
import { ISubscription } from "@/interfaces/subscription.types";
import { isSubscriptionValidForType } from "@/utils/subscription-match";

export interface AdAvailability {
  normalAvailable: number;
  featuredAvailable: number;
  canPost: boolean;
  canFeature: boolean;
}

export const useAdAvailability = () => {
  const {
    subscriptions,
    fetchSubscriptions,
    isLoading: userSubscriptionsLoading,
    getActiveSubscriptions,
  } = useSubscriptionStore();

  const { data: plansData, isLoading: plansLoading } = useGetPlans();

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    mode: "selection" | "insufficient" | "no_plans";
    type: "normal" | "featured";
    categoryType?: string;
    categoryName?: string;
    currentPlanName?: string;
    isFreePlan?: boolean;
  }>({
    isOpen: false,
    mode: "selection",
    type: "normal",
  });

  useEffect(() => {
    // Initial fetch if empty
    if (subscriptions.length === 0) {
      fetchSubscriptions();
    }
  }, [fetchSubscriptions, subscriptions.length]);

  const activeSubscriptions = useMemo(() => {
    return getActiveSubscriptions();
  }, [subscriptions, getActiveSubscriptions]);

  const getAvailability = useCallback(
    (
      type: string,
      category: string,
      categoryId?: string,
    ): AdAvailability & { matchingPlansCount: number } => {
      let normalAvailableTotal = 0;
      let featuredAvailableTotal = 0;
      let matchingPlansCount = 0;

      activeSubscriptions.forEach((sub) => {
        // A plan matches if its type matches targetType or it is a wildcard plan
        if (isSubscriptionValidForType(sub, type || "Ads")) {
          matchingPlansCount++;
          const available = (sub.addsAvailable || 0) - (sub.adsUsed || 0);
          const featured =
            (sub.featuredAdsAvailable || 0) - (sub.featuredAdsUsed || 0);

          normalAvailableTotal += Math.max(0, available);
          featuredAvailableTotal += Math.max(0, featured);
        }
      });

      return {
        normalAvailable: normalAvailableTotal,
        featuredAvailable: featuredAvailableTotal,
        canPost: normalAvailableTotal > 0,
        canFeature: featuredAvailableTotal > 0,
        matchingPlansCount,
      };
    },
    [activeSubscriptions],
  );

  const plansExistForCategory = useCallback(
    (type: string, category: string, categoryId?: string): boolean => {
      if (!plansData?.data) return true; // Default to true while loading/error to stay conservative

      const typeLower = type.toLowerCase();
      const categoryLower = category.toLowerCase();

      return plansData.data.some((plan) => {
        if (!plan.isActive) return false;
        const planType = (plan.type || "Ads").toLowerCase();
        const isDefaultPlan = planType === "basic" || plan.isDefault;

        return planType === typeLower || isDefaultPlan;
      });
    },
    [plansData],
  );

  const getCompatibleSubscriptions = useCallback(
    (type: string, categoryId?: string): ISubscription[] => {
      return activeSubscriptions.filter((sub) => {
        // A plan matches if:
        // 1. It's a wildcard plan
        // 2. Its type specifically matches the target category (e.g., Electronics matches Electronics)
        if (isSubscriptionValidForType(sub, type || "Ads")) {
          const available = (sub.addsAvailable || 0) - (sub.adsUsed || 0);
          return available > 0;
        }
        return false;
      });
    },
    [activeSubscriptions],
  );

  const checkAvailability = (
    type: string,
    category: string,
    categoryId?: string,
    isFeatured: boolean = false,
  ): boolean => {
    const availability = getAvailability(type, category, categoryId);

    // Case 1: No plans exist for this category in the system (free posting usually, but requires Basic sub check)
    if (!plansExistForCategory(type, category, categoryId)) {
      const hasBasicSubscription = activeSubscriptions.some(
        (sub) =>
          sub.plan?.type?.toLowerCase() === "basic" || sub.plan?.isDefault,
      );

      if (hasBasicSubscription) {
        return true;
      }

      setDialogState({
        isOpen: true,
        mode: "no_plans",
        type: isFeatured ? "featured" : "normal",
        categoryType: type,
        categoryName: category,
      });
      return false;
    }

    // Case 2: No active subscription for this category
    if (availability.matchingPlansCount === 0) {
      setDialogState({
        isOpen: true,
        mode: "no_plans",
        type: isFeatured ? "featured" : "normal",
        categoryType: type,
        categoryName: category,
      });
      return false;
    }

    // Case 3: Has plans but insufficient ads
    if (isFeatured && !availability.canFeature) {
      setDialogState({
        isOpen: true,
        mode: "insufficient",
        type: "featured",
        categoryType: type,
        categoryName: category,
      });
      return false;
    }

    if (!isFeatured && !availability.canPost) {
      // Check if any matching plan for this category is a free/basic plan
      const matchingFreePlan = activeSubscriptions.find(
        (sub) =>
          isSubscriptionValidForType(sub, type || "Ads") &&
          (sub.plan?.price === 0 || sub.plan?.type?.toLowerCase() === "basic" || sub.plan?.isDefault)
      );

      setDialogState({
        isOpen: true,
        mode: "insufficient",
        type: "normal",
        categoryType: type,
        categoryName: category,
        isFreePlan: !!matchingFreePlan,
      });
      return false;
    }

    return true;
  };

  return {
    getAvailability,
    getCompatibleSubscriptions,
    checkAvailability,
    isLoading: userSubscriptionsLoading || plansLoading,
    activeSubscriptions,
    hasActiveSubscription: activeSubscriptions.length > 0,
    dialogProps: {
      isOpen: dialogState.isOpen,
      mode: dialogState.mode,
      type: dialogState.type,
      categoryType: dialogState.categoryType,
      categoryName: dialogState.categoryName,
      currentPlanName: dialogState.currentPlanName,
      isFreePlan: dialogState.isFreePlan,
      onClose: () => setDialogState((prev) => ({ ...prev, isOpen: false })),
    },
  };
};
