"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Eye,
  MapPin,
  Calendar,
  Gauge,
  Zap,
  Fuel,
  ImageIcon,
  CircleUser,
  Phone,
  MessageCircle,
  MessageSquareText,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export interface MobileHorizontalListViewCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  location: string;
  images: string[];
  specifications: {
    transmission?: string;
    fuelType?: string;
    mileage?: string;
    year?: number;
  };
  postedTime: string;
  views?: number;
  isPremium?: boolean;
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
  onClick?: (id: string) => void;
  className?: string;
}

const MobileHorizontalListViewCard: React.FC<
  MobileHorizontalListViewCardProps
> = ({
  id,
  title,
  price,
  originalPrice,
  discount,
  currency = "AED",
  location,
  images,
  specifications,
  postedTime,
  views = 0,
  isPremium = false,
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
  onClick,
  className,
}) => {
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
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [showTimer, endTime]);

  const handleCardClick = () => {
    onClick?.(id);
  };

  const handleImageSwipe = (direction: "next" | "prev") => {
    if (isTransitioning || images.length <= 1) return;

    setIsTransitioning(true);
    if (direction === "next") {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
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
      className={`w-full overflow-hidden rounded-xl border border-purple-100 bg-white hover:shadow-md transition-all duration-300 cursor-pointer group active:scale-[0.98] ${className} space-y-2`}
      onClick={handleCardClick}
    >
      <div className="flex p-2 items-center gap-2">
        {/* Image Section - Left Side */}
        <div className="w-full max-w-[110px] space-y-1">
          {/* Image Carousel */}
          <div className="relative aspect-square  flex-shrink-0 overflow-hidden rounded-xl">
            {images.length > 0 ? (
              <div className="relative w-full h-full">
                <div
                  className="flex transition-transform duration-300 ease-in-out h-full"
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
                        className="object-cover"
                        sizes="128px"
                      />
                    </div>
                  ))}
                </div>

                {/* Touch swipe indicators for mobile */}
                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isTransitioning}
                      onClick={() => handleImageSwipe("prev")}
                      className={`absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity opacity-100`}
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isTransitioning}
                      onClick={() => handleImageSwipe("next")}
                      className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity opacity-100`}
                    >
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <span className="text-lg">🚗</span>
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
                className={`absolute top-0 left-0 ${discountBadgeBg} ${discountBadgeTextColor} px-1.5 py-0.5 rounded-br-lg text-[10px] font-semibold shadow-lg`}
              >
                {discountText || `${Math.round(discount)}%`}
              </div>
            )}

            {/* Timer */}
            {showTimer && timeLeft && (
              <div
                className={`absolute bottom-0 right-0 ${timerBg} ${timerTextColor} px-1.5 py-0.5 rounded-tl-lg text-[10px] font-semibold shadow-lg flex items-center gap-1`}
              >
                <Clock className="w-2.5 h-2.5" />
                {timeLeft}
              </div>
            )}
          </div>

          {/* Image Tracking and Views Counter */}
          <div className="flex gap-2">
            {/* Image Counter */}
            {images.length > 1 && (
              <div className="w-full bg-[#777777] rounded px-1.5 py-0.5 flex justify-center items-center gap-1">
                <ImageIcon size={10} className="text-white" />
                <span className="text-[10px] text-white font-medium">
                  {currentImageIndex + 1}/{images.length}
                </span>
              </div>
            )}

            {/* Views Counter */}
            <div className="w-full bg-black rounded px-1.5 py-0.5 flex items-center justify-center gap-1">
              <Eye size={10} className="text-white" />
              <span className="text-[10px] text-white font-medium">
                {views}
              </span>
            </div>
          </div>
        </div>

        {/* Ad Metadata - Right Side */}
        <div className="space-y-2 flex-1">
          {/* Price Section */}
          <div className="flex items-center gap-1">
            <Image src={ICONS.currency.aed} alt="AED" width={16} height={16} />
            <span className="text-md font-bold text-purple">
              {formatPrice(price).replace("AED", "").trim()}
            </span>
            {originalPrice && (
              <span className="text-md text-grey-blue line-through text-sm">
                {formatPrice(originalPrice).replace("AED", "").trim()}
              </span>
            )}
            {discount && (
              <span className="text-md text-grey-blue text-sm font-semibold">
                {discount}%
              </span>
            )}
          </div>

          {/* Title */}
          <Typography
            variant="h3"
            className="text-sm font-semibold text-dark-blue leading-tight line-clamp-1"
          >
            {title}
          </Typography>

          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPin
              size={22}
              stroke="white"
              className="-ml-1 fill-dark-blue text-[#667085]"
            />
            <Typography
              variant="body-small"
              className="text-xs text-[#667085] truncate"
            >
              {location}
            </Typography>
          </div>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {specifications.transmission && (
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-[#667085]" />
                <Typography
                  variant="body-small"
                  className="text-xs text-[#667085] truncate"
                >
                  {specifications.transmission}
                </Typography>
              </div>
            )}
            {specifications.fuelType && (
              <div className=" flex items-center gap-1">
                <Fuel className="w-4 h-4 text-[#667085]" />
                <Typography
                  variant="body-small"
                  className="text-xs text-[#667085] truncate"
                >
                  {specifications.fuelType}
                </Typography>
              </div>
            )}

            {specifications.mileage && (
              <div className="flex items-center gap-1">
                <Gauge className="w-4 h-4 text-[#667085]" />
                <Typography
                  variant="body-small"
                  className="text-xs text-[#667085] truncate"
                >
                  {specifications.mileage}
                </Typography>
              </div>
            )}

            {specifications.year && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#667085]" />
                <Typography
                  variant="body-small"
                  className="text-xs text-[#667085] truncate"
                >
                  {specifications.year}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*  */}
      <div className="w-full border-t flex flex-wrap gap-3 items-center justify-between p-2">
        <div className="flex gap-2 items-center">
          <UserCircle2 className="text-purple" />
          <div className="text-grey-blue">
            <Typography
              variant="sm-semibold"
              className="flex items-center gap-2"
            >
              {seller?.name}{" "}
              <span>
                <Image
                  src={"/verified-seller.svg"}
                  alt="Verified"
                  width={16}
                  height={16}
                />
              </span>
            </Typography>
            <Typography
              variant="body-small"
              className="text-xs text-[#667085] truncate"
            >
              By {seller?.type} <span>• 2hr ago</span>
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Phone size={24} className="fill-purple stroke-0" />
          <MessageSquareText size={24} className="text-purple" />
          <FaWhatsapp className="text-purple" size={24} />
        </div>
      </div>
    </div>
  );
};

export default MobileHorizontalListViewCard;
