"use client";

import * as React from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HomeCarousel({
  banners,
}: {
  banners: {
    id: number;
    image: StaticImageData | string;
    callToAction: string;
  }[];
}) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  const previousSlide = React.useCallback(() => {
    setCurrentSlide((curr) =>
      curr === 0
        ? (banners?.length || 1) - 1 // Fallback to 0 if length is undefined
        : curr - 1
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

  React.useEffect(() => {
    if (isLoading) return;

    const timer = setInterval(nextSlide, 5000);
    return () => clearTimeout(timer);
  }, [nextSlide, isLoading]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="max-w-[1280px] mx-auto flex items-center gap-4 p-4 md:p-0">
      {/* Main carousel skeleton */}
      <div className="relative z-10 h-[200px] md:h-[300px] w-full max-w-[880px] overflow-hidden">
        <div className="h-full w-full bg-gray-200 animate-pulse rounded-xl md:rounded-none"></div>

        {/* Skeleton dots */}
        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-2 w-2 rounded-full bg-gray-300" />
          ))}
        </div>

        {/* Skeleton arrows */}
        <div className="absolute left-[7%] bottom-1/4 bg-gray-200 rounded-full size-[32px]"></div>
        <div className="absolute right-[7%] bottom-1/4 bg-gray-200 rounded-full size-[32px]"></div>
      </div>

      {/* Sponsored banner skeleton */}
      <div className="md:block hidden w-full max-w-[400px] h-[300px] bg-gray-200 animate-pulse">
        <div className="w-full h-[85%] bg-gray-300"></div>
        <div className="w-full h-[15%] flex items-center justify-center">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="max-w-[1280px] mx-auto flex items-center p-4 md:p-0 relative overflow-visible">
      {/* Main Carousel */}
      <div className="relative z-10 sm:h-[300px] w-full max-w-[880px] overflow-hidden">
        <div
          className="flex  transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners?.map((slide) => (
            <div
              key={slide.id}
              className="sm:h-[300px] w-full flex bg-grey-100 flex-col shrink-0 relative "
            >
              <Image
                src={slide.image}
                alt={slide.callToAction}
                width={1200}
                height={400}
                className="rounded-xl md:rounded-none h-[190px] sm:h-full w-full object-cover object-right md:object-center"
              />
            </div>
          ))}
        </div>

        {/* Dot Indicators */}
        <div className="absolute md:block hidden bottom-7 left-1/2 flex -translate-x-1/2 space-x-2">
          {banners?.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-purple md:bg-white scale-110"
                  : "bg-purple/50 hover:bg-purple/70 md:bg-white/50 md:hover:bg-white/70"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        <Button
          variant="ghost"
          className=" hidden md:block absolute left-[7%] bottom-1/4 bg-white rounded-full size-[32px] border-grey-blue hover:bg-purple hover:text-white"
          size="icon"
          onClick={previousSlide}
        >
          <ChevronLeft className="size-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:block absolute right-[7%] bottom-1/4 bg-white rounded-full size-[32px] border-grey-blue hover:bg-purple hover:text-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Sponsored Banner */}
      <div className="md:block hidden w-full max-w-[400px] h-[300px] bg-black">
        <div className="w-full h-[85%] bg-white">
          <Image
            src={banners[1].image}
            alt="Banner 1"
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

      <div className="absolute md:hidden flex -bottom-3 left-1/2 -translate-x-1/2 space-x-2">
        {banners?.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-purple scale-110"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
