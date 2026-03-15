"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";

interface FeatureConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Name of the subscription plan that has available featured credits */
  planName?: string;
  /** Called when the user confirms — caller should fire the updateAd mutation */
  onConfirm: () => void;
  isLoading?: boolean;
}

export const FeatureConfirmDialog: React.FC<FeatureConfirmDialogProps> = ({
  open,
  onOpenChange,
  planName,
  onConfirm,
  isLoading,
}) => {
  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Mark as Featured?</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            This will use one featured ad credit from your{" "}
            {planName ? <strong>{planName}</strong> : "active"} plan.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div className="p-4">
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2 fill-yellow-200" />
            <p className="text-sm text-yellow-800">
              Your ad will appear highlighted at the top of search results.
            </p>
          </div>
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
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Featuring..." : "Confirm & Feature"}
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
