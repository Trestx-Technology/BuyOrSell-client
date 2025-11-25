"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Gauge,
  Zap,
  Fuel,
  ImageIcon,
  CircleUser,
  Clock,
} from "lucide-react";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";
import { ProductExtraFields } from "@/interfaces/ad";

export interface HorizontalListingCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  location: string;
  images: string[];
  extraFields: ProductExtraFields;
  postedTime: string;
  views?: number;
  isPremium?: boolean;
  isFavorite?: boolean;
  // Discount and timer props
  discountText?: string;
  discountBadgeBg?: string;
  discountBadgeTextColor?: string;
  showDiscountBadge?: boolean;
  showTimer?: boolean;
  timerBg?: string;
  timerTextColor?: string;
  endTime?: Date;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

const HorizontalListingCard: React.FC<HorizontalListingCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  discount,
  currency = "AED",
  location,
  images,
  extraFields,
  postedTime,
  views = 0,
  isPremium = false,
  isFavorite = false,
  // Discount and timer props
  discountText,
  discountBadgeBg = "bg-red-500",
  discountBadgeTextColor = "text-white",
  showDiscountBadge = false,
  showTimer = false,
  timerBg = "bg-black",
  timerTextColor = "text-white",
  endTime,
  onFavorite,
  onShare,
  onClick,
  className,
}) => {
  // Ensure extraFields exists
  const safeExtraFields = extraFields || {};

  // Helper function to get field value from extraFields
  const getFieldValue = (fieldName: string): string | number | undefined => {
    if (!safeExtraFields) return undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (safeExtraFields as Record<string, any>)[fieldName];
    if (value === undefined || value === null) return undefined;
    if (typeof value === "string" || typeof value === "number") return value;
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  // Extract commonly used fields - try multiple field name variations
  const transmission = getFieldValue("Transmission Type") || getFieldValue("transmission") || getFieldValue("Transmission");
  const fuelType = getFieldValue("Fule Type") || getFieldValue("Fuel Type") || getFieldValue("fuelType") || getFieldValue("fuel");
  const mileage = getFieldValue("Mileage") || getFieldValue("mileage");
  const year = getFieldValue("Year") || getFieldValue("year");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  // Timer countdown effect
  useEffect(() => {
    if (!showTimer || !endTime) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = endTime.getTime() - now;

      if (distance < 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [showTimer, endTime]);

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(id);
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      role="button"
      className={`overflow-hidden rounded-2xl border border-purple-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex h-[157px]">
        {/* Image Section - Left Side */}
        <div className="relative w-full max-w-[226px] h-full flex-shrink-0">
          {images.length > 0 ? (
            <div className="relative w-full h-full overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                }}
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="w-full h-full flex-shrink-0 relative"
                  >
                    <Image
                      src={image}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mb-1 mx-auto">
                  <span className="text-lg">🚗</span>
                </div>
                <span className="text-xs">No Image</span>
              </div>
            </div>
          )}

          {/* Premium Badge */}
          {!showDiscountBadge && isPremium && (
            <div className="absolute top-2 left-2">
              <Image
                src={"/premium.svg"}
                alt="Premium"
                width={24}
                height={24}
              />
            </div>
          )}

          {/* Discount Badge */}
          {showDiscountBadge && discount && discount > 0 && (
            <div
              className={`absolute top-0 left-0 ${discountBadgeBg} ${discountBadgeTextColor} px-2 py-1 rounded-tl-lg rounded-br-lg text-xs font-semibold shadow-lg`}
            >
              {discountText || `${Math.round(discount)}%`}
            </div>
          )}

          {/* Timer */}
          {showTimer && timeLeft && (
            <div
              className={`absolute bottom-0 right-0 ${timerBg} ${timerTextColor} px-2 py-1 rounded-tl-lg text-xs font-semibold shadow-lg flex items-center gap-1`}
            >
              <Clock className="w-3 h-3" />
              {timeLeft}
            </div>
          )}
          {/* Favorite Button */}
          <button
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 hover:scale-125 transition-all cursor-pointer"
            onClick={handleFavorite}
          >
            <Heart
              size={22}
              stroke="white"
              className={` ${
                isFavorite ? "fill-red-500 text-red-500" : "fill-white"
              }`}
            />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-2 left-2">
            <div className="bg-[#777777] rounded px-1.5 py-0.5 flex items-center gap-1">
              <ImageIcon size={12} className="text-white" />
              <span className="text-xs text-white font-medium">
                {currentImageIndex + 1}/{images.length}
              </span>
            </div>
          </div>

          {/* Views Counter */}
          {!showTimer && (
            <div className="absolute bottom-2 right-2">
              <div className="bg-black rounded px-1.5 py-0.5 flex items-center gap-1">
                <Eye size={12} className="text-white" />
                <span className="text-xs text-white font-medium">{views}</span>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && isHovered && (
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={isTransitioning}
                className={`absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity opacity-0 group-hover:opacity-100`}
                onClick={handlePreviousImage}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={isTransitioning}
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity opacity-0 group-hover:opacity-100`}
                onClick={handleNextImage}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </>
          )}

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isTransitioning || index === currentImageIndex) return;
                    setIsTransitioning(true);
                    setCurrentImageIndex(index);
                    setTimeout(() => {
                      setIsTransitioning(false);
                    }, 500);
                  }}
                  disabled={isTransitioning || index === currentImageIndex}
                  className={`w-1 h-1 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75"
                  } ${isTransitioning ? "cursor-not-allowed" : ""}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Section - Center Side */}
        <div className="flex-1 lg:flex-none p-4 space-y-3">
          {/* Title */}
          <Typography
            variant="md-medium"
            className=" font-semibold text-dark-blue leading-tight line-clamp-1"
          >
            {title}
          </Typography>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={ICONS.currency.aed}
                alt="AED"
                width={16}
                height={16}
              />
              <span className="text-sm font-bold text-purple">
                {formatPrice(price).replace("AED", "").trim()}
              </span>
              {originalPrice && (
                <span className="text-sm text-grey-blue line-through">
                  {formatPrice(originalPrice).replace("AED", "").trim()}
                </span>
              )}
              {discount && (
                <span className="text-sm text-teal font-bold">{discount}%</span>
              )}
            </div>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {transmission && (
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-[#667085]" />
                <Typography
                  variant="body-small"
                  className="text-xs text-[#667085] truncate"
                >
                  {String(transmission)}
                </Typography>
              </div>
            )}
            {fuelType && (
              <div className=" flex items-center gap-1">
                <Fuel className="w-4 h-4 text-[#667085]" />
                <Typography
                  variant="body-small"
                  className="text-xs text-[#667085] truncate"
                >
                  {String(fuelType)}
                </Typography>
              </div>
            )}

            {mileage && (
              <div className="flex items-center gap-1">
                <Gauge className="w-4 h-4 text-[#667085]" />
                <Typography
                  variant="body-small"
                  className="text-xs text-[#667085] truncate"
                >
                  {String(mileage)}
                </Typography>
              </div>
            )}

            {year && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#667085]" />
                <Typography
                  variant="body-small"
                  className="text-xs text-[#667085] truncate"
                >
                  {String(year)}
                </Typography>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-[#667085]" />
            <Typography
              variant="body-small"
              className="text-xs text-[#667085] truncate"
            >
              {location}
            </Typography>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:flex-1 hidden sm:flex flex-col justify-between items-end gap-4 p-4">
          <div className="flex flex-col md:flex-row justify-end items-end gap-2">
            <>
              <Typography
                variant="sm-black-inter"
                className="text-xs text-gray-500 whitespace-nowrap font-medium flex items-center gap-1"
              >
                <CircleUser size={16} className="text-purple" />
                <span className="text-xs text-grey-blue font-normal">
                  By Agent:
                </span>
                Premium Motors
              </Typography>
            </>
            <div className="flex items-center gap-2">
              <Image
                src={"/verified-seller.svg"}
                alt="Verified Seller"
                width={16}
                height={16}
              />
              <span className="text-xs text-grey-blue">{postedTime}</span>
            </div>
          </div>
          <Button size={"default"} className="max-w-[117px]">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalListingCard;
