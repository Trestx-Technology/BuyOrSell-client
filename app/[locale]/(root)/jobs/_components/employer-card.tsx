"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/typography";
import { UI_ICONS } from "@/constants/icons";
import { SaveOrganizationButton } from "./save-organization-button";
import { FollowOrganizationButton } from "./follow-organization-button";

interface EmployerCardProps {
  logo: string;
  name: string;
  category: string;
  followers: number;
  employerId: string;
  isFollowing?: boolean;
  isWishlisted?: boolean;
  href?: string; // Optional custom href for navigation
}

export function EmployerCard({
  logo,
  name,
  category,
  followers,
  employerId,
  isFollowing = false,
  isWishlisted = false,
  href,
}: EmployerCardProps) {
  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className=" w-full sm:w-[240px] rounded-3xl bg-gradient-to-br from-purple-100 to-purple-50 py-2 px-4 shadow-lg relative">
      {/* Header with Logo and Wishlist */}
      <div className="flex items-center justify-between">
        <div className="size-[32px] rounded-full">
          <Image
            src={logo || UI_ICONS.company}
            alt={`${name} logo`}
            width={32}
            height={32}
            className="h-full w-full object-cover rounded-full"
            onError={(e) => {
              // Fallback to company icon if logo fails to load
              const target = e.target as HTMLImageElement;
              if (target.src !== UI_ICONS.company) {
                target.src = UI_ICONS.company;
              }
            }}
          />
        </div>
        <SaveOrganizationButton 
          organizationId={employerId}
          initialIsSaved={isWishlisted}
        />
      </div>

      {/* Company Info */}
      <div className="mb-2">
        <Link href={href || `/jobs/employer/${employerId}`}>
          <Typography
            variant="h3"
            className="text-xl font-bold text-gray-900 hover:text-purple transition-colors cursor-pointer truncate"
          >
            {name}
          </Typography>
        </Link>
        <Typography variant="body-small" className="mb-1 text-gray-700">
          {category}
        </Typography>
        <Typography
          variant="body-small"
          className="text-sm font-medium text-gray-600"
        >
          {formatFollowers(followers)} Followers
        </Typography>
      </div>

      {/* Follow Button Component */}
      <FollowOrganizationButton
        organizationId={employerId}
        initialIsFollowing={isFollowing}
      />
    </div>
  );
}
