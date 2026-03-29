"use client";

import { useState, useCallback, useMemo } from "react";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { 
  resolvePostingPlan, 
  getSubscriptionRemainingAds,
  getSubscriptionRemainingFeatured,
  isBasicPlan,
  isCategoryPlan,
  ResolvedPlan
} from "@/utils/subscription-match";
import { ISubscription } from "@/interfaces/subscription.types";

export type SubscriptionDialogMode = "no_plans" | "insufficient" | "expired" | "selection" | "has_credits";
export type SubscriptionActionType = "post" | "renew" | "feature";

export interface SubscriptionDialogProps {
  isOpen: boolean;
  mode: SubscriptionDialogMode;
  action: SubscriptionActionType;
  categoryType?: string;
  categoryName?: string;
  matchedSubscription?: ISubscription | null;
  onClose: () => void;
}

/**
 * Unified hook for all subscription-related logic (Posting, Renewing, Featuring).
 * Consolidates useAdAvailability, useRenewAdAvailability, etc.
 */
export const useAdSubscription = () => {
  const {
    isLoading: subscriptionsLoading,
    getActiveSubscriptions,
    getSubscriptionForCategory
  } = useSubscriptionStore();

  const [dialogProps, setDialogProps] = useState<Omit<SubscriptionDialogProps, 'onClose'>>({
    isOpen: false,
    mode: "no_plans",
    action: "post",
  });

  const closeDialog = useCallback(() => {
    setDialogProps(prev => ({ ...prev, isOpen: false }));
  }, []);

  /**
   * Main entry point for checking if an action is allowed.
   * Returns true if allowed, or false (and triggers a dialog) if not.
   */
  const checkAvailability = useCallback((params: {
    action: SubscriptionActionType;
    categoryType: string;
    categoryName: string;
    categoryId?: string;
  }): boolean => {
    const activeSubs = getActiveSubscriptions();
    const resolved = resolvePostingPlan(activeSubs, params.categoryType, params.categoryId);

    // 1. Handle No Matching Plan / No Credits
    if (resolved.planType === "NONE") {
      setDialogProps({
        isOpen: true,
        mode: "no_plans",
        action: params.action,
        categoryType: params.categoryType,
        categoryName: params.categoryName,
        matchedSubscription: null,
      });

      // If we find a matching plan that is just used up, it's insufficient
      const usedUpSub = activeSubs.find(sub => {
         return isCategoryPlan(sub, params.categoryType, params.categoryId) || isBasicPlan(sub);
      });

      if (usedUpSub) {
         setDialogProps(prev => ({ ...prev, mode: "insufficient", matchedSubscription: usedUpSub }));
      }

      return false;
    }

    // 2. Handle Action-Specific Transitions
    
    // For Featuring
    if (params.action === "feature") {
      const hasFeaturedCredits = resolved.remainingFeatured > 0;
      setDialogProps({
        isOpen: true,
        mode: hasFeaturedCredits ? "has_credits" : "insufficient",
        action: "feature",
        categoryType: params.categoryType,
        categoryName: params.categoryName,
        matchedSubscription: resolved.subscription,
      });
      return false;
    }

    // For Renewing
    if (params.action === "renew") {
      setDialogProps({
        isOpen: true,
        mode: "has_credits",
        action: "renew",
        categoryType: params.categoryType,
        categoryName: params.categoryName,
        matchedSubscription: resolved.subscription,
      });
      return false;
    }

    // 3. For Posting - if we have credits, return true immediately
    return true;
  }, [getActiveSubscriptions]);

  /**
   * Resolves the best plan for a category without triggering dialogs.
   */
  const resolve = useCallback((categoryType: string, categoryId?: string): ResolvedPlan => {
    return getSubscriptionForCategory(categoryType, categoryId);
  }, [getSubscriptionForCategory]);

  return {
    checkAvailability,
    resolve,
    isLoading: subscriptionsLoading,
    dialogProps: { ...dialogProps, onClose: closeDialog } as SubscriptionDialogProps,
    closeDialog,
    // Helper to get remaining credits for UI display
    getRemainingCredits: (categoryType: string, categoryId?: string) => {
      const res = resolve(categoryType, categoryId);
      return {
        remainingAds: res.remainingAds,
        remainingFeatured: res.remainingFeatured,
        planName: res.subscription?.plan?.plan || null,
      };
    }
  };
};
