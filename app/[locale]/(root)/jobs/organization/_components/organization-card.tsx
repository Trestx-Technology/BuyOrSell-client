"use client";

import { MapPin, CheckCircle2, Star, Share2, Heart } from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Organization } from "@/interfaces/organization.types";
import { formatDistanceToNow } from "date-fns";
import { useLocale } from "@/hooks/useLocale";

export interface OrganizationCardProps {
  organization: Organization;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
}

export default function OrganizationCard({
  organization,
  isFavorite = false,
  onFavorite,
  onShare,
}: OrganizationCardProps) {
  const { localePath } = useLocale();
  const postedTime = formatDistanceToNow(new Date(organization.createdAt), {
    addSuffix: true,
  });

  const displayName = organization.tradeName || organization.legalName;
  const location = `${organization.city || ""}${
    organization.emirate ? `, ${organization.emirate}` : ""
  }`;

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-4 shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)] w-full max-w-[256px] space-y-4 relative">
      {/* Header with Badge and Actions */}
      <div className="flex flex-col gap-[21.33px]">
        <div className="flex justify-between items-start">
          <Badge className="bg-purple/10 text-purple px-2 py-1.5 rounded-[24px] text-xs font-normal capitalize">
            {postedTime}
          </Badge>
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={() => onShare(organization._id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Share2 className="w-5 h-5 text-dark-blue" />
              </button>
            )}
            {onFavorite && (
              <button
                onClick={() => onFavorite(organization._id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-dark-blue"
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Organization Info */}
        <div className="flex items-start gap-[17.78px]">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-1">
              <Link href={localePath(`/jobs/organization/${organization._id}`)}>
                <Typography
                  variant="h3"
                  className="text-black font-bold text-lg leading-tight line-clamp-2 hover:text-purple transition-colors cursor-pointer"
                >
                  {displayName}
                </Typography>
              </Link>
              {organization.verified && (
                <CheckCircle2 className="w-4 h-4 text-purple flex-shrink-0" />
              )}
            </div>
            {organization.type && (
              <Typography
                variant="body-small"
                className="text-black text-sm line-clamp-2"
              >
                {organization.type}
              </Typography>
            )}
          </div>
          {organization.logoUrl ? (
            <Image
              src={organization.logoUrl}
              alt={displayName}
              width={32}
              height={32}
              className="rounded-full object-cover flex-shrink-0"
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

      {/* Organization Details */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            {organization.ratingAvg
              ? organization.ratingAvg.toFixed(1)
              : "Not Rated Yet"}{" "}
            ({organization.ratingCount})
          </Typography>
        </div>
        {location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-grey-blue" />
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium line-clamp-1"
            >
              {location}
            </Typography>
          </div>
        )}
        {organization.totalJobsPosted !== undefined && (
          <div className="flex items-center gap-1.5">
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium"
            >
              {organization.totalJobsPosted} Jobs Posted
            </Typography>
          </div>
        )}
        {organization.followersCount !== undefined && (
          <div className="flex items-center gap-1.5">
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium"
            >
              {organization.followersCount} Followers
            </Typography>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Link
        className="w-full block uppercase font-medium text-xs bg-purple text-white rounded-lg py-2 px-4 text-center hover:scale-105 transition-all duration-300"
        href={localePath(`/jobs/organization/${organization._id}`)}
      >
        View Profile
      </Link>
    </div>
  );
}
