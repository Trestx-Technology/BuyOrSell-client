"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCw, Star, MoreVertical } from "lucide-react";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { useLocale } from "@/hooks/useLocale";
import { useDeleteAd, useRenewAd, useUpdateAd } from "@/hooks/useAds";
import { useSubscriptionStore } from "@/stores/subscriptionStore";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import { useRouter } from "nextjs-toploader/app";
import { ProductExtraFields, AdLocation } from "@/interfaces/ad";
import { getSpecifications } from "@/utils/normalize-extra-fields";
import { ListingInfo } from "@/components/features/listing-card/listing-info";
import { ListingImageGallery } from "@/components/features/listing-card/listing-image-gallery";
import { Specification } from "@/components/global/specifications-display";
import { cn } from "@/lib/utils";

export interface MyAdCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  location: AdLocation;
  images: string[];
  extraFields?: ProductExtraFields;
  postedTime: string; // Keep for interface compatibility, though might not be used in actions
  views?: number;
  isPremium?: boolean;
  validity?: string;
  className?: string;
  // Handlers
  onFavorite?: (id: string) => void; // Kept for compatibility if passed
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
  isSaved: boolean;
}

const MyAdCard: React.FC<MyAdCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  discount,
  location,
  images,
  extraFields = [],
  views = 0,
  isPremium = false,
  validity,
  className,
  isSaved,
}) => {
  const { t } = useLocale();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [renewDays, setRenewDays] = useState(30);

  const deleteAdMutation = useDeleteAd();
  const updateAdMutation = useUpdateAd();
  const { mutate: renewAd, isPending: isRenewing } = useRenewAd();
  const { canFeatureAd } = useSubscriptionStore();
  const router = useRouter();

  // Check Expiration
  const isExpired = useMemo(() => {
    if (!validity) return false;
    return new Date(validity) < new Date();
  }, [validity]);

  const daysUntilExpiry = useMemo(() => {
    if (!validity) return null;
    const diffTime = new Date(validity).getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [validity]);

  // Dynamically extract specifications from extraFields
  const specifications = useMemo((): Specification[] => {
    const specsFromFields = getSpecifications(extraFields, 4);
    return specsFromFields.map((spec) => ({
      name: spec.name,
      value: spec.value,
      icon: spec.icon,
    }));
  }, [extraFields]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteAdMutation.mutate(id, {
      onSuccess: () => {
        setShowDeleteConfirm(false);
      },
    });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/post-ad/edit/${id}`);
  };

  const handleRenewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRenewDialog(true);
  };

  const handleFeatureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (canFeatureAd()) {
      updateAdMutation.mutate(
        { id, payload: { isFeatured: true } },
        {
          onSuccess: () => {
            toast.success("Ad marked as featured successfully!");
          },
          onError: () => {
            toast.error("Failed to mark ad as featured.");
          },
        },
      );
    } else {
      setShowFeatureDialog(true);
    }
  };

  // Renew mutation handler
  const onRenewSubmit = () => {
    renewAd(
      { id, days: Number(renewDays) },
      {
        onSuccess: () => {
          setShowRenewDialog(false);
        },
      },
    );
  };

  return (
    <>
      <div
        className={cn(
          "w-full rounded-2xl bg-white dark:bg-gray-900 shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer group relative flex flex-col",
          className,
        )}
        // onClick={handleCardClick}
      >
        <Link href={`/ad/${id}`} className="absolute inset-0" />
        <div className="p-0 flex flex-col h-full">
          {/* Image Section */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <ListingImageGallery
              id={id}
              title={title}
              images={images}
              isPremium={isPremium}
              views={views}
              isSaved={isSaved}
              handleShare={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Implement share if needed
              }}
            />
            {isExpired && (
              <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  EXPIRED
                </Badge>
              </div>
            )}
          </div>

          {/* Info Section Using Shared Component */}
          <ListingInfo
            title={title}
            price={price}
            originalPrice={originalPrice}
            discount={discount}
            location={location}
            specifications={specifications}
          />

          {validity && (
            <div className="px-3 pb-3 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Expiry Date:{" "}
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(validity).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {!isExpired &&
                daysUntilExpiry !== null &&
                daysUntilExpiry <= 3 &&
                daysUntilExpiry >= 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-2 py-0 h-5 bg-orange-100 text-orange-700 hover:bg-orange-100 border-none font-medium"
                  >
                    Expiring Soon ({daysUntilExpiry}{" "}
                    {daysUntilExpiry === 1 ? "day" : "days"})
                  </Badge>
                )}
            </div>
          )}

          {/* Actions Footer */}
          {/* Actions Footer */}
          <div className="mt-auto border-t border-gray-100 dark:border-gray-800 p-3 flex items-center gap-2 z-20 relative bg-white dark:bg-gray-900 rounded-b-2xl">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-8 px-2 text-xs"
              onClick={handleEditClick}
              icon={<Pencil className="w-3.5 h-3.5" />}
              iconPosition="left"
            >
              {t.user.profileEdit.editAd}
            </Button>

            {!isExpired && (
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 px-2 text-xs text-yellow-600 border-yellow-200 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
                  isPremium &&
                    "bg-yellow-500 text-white border-yellow-200 hover:bg-yellow-600",
                )}
                onClick={handleFeatureClick}
                disabled={updateAdMutation.isPending || isPremium}
                icon={<Star className="w-3.5 h-3.5" />}
                iconPosition="left"
              >
                {isPremium ? "Featured" : "Feature"}
              </Button>
            )}

            {isExpired && (
              <Button
                size="sm"
                className="h-8 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                onClick={handleRenewClick}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                iconPosition="left"
              >
                Renew
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-gray-500 hover:text-dark-blue dark:hover:text-white"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[9999]">
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t.user.profileEdit.deleteAd}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <WarningConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Ad"
        description="Are you sure you want to delete this Ad? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={deleteAdMutation.isPending}
        confirmVariant="danger"
      />

      {/* Renew Dialog */}
      <ResponsiveDialogDrawer
        open={showRenewDialog}
        onOpenChange={setShowRenewDialog}
        title="Renew Ad"
        description="Extend the validity of your ad. Enter the number of days you want to extend it for."
      >
        <div className="grid gap-4 py-4 px-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="days" className="text-right">
              Days
            </Label>
            <Input
              id="days"
              type="number"
              value={renewDays}
              onChange={(e) => setRenewDays(Number(e.target.value))}
              className="col-span-3"
              min={1}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowRenewDialog(false)}
              disabled={isRenewing}
            >
              Cancel
            </Button>
            <Button onClick={onRenewSubmit} disabled={isRenewing}>
              {isRenewing ? "Renewing..." : "Confirm Renewal"}
            </Button>
          </div>
        </div>
      </ResponsiveDialogDrawer>

      {/* Feature Credit Dialog */}
      <ResponsiveModal
        open={showFeatureDialog}
        onOpenChange={setShowFeatureDialog}
      >
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
                You don&apos;t have enough featured ad credits in your current
                plan.
              </p>
            </div>
            <p className="text-center text-sm text-gray-600">
              Pay <strong>2 AED</strong> to mark this ad as featured
              immediately.
            </p>
          </div>
          <ResponsiveModalFooter>
            <Button
              variant="outline"
              onClick={() => setShowFeatureDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
              onClick={() => {
                // Determine payment flow here
                toast.info("Payment integration coming soon!");
                setShowFeatureDialog(false);
              }}
            >
              Pay 2 AED & Feature
            </Button>
          </ResponsiveModalFooter>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </>
  );
};

export default MyAdCard;
