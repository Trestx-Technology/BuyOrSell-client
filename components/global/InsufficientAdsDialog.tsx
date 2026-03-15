"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
      ResponsiveModal,
      ResponsiveModalContent,
      ResponsiveModalDescription,
      ResponsiveModalHeader,
      ResponsiveModalTitle,
      ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface InsufficientAdsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "normal" | "featured";
  categoryType?: string;
  categoryName?: string;
  onPay?: () => void;
}

export const InsufficientAdsDialog: React.FC<InsufficientAdsDialogProps> = ({
  isOpen,
  onClose,
  type = "normal",
  categoryType,
  categoryName,
  onPay,
}) => {
  const router = useRouter();
  const { locale } = useLocale();

  const title = type === "featured" ? "Out of Featured Ads" : "Insufficient Ad Credits";
  const getDescription = () => {
    if (type === "featured") {
      return `You have used all your available featured ads for ${categoryName || "this category"}. Upgrade your plan or purchase more credits to continue highlighting your listings.`;
    }
    return `You have an active plan for ${categoryName || "this category"}, but you have reached your posting limit. Please upgrade or renew your plan to continue listing.`;
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent className="sm:max-w-md bg-white rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          <ResponsiveModalHeader className="p-0">
            <ResponsiveModalTitle className="text-2xl text-center font-bold text-gray-900 mb-3">
              {title}
            </ResponsiveModalTitle>
            <ResponsiveModalDescription className="text-gray-500 text-center text-base leading-relaxed">
              {getDescription()}
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
              Explore Plans
            </Button>

            {onPay && (
              <Button
                variant="outline"
                className="w-full rounded-xl h-12 text-base font-semibold border-purple text-purple hover:bg-purple/5"
                onClick={onPay}
              >
                Pay 2 AED & Continue
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
