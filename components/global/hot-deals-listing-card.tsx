import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CircleUser,
  Clock,
  ImageOffIcon,
  ImageIcon,
  Eye,
} from "lucide-react";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ProductExtraFields } from "@/interfaces/ad";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PriceDisplay } from "@/components/global/price-display";
import {
  SpecificationsDisplay,
  Specification,
} from "@/components/global/specifications-display";
import { getSpecifications } from "@/utils/normalize-extra-fields";
import { useMemo } from "react";
import { useShare } from "@/hooks/useShare";
import { CollectionManager } from "@/components/global/collection-manager";
import { useGetCollectionsByAd } from "@/hooks/useCollections";

export interface HotDealsListingCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency?: string;
  location: string;
  images: string[];
  extraFields: ProductExtraFields;
  isExchange?: boolean;
  postedTime: string;
  views?: number;
  isPremium?: boolean;
  isAddedInCollection?: boolean;
  onClick?: (id: string) => void;
  className?: string;
  showSeller?: boolean;
  showSocials?: boolean;
  seller?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    type?: "Agent" | "Individual";
    isVerified?: boolean;
    image?: string | null;
  };
  // Hot deals specific props
  discountText?: string;
  discountBadgeBg?: string;
  discountBadgeTextColor?: string;
  showDiscountBadge?: boolean;
  showTimer?: boolean;
  timerBg?: string;
  timerTextColor?: string;
  dealValidThrough?: string | null; // ISO date string from ad data
}

const HotDealsListingCard: React.FC<HotDealsListingCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  discount,
  currency = "AED",
  location,
  images,
  extraFields,
  isExchange = false,
  views,
  isPremium = false,
  isAddedInCollection,
  onClick,
  className,
  showSeller,
  seller,
  discountText,
  discountBadgeBg = "bg-white",
  discountBadgeTextColor = "text-black",
  showDiscountBadge = true,
  showTimer = true,
  timerBg = "bg-[#4A4A4A]",
  timerTextColor = "text-white",
  dealValidThrough,
}) => {
  // Dynamically extract specifications from extraFields
  const specifications = useMemo((): Specification[] => {
    const specsFromFields = getSpecifications(extraFields, 4);
    return specsFromFields.map((spec) => ({
      name: spec.name,
      value: spec.value,
      icon: spec.icon,
    }));
  }, [extraFields]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { share } = useShare();
  const { data: collectionsByAdResponse } = useGetCollectionsByAd(
    isAddedInCollection === undefined ? id : ""
  );
  const apiIsAddedInCollection =
    collectionsByAdResponse?.data?.isAddedInCollection ?? false;
  const [isSaved, setIsSaved] = useState(
    isAddedInCollection ?? apiIsAddedInCollection
  );

  useEffect(() => {
    setIsSaved(isAddedInCollection ?? apiIsAddedInCollection);
  }, [isAddedInCollection, apiIsAddedInCollection]);

  // Timer logic for countdown using dealValidThrough
  useEffect(() => {
    if (!showTimer || !dealValidThrough) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(dealValidThrough).getTime();
      const distance = end - now;

      if (distance > 0) {
        const totalSeconds = Math.floor(distance / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        // Format based on remaining time for better readability
        if (days > 0) {
          // Show days and hours (e.g., "5d 12h")
          setTimeLeft(`${days}d ${hours}h`);
        } else if (totalHours > 0) {
          // Show hours and minutes (e.g., "12h 30m")
          setTimeLeft(`${totalHours}h ${minutes}m`);
        } else {
          // Show minutes and seconds (e.g., "30m 45s")
          setTimeLeft(`${totalMinutes}m ${seconds}s`);
        }
      } else {
        setTimeLeft("EXPIRED");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dealValidThrough, showTimer]);

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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    share(id, title).catch((error) => {
      console.error("Error sharing ad:", error);
    });
  };

  const handleCardClick = () => {
    onClick?.(id);
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border border-purple-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <Link href={`/ad/${id}`} className="absolute inset-0 "></Link>
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
                  <ImageOffIcon className="w-8 h-8 text-gray-400" />
                </div>
                <span className="text-sm font-medium">No Image</span>
              </div>
            </div>
          )}

          {/* Premium Badge - Hidden when discount is present */}
          {isPremium && !(discount && discount > 0) && (
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
          {images?.length > 0 && (
            <div className="absolute bottom-3 left-3 w-fit">
              <div className="bg-[#777777] rounded-lg px-2 py-1 flex items-center gap-1 w-fit">
                <ImageIcon className="size-3 sm:size-4 text-white" />
                <span className="text-[10px] text-white font-medium">
                  {currentImageIndex + 1}/{images.length}
                </span>
              </div>
            </div>
          )}

          {/* Views Counter */}
          {views && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-black rounded-lg px-2 py-1 flex items-center gap-1">
                <Eye className="size-3 sm:size-4 text-white" />
                <span className="text-[10px] text-white font-medium">
                  {views}
                </span>
              </div>
            </div>
          )}

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
                  className={`fill-white stroke-slate-400 ${
                    isSaved ? "fill-purple" : ""
                  }`}
                  strokeWidth={1}
                />
              </button>
            </CollectionManager>
          </div>

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
        </div>

        {/* Content Section */}
        <div className="pt-2 space-y-3">
          {/* Price Section */}
          <div className="px-2.5">
            <PriceDisplay
              price={price}
              originalPrice={originalPrice}
              discountPercentage={discount}
              currencyIconWidth={16}
              currencyIconHeight={16}
              className="gap-1"
              currentPriceClassName="text-sm font-bold text-purple"
              originalPriceClassName="text-xs text-grey-blue line-through text-sm"
              discountBadgeClassName="text-xs text-teal text-sm font-semibold"
            />
          </div>

          {/* Title */}
          <Typography
            variant="h3"
            className="text-sm font-semibold text-dark-blue leading-tight px-2.5 line-clamp-1"
          >
            {title}
          </Typography>

          {/* Location */}
          <div className="flex px-1 gap-1 items-center">
            <MapPin
              size={22}
              stroke="white"
              className="w-fit min-w-6 fill-dark-blue text-dark-blue"
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
                truncate
                className="grid grid-cols-2 gap-2"
                itemClassName="text-[#667085]"
              />
            </div>
          )}

          {/* Time ago */}
          <div className="text-xs text-grey-blue font-regular border-t border-grey-blue/20 p-2.5 flex items-start justify-between">
            {showSeller && seller && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="hidden sm:flex items-center gap-2 cursor-pointer">
                      {seller.image ? (
                        <div className="relative border w-[22px] h-[22px] rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={seller.image}
                            alt={seller.name || "Seller"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <CircleUser size={20} className="text-purple" />
                      )}
                      <div>
                        <Typography
                          variant="sm-black-inter"
                          className="text-xs text-gray-500 font-medium flex items-center gap-1 truncate"
                        >
                          {seller.name ||
                            `${seller.firstName || ""} ${
                              seller.lastName || ""
                            }`.trim() ||
                            "Seller"}
                          {seller.isVerified && (
                            <Image
                              src={"/verified-seller.svg"}
                              alt="Verified"
                              width={16}
                              height={16}
                            />
                          )}
                        </Typography>
                        {seller.type && (
                          <Typography
                            variant="body-small"
                            className="text-[10px] text-grey-blue"
                          >
                            By {seller.type}
                          </Typography>
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[200px]">
                    <div className="space-y-1">
                      <div className="font-semibold text-sm">
                        {seller.name ||
                          `${seller.firstName || ""} ${
                            seller.lastName || ""
                          }`.trim() ||
                          "Seller"}
                        {seller.isVerified && (
                          <span className="ml-1 text-xs text-green-600">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      {seller.type && (
                        <div className="text-xs text-gray-500">
                          Seller Type: {seller.type}
                        </div>
                      )}
                      {seller.firstName && seller.lastName && seller.name && (
                        <div className="text-xs text-gray-400">
                          {seller.firstName} {seller.lastName}
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {/* <span className="whitespace-nowrap">
              {postedTime}
            </span> */}
          </div>

          {/* {showSocials && (
              <div className="flex items-center gap-2 sm:hidden">
                <Phone
                  size={18}
                  stroke="0"
                  className="fill-purple hover:scale-110 transition-all duration-300"
                />
                <MessageSquareText
                  size={18}
                  className="text-purple hover:scale-110 transition-all duration-300"
                />
                <FaWhatsapp
                  size={18}
                  className="text-purple hover:scale-110 transition-all duration-300"
                />
              </div>
            )} */}
        </div>
      </div>
    </div>
  );
};

export default HotDealsListingCard;
