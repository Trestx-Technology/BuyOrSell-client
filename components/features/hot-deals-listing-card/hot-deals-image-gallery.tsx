import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Eye,
  Clock,
  ImageOffIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HotDealsActions } from "./hot-deals-actions";
import { DealTimer } from "@/components/global/deal-timer";

interface HotDealsImageGalleryProps {
  id: string;
  title: string;
  images: string[];
  isPremium?: boolean;
  views?: number;
  discount?: number;
  handleShare: (e: React.MouseEvent) => void;
  onToggleSave: (isAdded: boolean) => void;
  isSaved: boolean;
  // Hot deals specifics
  discountText?: string;
  discountBadgeBg?: string;
  discountBadgeTextColor?: string;
  showDiscountBadge?: boolean;
  showTimer?: boolean;
  timerBg?: string;
  timerTextColor?: string;
  dealValidThrough?: string | null;
}

export const HotDealsImageGallery: React.FC<HotDealsImageGalleryProps> = ({
  id,
  title,
  images,
  isPremium,
  views,
  discount,
  handleShare,
  onToggleSave,
  isSaved,
  discountText,
  discountBadgeBg = "bg-white",
  discountBadgeTextColor = "text-black",
  showDiscountBadge = true,
  showTimer = true,
  timerBg = "bg-[#4A4A4A]",
  timerTextColor = "text-white",
  dealValidThrough,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handler for image navigation
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
    setCurrentImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );

    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };


  return (
    <div className="relative aspect-[3/3] sm:aspect-[4/3] bg-primary w-full h-full min-h-[122px] max-h-[177px] overflow-hidden">
      {images.length > 0 ? (
        <div className="relative w-full h-full overflow-hidden z-10">
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
        <div className="absolute top-3 left-3 z-20">
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
      {views && (
        <div className="absolute bottom-3 right-3 z-20">
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
        <div className="z-20">
          <Button
            size="sm"
            variant="secondary"
            disabled={isTransitioning}
            className={cn(
              "absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity z-20",
              isTransitioning ? "opacity-50 cursor-not-allowed" : "opacity-100"
            )}
            onClick={handlePreviousImage}
          >
            <ChevronLeft className="h-4 w-4 text-slate-700" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            disabled={isTransitioning}
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg transition-opacity z-20",
              isTransitioning ? "opacity-50 cursor-not-allowed" : "opacity-100"
            )}
            onClick={handleNextImage}
          >
            <ChevronRight className="h-4 w-4 text-slate-700" />
          </Button>
        </div>
      )}

      {/* Image Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 z-20">
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
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer hover:scale-125",
                index === currentImageIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75",
                isTransitioning && "cursor-not-allowed"
              )}
            />
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <HotDealsActions
        id={id}
        title={title}
        image={images?.[0]}
        isSaved={isSaved}
        handleShare={handleShare}
        onToggleSave={onToggleSave}
      />

      {/* Discount Badge */}
      {showDiscountBadge && discount && discount > 0 && (
        <div
          className={cn(
            "absolute top-0 left-0 px-2 py-1 rounded-tl-lg rounded-br-lg text-xs font-semibold shadow-lg z-20",
            discountBadgeBg,
            discountBadgeTextColor
          )}
        >
          {discountText || `${Math.round(discount)}%`}
        </div>
      )}

      {/* Timer */}
      {showTimer && dealValidThrough && (
        <div
          className={cn(
            "absolute bottom-0 right-0 px-2 py-1 rounded-tl-lg text-xs font-semibold shadow-lg z-20",
            timerBg,
            timerTextColor
          )}
        >
          <DealTimer
            validThrough={dealValidThrough}
            variant="plain"
            showIcon={true}
            iconColor={timerTextColor}
            textColor={timerTextColor}
            className="text-xs"
          />
        </div>
      )}
    </div>
  );
};
