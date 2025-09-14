import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

export interface CardsCarouselProps {
  children: React.ReactNode;
  title?: string;
  showNavigation?: boolean;
  className?: string;
  titleClassName?: string;
  breakpoints?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
}

export function CardsCarousel({
  children,
  title,
  showNavigation = true,
  titleClassName = "",
  className = "",
  breakpoints = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
}: CardsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 0px)": { slidesToScroll: breakpoints.mobile || 1 },
      "(min-width: 640px)": { slidesToScroll: breakpoints.tablet || 1 },
      "(min-width: 768px)": { slidesToScroll: breakpoints.desktop || 2 },
      "(min-width: 1024px)": { slidesToScroll: breakpoints.desktop || 3 },
      "(min-width: 1280px)": { slidesToScroll: breakpoints.wide || 4 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);
  const [slidesInView, setSlidesInView] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());

    // Get total slides and slides in view
    const total = emblaApi.slideNodes().length;
    const inView = emblaApi.slidesInView().length;
    setTotalSlides(total);
    setSlidesInView(inView);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h2
          className={cn("text-lg font-medium text-dark-blue", titleClassName)}
        >
          {title}
        </h2>
      )}

      <div className="relative overflow-visible">
        {showNavigation && totalSlides && (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full shadow-xl border-0 shadow-purple/20 text-dark-blue hover:bg-purple hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full shadow-xl border-0 shadow-purple/20 text-dark-blue hover:bg-purple hover:text-white disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 py-3">{children}</div>
        </div>
      </div>
    </div>
  );
}
