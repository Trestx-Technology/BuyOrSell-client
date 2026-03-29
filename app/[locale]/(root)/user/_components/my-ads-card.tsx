"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCw, Star, MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { useLocale } from "@/hooks/useLocale";
import { useDeleteAd, useRenewAd, useFeatureAd } from "@/hooks/useAds";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import { RenewAdDialog } from "@/app/[locale]/(root)/user/my-ads/_components/RenewAdDialog";
import { FeatureAdDialog } from "@/app/[locale]/(root)/user/my-ads/_components/FeatureAdDialog";
import { FeatureConfirmDialog } from "@/app/[locale]/(root)/user/my-ads/_components/FeatureConfirmDialog";
import { useAdSubscription } from "@/hooks/useAdSubscription";
import { NoActivePlansDialog } from "@/components/global/NoActivePlansDialog";
import { InsufficientAdsDialog } from "@/components/global/InsufficientAdsDialog";
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
  postedTime: string;
  views?: number;
  isPremium?: boolean;
  validity?: string;
  className?: string;
  // Handlers
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
  isSaved: boolean;
  status: "live" | "rejected" | "created";
  categoryId?: string;
  /** Leaf category name (ad.category.name) */
  categoryName?: string;
  /** Top-level category name — first entry of ad.relatedCategories — used as plan type */
  categoryType?: string;
  adType?: "AD" | "JOB";
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
  status,
  categoryId,
  categoryName,
  categoryType,
  adType,
}) => {
  const { t } = useLocale();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [renewDays, setRenewDays] = useState(30);

  const deleteAdMutation = useDeleteAd();
  const featureAdMutation = useFeatureAd();
  const { mutate: renewAd, isPending: isRenewing } = useRenewAd();
  const { 
    checkAvailability: checkRenewAvailability, 
    dialogProps: renewDialogProps, 
  } = useAdSubscription();

  const { 
    checkAvailability: checkFeaturedAvailability, 
    dialogProps: featureDialogProps, 
  } = useAdSubscription();
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

    // Detect type if missing or generic
    let effectiveType = categoryType;
    if (!effectiveType || effectiveType === "Ads") {
      const name = (categoryName || "").toLowerCase();
      if (name.includes("electronic")) effectiveType = "Electronics";
      else if (name.includes("motor") || name.includes("car"))
        effectiveType = "Motors";
      else if (name.includes("property")) effectiveType = "Properties";
      else if (name.includes("job")) effectiveType = "Jobs";
      else effectiveType = effectiveType || (adType === "JOB" ? "Jobs" : "Ads");
    }

    const effectiveCategory = categoryName || effectiveType || "Ad";
    checkRenewAvailability({
      action: "renew",
      categoryType: effectiveType as string,
      categoryName: effectiveCategory,
      categoryId: categoryId,
    });
  };

  const handleFeatureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Use relatedCategories[0] as the plan type; fall back to adType if not available
    const effectiveType = categoryType || adType || "Ads";
    const effectiveCategory = categoryName || effectiveType;
    checkFeaturedAvailability({
      action: "feature",
      categoryType: effectiveType,
      categoryName: effectiveCategory,
      categoryId: categoryId,
    });
  };

  /** Called when the user confirms featuring using an existing plan credit */
  const handleConfirmFeature = () => {
    const sub = featureDialogProps.matchedSubscription;
    if (!sub) return;
    featureAdMutation.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Ad marked as featured successfully!");
          featureDialogProps.onClose();
        },
        onError: () => {
          toast.error("Failed to mark ad as featured.");
        },
      },
    );
  };

  // Renew mutation handler
  const onRenewSubmit = () => {
    const sub = renewDialogProps.matchedSubscription;
    if (!sub) return;

    renewAd(
      { id, days: Number(renewDays), subscriptionId: sub._id },
      {
        onSuccess: () => {
          renewDialogProps.onClose();
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
            {isExpired ? (
              <div className="absolute inset-x-0 top-0 p-2 z-20 flex justify-between items-start pointer-events-none">
                <Badge
                  variant="destructive"
                  className="bg-red-600 text-white border-none shadow-sm"
                >
                  EXPIRED
                </Badge>
              </div>
            ) : (
              <div className="absolute inset-x-0 top-0 p-2 z-20 flex justify-between items-start pointer-events-none">
                {status === "live" && (
                  <Badge className="bg-green-600 text-white border-none shadow-sm">
                    LIVE
                  </Badge>
                )}
                {status === "created" && (
                  <Badge className="bg-orange-500 text-white border-none shadow-sm">
                    PENDING
                  </Badge>
                )}
                {status === "rejected" && (
                  <Badge
                    variant="destructive"
                    className="bg-red-500 text-white border-none shadow-sm"
                  >
                    REJECTED
                  </Badge>
                )}
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
          <div className="mt-auto border-t border-gray-100 dark:border-gray-800 p-3 flex items-center gap-2 z-20 relative bg-white dark:bg-gray-900 rounded-b-2xl">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 min-w-0 h-9 rounded-xl font-semibold text-[11px] border-none px-2"
              onClick={handleEditClick}
              icon={<Pencil className="w-3.5 h-3.5" />}
            >
              <span className="truncate">{t.user.profileEdit.editAd}</span>
            </Button>

            {isExpired ? (
              <Button
                variant="success"
                size="sm"
                className="flex-1 min-w-0 h-9 rounded-xl font-bold text-[11px] shadow-sm hover:shadow-md transition-all px-2"
                onClick={handleRenewClick}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                <span className="truncate">Renew</span>
              </Button>
            ) : (
              <Button
                variant={isPremium ? "warning" : "warningOutlined"}
                size="sm"
                className={cn(
                  "flex-1 min-w-0 h-9 rounded-xl font-semibold text-[11px] transition-all px-2",
                  !isPremium &&
                    "border-warning-100 text-warning-100 dark:border-warning-100",
                )}
                onClick={handleFeatureClick}
                disabled={featureAdMutation.isPending || isPremium}
                icon={
                  <Star
                    className={cn("w-3.5 h-3.5", isPremium && "fill-current")}
                  />
                }
              >
                <span className="truncate">{isPremium ? "Featured" : "Feature"}</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-gray-400 hover:text-dark-blue dark:hover:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <MoreVertical className="w-4.5 h-4.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="z-[9999] rounded-xl border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden min-w-[140px] p-1"
              >
                <DropdownMenuItem
                  onClick={handleDeleteClick}
                  className="text-red-500 focus:text-white focus:bg-red-500 dark:focus:bg-red-600 cursor-pointer font-semibold rounded-lg p-2.5 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
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

      <RenewAdDialog
        open={renewDialogProps.isOpen && renewDialogProps.mode === "has_credits"}
        onOpenChange={(open) => {
          if (!open) renewDialogProps.onClose();
        }}
        renewDays={renewDays}
        onRenewDaysChange={setRenewDays}
        onConfirm={onRenewSubmit}
        isRenewing={isRenewing}
      />

      {/* Renew Flow Dialogs */}
      <NoActivePlansDialog
        isOpen={renewDialogProps.isOpen && renewDialogProps.mode === "no_plans"}
        onClose={renewDialogProps.onClose}
        categoryName={renewDialogProps.categoryName}
        categoryType={renewDialogProps.categoryType}
      />

      <InsufficientAdsDialog
        isOpen={renewDialogProps.isOpen && renewDialogProps.mode === "insufficient"}
        onClose={renewDialogProps.onClose}
        categoryName={renewDialogProps.categoryName}
        categoryType={renewDialogProps.categoryType}
        type="normal"
      />

      {/* ── Feature Ad Dialogs (2 states) ─────────────────────────────────── */}

      {/* State 2: matching plan exists but no featured credits → Stripe pay flow */}
      <FeatureAdDialog
        open={featureDialogProps.isOpen && featureDialogProps.mode === "insufficient"}
        onOpenChange={(open) => {
          if (!open) featureDialogProps.onClose();
        }}
        adId={id}
      />

      {/* State 3: matching plan with featured credits → free confirmation */}
      <FeatureConfirmDialog
        open={featureDialogProps.isOpen && featureDialogProps.mode === "has_credits"}
        onOpenChange={(open) => {
          if (!open) featureDialogProps.onClose();
        }}
        planName={featureDialogProps.matchedSubscription?.plan?.plan}
        onConfirm={handleConfirmFeature}
        isLoading={featureAdMutation.isPending}
      />

      {/* State 1: No Plans at all for Featured */}
      <NoActivePlansDialog
        isOpen={featureDialogProps.isOpen && featureDialogProps.mode === "no_plans"}
        onClose={featureDialogProps.onClose}
        categoryName={featureDialogProps.categoryName}
        categoryType={featureDialogProps.categoryType}
      />
    </>
  );
};

export default MyAdCard;
