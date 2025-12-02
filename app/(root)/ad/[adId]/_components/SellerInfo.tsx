"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@/components/typography";
import { Star } from "lucide-react";
import Link from "next/link";
import { AD } from "@/interfaces/ad";
import { format } from "date-fns";

interface SellerInfoProps {
  ad: AD;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ ad }) => {
  // Extract seller data from ad
  const sellerName = ad.organization?.tradeName || 
                     ad.organization?.legalName || 
                     (ad.owner?.firstName && ad.owner?.lastName
                       ? `${ad.owner.firstName} ${ad.owner.lastName}`
                       : "Seller");
  
  const isVerified = ad.organization?.verified || false;
  const sellerType = ad.organization ? "Verified Dealer" : "Private Seller";
  
  const avatar = ad.organization?.logoUrl || 
                 ad.owner?.image ||
                 "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  
  const location = typeof ad.location === "string"
    ? ad.location
    : ad.location?.city || ad.address?.city || "Location not specified";
  
  const memberSince = ad.owner?.createdAt 
    ? format(new Date(ad.owner.createdAt), "yyyy")
    : ad.organization?.createdAt
    ? format(new Date(ad.organization.createdAt), "yyyy")
    : "N/A";
  
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
        Seller Information
      </Typography>

      {/* Seller Profile */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Image
            src={avatar}
            alt={sellerName}
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
          <span className="text-sm text-grey-blue">Location</span>
          <span className="text-sm text-dark-blue font-medium">
            {location}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-blue">Member Since</span>
          <span className="text-sm text-dark-blue font-medium">
            {memberSince}
          </span>
        </div>

        {rating > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-blue">Rating</span>
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
