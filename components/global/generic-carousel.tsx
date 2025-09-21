"use client";

import * as React from "react";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BannerItem {
  id: number | string;
  image: StaticImageData | string;
  callToAction: string;
  alt?: string;
}

export interface GenericCarouselProps {
  banners: BannerItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showNavigation?: boolean;
  className?: string;
  containerClassName?: string;
  buttonClassName?: string;
  prevButtonClassName?: string;
  nextButtonClassName?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  height?: string;
  onSlideChange?: (index: number) => void;
}

export function GenericCarousel({
  banners,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showNavigation = true,
  className = "",
  containerClassName = "",
  buttonClassName = "",
  prevButtonClassName = "",
  nextButtonClassName = "",
  dotClassName = "",
  activeDotClassName = "",
  height = "h-[200px] md:h-[300px]",
  onSlideChange,
}: GenericCarouselProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  const previousSlide = React.useCallback(() => {
    setCurrentSlide((curr) =>
      curr === 0 ? (banners?.length || 1) - 1 : curr - 1
    );
  }, [banners?.length]);

  const nextSlide = React.useCallback(() => {
    setCurrentSlide((curr) =>
      curr === (banners?.length || 1) - 1 ? 0 : curr + 1
    );
  }, [banners?.length]);

  // Loading state for smooth UX
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Auto-play functionality
  React.useEffect(() => {
    if (isLoading || !autoPlay || !banners?.length) return;

    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearTimeout(timer);
  }, [nextSlide, isLoading, autoPlay, autoPlayInterval, banners?.length]);

  // Callback for slide change
  React.useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentSlide);
    }
  }, [currentSlide, onSlideChange]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  // Banner renderer
  const renderBanner = (banner: BannerItem) => (
    <div
      key={banner.id}
      className={`${height} w-full flex bg-grey-100 flex-col shrink-0 relative`}
    >
      <Image
        src={banner.image}
        alt={banner.alt || banner.callToAction}
        width={1200}
        height={400}
        unoptimized
        className="rounded-xl md:rounded-none h-[190px] sm:h-full w-full object-cover object-left md:object-center"
      />
    </div>
  );

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className={`flex items-center gap-4 p-4 md:p-0 ${containerClassName}`}>
      <div
        className={`relative z-10 ${height} w-full max-w-[880px] overflow-hidden ${className}`}
      >
        <div className="h-full w-full bg-gray-200 animate-pulse rounded-xl md:rounded-none"></div>

        {/* Skeleton dots */}
        {showDots && (
          <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 space-x-2">
            {Array.from({ length: Math.min(banners?.length || 3, 3) }).map(
              (_, index) => (
                <div key={index} className="h-2 w-2 rounded-full bg-gray-300" />
              )
            )}
          </div>
        )}

        {/* Skeleton arrows */}
        {showNavigation && (
          <>
            <div className="absolute left-[7%] bottom-1/4 bg-gray-200 rounded-full size-[32px]"></div>
            <div className="absolute right-[7%] bottom-1/4 bg-gray-200 rounded-full size-[32px]"></div>
          </>
        )}
      </div>
    </div>
  );

  if (!banners || banners.length === 0) {
    return null;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      className={`flex items-center p-4 md:p-0 relative overflow-visible ${containerClassName}`}
    >
      {/* Main Carousel */}
      <div
        className={`relative z-10 ${height} w-full overflow-hidden ${className}`}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => renderBanner(banner))}
        </div>

        {/* Dot Indicators */}
        {showDots && (
          <div className="absolute flex bottom-2 md:bottom-7 left-1/2 -translate-x-1/2 space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`size-2 md:size-3 rounded-full transition-all duration-300 border-grey-blue border ${
                  index === currentSlide
                    ? `scale-110 bg-dark-blue ${activeDotClassName}`
                    : ` hover:bg-purple/70 bg-transparent md:hover:bg-white/70 ${dotClassName}`
                }`}
                onClick={() => handleSlideChange(index)}
              />
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        {showNavigation && banners.length > 1 && (
          <>
            <Button
              variant="ghost"
              className={cn(
                "hidden md:flex absolute left-[7%] bottom-1/2 bg-dark-blue text-white rounded-full size-8 items-center justify-center border-grey-blue hover:bg-purple hover:text-white",
                buttonClassName,
                prevButtonClassName
              )}
              size="icon"
              onClick={previousSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "hidden md:flex bg-dark-blue text-white absolute right-[7%] bottom-1/2 rounded-full size-8 items-center justify-center border-grey-blue hover:bg-purple hover:text-white",
                buttonClassName,
                nextButtonClassName
              )}
              size="icon"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
