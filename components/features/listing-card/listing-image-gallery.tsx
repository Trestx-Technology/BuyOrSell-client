import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Eye,
  Repeat,
  ImageOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ListingActions } from "./listing-actions";
import { SafeImage } from "@/components/ui/safe-image";

interface ListingImageGalleryProps {
  id: string;
  title: string;
  images: string[];
  isPremium?: boolean;
  isExchange?: boolean;
  views?: number;
  handleShare: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

const GalleryImage = ({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
  }) => {
  return (
    <SafeImage
      src={src}
      alt={alt}
      fill
      className="object-cover"
      priority={index === 0}
      loading={index === 0 ? "eager" : "lazy"}
    />
  );
};

export const ListingImageGallery: React.FC<ListingImageGalleryProps> = ({
  id,
  title,
  images,
  isPremium,
  isExchange,
  views,
  handleShare,
  isSaved,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset image index when images change
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

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

  return (
    <div className="relative z-10 pointer-events-none aspect-[3/3] sm:aspect-[4/3] w-full h-full min-h-[122px] max-h-[177px] overflow-hidden">
      {images.length > 0 ? (
        <div className="relative w-full h-full overflow-hidden">
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
                <GalleryImage
                  src={image}
                  alt={`${title} - Image ${index + 1}`}
                  index={index}
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
        <Badge className="absolute h-6 bg-[#FE9800] top-3 left-2 z-20 pointer-events-none">
          <Repeat size={22} />
          Exchange Available
        </Badge>
      )}

      {/* Image Counter */}
      {images?.length > 1 && (
        <div className="absolute bottom-3 left-3 w-fit z-20 pointer-events-none">
          <div className="bg-[#777777] rounded-lg px-2 py-1 flex items-center gap-1 w-fit">
            <ImageIcon className="size-3 sm:size-4 text-white" />
            <span className="text-[10px] text-white font-medium">
              {currentImageIndex + 1}/{images.length}
            </span>
          </div>
        </div>
      )}

      {/* Views Counter */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
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
              "absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg z-30 p-0 pointer-events-auto",
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
              "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg p-0 pointer-events-auto",
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
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-auto">
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
      <ListingActions
        id={id}
        title={title}
        image={images?.[0]}
        isExchange={isExchange}
        handleShare={handleShare}
        isSaved={isSaved}
      />
    </div>
  );
};
