"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Banner } from "@/interfaces/banner.types";

interface SponsoredBannerProps {
  banner: Banner;
  className?: string;
}

const SponsoredBanner = React.memo(function SponsoredBanner({
  banner,
  className = "",
}: SponsoredBannerProps) {
  return (
    <div
      className={`md:block hidden w-full max-w-[400px] h-full bg-black ${className}`}
    >
      <Image
        src={banner.image}
        alt={banner.title || banner.titleAr || "Sponsored banner"}
        unoptimized
        width={400}
        height={300}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
});

export interface BannerCarouselProps {
  banners: Banner[];
  isLoading?: boolean;
  error: Error | null;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showNavigation?: boolean;
  showSponsoredBanner?: boolean;
  className?: string;
  containerClassName?: string;
  buttonClassName?: string;
  prevButtonClassName?: string;
  nextButtonClassName?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  imageClassName?: string;
  sponsoredBannerClassName?: string;
  maxWidth?: string;
  height?: string;
  onSlideChange?: (index: number) => void;
}

// Memoized loading skeleton
const LoadingSkeleton = React.memo(function LoadingSkeleton({
  maxWidth,
  height,
  containerClassName,
  showDots,
  showNavigation,
  showSponsoredBanner,
  bannersLength = 3,
}: {
  maxWidth: string;
  height: string;
  containerClassName: string;
  showDots: boolean;
  showNavigation: boolean;
  showSponsoredBanner: boolean;
  bannersLength?: number;
}) {
  return (
    <div
      className={`${maxWidth} mx-auto flex items-center gap-4 p-4 md:p-0 ${containerClassName}`}
    >
      {/* Main carousel skeleton */}
      <div
        className={`relative z-10 ${height} w-full max-w-[880px] overflow-hidden`}
      >
        <div className="h-full w-full bg-gray-200 animate-pulse rounded-xl md:rounded-none"></div>

        {/* Skeleton dots */}
        {showDots && (
          <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 space-x-2">
            {Array.from({ length: Math.min(bannersLength, 3) }).map(
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

      {/* Sponsored banner skeleton */}
      {showSponsoredBanner && (
        <div className="md:block hidden w-full max-w-[400px] h-[300px] bg-gray-200 animate-pulse"></div>
      )}
    </div>
  );
});

export function BannerCarousel({
  banners,
  isLoading,
  autoPlay = true,
  autoPlayInterval = 5000,
  showDots = true,
  showNavigation = true,
  showSponsoredBanner = false,
  className = "",
  containerClassName = "",
  buttonClassName = "",
  prevButtonClassName = "",
  nextButtonClassName = "",
  dotClassName = "",
  activeDotClassName = "",
  imageClassName = "",
  sponsoredBannerClassName = "",
  maxWidth = "max-w-[1280px]",
  height = "h-[200px] md:h-[300px]",
  error,
  onSlideChange,
}: BannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const autoPlayTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const bannersLength = banners?.length || 0;

  const clearAutoPlayTimer = React.useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
  }, []);

  const previousSlide = React.useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((curr) => (curr === 0 ? bannersLength - 1 : curr - 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [bannersLength, isTransitioning]);

  const nextSlide = React.useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((curr) => (curr === bannersLength - 1 ? 0 : curr + 1));
    setTimeout(() => setIsTransitioning(false), 500);
  }, [bannersLength, isTransitioning]);

  const handleSlideChange = React.useCallback(
    (index: number) => {
      if (isTransitioning || index === currentSlide) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 500);

      // Reset autoplay timer when manually changing slides
      if (autoPlay) {
        clearAutoPlayTimer();
        autoPlayTimerRef.current = setInterval(nextSlide, autoPlayInterval);
      }
    },
    [
      isTransitioning,
      currentSlide,
      autoPlay,
      autoPlayInterval,
      clearAutoPlayTimer,
      nextSlide,
    ]
  );

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || bannersLength <= 1) {
      clearAutoPlayTimer();
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentSlide((curr) => (curr === bannersLength - 1 ? 0 : curr + 1));
    }, autoPlayInterval);

    return () => clearAutoPlayTimer();
  }, [autoPlay, autoPlayInterval, bannersLength, clearAutoPlayTimer]);

  // Callback for slide change
  React.useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentSlide);
    }
  }, [currentSlide, onSlideChange]);

  if (isLoading) {
    return (
      <LoadingSkeleton
        maxWidth={maxWidth}
        height={height}
        containerClassName={containerClassName}
        showDots={showDots}
        showNavigation={showNavigation}
        showSponsoredBanner={showSponsoredBanner}
        bannersLength={bannersLength}
      />
    );
  }

  if (error || !banners || banners.length === 0) return null;

  return (
    <div
      className={`${maxWidth} h-[250px] mx-auto flex items-center p-4 md:p-0 relative overflow-visible ${containerClassName}`}
    >
      {/* Main Carousel */}
      <div
        className={`relative w-full max-w-[880px] overflow-hidden ${className} h-full`}
        style={{ willChange: "transform" }}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            willChange: "transform",
          }}
        >
          {banners.map((slide, index) => (
            <div
              key={slide._id}
              className={`${height} w-full flex bg-grey-100 flex-col shrink-0 relative`}
            >
              <Image
                src={slide.image}
                alt={slide.title || slide.titleAr || "Banner"}
                width={1200}
                height={400}
                className={`rounded-xl md:rounded-none h-full w-full object-cover object-right md:object-center ${imageClassName}`}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Dot Indicators - Desktop */}
        {showDots && bannersLength > 1 && (
          <div className="absolute md:flex hidden bottom-7 left-1/2 -translate-x-1/2 space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  index === currentSlide
                    ? `bg-white scale-110 ${activeDotClassName}`
                    : `bg-white/50 hover:bg-white/70 ${dotClassName}`,
                  isTransitioning && "pointer-events-none"
                )}
                onClick={() => handleSlideChange(index)}
                disabled={isTransitioning}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        {showNavigation && bannersLength > 1 && (
          <>
            <Button
              variant="ghost"
              className={cn(
                "hidden md:flex absolute left-[7%] bottom-1/4 bg-white rounded-full size-8 items-center justify-center border-grey-blue hover:bg-purple hover:text-white transition-colors",
                buttonClassName,
                prevButtonClassName,
                isTransitioning && "pointer-events-none opacity-50"
              )}
              size="icon"
              icon={<ChevronLeft />}
              iconPosition="center"
              onClick={previousSlide}
              disabled={isTransitioning}
              aria-label="Previous slide"
            />
            <Button
              variant="ghost"
              className={cn(
                "hidden md:flex absolute right-[7%] bottom-1/4 bg-white rounded-full size-8 items-center justify-center border-grey-blue hover:bg-purple hover:text-white transition-colors",
                buttonClassName,
                nextButtonClassName,
                isTransitioning && "pointer-events-none opacity-50"
              )}
              size="icon"
              icon={<ChevronRight />}
              iconPosition="center"
              onClick={nextSlide}
              disabled={isTransitioning}
              aria-label="Next slide"
            />
          </>
        )}
      </div>

      {/* Sponsored Banner */}
      {showSponsoredBanner && banners.length > 1 && (
        <SponsoredBanner
          banner={banners[1]}
          className={sponsoredBannerClassName}
        />
      )}

      {/* Mobile Dots */}
      {showDots && bannersLength > 1 && (
        <div className="absolute md:hidden flex -bottom-3 left-1/2 -translate-x-1/2 space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? `bg-purple scale-110 ${activeDotClassName}`
                  : `bg-gray-300 hover:bg-gray-400 ${dotClassName}`,
                isTransitioning && "pointer-events-none"
              )}
              onClick={() => handleSlideChange(index)}
              disabled={isTransitioning}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
