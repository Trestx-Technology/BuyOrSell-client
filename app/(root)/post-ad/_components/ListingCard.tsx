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
} from "lucide-react";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";

export interface ListingCardProps {
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

const ListingCard: React.FC<ListingCardProps> = ({
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
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Main Image */}
          <div className="relative w-full h-full max-h-[177px] overflow-hidden">
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
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <span className="text-sm">No Image</span>
                </div>
              </div>
            )}

            {/* Premium Badge */}
            {isPremium && (
              <div className="absolute top-3 left-3">
                <Image
                  src={"/premium.svg"}
                  alt="Premium"
                  width={31}
                  height={31}
                />
              </div>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-3 left-3">
              <div className="bg-[#777777] rounded-lg px-2 py-1 flex items-center gap-1">
                <ImageIcon size={18} className="text-white" />
                <span className="text-xs text-white font-medium">
                  {currentImageIndex + 1}/{images.length}
                </span>
              </div>
            </div>

            {/* Views Counter */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-black rounded-lg px-2 py-1 flex items-center gap-1">
                <Eye size={18} className="text-white" />
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
                  className={`absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity ${
                    isTransitioning
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                  onClick={handlePreviousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isTransitioning}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity ${
                    isTransitioning
                      ? "opacity-50 cursor-not-allowed"
                      : "opacity-100"
                  }`}
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Dots Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
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
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-125 ${
                      index === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    } ${isTransitioning ? "cursor-not-allowed" : ""}`}
                  />
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-0">
              <button
                className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:scale-125 transition-all cursor-pointer"
                onClick={handleShare}
              >
                <Share2 size={22} stroke="white" />
              </button>
              <button
                className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:scale-125 transition-all cursor-pointer"
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
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-2 space-y-3">
          {/* Price Section */}
          <div className="flex items-center gap-1 px-2.5">
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
              <span className="text-md text-grey-blue text-sm text-teal font-semibold">
                {discount}%
              </span>
            )}
          </div>

          {/* Title */}
          <Typography
            variant="h3"
            className="text-sm font-semibold text-dark-blue leading-tight px-2.5 line-clamp-1"
          >
            {title}
          </Typography>

          {/* Location */}
          <div className="flex items-center gap-1 px-2.5">
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

          {/* Dynamic Specs - First row (max 2 specs) */}
          <div className="flex items-center gap-4 px-2.5">
            {specifications.transmission && (
              <div className="w-full flex items-center gap-1">
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
              <div className="w-full flex items-center gap-1">
                <Fuel className="w-4 h-4 text-[#667085]" />
                <Typography
                  variant="body-small"
                  className="text-xs text-[#667085] truncate"
                >
                  {specifications.fuelType}
                </Typography>
              </div>
            )}
          </div>

          {/* Dynamic Specs - Second row (max 2 specs) */}
          <div className="space-y-1 px-2.5">
            <div className="flex items-center gap-2">
              {specifications.mileage && (
                <div className="w-full flex items-center gap-1">
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
                <div className="w-full flex items-center gap-1">
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

          {/* Time ago */}
          <div className="text-xs text-grey-blue font-regular px-2.5 border-t border-grey-blue/20 py-2.5 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CircleUser size={22} className="text-purple" />
              <div>
                <Typography
                  variant="sm-black-inter"
                  className="text-xs text-gray-500 font-medium flex items-center gap-1 whitespace-nowrap"
                >
                  Premium Motors
                  <Image
                    src={"/verified-seller.svg"}
                    alt="Premium"
                    width={16}
                    height={16}
                  />
                </Typography>
                <Typography
                  variant="body-small"
                  className="text-xs text-grey-blue"
                >
                  By Agent
                </Typography>
              </div>
            </div>
            {postedTime}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ListingCard;
