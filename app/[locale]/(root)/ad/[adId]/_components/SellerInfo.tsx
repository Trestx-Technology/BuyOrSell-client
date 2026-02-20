"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Star, CircleUser, Building2 } from "lucide-react";
import Link from "next/link";
import { AD } from "@/interfaces/ad";
import { format } from "date-fns";
import { useLocale } from "@/hooks/useLocale";
import { ICONS } from "@/constants/icons";
import { toast } from "sonner";

interface SellerInfoProps {
  ad: AD;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ ad }) => {
  const { t, localePath } = useLocale();

  // Extract seller data from ad
  const sellerName =
    ad.organization?.tradeName ||
    ad.organization?.legalName ||
    (ad.owner?.firstName && ad.owner?.lastName
      ? `${ad.owner.firstName} ${ad.owner.lastName}`
      : "Seller");

  const isVerified = ad.organization?.verified || false;
  const sellerType = ad.organization
    ? t.ad.sellerInfo.verifiedDealer
    : t.ad.sellerInfo.privateSeller;

  const avatarUrl = ad.organization?.logoUrl || ad.owner?.image || null;
  const hasAvatar = !!avatarUrl;
  const isOrganization = !!ad.organization;

  const location =
    typeof ad.location === "string"
      ? ad.location
      : ad.location?.city ||
        ad.address?.city ||
        t.ad.sellerInfo.locationNotSpecified;

  const memberSince = ad.owner?.createdAt
    ? format(new Date(ad.owner.createdAt), "yyyy")
    : ad.organization?.createdAt
    ? format(new Date(ad.organization.createdAt), "yyyy")
    : t.ad.sellerInfo.notAvailable;

  const rating = ad.organization?.ratingAvg || 0;
  const totalReviews = ad.organization?.ratingCount || 0;

  const sellerId = ad.organization?._id || ad.owner?._id || "";

  // Determine the correct seller route based on seller type
  const sellerRoute = isOrganization && ad.organization?.type === "company" ? `/organizations/${ad.organization._id}` : `/seller/org/${sellerId}`


  return (
    <Link
      onClick={() => {
        if (!isOrganization) {
          toast.info("This Ad is posted by a Private Seller");
        }
      }}
      href={isOrganization ? localePath(sellerRoute) : "#"}
      className="bg-white dark:bg-slate-900 group rounded-xl border border-gray-200 dark:border-slate-800 p-4 shadow-sm relative block w-full"
    >
      <Typography
        variant="h3"
        className="text-lg font-semibold text-dark-blue dark:text-gray-100 mb-4"
      >
        {t.ad.sellerInfo.title}
      </Typography>

      {/* Seller Profile */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
          {hasAvatar ? (
            <Image
              src={avatarUrl}
              alt={sellerName}
              width={40}
              height={40}
              className="rounded-full aspect-square object-cover"
            />
          ) : isOrganization ? (
            <Building2 size={24} className="text-purple-600" />
          ) : (
            <CircleUser size={24} className="text-purple-600" />
          )}
        </div>
        <div>
          <Typography
            variant="sm-medium"
            className="font-semibold flex items-center gap-2 text-dark-blue dark:text-gray-100"
          >
            {sellerName}
            {isVerified && (
              <Image
                src={ICONS.auth.verified}
                alt="verified"
                width={21}
                height={21}
              />
            )}
          </Typography>
          <Typography variant="sm-regular" className="text-grey-blue dark:text-gray-400">
            {sellerType}
          </Typography>
        </div>
      </div>

      {/* Seller Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Typography variant="sm-regular" className="text-grey-blue dark:text-gray-400">
            {t.ad.sellerInfo.location}
          </Typography>
          <Typography variant="sm-medium" className="text-dark-blue dark:text-gray-100">
            {location}
          </Typography>
        </div>

        <div className="flex items-center justify-between">
          <Typography variant="sm-regular" className="text-grey-blue dark:text-gray-400">
            {t.ad.sellerInfo.memberSince}
          </Typography>
          <Typography variant="sm-medium" className="text-dark-blue dark:text-gray-100">
            {memberSince}
          </Typography>
        </div>

        {rating > 0 && (
          <div className="flex items-center justify-between">
            <Typography variant="sm-regular" className="text-grey-blue dark:text-gray-400">
              {t.ad.sellerInfo.rating}
            </Typography>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" fill="#FFB319" />
              <Typography variant="sm-medium" className="text-dark-blue dark:text-gray-100">
                {rating.toFixed(1)}/5
              </Typography>
              {totalReviews > 0 && (
                <Typography variant="body-small" className="text-xs text-grey-blue dark:text-gray-400 ml-1">
                  ({totalReviews})
                </Typography>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SellerInfo;
