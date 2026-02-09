import { useGetMySubscription } from "./useSubscriptions";
import { useMemo, useState } from "react";

export interface AdAvailability {
  normalAvailable: number;
  featuredAvailable: number;
  canPost: boolean;
  canFeature: boolean;
}

export const useAdAvailability = () => {
  const { data: subscriptionsData, isLoading } = useGetMySubscription();
  const subscriptions = subscriptionsData?.data || [];

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "normal" | "featured";
  }>({
    isOpen: false,
    type: "normal",
  });

  const activeSubscriptions = useMemo(() => {
    return subscriptions.filter(
      (sub) =>
        sub.isActive &&
        (sub.status === "active" || (sub.status as string) === "confirmed"),
    );
  }, [subscriptions]);

  const getAvailability = (type: string, category: string): AdAvailability => {
    let normalAvailableTotal = 0;
    let featuredAvailableTotal = 0;

    activeSubscriptions.forEach((sub) => {
      const subType = sub.plan?.type?.toLowerCase();
      const targetType = type?.toLowerCase();

      if (subType === targetType) {
        const coversCategory =
          !sub.plan.categories ||
          sub.plan.categories.length === 0 ||
          sub.plan.categories.some(
            (cat) => cat.toLowerCase() === category.toLowerCase(),
          );

        if (coversCategory) {
          const available = (sub.addsAvailable || 0) - (sub.adsUsed || 0);
          const featured =
            (sub.featuredAdsAvailable || 0) - (sub.featuredAdsUsed || 0);

          normalAvailableTotal += Math.max(0, available);
          featuredAvailableTotal += Math.max(0, featured);
        }
      }
    });

    return {
      normalAvailable: normalAvailableTotal,
      featuredAvailable: featuredAvailableTotal,
      canPost: normalAvailableTotal > 0,
      canFeature: featuredAvailableTotal > 0,
    };
  };

  const checkAvailability = (
    type: string,
    category: string,
    isFeatured: boolean = false,
  ): boolean => {
    const availability = getAvailability(type, category);
    if (isFeatured && !availability.canFeature) {
      setDialogState({ isOpen: true, type: "featured" });
      return false;
    }
    if (!isFeatured && !availability.canPost) {
      setDialogState({ isOpen: true, type: "normal" });
      return false;
    }
    return true;
  };

  return {
    getAvailability,
    checkAvailability,
    isLoading,
    activeSubscriptions,
    hasActiveSubscription: activeSubscriptions.length > 0,
    dialogProps: {
      isOpen: dialogState.isOpen,
      type: dialogState.type,
      onClose: () => setDialogState((prev) => ({ ...prev, isOpen: false })),
    },
  };
};
