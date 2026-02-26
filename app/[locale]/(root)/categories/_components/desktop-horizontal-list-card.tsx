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
  ImageIcon,
  CircleUser,
  Clock,
} from "lucide-react";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";
import { ProductExtraFields, AdLocation } from "@/interfaces/ad";
import { PriceDisplay } from "@/components/global/price-display";
import {
  SpecificationsDisplay,
  Specification,
} from "@/components/global/specifications-display";
import { useMemo } from "react";
import { getSpecifications } from "@/utils/normalize-extra-fields";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";
import { getLocationDisplay } from "@/utils/get-location-display";

export interface HorizontalListingCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  location: AdLocation;
  images: string[];
  extraFields: ProductExtraFields;
  postedTime: string;
  views?: number;
  isPremium?: boolean;
  isFavorite?: boolean;
  seller?: {
    name: string;
    isVerified: boolean;
    type: string;
  };
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
  seller,
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
  onShare, // eslint-disable-line @typescript-eslint/no-unused-vars
  onClick,
  className,
}) => {
  const { locale } = useLocale();

  // Resolve display-ready location string
  const displayLocation = useMemo(
    () => getLocationDisplay(location, locale),
    [location, locale]
  );

  // Dynamically extract specifications from extraFields
  const specifications = useMemo((): Specification[] => {
    const specsFromFields = getSpecifications(extraFields, 4); // Limit to 4 for display
    return specsFromFields.map((spec) => ({
      name: spec.name,
      value: spec.value,
      icon: spec.icon, // Use icon from extraFields if available
    }));
  }, [extraFields]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
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

  const handleCardClick = () => {
    onClick?.(id);
  };

  return (
    <div
      role="button"
      className={`overflow-hidden rounded-2xl border border-purple-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
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
          {isPremium && (
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
            className="absolute top-2 text-slate-700 right-2 h-8 w-8 hover:scale-125 transition-all cursor-pointer"
            onClick={handleFavorite}
          >
            <Heart
              size={22}
              className={` ${
                isFavorite
                ? "fill-purple text-purple"
                : "text-slate-300 fill-white dark:fill-gray-800 stroke-1"
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

          {typeof views === "number" && (
            <div className={cn("absolute right-2 z-20", showTimer && timeLeft ? "bottom-8" : "bottom-2")}>
              <div className="bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1">
                <Eye size={12} className="text-white" />
                <span className="text-[10px] text-white font-medium">{views}</span>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={isTransitioning}
                className={`absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity`}
                onClick={handlePreviousImage}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={isTransitioning}
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity`}
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
            className=" font-semibold text-dark-blue dark:text-gray-100 leading-tight line-clamp-1"
          >
            {title}
          </Typography>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <PriceDisplay
              price={price}
              originalPrice={originalPrice}
              discountPercentage={discount}
              currencyIconWidth={16}
              currencyIconHeight={16}
              className="gap-2"
              currentPriceClassName="text-sm font-bold text-purple"
              originalPriceClassName="text-sm text-grey-blue dark:text-gray-500 line-through"
              discountBadgeClassName="text-sm text-teal font-bold"
            />
          </div>

          {/* Specifications */}
          {specifications.length > 0 && (
            <SpecificationsDisplay
              specifications={specifications}
              maxVisible={4}
              showPopover={false}
              className="grid grid-cols-2 lg:grid-cols-4 gap-2"
              itemClassName="text-[#667085] dark:text-gray-400"
            />
          )}

          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-[#667085] dark:text-gray-400" />
            <Typography
              variant="body-small"
              className="text-xs text-[#667085] dark:text-gray-400 truncate"
            >
              {displayLocation}
            </Typography>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:flex-1 hidden sm:flex flex-col justify-between items-end gap-4 p-4">
          <div className="flex flex-col md:flex-row justify-end items-end gap-2">
            {seller && (
              <Typography
                variant="sm-black-inter"
                className="text-xs text-gray-500 whitespace-nowrap font-medium flex items-center gap-1"
              >
                <CircleUser size={16} className="text-purple" />
                <span className="text-xs text-grey-blue dark:text-gray-400 font-normal">
                  {seller.type === "Agent" ? "By Agent:" : "By:"}
                </span>
                <span className="dark:text-gray-300">{seller.name}</span>
              </Typography>
            )}
            <div className="flex items-center gap-2">
              {seller?.isVerified && (
                <Image
                  src={"/verified-seller.svg"}
                  alt="Verified Seller"
                  width={16}
                  height={16}
                />
              )}
              <span className="text-xs text-grey-blue dark:text-gray-500">{postedTime}</span>
            </div>
          </div>
          <Button
            size={"default"}
            className="max-w-[117px]"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(id);
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalListingCard;
