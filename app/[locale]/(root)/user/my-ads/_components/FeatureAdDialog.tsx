"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { useCreateAdsCheckout } from "@/hooks/usePayments";
import { useAuthStore } from "@/stores/authStore";

interface FeatureAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The ID of the ad to feature after successful payment */
  adId: string;
}

/** Flat fee in AED cents (Stripe uses smallest currency unit — fils for AED: 1 AED = 100 fils) */
const FEATURE_AD_AMOUNT_FILS = 200; // 2 AED

export const FeatureAdDialog: React.FC<FeatureAdDialogProps> = ({
  open,
  onOpenChange,
  adId,
}) => {
  const { session } = useAuthStore();
  const { mutate: createCheckout, isPending } = useCreateAdsCheckout();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handlePay = () => {
    const userId = session.user?._id;
    const customerEmail = session.user?.email;

    if (!userId || !customerEmail) {
      toast.error("You must be logged in to proceed.");
      return;
    }

    const origin = window.location.origin;
    const locale = window.location.pathname.split("/")[1] || "en";

    // On success, Stripe redirects back with ?session_id={CHECKOUT_SESSION_ID}
    // We also embed the adId so the page knows which ad to feature
    const successUrl = `${origin}/${locale}/user/my-ads?feature_payment=success&featured_ad_id=${adId}&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/${locale}/user/my-ads?feature_payment=cancelled`;

    createCheckout(
      {
        lineItems: [
          {
            name: "Featured Ad (2 AED)",
            amount: FEATURE_AD_AMOUNT_FILS,
            currency: "aed",
            quantity: 1,
          },
        ],
        successUrl,
        cancelUrl,
        type: "ADS",
        typeId: adId,
        userId,
        customerEmail,
        mode: "payment",
      },
      {
        onSuccess: (response) => {
          const checkoutUrl = response.data?.checkoutUrl;
          if (checkoutUrl) {
            setIsRedirecting(true);
            window.location.href = checkoutUrl;
          } else {
            toast.error("Failed to get checkout URL. Please try again.");
          }
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to create payment session. Please try again."
          );
        },
      }
    );
  };

  const isLoading = isPending || isRedirecting;

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Get Featured!</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Boost your ad visibility by marking it as featured.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div className="p-4 space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold text-yellow-900 mb-1">
              Insufficient Credits
            </h3>
            <p className="text-sm text-yellow-700">
              Your current plan for this ad does not have featured ad credits
              available.
            </p>
          </div>
          <p className="text-center text-sm text-gray-600">
            Pay <strong>2 AED</strong> once to mark this ad as featured
            immediately.
          </p>
        </div>
        <ResponsiveModalFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={handlePay}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isRedirecting ? "Redirecting..." : "Creating session..."}
              </>
            ) : (
              "Pay 2 AED & Feature"
            )}
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
