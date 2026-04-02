"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Tag, Percent } from "lucide-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { useUpdateAd } from "@/hooks/useAds";
import { useLocale } from "@/hooks/useLocale";
import { DatePicker } from "@/app/[locale]/(root)/organizations/_components/DatePicker";
import { addDays, format } from "date-fns";

interface UpdateDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adId: string;
  adPrice: number;
  initialDeal?: boolean;
  initialDiscountedPercent?: number;
  initialDealValidThru?: string;
  currency?: string;
}

export const UpdateDealDialog: React.FC<UpdateDealDialogProps> = ({
  open,
  onOpenChange,
  adId,
  adPrice,
  initialDeal = false,
  initialDiscountedPercent,
  initialDealValidThru,
  currency = "AED",
}) => {
  const { t } = useLocale();
  const updateAdMutation = useUpdateAd();

  const [dealActive, setDealActive] = useState(initialDeal);
  const [discountedPercent, setDiscountedPercent] = useState<number | "">(
    initialDiscountedPercent || "",
  );
  
  // Default to 30 days from now if not provided
  const getDefaultExpiry = () => format(addDays(new Date(), 30), "yyyy-MM-dd");
  
  const [validThru, setValidThru] = useState(initialDealValidThru || getDefaultExpiry());

  useEffect(() => {
    if (open) {
      setDealActive(initialDeal);
      setDiscountedPercent(initialDiscountedPercent || "");
      setValidThru(initialDealValidThru || getDefaultExpiry());
    }
  }, [open, initialDeal, initialDiscountedPercent, initialDealValidThru]);

  const handleUpdate = async () => {
    if (dealActive) {
      if (
        discountedPercent === "" ||
        Number(discountedPercent) <= 0 ||
        Number(discountedPercent) >= 100
      ) {
        toast.error("Please enter a valid discount percentage (1-99).");
        return;
      }
      if (!validThru) {
        toast.error("Please select a deal expiration date.");
        return;
      }
    }

    try {
      await updateAdMutation.mutateAsync({
        id: adId,
        payload: {
          deal: dealActive,
          discountedPercent: dealActive ? Number(discountedPercent) : undefined,
          dealValidThru: dealActive
            ? new Date(validThru).toISOString()
            : undefined,
        },
      });
      toast.success("Deal updated successfully!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update deal.");
    }
  };

  const calculateDiscountedPrice = () => {
    if (
      discountedPercent === "" ||
      Number(discountedPercent) <= 0 ||
      adPrice <= 0
    )
      return adPrice;
    const discountAmount = (adPrice * Number(discountedPercent)) / 100;
    return Math.round(adPrice - discountAmount);
  };

  // Min and Max dates for the deal
  const minDate = new Date();
  const maxDate = addDays(new Date(), 30);

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent className="max-w-md">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple" />
            Manage Deal Settings
          </ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Boost your sales by offering a limited-time discount on your item.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>

        <div className="p-6 space-y-6">
          {/* Deal Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <div className="space-y-0.5">
              <Label className="text-base font-bold">Activate Deal</Label>
              <p className="text-xs text-gray-500">
                Enable discount for this ad
              </p>
            </div>
            <Checkbox
              checked={dealActive}
              onCheckedChange={(checked) => setDealActive(!!checked)}
            />
          </div>

          {dealActive && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Original Price Display */}
              <div className="flex items-center justify-between text-sm px-1">
                <span className="text-gray-500">Original Price:</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {adPrice} {currency}
                </span>
              </div>

              {/* Discount Percentage Input */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Discount Percentage (%)
                </Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                  <Input
                    type="number"
                    placeholder="Enter percentage (e.g. 20)"
                    className="pl-10 h-11 rounded-xl"
                    value={discountedPercent}
                    min={1}
                    max={99}
                    onChange={(e) =>
                      setDiscountedPercent(
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                  />
                </div>
                {discountedPercent !== "" && Number(discountedPercent) > 0 && (
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/30 flex justify-between items-center mt-2">
                    <span className="text-xs text-green-700 dark:text-green-300">
                      New Selling Price:
                    </span>
                    <span className="font-bold text-green-700 dark:text-green-300">
                      {calculateDiscountedPrice()} {currency}
                    </span>
                  </div>
                )}
              </div>

              {/* Expiration Date Input with DatePicker */}
              <div className="space-y-2">
                <Label className="text-sm font-medium px-1 block">
                  Deal Expires On
                </Label>
                <DatePicker
                  placeholder="Select expiration date"
                  value={validThru}
                  onChange={setValidThru}
                  allowFutureDates={true}
                  minDate={minDate}
                  maxDate={maxDate}
                  className="rounded-xl h-11"
                />
                <p className="text-[10px] text-gray-500 px-1 mt-1">
                  Deals are limited to a maximum of 30 days.
                </p>
              </div>
            </div>
          )}
        </div>

        <ResponsiveModalFooter className="mt-0">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl h-11"
            disabled={updateAdMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            className="flex-1 rounded-xl h-11 bg-purple hover:bg-purple/90 font-bold"
            disabled={updateAdMutation.isPending}
          >
            {updateAdMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Update Deal"
            )}
          </Button>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};
