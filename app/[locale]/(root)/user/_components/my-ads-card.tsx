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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  status: "live" | "rejected" | "created";
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
            {isExpired ? (
              <div className="absolute inset-x-0 top-0 p-2 z-20 flex justify-between items-start pointer-events-none">
                <Badge variant="destructive" className="bg-red-600 text-white border-none shadow-sm">
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
                        <Badge variant="destructive" className="bg-red-500 text-white border-none shadow-sm">
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
          <div className="mt-auto border-t border-gray-100 dark:border-gray-800 p-3.5 flex items-center gap-2.5 z-20 relative bg-white dark:bg-gray-900 rounded-b-2xl">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 h-9 rounded-xl font-semibold text-xs border-none"
              onClick={handleEditClick}
              icon={<Pencil className="w-4 h-4" />}
              iconPosition="left"
            >
              {t.user.profileEdit.editAd}
            </Button>

            {isExpired ? (
              <Button
                variant="success"
                size="sm"
                className="flex-1 h-9 rounded-xl font-bold text-xs shadow-sm hover:shadow-md transition-all"
                onClick={handleRenewClick}
                icon={<RefreshCw className="w-4 h-4" />}
                iconPosition="left"
              >
                Renew
              </Button>
            ) : (
              <Button
                variant={isPremium ? "warning" : "warningOutlined"}
                size="sm"
                className={cn(
                  "flex-1 h-9 rounded-xl font-semibold text-xs transition-all",
                  !isPremium && "border-warning-100 text-warning-100 dark:border-warning-100"
                )}
                onClick={handleFeatureClick}
                disabled={updateAdMutation.isPending || isPremium}
                icon={<Star className={cn("w-4 h-4", isPremium && "fill-current")} />}
                iconPosition="left"
              >
                {isPremium ? "Featured" : "Feature"}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-gray-400 hover:text-dark-blue dark:hover:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[9999] rounded-xl border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden min-w-[140px] p-1">
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

      {/* Renew Dialog */}
      <ResponsiveDialogDrawer
        open={showRenewDialog}
        onOpenChange={setShowRenewDialog}
        title="Renew Ad"
        description="Choose how long you want to extend your ad's validity."
      >
        <div className="grid gap-4 py-4 px-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="days" className="text-right">
              Duration
            </Label>
            <div className="col-span-3">
              <Select
                value={String(renewDays)}
                onValueChange={(val) => setRenewDays(Number(val))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
