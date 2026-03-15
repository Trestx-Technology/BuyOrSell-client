"use client";

import React from "react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { ISubscription } from "@/interfaces/subscription.types";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Crown,
  Package,
} from "lucide-react";

interface PlanSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: ISubscription[];
  onSelect: (subscriptionId: string) => void;
  categoryName: string;
  categoryType?: string;
  mode?: "selection";
}

export const PlanSelectionDialog: React.FC<PlanSelectionDialogProps> = ({
  isOpen,
  onClose,
  subscriptions,
  onSelect,
  categoryName,
  categoryType,
  mode = "selection",
}) => {
  const router = useRouter();
  const { locale } = useLocale();

  // Mode: Selection (Default)
  const isOnlyBasic =
    subscriptions.length === 1 &&
    (subscriptions[0].plan?.type?.toLowerCase() === "basic" ||
      subscriptions[0].plan?.isDefault);

  const basicSubscription = isOnlyBasic ? subscriptions[0] : null;

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent className="sm:max-w-md bg-white rounded-2xl p-6">
        {isOnlyBasic ? (
          <div className="flex flex-col items-center text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 mb-6">
              <AlertCircle className="h-8 w-8 text-amber-500" />
            </div>

            <ResponsiveModalHeader className="p-0 ">
              <ResponsiveModalTitle className="text-2xl text-center font-bold text-gray-900 mb-3">
                Paid Plan Recommended
              </ResponsiveModalTitle>
              <ResponsiveModalDescription className="text-gray-500 text-center text-base leading-relaxed">
                Posting an ad in <strong>{categoryName}</strong> usually
                requires a paid plan. However, since you have an active{" "}
                <strong>Basic Plan</strong>, you can continue with it for now.
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>

            <div className="w-full mt-8 flex flex-col gap-3">
              <Button
                className="w-full rounded-xl h-12 text-base font-semibold flex gap-2 items-center justify-center group bg-purple hover:bg-purple/90"
                onClick={() => {
                  onClose();
                  const targetType = categoryType || "Ads";
                  router.push(`/${locale}/plans?type=${targetType}`);
                }}
                icon={
                  <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                }
                iconPosition="right"
              >
                Explore Paid Plans
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl text-base font-medium border-gray-200 hover:bg-gray-50"
                onClick={() =>
                  basicSubscription && onSelect(basicSubscription._id)
                }
              >
                Continue with Basic Plan
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ResponsiveModalHeader>
              <ResponsiveModalTitle className="text-center text-xl font-bold text-gray-900 mt-4 sm:mt-0">
                Choose Posting Plan
              </ResponsiveModalTitle>
              <ResponsiveModalDescription className="text-center text-gray-500 mt-2">
                Select which subscription to use for your ad in{" "}
                <strong>{categoryName}</strong>
              </ResponsiveModalDescription>
            </ResponsiveModalHeader>

            <div className="mt-6 flex flex-col gap-3 max-h-[400px] overflow-y-auto px-1 py-1">
              {subscriptions.map((sub) => {
                const available = (sub.addsAvailable || 0) - (sub.adsUsed || 0);
                const isDefault =
                  sub.plan?.type?.toLowerCase() === "basic" ||
                  sub.plan?.isDefault;

                return (
                  <button
                    key={sub._id}
                    onClick={() => onSelect(sub._id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left group",
                      "border-gray-100 hover:border-purple/50 hover:bg-purple/5",
                      "active:scale-[0.98]",
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "p-2.5 rounded-lg",
                          isDefault
                            ? "bg-gray-100 text-gray-600"
                            : "bg-purple/10 text-purple",
                        )}
                      >
                        {isDefault ? (
                          <Package size={20} />
                        ) : (
                          <Crown size={20} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 group-hover:text-purple transition-colors">
                          {sub.plan?.plan || "Standard Plan"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {available} ads remaining
                        </p>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 className="text-purple w-5 h-5" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pb-6 sm:pb-0">
              <Button
                variant="ghost"
                className="w-full text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
