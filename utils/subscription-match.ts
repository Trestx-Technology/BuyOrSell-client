import { ISubscription } from "@/interfaces/subscription.types";

// =============================================================================
// PLAN TYPE HELPERS
// =============================================================================

/**
 * Returns true if the subscription's plan is a Default wildcard plan.
 * These plans can be used for ANY category.
 */
export function isBasicPlan(sub: ISubscription): boolean {
  return !!sub.plan?.isDefault;
}

/**
 * Returns true if the subscription has expired based on its `endDate`.
 */
export function isSubscriptionExpired(sub: ISubscription): boolean {
  const status = sub.status?.toLowerCase();
  if (status === "expired" || status === "inactive") return true;

  if (!sub.endDate) return false;
  return new Date(sub.endDate) < new Date();
}

// =============================================================================
// CREDIT HELPERS
// =============================================================================

/**
 * Returns the number of remaining normal ad credits for a subscription.
 * Never returns negative.
 */
export function getSubscriptionRemainingAds(sub: ISubscription): number {
  return Math.max(0, (sub.addsAvailable || 0) - (sub.adsUsed || 0));
}

/**
 * Returns the number of remaining featured ad credits for a subscription.
 * Never returns negative.
 */
export function getSubscriptionRemainingFeatured(sub: ISubscription): number {
  return Math.max(0, (sub.featuredAdsAvailable || 0) - (sub.featuredAdsUsed || 0));
}

// =============================================================================
// PLAN MATCHING
// =============================================================================

/**
 * Validates if the given subscription covers the target category type.
 *
 * Rules:
 * 1. Plans marked with `isDefault` are considered wildcards and match everything.
 * 2. Otherwise, the plan's `type` must strictly match the `targetType` (case-insensitive).
 */
export function isSubscriptionValidForType(
  sub: ISubscription,
  targetType: string,
  targetCategoryId?: string,
): boolean {
  return (
    isBasicPlan(sub) || isCategoryPlan(sub, targetType, targetCategoryId)
  );
}

/**
 * Returns true if the subscription is a category-specific (non-default) plan
 * that matches the given target type or category ID.
 */
export function isCategoryPlan(
  sub: ISubscription,
  targetType: string,
  targetCategoryId?: string,
): boolean {
  if (isBasicPlan(sub)) return false;

  // 1. Match by Category ID (Most robust)
  if (targetCategoryId && sub.plan?.categories?.includes(targetCategoryId)) {
    return true;
  }

  // 2. Match by Type string (Fallback)
  const subType = sub.plan?.type?.toLowerCase().trim();
  const targetLower = targetType.toLowerCase().trim();

  // Special handling for Jobs/Job pluralization
  const isJobType = (t: string) => t === "job" || t === "jobs";
  if (isJobType(subType) && isJobType(targetLower)) {
    return true;
  }

  return subType === targetLower;
}

// =============================================================================
// PLAN RESOLUTION
// =============================================================================

export type ResolvedPlanType = "CATEGORY" | "DEFAULT" | "NONE";

export interface ResolvedPlan {
  /** Which type of plan was resolved */
  planType: ResolvedPlanType;
  /** The resolved subscription (null if NONE) */
  subscription: ISubscription | null;
  /** Remaining normal ad credits */
  remainingAds: number;
  /** Remaining featured ad credits */
  remainingFeatured: number;
  /** Whether the ad should be auto-marked as featured */
  shouldFeature: boolean;
}

/**
 * Resolves the best subscription to use for posting in a given category.
 *
 * Priority: Category-specific Plan > Default Plan > None
 *
 * Within each tier, picks the first subscription with ad credits > 0.
 * If multiple exist, prefers the one with more remaining credits.
 */
export function resolvePostingPlan(
  activeSubscriptions: ISubscription[],
  targetType: string,
  targetCategoryId?: string,
): ResolvedPlan {
  const noPlan: ResolvedPlan = {
    planType: "NONE",
    subscription: null,
    remainingAds: 0,
    remainingFeatured: 0,
    shouldFeature: false,
  };

  if (!activeSubscriptions.length) return noPlan;

  // Split into category-specific and default plans
  const categoryPlans: ISubscription[] = [];
  const defaultPlans: ISubscription[] = [];

  for (const sub of activeSubscriptions) {
    if (isCategoryPlan(sub, targetType, targetCategoryId)) {
      categoryPlans.push(sub);
    } else if (isBasicPlan(sub)) {
      defaultPlans.push(sub);
    }
  }

  // Sort by remaining credits descending (best plan first)
  const sortByCredits = (a: ISubscription, b: ISubscription) =>
    getSubscriptionRemainingAds(b) - getSubscriptionRemainingAds(a);

  categoryPlans.sort(sortByCredits);
  defaultPlans.sort(sortByCredits);

  // Priority 1: Category plan with credits
  const bestCategory = categoryPlans.find(
    (s) => getSubscriptionRemainingAds(s) > 0,
  );
  if (bestCategory) {
    const remainingAds = getSubscriptionRemainingAds(bestCategory);
    const remainingFeatured = getSubscriptionRemainingFeatured(bestCategory);
    return {
      planType: "CATEGORY",
      subscription: bestCategory,
      remainingAds,
      remainingFeatured,
      shouldFeature: remainingFeatured > 0,
    };
  }

  // Priority 2: Default plan with credits
  const bestDefault = defaultPlans.find(
    (s) => getSubscriptionRemainingAds(s) > 0,
  );
  if (bestDefault) {
    const remainingAds = getSubscriptionRemainingAds(bestDefault);
    const remainingFeatured = getSubscriptionRemainingFeatured(bestDefault);
    return {
      planType: "DEFAULT",
      subscription: bestDefault,
      remainingAds,
      remainingFeatured,
      shouldFeature: remainingFeatured > 0,
    };
  }

  // No credits available on any matching plan
  return noPlan;
}
