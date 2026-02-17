import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  Eye,
  ChevronLeft,
  ChevronRight,
  MapPin,
  ImageIcon,
  CircleUser,
  Phone,
  MessageSquareText,
  Clock,
  ImageOffIcon,
} from "lucide-react";
import { ICONS } from "@/constants/icons";
import { Typography } from "@/components/typography";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ProductExtraFields } from "@/interfaces/ad";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useShare } from "@/hooks/useShare";
import { CollectionManager } from "./collection-manager";
import { useGetCollectionsByAd } from "@/hooks/useCollections";
import { ChatInit } from "@/components/global/chat-init";

export interface DealsListingCardProps {
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
  isFavorite?: boolean;
  isSaved?: boolean;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
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
    id?: string;
  };
  // Deals specific props
  dealValidThrough?: string | null; // ISO date string for deal expiration
  discountText?: string; // Custom discount text (e.g., "FLAT 20% OFF")
}

const DealsListingCard: React.FC<DealsListingCardProps> = ({
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
  views,
  isFavorite = false,
  isSaved: initialIsSaved,
  onFavorite,
  onShare,
  onClick,
  className,
  showSeller,
  showSocials,
  seller,
  dealValidThrough,
  discountText,
}) => {
  const { share } = useShare();

  // Use isAddedInCollection flag from ad data if provided, otherwise check via API
  const { data: collectionsByAdResponse } = useGetCollectionsByAd(
    initialIsSaved === undefined ? id : ""
  );
  const apiIsAddedInCollection =
    collectionsByAdResponse?.data?.isAddedInCollection ?? false;

  // Use initialIsSaved prop if provided, otherwise use API result, fallback to isFavorite
  const effectiveIsFavorite =
    initialIsSaved !== undefined
      ? initialIsSaved
      : collectionsByAdResponse !== undefined
      ? apiIsAddedInCollection
      : isFavorite;

  // Normalize extraFields: handle both array and object formats, preserving icon info
  interface FieldWithIcon {
    name: string;
    value: string | number | boolean | string[] | null;
    icon?: string;
  }

  const normalizeExtraFields = (): FieldWithIcon[] => {
    if (!extraFields) return [];

    // If it's an array, use it directly (preserves icon info)
    if (Array.isArray(extraFields)) {
      return extraFields
        .filter(
          (field) =>
            field &&
            typeof field === "object" &&
            "name" in field &&
            "value" in field
        )
        .map((field) => ({
          name: field.name,
          value: field.value,
          icon: field.icon,
        }))
        .filter(
          (field) =>
            field.value !== null &&
            field.value !== undefined &&
            field.value !== ""
        );
    }

    // If it's an object, convert to array format (no icon info available)
    const fields: FieldWithIcon[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(extraFields as Record<string, any>).forEach(
      ([name, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          fields.push({ name, value });
        }
      }
    );
    return fields;
  };

  const extraFieldsList = normalizeExtraFields();

  // Get first 4 fields for display (2 per row)
  const displayFields = extraFieldsList.slice(0, 4);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Timer logic for countdown using dealValidThrough
  useEffect(() => {
    if (!dealValidThrough) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(dealValidThrough).getTime();
      const distance = end - now;

      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft("EXPIRED");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [dealValidThrough]);

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

  const handleCollectionSuccess = () => {
    onFavorite?.(id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await share(id, title);
    } catch (error) {
      console.error("Error sharing ad:", error);
    }
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

  // Calculate discount percentage if not provided
  const discountPercentage =
    discount ||
    (originalPrice && price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0);

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border border-purple-100 bg-white dark:bg-gray-900 dark:border-gray-800 hover:shadow-lg transition-all duration-300 cursor-pointer group relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <Link href={`/ad/${id}`} className="absolute inset-0"></Link>
      <div className="p-0">
        {/* Image Section */}
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
                  <ImageOffIcon />
                </div>
                <span className="text-sm font-medium">No Image</span>
              </div>
            </div>
          )}

          {/* Discount Badge - Prominent for deals */}
          {(discountPercentage > 0 || discountText) && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="h-7 bg-[#FB9800] text-white font-bold px-3 py-1">
                {discountText || `${discountPercentage}% OFF`}
              </Badge>
            </div>
          )}

          {/* Timer Badge - Prominent for deals */}
          {timeLeft && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="h-7 bg-black text-white font-semibold px-3 py-1 flex items-center gap-1.5">
                <Clock size={14} />
                <span className="text-xs">{timeLeft}</span>
              </Badge>
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
          <div className="hidden absolute top-3 right-3 sm:flex gap-2">
            <button
              className="h-8 w-8 opacity-100 hover:scale-125 transition-all cursor-pointer rounded-full"
              onClick={handleShare}
            >
              <Share2
                size={22}
                className="mx-auto fill-white stroke-slate-400"
                strokeWidth={1}
              />
            </button>
            <CollectionManager
              itemId={id}
              itemTitle={title}
              itemImage={images[0]}
              onSuccess={handleCollectionSuccess}
            >
              <button
                className="h-8 w-8 opacity-100 hover:scale-125 transition-all cursor-pointer rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart
                  size={24}
                  className={`mx-auto fill-white stroke-slate-400 ${
                    effectiveIsFavorite ? "fill-red-500" : ""
                  }`}
                  strokeWidth={1}
                />
              </button>
            </CollectionManager>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-2 space-y-3">
          {/* Price Section - Highlighted for deals */}
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
            {discountPercentage > 0 && (
              <span className="text-md text-teal text-sm font-semibold">
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Title */}
          <Typography
            variant="h3"
            className="text-sm font-semibold text-dark-blue dark:text-gray-100 leading-tight px-2.5 line-clamp-1"
          >
            {title}
          </Typography>

          {/* Location */}
          <div className="flex px-1 gap-1 items-center">
            <MapPin
              size={22}
              stroke="white"
              className="w-fit min-w-6 fill-dark-blue text-dark-blue dark:fill-gray-100 dark:text-gray-100"
            />
            <Typography
              variant="body-small"
              className="text-xs text-[#667085] dark:text-gray-400 truncate"
            >
              {location}
            </Typography>
          </div>

          {/* Dynamic Specs - Grid with 2 columns */}
          <div className="min-h-10">
            {displayFields.length > 0 && (
              <div className="hidden sm:grid grid-cols-2 gap-2 px-2.5">
                {displayFields.map((field) => {
                  const displayValue = Array.isArray(field.value)
                    ? field.value.join(", ")
                    : typeof field.value === "boolean"
                    ? field.value
                      ? "Yes"
                      : "No"
                    : String(field.value);

                  return (
                    <div
                      key={field.name}
                      className="flex items-center gap-1 min-w-0"
                    >
                      {field.icon && (
                        <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                          <Image
                            src={field.icon}
                            alt={field.name}
                            width={16}
                            height={16}
                            className="w-4 h-4 object-contain"
                          />
                        </div>
                      )}
                      <Typography
                        variant="body-small"
                        className="text-xs text-[#667085] dark:text-gray-400 truncate min-w-0 flex-1"
                      >
                        {displayValue}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Time ago */}
          <div className="text-xs text-grey-blue dark:text-gray-400 font-regular border-t border-grey-blue/20 dark:border-white/10 p-2.5 flex items-start justify-between">
            {seller && showSeller !== false && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="hidden sm:flex items-center gap-2 cursor-pointer">
                      {seller.image ? (
                        <div className="relative w-[22px] h-[22px] rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={seller.image}
                            alt={seller.name || "Seller"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <CircleUser size={22} className="text-purple" />
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
                            className="text-xs text-grey-blue"
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
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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

export default DealsListingCard;
export { DealsListingCard };
