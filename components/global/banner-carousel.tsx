"use client";

import * as React from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BannerItem {
  id: number | string;
  image: StaticImageData | string;
  callToAction: string;
  alt?: string;
}

export interface BannerCarouselProps {
  banners: BannerItem[];
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

export function BannerCarousel({
  banners,
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
  onSlideChange,
}: BannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

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

  // Simulate API call loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-play functionality
  React.useEffect(() => {
    if (isLoading || !autoPlay) return;

    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearTimeout(timer);
  }, [nextSlide, isLoading, autoPlay, autoPlayInterval]);

  // Callback for slide change
  React.useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentSlide);
    }
  }, [currentSlide, onSlideChange]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
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

      {/* Sponsored banner skeleton */}
      {showSponsoredBanner && (
        <div className="md:block hidden w-full max-w-[400px] h-[300px] bg-gray-200 animate-pulse">
          <div className="w-full h-[85%] bg-gray-300"></div>
          <div className="w-full h-[15%] flex items-center justify-center">
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      className={`${maxWidth} mx-auto flex items-center p-4 md:p-0 relative overflow-visible ${containerClassName}`}
    >
      {/* Main Carousel */}
      <div
        className={`relative z-10 ${height} w-full max-w-[880px] overflow-hidden ${className}`}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners?.map((slide) => (
            <div
              key={slide.id}
              className={`${height} w-full flex bg-grey-100 flex-col shrink-0 relative`}
            >
              <Image
                src={slide.image}
                alt={slide.alt || slide.callToAction}
                width={1200}
                height={400}
                className={`rounded-xl md:rounded-none h-[190px] sm:h-full w-full object-cover object-right md:object-center ${imageClassName}`}
              />
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        {showDots && (
          <div className="absolute md:block hidden bottom-7 left-1/2 flex -translate-x-1/2 space-x-2">
            {banners?.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? `bg-purple md:bg-white scale-110 ${activeDotClassName}`
                    : `bg-purple/50 hover:bg-purple/70 md:bg-white/50 md:hover:bg-white/70 ${dotClassName}`
                }`}
                onClick={() => handleSlideChange(index)}
              />
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <Button
              variant="ghost"
              className={cn(
                "hidden md:flex absolute left-[7%] bottom-1/4 bg-white rounded-full size-8 items-center justify-center border-grey-blue hover:bg-purple hover:text-white",
                buttonClassName,
                prevButtonClassName
              )}
              size="icon"
              icon={<ChevronLeft />}
              iconPosition="center"
              onClick={previousSlide}
            />
            <Button
              variant="ghost"
              className={cn(
                "hidden md:flex absolute right-[7%] bottom-1/4 bg-white rounded-full size-8 items-center justify-center border-grey-blue hover:bg-purple hover:text-white",
                buttonClassName,
                nextButtonClassName
              )}
              size="icon"
              icon={<ChevronRight />}
              iconPosition="center"
              onClick={nextSlide}
            />
          </>
        )}
      </div>

      {/* Sponsored Banner */}
      {showSponsoredBanner && banners && banners.length > 1 && (
        <div
          className={`md:block hidden w-full max-w-[400px] h-[300px] bg-black ${sponsoredBannerClassName}`}
        >
          <div className="w-full h-[85%] bg-white">
            <Image
              src={banners[1].image}
              alt={banners[1].alt || banners[1].callToAction}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full h-[15%] flex items-center justify-center">
            <Button
              size="sm"
              className="rounded-sm bg-white opacity-70 text-black mx-auto hover:opacity-100 hover:bg-white transition-all duration-300"
            >
              Explore More
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Dots */}
      {showDots && (
        <div className="absolute md:hidden flex -bottom-3 left-1/2 -translate-x-1/2 space-x-2">
          {banners?.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? `bg-purple scale-110 ${activeDotClassName}`
                  : `bg-gray-300 hover:bg-gray-400 ${dotClassName}`
              }`}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
