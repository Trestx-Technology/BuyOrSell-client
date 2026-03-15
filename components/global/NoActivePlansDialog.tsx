"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";

interface NoActivePlansDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
  categoryType?: string;
  onPay?: () => void;
}

export const NoActivePlansDialog: React.FC<NoActivePlansDialogProps> = ({
  isOpen,
  onClose,
  categoryName,
  categoryType,
  onPay,
}) => {
  const router = useRouter();
  const { locale } = useLocale();

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent className="sm:max-w-md bg-white rounded-2xl p-6">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple/10 mb-6">
            <Crown className="h-8 w-8 text-purple" />
          </div>

          <ResponsiveModalHeader className="p-0">
            <ResponsiveModalTitle className="text-2xl text-center font-bold text-gray-900 mb-3">
              No Active Plan Found
            </ResponsiveModalTitle>
            <ResponsiveModalDescription className="text-gray-500 text-center text-base leading-relaxed">
              You don&apos;t have an active subscription to post in{" "}
              <strong>{categoryName}</strong>. Please select a plan to start
              listing your items.
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
