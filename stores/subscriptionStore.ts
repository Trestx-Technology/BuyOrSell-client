import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ISubscription } from "@/interfaces/subscription.types";
import {
  getMySubscription,
  stopRecurringSubscription,
} from "@/app/api/subscription/subscription.services";
import { isSubscriptionValidForType } from "@/utils/subscription-match";
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
  getAvailableFeaturedAdsCount: (type: string, category: string) => number;

  // New Actions
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
            (sub.status === "active" ||
              sub.status === "confirmed" ||
              sub.status === "created"),
        );
      },

      getAvailableFeaturedAdsCount: (type: string, category: string) => {
        const activeSubs = get().getActiveSubscriptions();

        let totalAvailable = 0;

        activeSubs.forEach((sub) => {
          if (isSubscriptionValidForType(sub, type || "Ads")) {
            const available =
              (sub.featuredAdsAvailable || 0) - (sub.featuredAdsUsed || 0);
            if (available > 0) {
              totalAvailable += available;
            }
          }
        });

        return totalAvailable;
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
