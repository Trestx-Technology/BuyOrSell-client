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
  Repeat,
  Settings,
  Palette,
  Car,
  Users,
  CheckCircle,
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
  isExchange?: boolean;
  postedTime: string;
  views?: number;
  isPremium?: boolean;
  isFavorite?: boolean;
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
  isExchange = false,
  postedTime,
  views,
  isPremium = false,
  isFavorite = false,
  onFavorite,
  onShare,
  onClick,
  className,
  showSeller,
  showSocials,
  seller,
}) => {
  const { share } = useShare();

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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await share(id, title);
    } catch (error) {
      console.error("Error sharing ad:", error);
    }
    // Also call the original onShare callback if provided
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
                  <ImageOffIcon />
                </div>
                <span className="text-sm font-medium">No Image</span>
              </div>
            </div>
          )}

          {/* Premium Badge */}
          {isPremium && (
            <div className=" absolute top-3 left-3">
              <Image
                src={"/premium.svg"}
                alt="Premium"
                width={31}
                height={31}
              />
            </div>
          )}
          {isExchange && (
            <Badge className="absolute h-6 bg-[#FE9800] top-3 left-2">
              <Repeat size={22} />
              Exchange Available
            </Badge>
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
          {images.length > 1 && isHovered && (
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
            </div>
          )}

          {/* Image Dots Indicator */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100">
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
              className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:scale-125 transition-all cursor-pointer text-purple bg-white border rounded-full"
              onClick={handleShare}
            >
              <Share2 size={22} className="mx-auto" />
            </button>
            <CollectionManager
              itemId={id}
              itemTitle={title}
              itemImage={images[0]}
              onSuccess={() => {
                // Optionally refresh or show feedback
                onFavorite?.(id);
              }}
            >
              <button className="h-8 w-8 opacity-0 group-hover:opacity-100 hover:scale-125 transition-all cursor-pointer text-purple bg-white border rounded-full">
                <Heart
                  size={24}
                  className={` mx-auto stroke-1 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-purple"
                  }`}
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
              <span className="text-md text-teal text-sm font-semibold">
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
          <div className="flex px-1 gap-1 items-center ">
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
                        className="text-xs text-[#667085] truncate min-w-0 flex-1"
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
          <div className="text-xs text-grey-blue font-regular border-t border-grey-blue/20 p-2.5 flex items-start justify-between">
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
            {postedTime}
            {showSocials && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility functions for specifications
export const getSpecIcon = (key: string) => {
  const iconMap: {
    [key: string]: React.ComponentType<{ className?: string }>;
  } = {
    year: Calendar,
    mileage: Gauge,
    fuelType: Fuel,
    transmission: Zap,
    engine: Settings,
    power: Zap,
    color: Palette,
    doors: Car,
    seats: Users,
    condition: CheckCircle,
  };
  return iconMap[key] || Settings;
};

export const formatSpecValue = (key: string, value: string | number) => {
  if (key === "year") return value;
  if (key === "mileage") return `${value} km`;
  if (key === "power") return `${value} HP`;
  if (key === "doors") return `${value} doors`;
  if (key === "seats") return `${value} seats`;
  return value;
};

export default ListingCard;
export { ListingCard };
