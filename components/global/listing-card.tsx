import React, { useEffect, useMemo, useState } from "react";
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
import {
  SpecificationsDisplay,
  Specification,
} from "@/components/global/specifications-display";
import { getSpecifications } from "@/utils/normalize-extra-fields";
import { PriceDisplay } from "./price-display";
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
  isExchange?: boolean;
  postedTime: string;
  views?: number;
  isPremium?: boolean;
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
  isAddedInCollection?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  id,
  title,
  price,
  originalPrice,
  discount,
  location,
  images,
  extraFields,
  isExchange = false,
  postedTime,
  views,
  isPremium = false,
  className,
  showSeller,
  showSocials,
  seller,
  isAddedInCollection,
}) => {
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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await share(id, title);
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border border-purple-100 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group relative ${className}`}
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
              itemImage={images?.[0] || ""}
              onSuccess={(isAdded) => {
                setIsSaved(isAdded);
              }}
            >
              <button
                className="h-8 w-8 opacity-100 hover:scale-125 transition-all cursor-pointer rounded-full"
                onClick={(e) => e.stopPropagation()}
              >
                <Heart
                  size={24}
                  className={cn(
                    `mx-auto fill-white stroke-slate-400`,
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

          {/* Dynamic Specs */}
          <div className="min-h-10">
            {specifications.length > 0 && (
              <div className="hidden sm:block px-2.5">
                <SpecificationsDisplay
                  specifications={specifications}
                  maxVisible={4}
                  showPopover={false}
                  className="grid grid-cols-2 gap-2"
                  itemClassName="text-[#667085]"
                  truncate={true}
                />
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
