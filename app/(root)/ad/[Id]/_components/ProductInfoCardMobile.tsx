"use client";

import React from "react";
import { Typography } from "@/components/typography";

import { FaMapMarkerAlt } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
import { IoCalendarNumber } from "react-icons/io5";
import { PiGaugeFill } from "react-icons/pi";
import { BsFuelPumpFill } from "react-icons/bs";
import { IoIosFlash } from "react-icons/io";
import Image from "next/image";
import { ICONS } from "@/constants/icons";

interface ProductInfoCardMobileProps {
  adId: string;
}

const ProductInfoCardMobile: React.FC<ProductInfoCardMobileProps> = () => {
  // Mock data - replace with actual API call
  const productData = {
    title: "BMW 5 Series",
    subtitle: "530i M Sport",
    price: 105452,
    originalPrice: 125000,
    discount: 12,
    currency: "AED",
    location: "Business Bay, Dubai",
    postedTime: "2 hours ago",
    specifications: {
      year: 2023,
      mileage: "35,000 KM",
      fuelType: "Petrol",
      transmission: "Automatic",
    },
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      {/* Header with Title and Favorite Button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Typography
            variant="h2"
            className="text-lg font-semibold text-dark-blue mb-1"
          >
            {productData.title}
          </Typography>
          <Typography variant="body" className="text-sm text-grey-blue">
            {productData.subtitle}
          </Typography>
        </div>
        {/* Favorite Button */}
        <div className="lg:hidden block">
          <Image src={"/premium.svg"} alt="Premium" width={31} height={31} />
        </div>
      </div>

      {/* Price Section */}
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="flex items-center gap-1">
          <Image src={ICONS.currency.aed} alt="AED" width={24} height={24} />
          <span className="text-2xl font-bold text-purple-600">
            {formatPrice(productData.price)}
          </span>
        </div>
        {productData.originalPrice && (
          <span className="text-sm text-grey-blue line-through">
            {formatPrice(productData.originalPrice)}
          </span>
        )}
        {productData.discount && (
          <span className="text-teal text-sm font-semibold">
            {productData.discount}% OFF
          </span>
        )}
      </div>

      {/* Location and Time Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center w-full gap-1.5">
          <FaMapMarkerAlt className="size-4" fill="#1D2939" stroke="1" />
          <Typography variant="body-small" className="text-grey-blue text-xs">
            {productData.location}
          </Typography>
        </div>
        <div className="flex items-center gap-1.5 w-full">
          <GoClockFill className="size-4" fill="#1D2939" stroke="1" />
          <Typography variant="body-small" className="text-grey-blue text-xs">
            {productData.postedTime}
          </Typography>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-b border-dashed border-gray-300 mb-4"></div>

      {/* Specifications Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {/* Year */}
        <div className="flex items-center gap-1.5">
          <IoCalendarNumber className="h-4 w-4 text-grey-blue" />
          <Typography variant="body-small" className="text-grey-blue text-xs">
            Year:
          </Typography>
          <Typography
            variant="body-small"
            className="text-black text-xs font-medium"
          >
            {productData.specifications.year}
          </Typography>
        </div>

        {/* Mileage */}
        <div className="flex items-center gap-1.5">
          <PiGaugeFill className="h-4 w-4 text-green-600" />
          <Typography variant="body-small" className="text-grey-blue text-xs">
            Mileage:
          </Typography>
          <Typography
            variant="body-small"
            className="text-black text-xs font-medium"
          >
            {productData.specifications.mileage}
          </Typography>
        </div>

        {/* Fuel */}
        <div className="flex items-center gap-1.5">
          <BsFuelPumpFill className="h-4 w-4 text-red-600" />
          <Typography variant="body-small" className="text-grey-blue text-xs">
            Fuel:
          </Typography>
          <Typography
            variant="body-small"
            className="text-black text-xs font-medium"
          >
            {productData.specifications.fuelType}
          </Typography>
        </div>

        {/* Transmission */}
        <div className="flex items-center gap-1.5">
          <IoIosFlash className="h-4 w-4 text-yellow-600" />
          <Typography variant="body-small" className="text-grey-blue text-xs">
            Transmission:
          </Typography>
          <Typography
            variant="body-small"
            className="text-black text-xs font-medium"
          >
            {productData.specifications.transmission}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoCardMobile;
