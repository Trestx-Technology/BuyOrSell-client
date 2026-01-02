"use client";

import React from "react";
import { CheckCircle2, Star, Share2, Heart } from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Organization } from "@/interfaces/organization.types";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

export interface OrganizationHeaderCardProps {
  organization: Organization;
  onFavorite?: (id: string) => void;
  onFollow?: (id: string) => void;
  isFavorite?: boolean;
  isFollowing?: boolean;
}

export default function OrganizationHeaderCard({
  organization,
  onFavorite,
  onFollow,
  isFavorite = false,
  isFollowing = false,
}: OrganizationHeaderCardProps) {
  const { localePath } = useLocale();
  const displayName = organization.tradeName || organization.legalName;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E2E2] p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          {organization.logoUrl ? (
            <Image
              src={organization.logoUrl}
              alt={displayName}
              width={120}
              height={120}
              className="rounded-2xl object-cover border border-gray-200"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-2xl bg-purple flex items-center justify-center border border-gray-200">
              <span className="text-white text-4xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Company Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Link href={localePath(`/jobs/organization/${organization._id}`)}>
                  <Typography
                    variant="h1"
                    className="text-dark-blue font-bold text-3xl hover:text-purple transition-colors cursor-pointer"
                  >
                    {displayName}
                  </Typography>
                </Link>
                {organization.verified && (
                  <CheckCircle2 className="w-6 h-6 text-purple" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                {organization.type && (
                  <Badge className="bg-[#F5EBFF] text-purple px-3 py-1 rounded-full text-sm font-normal">
                    {organization.type}
                  </Badge>
                )}
                {organization.ratingAvg && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <Typography
                      variant="body-large"
                      className="text-dark-blue font-semibold"
                    >
                      {organization.ratingAvg.toFixed(1)}
                    </Typography>
                    {organization.ratingCount && (
                      <Typography
                        variant="body-small"
                        className="text-[#8A8A8A] text-sm"
                      >
                        ({organization.ratingCount} reviews)
                      </Typography>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {onFollow && (
                <Button
                  onClick={() => onFollow(organization._id)}
                  variant={isFollowing ? "outline" : "primary"}
                  className={
                    isFollowing
                      ? "border-purple text-purple hover:bg-purple/10"
                      : "bg-purple text-white hover:bg-purple/90"
                  }
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
              <div className="flex gap-2">
                {onFavorite && (
                  <Button
                    onClick={() => onFavorite(organization._id)}
                    variant="outline"
                    size="icon"
                    className={
                      isFavorite
                        ? "border-red-500 text-red-500 hover:bg-red-50"
                        : "border-gray-300 hover:bg-gray-50"
                    }
                  >
                    <Heart
                      className={`w-4 h-4 ${isFavorite ? "fill-red-500" : ""}`}
                    />
                  </Button>
                )}
                <Button variant="outline" size="icon" className="border-gray-300 hover:bg-gray-50">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
