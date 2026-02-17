import { useMemo, useState, useEffect } from "react";
import { useSubscriptionStore } from "@/stores/subscriptionStore";

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
    isLoading,
    getActiveSubscriptions,
  } = useSubscriptionStore();

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    type: "normal" | "featured";
    categoryType?: string;
  }>({
    isOpen: false,
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

  const getAvailability = (type: string, category: string): AdAvailability => {
    let normalAvailableTotal = 0;
    let featuredAvailableTotal = 0;

    const propertyCategories = [
      "property for sale",
      "property for rent",
      "properties",
      "properties for sale",
      "properties for rent",
      "real estate",
    ];
    const motorCategories = [
      "motors",
      "motor",
      "cars",
      "vehicles",
      "auto",
      "motorcycles",
    ];
    const isPropertyCategory = propertyCategories.includes(
      category.toLowerCase(),
    );
    const isMotorCategory = motorCategories.includes(category.toLowerCase());

    activeSubscriptions.forEach((sub) => {
      const subType = sub.plan?.type?.toLowerCase();
      const targetType = type?.toLowerCase();

      if (subType === targetType) {
        const coversCategory =
          !sub.plan.categories ||
          sub.plan.categories.length === 0 ||
          sub.plan.categories.some((cat) => {
            const catLower = cat.toLowerCase();
            if (catLower === category.toLowerCase()) return true;

            // If user has a "Properties" plan, it covers sub-property categories
            if (isPropertyCategory && propertyCategories.includes(catLower))
              return true;

            // If user has a "Motors" plan, it covers sub-motor categories
            if (isMotorCategory && motorCategories.includes(catLower))
              return true;

            return false;
          });

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
      setDialogState({ isOpen: true, type: "featured", categoryType: type });
      return false;
    }
    if (!isFeatured && !availability.canPost) {
      setDialogState({ isOpen: true, type: "normal", categoryType: type });
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
      categoryType: dialogState.categoryType,
      onClose: () => setDialogState((prev) => ({ ...prev, isOpen: false })),
    },
  };
};
