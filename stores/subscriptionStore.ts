import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ISubscription } from "@/interfaces/subscription.types";
import {
  getMySubscription,
  incrementAiUsage,
  stopRecurringSubscription,
} from "@/app/api/subscription/subscription.services";
import { toast } from "sonner";

interface SubscriptionState {
  subscriptions: ISubscription[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSubscriptions: () => Promise<void>;
  setSubscriptions: (subscriptions: ISubscription[]) => void;
  clearSubscriptions: () => void;

  // Helpers
  getActiveSubscriptions: () => ISubscription[];
  hasSubscriptionForCategory: (type: string, category: string) => boolean;
  canUseAi: () => boolean;
  canFeatureAd: () => boolean;

  // New Actions
  useAi: () => Promise<boolean>;
  cancelSubscription: (id: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      isLoading: false,
      error: null,

      fetchSubscriptions: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await getMySubscription();
          set({ subscriptions: response.data, isLoading: false });
        } catch (error: any) {
          set({
            error: error.message || "Failed to fetch subscriptions",
            isLoading: false,
          });
        }
      },

      setSubscriptions: (subscriptions) => set({ subscriptions }),

      clearSubscriptions: () => set({ subscriptions: [], error: null }),

      getActiveSubscriptions: () => {
        return get().subscriptions.filter(
          (sub) =>
            sub.isActive &&
            (sub.status === "active" || sub.status === "confirmed"),
        );
      },

      hasSubscriptionForCategory: (type: string, category: string) => {
        const activeSubs = get().getActiveSubscriptions();

        // Handle "Property for Sale" / "Property for Rent" inside "Properties" logic
        const propertyCategories = [
          "property for sale",
          "property for rent",
          "properties",
        ];
        const isPropertyCategory = propertyCategories.includes(
          category.toLowerCase(),
        );

        return activeSubs.some((sub) => {
          const subType = sub.plan?.type?.toLowerCase();
          const targetType = type?.toLowerCase();

          if (subType !== targetType) return false;

          // If no categories specified in plan, it covers all categories of that type
          if (!sub.plan.categories || sub.plan.categories.length === 0)
            return true;

          // Check if category matches
          const matchesDirectly = sub.plan.categories.some(
            (cat) => cat.toLowerCase() === category.toLowerCase(),
          );

          if (matchesDirectly) return true;

          // Special logic for Properties
          if (isPropertyCategory) {
            const hasPropertiesPlan = sub.plan.categories.some(
              (cat) => cat.toLowerCase() === "properties",
            );
            if (hasPropertiesPlan) return true;
          }

          return false;
        });
      },

      canUseAi: () => {
        const activeSubs = get().getActiveSubscriptions();
        // Check if any active subscription has AI available
        return activeSubs.some((sub) => {
          const available = (sub.aiAvailable || 0) - (sub.numberOfAiUsed || 0);
          return available > 0;
        });
      },

      canFeatureAd: () => {
        const activeSubs = get().getActiveSubscriptions();
        // Check if any active subscription has featured ads available
        return activeSubs.some((sub) => {
          const available =
            (sub.featuredAdsAvailable || 0) - (sub.featuredAdsUsed || 0);
          return available > 0;
        });
      },

      useAi: async () => {
        const activeSubs = get().getActiveSubscriptions();
        // Find first subscription with AI credits
        const subWithAi = activeSubs.find((sub) => {
          const available = (sub.aiAvailable || 0) - (sub.numberOfAiUsed || 0);
          return available > 0;
        });

        if (!subWithAi) {
          toast.error("No AI credits available. Please upgrade your plan.");
          return false;
        }

        try {
          await incrementAiUsage(subWithAi._id);

          // Update local state to reflect incremented usage
          set((state) => ({
            subscriptions: state.subscriptions.map((s) =>
              s._id === subWithAi._id
                ? { ...s, numberOfAiUsed: (s.numberOfAiUsed || 0) + 1 }
                : s,
            ),
          }));

          return true;
        } catch (error: any) {
          toast.error(error.message || "Failed to process AI usage");
          return false;
        }
      },

      cancelSubscription: async (id: string) => {
        try {
          await stopRecurringSubscription(id);

          // Update local state
          set((state) => ({
            subscriptions: state.subscriptions.map((s) =>
              s._id === id ? { ...s, cancelAtPeriodEnd: true } : s,
            ),
          }));

          toast.success("Auto-renewal cancelled successfully");
        } catch (error: any) {
          toast.error(error.message || "Failed to cancel subscription");
          throw error;
        }
      },
    }),
    {
      name: "subscription-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
