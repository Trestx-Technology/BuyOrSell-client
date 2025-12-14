"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  ImagePlusIcon,
  Heart,
  Share2,
  X,
  Play,
  Pause,
} from "lucide-react";
import CollectionDrawer from "@/app/(root)/favorites/_components/collection-drawer";
import { AD } from "@/interfaces/ad";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  ad: AD;
}

interface MediaItem {
  id: number;
  type: "image" | "video";
  src: string;
  thumbnail: string;
  alt: string;
}

interface GalleryProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItems: MediaItem[];
  initialIndex?: number;
}

// Full-screen Gallery Component
function Gallery({ isOpen, onClose, mediaItems, initialIndex = 0 }: GalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);

  // Update selected index when initialIndex changes
  useEffect(() => {
    setSelectedIndex(initialIndex);
  }, [initialIndex]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % mediaItems.length);
    setIsPlaying(false);
  }, [mediaItems.length]);

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    setIsPlaying(false);
  }, [mediaItems.length]);

  const selectedItem = mediaItems[selectedIndex];

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToNext, goToPrevious, onClose]);

  // Prevent body scroll when gallery is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || mediaItems.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-white/90 text-sm font-medium">
          {selectedIndex + 1} / {mediaItems.length}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10 hover:text-white">
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center h-full px-4 pb-32 pt-20">
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
          {/* Navigation Buttons */}
          {mediaItems.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 z-10 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 z-10 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* Media Display */}
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedItem.type === "image" ? (
              <Image
                key={selectedItem.id}
                src={selectedItem.src || "/placeholder.svg"}
                alt={selectedItem.alt}
                width={1920}
                height={1080}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                unoptimized
              />
            ) : (
              <div className="relative">
                <Image
                  src={selectedItem.thumbnail || "/placeholder.svg"}
                  alt={selectedItem.alt}
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  unoptimized
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-2 border-white/40"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnails Bar */}
      {mediaItems.length > 1 && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-transform duration-300",
            showThumbnails ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {mediaItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedIndex(index);
                  setIsPlaying(false);
                }}
                className={cn(
                  "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                  selectedIndex === index
                    ? "border-white scale-110 shadow-xl"
                    : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={item.thumbnail || "/placeholder.svg"}
                  alt={item.alt}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  unoptimized
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="h-5 w-5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Thumbnails Button */}
      {mediaItems.length > 1 && (
        <button
          onClick={() => setShowThumbnails(!showThumbnails)}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/60 hover:text-white text-xs"
        >
          {showThumbnails ? "▼" : "▲"}
        </button>
      )}
    </div>
  );
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ ad }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Use real ad images or fallback to empty array
  const images = ad.images && ad.images.length > 0 ? ad.images : [];

  // Convert images array to MediaItem format
  const mediaItems: MediaItem[] = images.map((imageUrl, index) => ({
    id: index + 1,
    type: "image" as const,
    src: imageUrl,
    thumbnail: imageUrl,
    alt: `${ad.title || "Product"} - Image ${index + 1}`,
  }));

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="overflow-hidden sticky lg:relative z-10 top-0 left-0 w-full">
      {/* Main Image */}
      <div className="relative aspect-[16/9]">
        {images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex]}
              alt={`${ad.title || "Product"} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover md:rounded-xl"
              unoptimized
            />

            {/* Premium Badge */}
            {ad.isFeatured && (
              <div className="lg:block hidden absolute bottom-3 left-3">
                <Image
                  src={"/premium.svg"}
                  alt="Premium"
                  width={31}
                  height={31}
                />
              </div>
            )}

            {/* Right side - Share and Save */}
            <div className="sm:hidden flex items-center gap-2 z-10 sm:gap-4 absolute top-3 right-3">
              <button className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110">
                <Share2 className="h-5 w-5" />
                <span className="text-sm font-medium sm:block hidden">
                  Share
                </span>
              </button>

              <CollectionDrawer
                trigger={
                  <button className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110">
                    <Heart className="h-5 w-5" />
                    <span className="text-sm font-medium sm:block hidden">
                      Save
                    </span>
                  </button>
                }
              />
            </div>

            {/* Image Counter - Opens Gallery */}
            {images.length > 0 && (
              <div className="absolute bottom-8 lg:bottom-4 right-4">
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="bg-white px-2 py-1 rounded-sm text-sm flex items-center gap-1 cursor-pointer hover:scale-110 transition-all"
                >
                  <ImagePlusIcon className="h-4 w-4" />
                  <span className="text-xs font-semibold">
                    {images.length} Photos
                  </span>
                </button>
              </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={handlePrevious}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  iconPosition="center"
                  className="size-8 rounded-full absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                />
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={handleNext}
                  icon={<ChevronRight className="h-4 w-4" />}
                  iconPosition="center"
                  className="size-8 rounded-full absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                />
              </>
            )}

            {/* Image Dots */}
            {images.length > 1 && (
              <div className="hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
              <Camera className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No images available</p>
            </div>
          </div>
        )}
      </div>

      {/* Full-screen Gallery Modal */}
      <Gallery
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        mediaItems={mediaItems}
        initialIndex={currentImageIndex}
      />
    </div>
  );
};

export default ProductGallery;

