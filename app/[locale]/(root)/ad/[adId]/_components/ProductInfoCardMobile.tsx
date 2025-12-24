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
import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";

interface ProductInfoCardMobileProps {
  ad: AD;
}

const ProductInfoCardMobile: React.FC<ProductInfoCardMobileProps> = ({ ad }) => {
  // Extract location
  const location =
    typeof ad.location === "string"
      ? ad.location
      : ad.location?.city || ad.address?.city || "Location not specified";

  // Format posted time
  const postedTime = formatDistanceToNow(new Date(ad.createdAt), {
    addSuffix: true,
  });

  // Extract extraFields for specifications
  const extraFields = normalizeExtraFieldsToArray(ad.extraFields || []);
  const getFieldValue = (fieldName: string): string => {
    const field = extraFields.find(
      (f) => f.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (field) {
      if (Array.isArray(field.value)) {
        return field.value.join(", ");
      }
      return String(field.value || "");
    }
    return "";
  };

  const year = getFieldValue("year") || "";
  const mileage = getFieldValue("mileage") || getFieldValue("km") || "";
  const fuelType = getFieldValue("fuel") || getFieldValue("fuelType") || "";
  const transmission = getFieldValue("transmission") || "";

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      {/* Header with Title and Premium Badge */}
      <div className="flex items-start justify-between mb-4">
        {ad.title && (
          <div className="flex-1">
            <Typography
              variant="h2"
              className="text-lg font-semibold text-dark-blue mb-1"
            >
              {ad.title}
            </Typography>
          </div>
        )}
        {/* Premium Badge */}
        {ad.isFeatured && (
          <div className="lg:hidden block">
            <Image src={"/premium.svg"} alt="Premium" width={31} height={31} />
          </div>
        )}
      </div>

      {/* Price Section */}
      {ad.price && (
        <div className="flex items-center justify-start gap-2 mb-6">
          <div className="flex items-center gap-1">
            <Image src={ICONS.currency.aed} alt="AED" width={24} height={24} />
            <span className="text-2xl font-bold text-purple-600">
              {formatPrice(ad.price)}
            </span>
          </div>
        </div>
      )}

      {/* Location and Time Row */}
      <div className="flex items-center justify-between mb-4">
        {location && (
          <div className="flex items-center w-full gap-1.5">
            <FaMapMarkerAlt className="size-4" fill="#1D2939" stroke="1" />
            <Typography variant="body-small" className="text-grey-blue text-xs">
              {location}
            </Typography>
          </div>
        )}
        {ad.createdAt && (
          <div className="flex items-center gap-1.5 w-full">
            <GoClockFill className="size-4" fill="#1D2939" stroke="1" />
            <Typography variant="body-small" className="text-grey-blue text-xs">
              {postedTime}
            </Typography>
          </div>
        )}
      </div>

      {/* Divider Line */}
      <div className="border-b border-dashed border-gray-300 mb-4"></div>

      {/* Specifications Grid */}
      {(year || mileage || fuelType || transmission) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {/* Year */}
          {year && (
            <div className="flex items-center gap-1.5">
              <IoCalendarNumber className="h-4 w-4 text-grey-blue" />
              <Typography variant="body-small" className="text-grey-blue text-xs">
                Year:
              </Typography>
              <Typography
                variant="body-small"
                className="text-black text-xs font-medium"
              >
                {year}
              </Typography>
            </div>
          )}

          {/* Mileage */}
          {mileage && (
            <div className="flex items-center gap-1.5">
              <PiGaugeFill className="h-4 w-4 text-green-600" />
              <Typography variant="body-small" className="text-grey-blue text-xs">
                Mileage:
              </Typography>
              <Typography
                variant="body-small"
                className="text-black text-xs font-medium"
              >
                {mileage}
              </Typography>
            </div>
          )}

          {/* Fuel */}
          {fuelType && (
            <div className="flex items-center gap-1.5">
              <BsFuelPumpFill className="h-4 w-4 text-red-600" />
              <Typography variant="body-small" className="text-grey-blue text-xs">
                Fuel:
              </Typography>
              <Typography
                variant="body-small"
                className="text-black text-xs font-medium"
              >
                {fuelType}
              </Typography>
            </div>
          )}

          {/* Transmission */}
          {transmission && (
            <div className="flex items-center gap-1.5">
              <IoIosFlash className="h-4 w-4 text-yellow-600" />
              <Typography variant="body-small" className="text-grey-blue text-xs">
                Transmission:
              </Typography>
              <Typography
                variant="body-small"
                className="text-black text-xs font-medium"
              >
                {transmission}
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductInfoCardMobile;

