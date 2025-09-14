"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Phone, BookmarkCheck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import Image from "next/image";

interface SellerHeaderProps {
  sellerId: string;
}

const SellerHeader: React.FC<SellerHeaderProps> = () => {
  // Mock data - replace with actual API call
  const sellerData = {
    name: "Premium Auto Dealer",
    avatar: "/volkswagen.png",
    rating: 4.8,
    reviewCount: 127,
    location: "Dubai, UAE",
    memberSince: "2020",
    isVerified: true,
    isTopRated: true,
    bannerImage: "/seller-banner.png",
  };

  const handleCall = () => {
    console.log("Call seller");
  };

  const handleMessage = () => {
    console.log("Send message to seller");
  };

  const handleWhatsApp = () => {
    console.log("WhatsApp seller");
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={i}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 0L12.5 6.5L20 7.5L15 12.5L16.5 20L10 16.5L3.5 20L5 12.5L0 7.5L7.5 6.5L10 0Z"
            fill="#FFC107"
          />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="#FFC107" />
              <stop offset="50%" stopColor="rgba(255, 193, 7, 0.25)" />
            </linearGradient>
          </defs>
          <path
            d="M10 0L12.5 6.5L20 7.5L15 12.5L16.5 20L10 16.5L3.5 20L5 12.5L0 7.5L7.5 6.5L10 0Z"
            fill="url(#halfStar)"
            stroke="#FFC107"
          />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative rounded-t-2xl h-40 overflow-hidden">
        <Image
          src={sellerData.bannerImage}
          alt="Seller banner"
          fill
          className="object-cover"
        />
      </div>

      {/* Main Content Card */}
      <div className="relative bg-white border border-gray-200 shadow-sm p-6 rounded-b-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Seller Info Section */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-30 h-30 rounded-full bg-gray-200 overflow-hidden">
                <Image
                  src={sellerData.avatar}
                  alt={sellerData.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Seller Details */}
            <div className="flex-1 min-w-0">
              {/* Name and Badges */}
              <div className="flex items-center gap-3 mb-4">
                <Typography
                  variant="h2"
                  className="text-xl font-semibold text-dark-blue"
                >
                  {sellerData.name}
                </Typography>

                {/* Verified Badge */}
                {sellerData.isVerified && (
                  <Image
                    src={"/verified-seller.svg"}
                    alt="Verified"
                    width={21}
                    height={21}
                  />
                )}

                {/* Top Rated Badge */}
                {sellerData.isTopRated && (
                  <div className="flex items-center text-sm font-medium h-10 gap-1 px-4 py-1 text-purple bg-purple/10 rounded-lg">
                    <BookmarkCheck size={18} />
                    Top Rated
                  </div>
                )}
              </div>

              {/* Rating, Location, Member Since */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 whitespace-nowrap">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(sellerData.rating)}
                  </div>
                  <Typography variant="body" className="text-sm text-dark-blue">
                    {sellerData.rating} ({sellerData.reviewCount} reviews)
                  </Typography>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="w-4 h-4 text-grey-blue" />
                  <Typography variant="body" className="text-sm text-dark-blue">
                    {sellerData.location}
                  </Typography>
                </div>

                {/* Member Since */}
                <div className="flex items-center gap-1">
                  <MdCalendarToday className="w-4 h-4 text-grey-blue" />
                  <Typography variant="body" className="text-sm text-dark-blue">
                    Member since {sellerData.memberSince}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[280px] lg:max-w-[315px]">
            {/* Call Button */}
            <Button
              onClick={handleCall}
              variant="primary"
              icon={<Phone className="h-5 w-5 fill-white" stroke="0" />}
              iconPosition="center"
              className="w-full"
            >
              Call Seller
            </Button>

            {/* Message and WhatsApp Buttons */}
            <div className="flex gap-3 w-full">
              <Button
                onClick={handleMessage}
                variant="outline"
                icon={
                  <MdMessage className="h-4 w-4 fill-dark-blue" stroke="0" />
                }
                iconPosition="left"
                className="flex-1 border-gray-300 text-dark-blue hover:bg-gray-50 text-sm"
              >
                Message
              </Button>

              {/* WhatsApp Button */}
              <Button
                onClick={handleWhatsApp}
                variant="outline"
                icon={
                  <FaWhatsapp className="h-4 w-4 fill-green-500" stroke="1" />
                }
                iconPosition="left"
                className="flex-1 border-gray-300 text-dark-blue hover:bg-gray-50 text-sm"
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerHeader;
