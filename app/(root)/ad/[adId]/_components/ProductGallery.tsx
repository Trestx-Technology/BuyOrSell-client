"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Camera, ImagePlusIcon, Heart, Share2 } from "lucide-react";
import CollectionDrawer from "@/app/(root)/favorites/_components/collection-drawer";
import { AD } from "@/interfaces/ad";
import GalleryDialog, { MediaItem } from "./GalleryDialog";
import { ShareDialog } from "@/components/ui/share-dialog";

interface ProductGalleryProps {
  ad: AD;
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
      <div className="bg-white border border-accent rounded-xl relative aspect-[16/9]">
        {images.length > 0 ? (
          <div className="relative w-full h-full relative">
            <Image
              src={images[currentImageIndex]}
              alt={`${ad.title || "Product"} - Image ${currentImageIndex + 1}`}
              fill
              className="absolute inset-0 object-contain md:rounded-xl"
              quality={90}
              sizes="(max-width: 768px) 100vw, 1200px"
              priority
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
              <ShareDialog
                url={window.location.href}
                title={ad.title}
                description={ad.description}
              >
                <button className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm font-medium sm:block hidden">
                    Share
                  </span>
                </button>
              </ShareDialog>

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
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="absolute bottom-8 lg:bottom-4 right-4 border bg-white px-2 py-1 rounded-sm text-sm flex items-center gap-1 cursor-pointer hover:scale-110 transition-all border-accent"
              >
                <ImagePlusIcon className="h-4 w-4" />
                <span className="text-xs font-semibold">
                  {images.length} Photos
                </span>
              </button>
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
      <GalleryDialog
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        mediaItems={mediaItems}
        initialIndex={currentImageIndex}
      />
    </div>
  );
};

export default ProductGallery;

