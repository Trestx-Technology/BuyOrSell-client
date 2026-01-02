"use client";

import React from "react";
import { MapPin, CheckCircle2, Star } from "lucide-react";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Organization } from "@/interfaces/organization.types";
import { formatDistanceToNow } from "date-fns";

export interface OrganizationListingCardProps {
  organization: Organization;
  isSelected: boolean;
  onClick: () => void;
}

export default function OrganizationListingCard({
  organization,
  isSelected,
  onClick,
}: OrganizationListingCardProps) {
  const postedTime = formatDistanceToNow(new Date(organization.createdAt), {
    addSuffix: true,
  });

  const displayName = organization.tradeName || organization.legalName;
  const location = `${organization.city || ""}${organization.emirate ? `, ${organization.emirate}` : ""}`;

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white w-full max-w-[256px] rounded-2xl cursor-pointer transition-all relative p-4",
        "border shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)] hover:shadow-[0px_2.67px_7.11px_#309689/20]",
        isSelected ? "border-purple border-[1px]" : "border-[#E2E2E2]"
      )}
    >
      <div className="flex flex-col gap-[21.33px]">
        {/* Badge section */}
        <div>
          <Badge className="bg-[#F5EBFF] text-purple px-[7.11px] py-[7.11px] rounded-[24px] text-xs font-normal leading-[1.21]">
            {postedTime}
          </Badge>
        </div>

        {/* Logo + Text section */}
        <div className="flex items-center gap-2 justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Typography
                variant="h3"
                className="text-[#1D2939] font-semibold text-[18px] leading-[1.21] truncate"
              >
                {displayName}
              </Typography>
              {organization.verified && (
                <CheckCircle2 className="w-4 h-4 text-purple flex-shrink-0" />
              )}
            </div>
            {organization.type && (
              <Typography
                variant="body-small"
                className="text-[#1D2939] text-sm font-normal leading-[1.21]"
              >
                {organization.type}
              </Typography>
            )}
          </div>
          {/* Logo */}
          {organization.logoUrl ? (
            <Image
              src={organization.logoUrl}
              alt={displayName}
              width={36}
              height={36}
              className="border rounded-full flex-shrink-0 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Info sections */}
      <div className="flex flex-col gap-2 mt-5">
        {/* Rating */}
        {organization.ratingAvg && (
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <Typography
              variant="body-small"
              className="text-[#1D2939] text-xs font-medium leading-[1.21]"
            >
              {organization.ratingAvg.toFixed(1)}
              {organization.ratingCount && ` (${organization.ratingCount})`}
            </Typography>
          </div>
        )}

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-[#8A8A8A]" />
            <Typography
              variant="body-small"
              className="text-[#1D2939] text-xs font-medium leading-[1.21] truncate"
            >
              {location}
            </Typography>
          </div>
        )}

        {/* Jobs Posted */}
        {organization.totalJobsPosted !== undefined && (
          <div className="flex items-center gap-1.5">
            <Typography
              variant="body-small"
              className="text-[#1D2939] text-xs font-medium leading-[1.21]"
            >
              {organization.totalJobsPosted} Jobs Posted
            </Typography>
          </div>
        )}

        {/* Followers */}
        {organization.followersCount !== undefined && (
          <div className="flex items-center gap-1.5">
            <Typography
              variant="body-small"
              className="text-[#1D2939] text-xs font-medium leading-[1.21]"
            >
              {organization.followersCount} Followers
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
