"use client";

import * as React from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface MidBannerItem {
  id: number | string;
  image: StaticImageData | string;
  callToAction: string;
  alt?: string;
}

export interface MidBannerCarouselProps {
  banners: MidBannerItem[];
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
  imageClassName?: string;
  maxWidth?: string;
  height?: string;
  onSlideChange?: (index: number) => void;
}

export function MidBannerCarousel({
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
  imageClassName = "",
  maxWidth = "max-w-[1180px]",
  height = "h-[150px] md:h-[300px]",
  onSlideChange,
}: MidBannerCarouselProps) {
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
      className={`${maxWidth} mx-auto flex items-center justify-center p-4 md:p-0 ${containerClassName}`}
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
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div
      className={cn(
        "mx-auto flex flex-col items-center justify-center p-4 md:p-0 relative overflow-visible",
        maxWidth,
        containerClassName
      )}
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
                className={` h-[150px] sm:h-full w-full object-cover object-right md:object-center ${imageClassName}`}
              />
            </div>
          ))}
        </div>

        {/* Dot Indicators */}

        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <Button
              variant="ghost"
              className={cn(
                "hidden md:flex absolute left-[7%] bottom-1/2 bg-black text-white rounded-full size-8 items-center justify-center border-grey-blue hover:bg-purple hover:text-white",
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
                "hidden md:flex absolute right-[7%] bottom-1/2 bg-black text-white rounded-full size-8 items-center justify-center border-grey-blue hover:bg-purple hover:text-white",
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

      <div className="flex items-center justify-center bg-black w-full max-w-[1150px] mx-auto py-3 mb-3 rounded-b-lg">
        {showDots && (
          <div className="flex space-x-2 w-full justify-center items-center">
            {banners?.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? `bg-white scale-110 ${activeDotClassName}`
                    : `border border-gray-300 hover:bg-gray-400 ${dotClassName}`
                }`}
                onClick={() => handleSlideChange(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
