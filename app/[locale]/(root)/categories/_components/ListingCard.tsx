"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  MessageSquareText,
} from "lucide-react";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { ChatInit } from "@/components/global/chat-init";
import { ProductExtraFields } from "@/interfaces/ad";
import { getSpecifications } from "@/utils/normalize-extra-fields";
import {
  SpecificationsDisplay,
  Specification,
} from "@/components/global/specifications-display";
import { useMemo, useEffect } from "react";
import { useShare } from "@/hooks/useShare";
import { CollectionManager } from "@/components/global/collection-manager";
import { useGetCollectionsByAd } from "@/hooks/useCollections";
import { cn } from "@/lib/utils";

export interface ListingCardProps {
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
  onClick?: (id: string) => void;
  className?: string;
  showSeller?: boolean;
  showSocials?: boolean;
  isSaved?: boolean;
  seller?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    type?: "Agent" | "Individual";
    isVerified?: boolean;
    image?: string | null;
    id?: string;
  };
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
  extraFields,
  postedTime,
  views = 0,
  isPremium = false,
  onClick,
  className,
  showSeller,
  showSocials,
  isSaved: initialIsSaved,
  seller,
}) => {
  const { share } = useShare();
  const { data: collectionsByAdResponse } = useGetCollectionsByAd(
    initialIsSaved === undefined ? id : ""
  );
  const apiIsAddedInCollection =
    collectionsByAdResponse?.data?.isAddedInCollection ?? false;
  const [isSaved, setIsSaved] = useState(
    initialIsSaved ?? apiIsAddedInCollection
  );

  useEffect(() => {
    setIsSaved(initialIsSaved ?? apiIsAddedInCollection);
  }, [initialIsSaved, apiIsAddedInCollection]);

  // Get specifications from extraFields and transform to Specification[] format
  const specifications = useMemo((): Specification[] => {
    const specsFromFields = getSpecifications(extraFields, 4);
    return specsFromFields.map((spec) => ({
      name: spec.name,
      value: spec.value,
      icon: spec.icon,
    }));
  }, [extraFields]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await share(id, title);
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
      className={`w-full overflow-hidden rounded-2xl border border-purple-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group relative ${className}`}
      onClick={handleCardClick}
    >
      <Link href={"/ad/123"} className="absolute inset-0 "></Link>
      <div className="p-0">
        {/* Image Section */}
        {/* Main Image */}
        <div className="relative aspect-[3/3] sm:aspect-[4/3] bg-primary w-full h-full min-h-[122px] max-h-[177px] overflow-hidden">
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
          <div className="absolute bottom-3 left-3 w-fit">
            <div className="bg-[#777777] rounded-lg px-2 py-1 flex items-center gap-1 w-fit">
              <ImageIcon className="size-3 sm:size-5 text-white" />
              <span className="text-[10px] sm:text-xs text-white font-medium">
                {currentImageIndex + 1}/{images.length}
              </span>
            </div>
          </div>

          {/* Views Counter */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-black rounded-lg px-2 py-1 flex items-center gap-1">
              <Eye className="size-3 sm:size-5 text-white" />
              <span className="text-[10px] sm:text-xs text-white font-medium">
                {views}
              </span>
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <div>
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
                <ChevronLeft className="h-4 w-4 text-slate-700" />
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
                <ChevronRight className="h-4 w-4 text-slate-700" />
              </Button>
            </div>
          )}

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
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
          <div className="hidden absolute top-3 right-3 sm:flex gap-0">
            <button
              className="h-8 w-8 opacity-100 hover:scale-125 transition-all cursor-pointer rounded-full flex items-center justify-center"
              onClick={handleShare}
            >
              <Share2
                size={22}
                className="fill-white stroke-slate-400"
                strokeWidth={1}
              />
            </button>
            <CollectionManager
              itemId={id}
              itemTitle={title}
              itemImage={images?.[0] || ""}
              onSuccess={(isAdded) => {
                setIsSaved(isAdded);
              }}
            >
              <button
                className="h-8 w-8 opacity-100 hover:scale-125 transition-all cursor-pointer rounded-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart
                  size={24}
                  className={cn(
                    `fill-white stroke-slate-400`,
                    isSaved && "fill-purple"
                  )}
                  strokeWidth={1}
                />
              </button>
            </CollectionManager>
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

          {/* Dynamic Specs */}
          {specifications.length > 0 && (
            <div className="hidden sm:block px-2.5">
              <SpecificationsDisplay
                specifications={specifications}
                maxVisible={4}
                showPopover={false}
                className="flex flex-wrap items-center gap-4"
                itemClassName="text-[#667085]"
                truncate={true}
              />
            </div>
          )}

          {/* Time ago */}
          <div className="text-xs text-grey-blue font-regular border-t border-grey-blue/20 p-2.5 flex items-start justify-between">
            {showSeller && (
              <div className="hidden sm:flex items-center gap-2">
                {seller?.image ? (
                  <div className="relative w-[22px] h-[22px] rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={seller.image}
                      alt={seller.name || "Seller"}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <CircleUser size={22} className="text-purple flex-shrink-0" />
                )}
                <div>
                  <Typography
                    variant="sm-black-inter"
                    className="text-xs text-gray-500 font-medium flex items-center gap-1 truncate"
                  >
                    {seller?.name ||
                      `${seller?.firstName || ""} ${seller?.lastName || ""
                        }`.trim() ||
                      "Seller"}
                    {seller?.isVerified && (
                      <Image
                        src={"/verified-seller.svg"}
                        alt="Verified"
                        width={16}
                        height={16}
                      />
                    )}
                  </Typography>
                  {seller?.type && (
                    <Typography
                      variant="body-small"
                      className="text-xs text-grey-blue"
                    >
                      By {seller.type}
                    </Typography>
                  )}
                </div>
              </div>
            )}
            {postedTime}
            {showSocials && (
              <div className="flex items-center gap-2 sm:hidden">
                <Phone
                  size={18}
                  stroke="0"
                  className="fill-purple hover:scale-110 transition-all duration-300"
                />
                <ChatInit
                  adId={id}
                  adTitle={title}
                  adImage={images[0]}
                  sellerId={seller?.id}
                  sellerName={seller?.name}
                  sellerImage={seller?.image || undefined}
                  sellerIsVerified={seller?.isVerified}
                >
                  {({ isLoading, onClick }) => (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-purple/10 p-0"
                      onClick={onClick}
                      isLoading={isLoading}
                    >
                      <MessageSquareText size={18} className="text-purple" />
                    </Button>
                  )}
                </ChatInit>
                <FaWhatsapp
                  size={18}
                  className="text-purple hover:scale-110 transition-all duration-300"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
