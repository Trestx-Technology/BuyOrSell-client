import { useMemo, useState, useEffect, useCallback } from "react";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { useGetPlans } from "./usePlans";

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

  const getAvailability = useCallback(
    (type: string, category: string): AdAvailability => {
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
    },
    [activeSubscriptions],
  );

  const plansExistForCategory = useCallback(
    (type: string, category: string): boolean => {
      if (!plansData?.data) return true; // Default to true while loading/error to stay conservative

      const typeLower = type.toLowerCase();
      const categoryLower = category.toLowerCase();

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

      const isPropertyCategory = propertyCategories.includes(categoryLower);
      const isMotorCategory = motorCategories.includes(categoryLower);

      return plansData.data.some((plan) => {
        if (!plan.isActive) return false;
        const planType = (plan.type || "Ads").toLowerCase();
        if (planType !== typeLower) return false;

        // If any active plan for this type has no categories, it covers everything of that type
        if (!plan.categories || plan.categories.length === 0) return true;

        return plan.categories.some((cat) => {
          const catLower = cat.toLowerCase();
          if (catLower === categoryLower) return true;
          if (isPropertyCategory && propertyCategories.includes(catLower))
            return true;
          if (isMotorCategory && motorCategories.includes(catLower))
            return true;
          return false;
        });
      });
    },
    [plansData],
  );

  const checkAvailability = (
    type: string,
    category: string,
    isFeatured: boolean = false,
  ): boolean => {
    // If no plans exist for this category, bypass the check and allow posting
    if (!plansExistForCategory(type, category)) {
      return true;
    }

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
    isLoading: userSubscriptionsLoading || plansLoading,
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
