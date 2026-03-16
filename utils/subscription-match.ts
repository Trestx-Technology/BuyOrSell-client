import { ISubscription } from "@/interfaces/subscription.types";

/**
 * Validates if the given subscription covers the target category type.
 *
 * Rules:
 * 1. Plans with type "basic" or "ads" or marked with `isDefault` are considered wildcards and match everything.
 * 2. Otherwise, the plan's `type` must strictly match the `targetType` (case-insensitive).
 *
 * @param sub - The active subscription object
 * @param targetType - The top-level category type required (e.g. "Electronics", "Motors", "Ads")
 * @returns boolean indicating if the plan covers the type
 */
export function isSubscriptionValidForType(
  sub: ISubscription,
  targetType: string,
): boolean {
  const subType = sub.plan?.type?.toLowerCase();
  const targetLower = targetType.toLowerCase();

  const isWildcard =
    subType === "basic" || subType === "ads" || sub.plan?.isDefault;

  return isWildcard || subType === targetLower;
}
