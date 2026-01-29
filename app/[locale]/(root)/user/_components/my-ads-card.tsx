"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCw } from "lucide-react";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { useLocale } from "@/hooks/useLocale";
import { useDeleteAd, useRenewAd } from "@/hooks/useAds";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import { useRouter } from "nextjs-toploader/app";
import { ProductExtraFields } from "@/interfaces/ad";
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
  location: string;
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
  isSaved
}) => {
  const { t } = useLocale();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [renewDays, setRenewDays] = useState(30);

  const deleteAdMutation = useDeleteAd();
  const { mutate: renewAd, isPending: isRenewing } = useRenewAd();
  const router = useRouter();

  // Check Expiration
  const isExpired = useMemo(() => {
    if (!validity) return false;
    return new Date(validity) < new Date();
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

  // Renew mutation handler
  const onRenewSubmit = () => {
    renewAd(
      { id, days: Number(renewDays) },
      {
        onSuccess: () => {
          setShowRenewDialog(false);
        },
      }
    );
  };

  return (
    <>
      <div
        className={cn(
          "w-full overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer group relative flex flex-col",
          className
        )}
        // onClick={handleCardClick}
      >
        <Link href={`/ad/${id}`} className="absolute inset-0" />
        <div className="p-0 flex flex-col h-full">
          {/* Image Section */}
          <div className="relative">
            <ListingImageGallery
              id={id}
              title={title}
              images={images}
              isPremium={isPremium}
              views={views}
              isSaved={isSaved}
              onToggleSave={() => { }}
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

          {/* Actions Footer */}
          <div className="mt-auto border-t border-gray-100 p-3 flex items-center justify-between gap-2 z-20 relative bg-white">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs"
            onClick={handleEditClick}
            >
            {t.user.profileEdit.editAd}
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="h-8 px-2 text-xs bg-red-50 text-red-600 hover:bg-red-100 border-red-100"
              onClick={handleDeleteClick}
              disabled={deleteAdMutation.isPending}
            >
              {t.user.profileEdit.deleteAd}
          </Button>
            {/* Renew Action - Show if expired or valid */}
            {isExpired && <Button
              size="sm"
              className={cn(
                "h-8 px-2 text-xs",
                isExpired
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
              onClick={handleRenewClick}

            >
              Renew
            </Button>}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <WarningConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Ad"
        description="Are you sure you want to delete this ad? This action cannot be undone."
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
    </>
  );
};

export default MyAdCard;
