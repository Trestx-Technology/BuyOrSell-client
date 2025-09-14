"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Star, MapPin, Calendar, Bookmark } from "lucide-react";

interface SellerListingsMobileHeaderProps {
  sellerId: string;
}

export default function SellerListingsMobileHeader({
  sellerId,
}: SellerListingsMobileHeaderProps) {
  // Mock seller data - in real app, this would come from API
  const sellerData = {
    name: "Premium Auto Seller",
    rating: 4.8,
    location: "Dubai, UAE",
    memberSince: "2020",
    isTopRated: true,
    avatar: "/volkswagen.png", // Using existing image from project
    verified: true,
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm -mt-5 relative z-20">
      <div className="flex items-start p-4 gap-4">
        {/* Seller Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-[74px] h-[74px] rounded-full overflow-hidden bg-gray-100">
            <Image
              src={sellerData.avatar}
              alt={sellerData.name}
              width={74}
              height={74}
              className="w-full h-full object-cover"
            />
          </div>
          {sellerData.verified && (
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
                {sellerData.name}
              </Typography>
              {sellerData.verified && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded">
                  <div className="w-3 h-3 bg-purple rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <Typography variant="xs-black-inter" className="text-dark-blue">
                {sellerData.rating}/5
              </Typography>
              <Typography variant="xs-black-inter" className="text-purple ml-1">
                View ratings
              </Typography>
            </div>

            {/* Location and Member Since */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <Typography variant="xs-black-inter" className="text-dark-blue">
                  {sellerData.location}
                </Typography>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <Typography variant="xs-black-inter" className="text-dark-blue">
                  Member since {sellerData.memberSince}
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rated Badge */}
        {sellerData.isTopRated && (
          <div className="flex items-center gap-1 px-3 py-1 bg-purple/10 rounded-lg">
            <Bookmark className="w-3 h-3 text-purple" />
            <Typography
              variant="xs-black-inter"
              className="text-purple font-medium"
            >
              Top Rated
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
