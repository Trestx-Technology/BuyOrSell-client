"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Typography } from "@/components/typography";
import { UI_ICONS } from "@/constants/icons";

interface EmployerCardProps {
  logo: string;
  name: string;
  category: string;
  followers: number;
  employerId: string;
  onFollow?: () => void;
  onWishlist?: () => void;
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
  onFollow,
  onWishlist,
  isFollowing = false,
  isWishlisted = false,
  href,
}: EmployerCardProps) {
  const [localWishlisted, setLocalWishlisted] = useState(isWishlisted);

  const handleWishlist = () => {
    setLocalWishlisted(!localWishlisted);
    onWishlist?.();
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-purple-100 to-purple-50 py-2 px-4 shadow-lg relative">
      {/* Header with Logo and Wishlist */}
      <div className="flex items-center justify-between">
        <div className="size-[32px] rounded-lg">
          <Image
            src={logo || UI_ICONS.company}
            alt={`${name} logo`}
            width={32}
            height={32}
            className="h-full w-full object-contain rounded-lg"
            onError={(e) => {
              // Fallback to company icon if logo fails to load
              const target = e.target as HTMLImageElement;
              if (target.src !== UI_ICONS.company) {
                target.src = UI_ICONS.company;
              }
            }}
          />
        </div>
        <button
          onClick={handleWishlist}
          className="rounded-full p-2 hover:bg-white/50 transition-colors"
          aria-label="Add to wishlist"
        >
          <Heart
            size={24}
            className={`transition-colors ${
              localWishlisted
                ? "fill-red-500 stroke-red-500"
                : "stroke-gray-800 hover:stroke-red-500"
            }`}
          />
        </button>
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

      {/* Follow Button */}
      <Button
        onClick={onFollow}
        size={"sm"}
        className="w-[96px]  text-xs font-semibold text-white hover:bg-purple-700 transition-colors absolute bottom-3 right-3"
        variant="primary"
      >
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </div>
  );
}
