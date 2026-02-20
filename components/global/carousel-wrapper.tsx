"use client";

import React, { useEffect, useRef, useState, useCallback, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CarouselWrapperProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  shadowColorClassName?: string;
  hideScrollbar?: boolean;
  scrollAmount?: number; // 0 to 1, percentage of clientWidth
}

export const CarouselWrapper = ({
  children,
  className,
  containerClassName,
  shadowColorClassName = "from-white dark:from-gray-950",
  hideScrollbar = true,
  scrollAmount = 0.7,
}: CarouselWrapperProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScroll();
      container.addEventListener("scroll", checkScroll);

      const resizeObserver = new ResizeObserver(checkScroll);
      resizeObserver.observe(container);

      // Also check on window resize
      window.addEventListener("resize", checkScroll);

      return () => {
        container.removeEventListener("scroll", checkScroll);
        resizeObserver.disconnect();
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [checkScroll, children]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const amount = container.clientWidth * scrollAmount;
      container.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={cn("relative group/carousel w-full", className)}>
      {/* Left Scroll Button and Gradient */}
      {canScrollLeft && (
        <>
          <div 
            className={cn(
                "absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r to-transparent z-10 pointer-events-none transition-opacity duration-300",
                shadowColorClassName
            )} 
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hidden sm:flex hover:bg-gray-50 dark:hover:bg-gray-800/80"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className={cn(
          "flex flex-1 items-center gap-3 overflow-x-auto relative scroll-smooth",
          hideScrollbar && "scrollbar-hide",
          containerClassName
        )}
      >
        {children}
      </div>

      {/* Right Scroll Button and Gradient */}
      {canScrollRight && (
        <>
          <div 
            className={cn(
                "absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l to-transparent z-10 pointer-events-none transition-opacity duration-300",
                shadowColorClassName
            )} 
          />
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hidden sm:flex hover:bg-gray-50 dark:hover:bg-gray-800/80"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
