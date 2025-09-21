"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Star } from "lucide-react";
import Link from "next/link";

interface SellerInfoProps {
  adId: string;
}

const SellerInfo: React.FC<SellerInfoProps> = () => {
  // Mock data - replace with actual API call
  const sellerData = {
    name: "Premium Auto Dealer",
    isVerified: true,
    type: "Verified Dealer",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Dubai, UAE",
    memberSince: "2020",
    totalAds: "50+ Cars",
    rating: 4.8,
    totalReviews: 127,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm relative">
      <Link href={"/seller/123"} className="absolute inset-0"></Link>
      <Typography
        variant="h3"
        className="text-lg font-semibold text-dark-blue mb-4"
      >
        Seller Information
      </Typography>

      {/* Seller Profile */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Image
            src={sellerData.avatar}
            alt={sellerData.name}
            width={40}
            height={40}
            className="rounded-full aspect-square object-cover"
          />
        </div>
        <div>
          <Typography
            variant="sm-medium"
            className="font-semibold flex items-center gap-2 text-dark-blue"
          >
            {sellerData.name}
            {sellerData.isVerified && (
              <Image
                src={"/verified-seller.svg"}
                alt="verified"
                width={21}
                height={21}
              />
            )}
          </Typography>
          <Typography variant="sm-regular" className="text-grey-blue">
            {sellerData.type}
          </Typography>
        </div>
      </div>

      {/* Seller Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-blue">Location</span>
          <span className="text-sm text-dark-blue font-medium">
            {sellerData.location}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-blue">Member Since</span>
          <span className="text-sm text-dark-blue font-medium">
            {sellerData.memberSince}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-blue">Total Ads</span>
          <span className="text-sm text-dark-blue font-medium">
            {sellerData.totalAds}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-blue">Rating</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" fill="#FFB319" />
            <span className="text-sm text-dark-blue font-medium">
              {sellerData.rating}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerInfo;
