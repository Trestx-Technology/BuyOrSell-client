import { useMemo, useState, useEffect, useCallback } from "react";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useGetPlans } from "./usePlans";
import { ISubscription } from "@/interfaces/subscription.types";
import { isSubscriptionValidForType } from "@/utils/subscription-match";

/**
 * The two possible outcomes when a user tries to feature an existing ad.
 *
 * - `no_featured_credits` → no active plan covers this ad, OR a plan exists but
 *                           has 0 featured credits left. Show FeatureAdDialog (pay 2 AED).
 * - `has_credits`         → a matching subscription with featured credits found.
 *                           Show FeatureConfirmDialog (free, use plan credit).
 */
export type FeatureAdMode = "no_featured_credits" | "has_credits";

export interface FeatureAdDialogState {
  isOpen: boolean;
  mode: FeatureAdMode;
  categoryName?: string;
  categoryType?: string;
  /** The subscription that has available featured credits (only set on has_credits) */
  matchedSubscription?: ISubscription;
}

// ---------------------------------------------------------------------------

export const useFeatureAdAvailability = () => {
  const {
    subscriptions,
    fetchSubscriptions,
    isLoading: subscriptionsLoading,
    getActiveSubscriptions,
  } = useSubscriptionStore();

  const { data: plansData, isLoading: plansLoading } = useGetPlans();

  const [dialogState, setDialogState] = useState<FeatureAdDialogState>({
    isOpen: false,
    mode: "no_featured_credits",
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
   * If plansData hasn't loaded yet we default to `true` (conservative — don't block prematurely).
   */
  const plansExistForType = useCallback(
    (type: string): boolean => {
      if (!plansData?.data) return true;
      const typeLower = type.toLowerCase();
      return plansData.data.some((plan) => {
        if (!plan.isActive) return false;
        const pt = (plan.type || "Ads").toLowerCase();
        return pt === typeLower || pt === "basic" || plan.isDefault;
      });
    },
    [plansData],
  );

  /**
   * Core check. Call this when the user clicks "Feature" on an ad.
   *
   * @param categoryType - relatedCategories[0] from the ad (top-level plan type, e.g. "Electronics")
   * @param categoryName - leaf category name (ad.category.name, e.g. "Mobiles & Tablets")
   * @returns `true` only if the caller should proceed without a dialog
   *          (shouldn't happen — every path opens a dialog or fires the mutation).
   */
  const checkFeaturedAvailability = useCallback(
    (categoryType: string, categoryName: string): false => {
      // ── Step 1: are there any plans in the system for this type? ────────────
      const hasPlansInSystem = plansExistForType(categoryType);

      // Subscriptions that cover this type
      const matchingSubscriptions = activeSubscriptions.filter((sub) =>
        isSubscriptionValidForType(sub, categoryType),
      );

      // ── Step 2: no active plan covers this ad → pay flow ────────────────────
      if (!hasPlansInSystem || matchingSubscriptions.length === 0) {
        setDialogState({
          isOpen: true,
          mode: "no_featured_credits",
          categoryType,
          categoryName,
        });
        return false;
      }

      // ── Step 3: plans exist but check featured credits ───────────────────────
      const subWithFeatured = matchingSubscriptions.find(
        (sub) =>
          (sub.featuredAdsAvailable || 0) - (sub.featuredAdsUsed || 0) > 0,
      );

      if (!subWithFeatured) {
        // Matching plan found but no featured credits left → pay flow
        setDialogState({
          isOpen: true,
          mode: "no_featured_credits",
          categoryType,
          categoryName,
        });
        return false;
      }

      // ── Step 4: valid plan with featured credits → confirm & use credit ──────
      setDialogState({
        isOpen: true,
        mode: "has_credits",
        categoryType,
        categoryName,
        matchedSubscription: subWithFeatured,
      });
      return false;
    },
    [activeSubscriptions, plansExistForType],
  );

  return {
    checkFeaturedAvailability,
    isLoading: subscriptionsLoading || plansLoading,
    dialogState,
    closeDialog: () => setDialogState((prev) => ({ ...prev, isOpen: false })),
  };
};
