"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  ImagePlusIcon,
  Heart,
  Share2,
  Repeat,
  Info,
  Play,
  ImageOff,
} from "lucide-react";
import CollectionManager from "@/components/global/collection-manager";
import { cn } from "@/lib/utils";
import { AD } from "@/interfaces/ad";
import GalleryDialog, { MediaItem } from "./GalleryDialog";
import { ShareDialog } from "@/components/ui/share-dialog";
import { ExchangeableAdWrapper } from "./ExchangeableAdWrapper";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import { BASE64 } from "@/constants/base64";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProductGalleryProps {
  ad: AD;
}

const GalleryImage = ({
  src,
  alt,
  fill,
  className,
  quality,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  quality?: number;
  sizes?: string;
  priority?: boolean;
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <ImageOff className="text-gray-300 w-10 h-10" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      quality={quality}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={BASE64}
      onError={() => setHasError(true)}
    />
  );
};

const ProductGallery: React.FC<ProductGalleryProps> = ({ ad }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);

  // Use real ad images or fallback to empty array
  const images = ad.images && ad.images.length > 0 ? ad.images : [];
  const hasVideo = !!ad.videoUrl;

  // Convert images and video to MediaItem format
  const mediaItems: MediaItem[] = useMemo(() => {
    const items: MediaItem[] = [];

    // Add video first if it exists
    if (hasVideo && ad.videoUrl) {
      items.push({
        id: 0,
        type: "video" as const,
        src: ad.videoUrl,
        thumbnail: images[0] || "/placeholder.svg", // Use first image as video thumbnail
        alt: `${ad.title || "Product"} - Video`,
      });
    }

    // Add all images
    images.forEach((imageUrl, index) => {
      items.push({
        id: index + 1,
        type: "image" as const,
        src: imageUrl,
        thumbnail: imageUrl,
        alt: `${ad.title || "Product"} - Image ${index + 1}`,
      });
    });

    return items;
  }, [images, hasVideo, ad.videoUrl, ad.title]);

  const handlePrevious = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Check if ad is exchangeable and get exchange data
  const isExchangeable = ad.upForExchange || ad.isExchangable || false;

  // Get exchange data from ad.exchangeWith
  const exchangeData = useMemo(() => {
    if (!isExchangeable || !ad.exchangeWith) return null;

    const exchangeWith = ad.exchangeWith;

    return {
      image: exchangeWith.imageUrl || "/placeholder.svg",
      title: exchangeWith.title || "Item for Exchange",
      description:
        exchangeWith.description || "Looking for items of similar value",
    };
  }, [ad, isExchangeable]);

  return (
    <div className="overflow-hidden sticky lg:relative z-10 top-0 left-0 w-full">
      {/* Main Image/Video */}
      <div className="bg-white dark:bg-slate-900 border border-accent dark:border-slate-800 rounded-xl relative aspect-[16/9]">
        {mediaItems.length > 0 ? (
          <div className="relative w-full h-full">
            {mediaItems[currentImageIndex].type === "video" ? (
              <div className="relative w-full h-full">
                <GalleryImage
                  src={mediaItems[currentImageIndex].thumbnail}
                  alt={mediaItems[currentImageIndex].alt}
                  fill
                  className="absolute inset-0 object-cover md:rounded-xl"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
                {/* Video Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 md:rounded-xl">
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 hover:bg-white transition-all hover:scale-110 shadow-lg"
                    aria-label="Play video"
                  >
                    <Play className="h-8 w-8 text-purple ml-1" />
                  </button>
                </div>
                {/* Video Badge */}
                <div className="absolute top-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  Video
                </div>
              </div>
            ) : (
                <GalleryImage
                src={mediaItems[currentImageIndex].src}
                alt={mediaItems[currentImageIndex].alt}
                fill
                className="absolute inset-0 object-contain md:rounded-xl"
                quality={90}
                sizes="(max-width: 768px) 100vw, 1200px"
                priority
              />
            )}

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
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={ad.title}
                description={ad.description}
              >
                <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 dark:text-gray-300 hover:text-purple transition-all cursor-pointer hover:scale-110">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm font-medium sm:block hidden">
                    Share
                  </span>
                </button>
              </ShareDialog>

              <CollectionManager
                itemId={ad._id}
                itemTitle={ad.title}
                itemImage={images[0]}
                className="w-full"
              >
                <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 dark:text-gray-300 hover:text-purple transition-all cursor-pointer hover:scale-110">
                  <Heart className={cn("h-5 w-5", ad.isAddedInCollection && "fill-purple text-purple")} />
                    <span className="text-sm font-medium sm:block hidden">
                    {ad.isAddedInCollection ? "Saved" : "Save"}
                    </span>
                  </button>
              </CollectionManager>
            </div>

            {/* Media Counter - Opens Gallery */}
            {mediaItems.length > 0 && (
              <button
                onClick={() => setIsGalleryOpen(true)}
                className="absolute bottom-8 lg:bottom-4 right-4 border bg-white dark:bg-slate-800 dark:border-slate-700 px-2 py-1 rounded-sm text-sm flex items-center gap-1 cursor-pointer hover:scale-110 transition-all border-accent"
              >
                <ImagePlusIcon className="h-4 w-4" />
                <span className="text-xs font-semibold">
                  View all &nbsp;
                  {mediaItems.length}
                  &nbsp;
                  {hasVideo && currentImageIndex === 0
                    ? "Media"
                    : mediaItems.length === 1 && hasVideo
                    ? "Video"
                    : "Photos"}
                </span>
              </button>
            )}

            {/* Exchange Available Button */}
            {isExchangeable && exchangeData && (
              <div className="flex items-center gap-2 absolute top-8 lg:top-4 right-4">
                <ResponsiveDialogDrawer
                  open={isExchangeDialogOpen}
                  onOpenChange={setIsExchangeDialogOpen}
                  title="Exchange Information"
                  dialogContentClassName="sm:max-w-2xl"
                  trigger={
                    <button className="border bg-white dark:bg-slate-800 dark:border-slate-700 px-2 py-1 rounded-sm text-sm flex items-center gap-1 cursor-pointer hover:scale-110 transition-all border-accent">
                      <Repeat className="h-4 w-4" />
                      <span className="text-xs font-semibold">
                        Exchange Available
                      </span>
                    </button>
                  }
                >
                  <ExchangeableAdWrapper exchangeAd={exchangeData} />
                </ResponsiveDialogDrawer>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                      >
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">What is Exchange?</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-pretty">
                        Exchange allows you to swap this item with another
                        user&apos;s item of similar value. Both parties agree to
                        trade their items directly, creating a win-win
                        transaction without money changing hands.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            {/* Navigation Arrows */}
            {mediaItems.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={handlePrevious}
                  icon={<ChevronLeft className="h-4 w-4" />}
                  iconPosition="center"
                  className="size-8 rounded-full absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg"
                />
                <Button
                  variant="secondary"
                  size="icon-sm"
                  onClick={handleNext}
                  icon={<ChevronRight className="h-4 w-4" />}
                  iconPosition="center"
                  className="size-8 rounded-full absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 shadow-lg"
                />
              </>
            )}

            {/* Media Dots */}
            {mediaItems.length > 1 && (
              <div className="hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:flex gap-2">
                {mediaItems.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => handleImageSelect(index)}
                    className={`w-2 h-2 rounded-full transition-all relative ${
                      index === currentImageIndex
                        ? "bg-white scale-125"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    title={item.type === "video" ? "Video" : `Image ${index}`}
                  >
                    {item.type === "video" && index === currentImageIndex && (
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-purple rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-slate-800">
              <div className="text-center text-gray-400 dark:text-gray-500">
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
