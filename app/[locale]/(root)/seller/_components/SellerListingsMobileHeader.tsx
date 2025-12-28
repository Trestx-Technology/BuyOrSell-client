"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Star, MapPin, Calendar, Bookmark } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { Organization } from "@/interfaces/organization.types";
import { User } from "@/interfaces/user.types";
import { format } from "date-fns";

interface SellerListingsMobileHeaderProps {
  sellerId: string;
  organization?: Organization;
  user?: User;
}

export default function SellerListingsMobileHeader({
  sellerId,
  organization,
  user,
}: SellerListingsMobileHeaderProps) {
  const { t } = useLocale();
  
  const isOrganization = !!organization;
  const sellerName = organization
    ? organization.tradeName || organization.legalName
    : user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Seller"
    : "Seller";
  
  const rating = organization?.ratingAvg || 0;
  const location = organization
    ? `${organization.city || ""}, ${organization.country || "AE"}`.replace(/^,\s*|,\s*$/g, "")
    : "Location not specified";
  const memberSince = organization?.createdAt
    ? format(new Date(organization.createdAt), "yyyy")
    : user?.createdAt
    ? format(new Date(user.createdAt), "yyyy")
    : "N/A";
  const isTopRated = (rating >= 4.5 && (organization?.ratingCount || 0) >= 10) || false;
  const avatar = organization?.logoUrl || user?.image || "/volkswagen.png";
  const verified = organization?.verified || user?.isVerified || false;

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm -mt-5 relative z-20">
      <div className="flex items-start p-4 gap-4">
        {/* Seller Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-[74px] h-[74px] rounded-full overflow-hidden bg-gray-100">
            <Image
              src={avatar}
              alt={sellerName}
              width={74}
              height={74}
              className="w-full h-full object-cover"
            />
          </div>
          {verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-purple rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex-1 min-w-0">
          <div className="space-y-2">
            {/* Name and Verification */}
            <div className="flex items-center gap-2">
              <Typography
                variant="sm-black-inter"
                className="font-semibold text-black"
              >
                {sellerName}
              </Typography>
              {verified && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded">
                  <div className="w-3 h-3 bg-purple rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <Typography variant="xs-black-inter" className="text-dark-blue">
                  {rating.toFixed(1)}/5
                </Typography>
                <Typography variant="xs-black-inter" className="text-purple ml-1">
                  {t.seller.reviews.title}
                </Typography>
              </div>
            )}

            {/* Location and Member Since */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <Typography variant="xs-black-inter" className="text-dark-blue">
                  {location}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <Typography variant="xs-black-inter" className="text-dark-blue">
                  {t.seller.header.memberSince} {memberSince}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Badge */}
        {isTopRated && (
          <div className="flex items-center gap-1 px-3 py-1 bg-purple/10 rounded-lg">
            <Bookmark className="w-3 h-3 text-purple" />
            <Typography
              variant="xs-black-inter"
              className="text-purple font-medium"
            >
              {t.seller.header.topRated}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
