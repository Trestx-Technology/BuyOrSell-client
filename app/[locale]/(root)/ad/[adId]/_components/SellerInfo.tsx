"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Star, CircleUser, Building2 } from "lucide-react";
import Link from "next/link";
import { AD } from "@/interfaces/ad";
import { format } from "date-fns";
import { useLocale } from "@/hooks/useLocale";

interface SellerInfoProps {
  ad: AD;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ ad }) => {
  const { t } = useLocale();

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm relative">
      {sellerId && (
        <Link href={`/seller/${sellerId}`} className="absolute inset-0"></Link>
      )}
      <Typography
        variant="h3"
        className="text-lg font-semibold text-dark-blue mb-4"
      >
        {t.ad.sellerInfo.title}
      </Typography>

      {/* Seller Profile */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
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
            className="font-semibold flex items-center gap-2 text-dark-blue"
          >
            {sellerName}
            {isVerified && (
              <Image
                src={"/verified-seller.svg"}
                alt="verified"
                width={21}
                height={21}
              />
            )}
          </Typography>
          <Typography variant="sm-regular" className="text-grey-blue">
            {sellerType}
          </Typography>
        </div>
      </div>

      {/* Seller Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-blue">
            {t.ad.sellerInfo.location}
          </span>
          <span className="text-sm text-dark-blue font-medium">{location}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-blue">
            {t.ad.sellerInfo.memberSince}
          </span>
          <span className="text-sm text-dark-blue font-medium">
            {memberSince}
          </span>
        </div>

        {rating > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-grey-blue">
              {t.ad.sellerInfo.rating}
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" fill="#FFB319" />
              <span className="text-sm text-dark-blue font-medium">
                {rating.toFixed(1)}/5
              </span>
              {totalReviews > 0 && (
                <span className="text-xs text-grey-blue ml-1">
                  ({totalReviews})
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerInfo;
