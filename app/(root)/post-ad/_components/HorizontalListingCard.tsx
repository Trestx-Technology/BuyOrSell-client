"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
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
  Phone,
  MessageCircle,
} from "lucide-react";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";

export interface HorizontalListingCardProps {
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
  isFavorite?: boolean;
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
  specifications,
  postedTime,
  views = 0,
  isPremium = false,
  isFavorite = false,
  onFavorite,
  onShare,
  onClick,
  className,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    <Card
      className={`overflow-hidden rounded-2xl border border-purple-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="flex h-[217px]">
          {/* Image Section - Left Side */}
          <div className="relative w-[111px] h-full flex-shrink-0">
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
            <div className="absolute bottom-2 right-2">
              <div className="bg-black rounded px-1.5 py-0.5 flex items-center gap-1">
                <Eye size={12} className="text-white" />
                <span className="text-xs text-white font-medium">{views}</span>
              </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && isHovered && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isTransitioning}
                  className={`absolute left-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity ${
                    isTransitioning
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                  onClick={handlePreviousImage}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isTransitioning}
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity ${
                    isTransitioning
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
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
                      if (isTransitioning || index === currentImageIndex)
                        return;
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

          {/* Content Section - Right Side */}
          <div className="flex-1 p-4 space-y-3">
            {/* Price Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={ICONS.currency.aed}
                  alt="AED"
                  width={16}
                  height={16}
                />
                <span className="text-lg font-bold text-purple">
                  {formatPrice(price).replace("AED", "").trim()}
                </span>
                {originalPrice && (
                  <span className="text-sm text-grey-blue line-through">
                    {formatPrice(originalPrice).replace("AED", "").trim()}
                  </span>
                )}
              </div>
              {discount && (
                <span className="text-sm text-teal font-semibold bg-teal/10 px-2 py-1 rounded">
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
              <MapPin size={16} className="text-[#667085]" />
              <Typography
                variant="body-small"
                className="text-xs text-[#667085] truncate"
              >
                {location}
              </Typography>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-2">
              {specifications.transmission && (
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-yellow-500 rounded flex items-center justify-center">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </div>
                  <Typography
                    variant="body-small"
                    className="text-xs text-[#667085] truncate"
                  >
                    {specifications.transmission}
                  </Typography>
                </div>
              )}
              {specifications.fuelType && (
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
                    <Fuel className="w-2.5 h-2.5 text-white" />
                  </div>
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
                  <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                    <Gauge className="w-2.5 h-2.5 text-white" />
                  </div>
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
                  <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                    <Calendar className="w-2.5 h-2.5 text-white" />
                  </div>
                  <Typography
                    variant="body-small"
                    className="text-xs text-[#667085] truncate"
                  >
                    {specifications.year}
                  </Typography>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-purple-100"></div>

            {/* Footer Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CircleUser size={16} className="text-purple" />
                <div>
                  <Typography
                    variant="sm-black-inter"
                    className="text-xs text-gray-500 font-medium flex items-center gap-1"
                  >
                    Premium Motors
                    <div className="w-3 h-3 bg-teal rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </Typography>
                  <Typography
                    variant="body-small"
                    className="text-xs text-grey-blue"
                  >
                    By Agent
                  </Typography>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-grey-blue">{postedTime}</span>
                <div className="flex gap-1">
                  <button
                    className="h-6 w-6 rounded-full bg-purple/10 flex items-center justify-center hover:bg-purple/20 transition-colors"
                    onClick={handleShare}
                  >
                    <Phone size={12} className="text-purple" />
                  </button>
                  <button
                    className="h-6 w-6 rounded-full bg-purple/10 flex items-center justify-center hover:bg-purple/20 transition-colors"
                    onClick={handleShare}
                  >
                    <MessageCircle size={12} className="text-purple" />
                  </button>
                  <button
                    className="h-6 w-6 rounded-full bg-purple/10 flex items-center justify-center hover:bg-purple/20 transition-colors"
                    onClick={handleFavorite}
                  >
                    <Heart
                      size={12}
                      className={`${
                        isFavorite ? "fill-red-500 text-red-500" : "text-purple"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HorizontalListingCard;
