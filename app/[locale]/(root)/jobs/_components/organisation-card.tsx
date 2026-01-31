"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/typography";
import { UI_ICONS } from "@/constants/icons";
import { SaveOrganizationButton } from "./save-organization-button";
import { FollowOrganizationButton } from "./follow-organization-button";
import { useState } from "react";

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
  const [imgError, setImgError] = useState(false);

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "O";

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="w-[240px] rounded-3xl bg-gradient-to-br from-purple-100 to-purple-50 py-2 px-4 shadow-lg relative">
      {/* Header with Logo and Wishlist */}
      <div className="flex items-center justify-between">
        <div className="size-[32px] rounded-full flex items-center justify-center bg-white overflow-hidden border border-purple/10 shadow-sm">
          {logo && !imgError ? (
            <Image
              src={logo}
              alt={`${name} logo`}
              width={32}
              height={32}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-purple font-bold text-xs">{initials}</span>
          )}
        </div>
        <SaveOrganizationButton
          organizationId={employerId}
          initialIsSaved={isWishlisted}
        />
      </div>

      {/* Company Info */}
      <div className="mb-2">
        <Link href={href || `/organizations/${employerId}`}>
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
        className="shrink-0 mb-1 shadow-sm absolute bottom-2 right-2"
      />
    </div>
  );
}
