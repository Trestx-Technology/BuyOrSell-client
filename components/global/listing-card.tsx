import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  Repeat,
  ImageOff,
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

  // Dynamically extract specifications from extraFields - memoized to prevent recalculation
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

  // Reset image index when images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  // Memoize handler functions to prevent unnecessary re-renders
  const handlePreviousImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isTransitioning || images.length <= 1) return;

      setIsTransitioning(true);
      setCurrentImageIndex((prev) => {
        const newIndex = prev === 0 ? images.length - 1 : prev - 1;
        return newIndex;
      });

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [images.length, isTransitioning]
  );

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isTransitioning || images.length <= 1) return;

      setIsTransitioning(true);
      setCurrentImageIndex((prev) => {
        const newIndex = prev === images.length - 1 ? 0 : prev + 1;
        return newIndex;
      });

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [images.length, isTransitioning]
  );

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      await share(id, title);
    },
    [id, title, share]
  );

  const handleDotClick = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();

      if (isTransitioning || index === currentImageIndex || images.length <= 1)
        return;

      setIsTransitioning(true);
      setCurrentImageIndex(index);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    },
    [isTransitioning, currentImageIndex, images.length]
  );

  // Memoize seller display name
  const sellerDisplayName = useMemo(() => {
    return (
      seller?.name ||
      `${seller?.firstName || ""} ${seller?.lastName || ""}`.trim() ||
      "Seller"
    );
  }, [seller]);

  return (
    <div
      className={cn(
        "w-[220px] h-full overflow-hidden rounded-2xl border border-purple-100 bg-white hover:shadow-lg transition-shadow duration-300 cursor-pointer group relative flex flex-col",
        className
      )}
    >
      <Link href={`/ad/${id}`} className="absolute inset-0 z-10" />
      <div className="p-0 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-[3/3] sm:aspect-[4/3] bg-primary w-full h-full min-h-[122px] max-h-[177px] overflow-hidden">
          {images.length > 0 ? (
            <div className="relative w-full h-full overflow-hidden z-20">
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{
                  transform: `translateX(-${currentImageIndex * 100}%)`,
                  willChange: isTransitioning ? "transform" : "auto",
                }}
              >
                {images.map((image, index) => (
                  <div
                    key={`${id}-image-${index}`}
                    className="w-full h-full flex-shrink-0 relative"
                  >
                    <Image
                      src={image}
                      alt={`${title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <ImageOff />
                </div>
                <span className="text-sm font-medium">No Image</span>
              </div>
            </div>
          )}

          {/* Premium Badge */}
          {isPremium && (
            <div className="absolute top-3 left-3 z-20">
              <Image src="/premium.svg" alt="Premium" width={31} height={31} />
            </div>
          )}

          {isExchange && (
            <Badge className="absolute h-6 bg-[#FE9800] top-3 left-2 z-20">
              <Repeat size={22} />
              Exchange Available
            </Badge>
          )}

          {/* Image Counter */}
          {images?.length > 1 && (
            <div className="absolute bottom-3 left-3 w-fit z-20">
              <div className="bg-[#777777] rounded-lg px-2 py-1 flex items-center gap-1 w-fit">
                <ImageIcon className="size-3 sm:size-4 text-white" />
                <span className="text-[10px] text-white font-medium">
                  {currentImageIndex + 1}/{images.length}
                </span>
              </div>
            </div>
          )}

          {/* Views Counter */}
          <div className="absolute bottom-3 right-3 z-20">
            <div className="bg-black rounded-lg px-2 py-1 flex items-center gap-1">
              <Eye className="size-3 sm:size-4 text-white" />
              <span className="text-[10px] text-white font-medium">
                {views}
              </span>
            </div>
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                size="sm"
                variant="secondary"
                disabled={isTransitioning}
                className={cn(
                  "absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg z-30 p-0",
                  isTransitioning && "opacity-50 cursor-not-allowed"
                )}
                onClick={handlePreviousImage}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4 text-slate-700" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={isTransitioning}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg z-30 p-0",
                  isTransitioning && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4 text-slate-700" />
              </Button>
            </>
          )}

          {/* Image Dots Indicator */}
          {images.length > 1 && images.length <= 5 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
              {images.map((_, index) => (
                <button
                  key={`${id}-dot-${index}`}
                  onClick={(e) => handleDotClick(e, index)}
                  disabled={isTransitioning || index === currentImageIndex}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    index === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/50 hover:bg-white/75 hover:scale-125",
                    (isTransitioning || index === currentImageIndex) &&
                      "cursor-not-allowed"
                  )}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="hidden absolute top-3 right-3 sm:flex gap-2 z-20">
            {!isExchange && (
              <button
                className="h-8 w-8 opacity-100 hover:scale-125 transition-transform cursor-pointer rounded-full"
                onClick={handleShare}
                aria-label="Share listing"
              >
                <Share2
                  size={22}
                  className="mx-auto fill-white stroke-slate-400"
                  strokeWidth={1}
                />
              </button>
            )}

            <CollectionManager
              itemId={id}
              itemTitle={title}
              itemImage={images?.[0] || ""}
              onSuccess={(isAdded) => setIsSaved(isAdded)}
            >
              <button
                className="h-8 w-8 opacity-100 hover:scale-125 transition-transform cursor-pointer rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                aria-label={
                  isSaved ? "Remove from collection" : "Add to collection"
                }
              >
                <Heart
                  size={24}
                  className={cn(
                    "mx-auto fill-white stroke-slate-400",
                    isSaved && "fill-purple"
                  )}
                  strokeWidth={1}
                />
              </button>
            </CollectionManager>
          </div>
        </div>

        {/* Content Section */}
        <div className="pt-2 space-y-3 flex-1 flex flex-col">
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
            className="text-sm font-semibold text-dark-blue leading-normal px-2.5 line-clamp-2"
          >
            {title}
          </Typography>

          {/* Location */}
          <div className="flex px-1 gap-1 items-center">
            <MapPin
              size={22}
              stroke="white"
              className="w-fit min-w-6 fill-dark-blue text-dark-blue flex-shrink-0"
            />
            <Typography
              variant="body-small"
              className="text-xs text-[#667085] truncate"
            >
              {location}
            </Typography>
          </div>

          {/* Dynamic Specs */}
          <div className="px-2.5 h-10">
            {specifications.length > 0 && (
              <SpecificationsDisplay
                specifications={specifications}
                maxVisible={4}
                showPopover={false}
                className="grid grid-cols-2 gap-2"
                itemClassName="text-[#667085]"
                truncate={true}
              />
            )}
          </div>

          {/* Spacer to push footer to bottom */}
          <div className="flex-1"></div>

          {/* Time ago and Seller */}
          <div className="hidden text-xs text-grey-blue font-regular border-t border-grey-blue/20 p-2.5 sm:flex items-start justify-between mt-auto">
            {seller ? (
              <div className="flex items-center gap-2 cursor-pointer z-20 relative">
                {seller.image ? (
                  <div className="relative w-[22px] h-[22px] rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={seller.image}
                      alt={sellerDisplayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <CircleUser size={22} className="text-purple flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <Typography
                    variant="sm-black-inter"
                    className="text-xs text-gray-500 font-medium flex items-center gap-1 truncate"
                  >
                    {sellerDisplayName}
                    {seller.isVerified && (
                      <Image
                        src="/verified-seller.svg"
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
            ) : (
              <span>{postedTime}</span>
            )}

            {showSocials && (
              <div className="flex items-center gap-2 sm:hidden z-20 relative">
                <Phone
                  size={18}
                  stroke="0"
                  className="fill-purple hover:scale-110 transition-transform duration-300"
                />
                <MessageSquareText
                  size={18}
                  className="text-purple hover:scale-110 transition-transform duration-300"
                />
                <FaWhatsapp
                  size={18}
                  className="text-purple hover:scale-110 transition-transform duration-300"
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
export { ListingCard };
