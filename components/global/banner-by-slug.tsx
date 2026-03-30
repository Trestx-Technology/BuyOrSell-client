"use client";

import React from "react";
import Image from "next/image";
import { useBannersBySlug } from "@/hooks/useBanners";
import { BannerCTAWrapper } from "./banner-cta-wrapper";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";
import { SponsoredCarousel } from "./banner-carousel";

interface BannerBySlugProps {
  slug: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  aspectRatio?: "video" | "square" | "portrait" | "auto";
  withOverlay?: boolean;
}

export const BannerBySlug = ({
  slug,
  className,
  imageClassName,
  priority = false,
  aspectRatio = "auto",
  withOverlay = false,
}: BannerBySlugProps) => {
  const { data, isLoading, error } = useBannersBySlug(slug, { limit: 10 });

  const banners = data?.data?.banners || [];

  if (isLoading) {
    return (
      <div className={cn("w-full overflow-hidden rounded-[32px]", className)}>
        <Skeleton 
          className={cn(
            "w-full bg-gray-200 dark:bg-gray-800",
            aspectRatio === "video" && "aspect-video",
            aspectRatio === "square" && "aspect-square",
            aspectRatio === "portrait" && "aspect-[3/4]",
            aspectRatio === "auto" && "h-[380px]"
          )} 
        />
      </div>
    );
  }

  if (error || !banners || banners.length === 0) {
    return null;
  }

  // If there are multiple banners, use the existing SponsoredCarousel
  if (banners.length > 1 && !withOverlay) {
    return (
      <SponsoredCarousel 
        banners={banners} 
        className={cn("rounded-[32px] overflow-hidden shadow-lg", className)}
        height={aspectRatio === "auto" ? "h-[380px]" : "h-full"}
      />
    );
  }
  
  const banner = banners[0];

  return (
    <div className={cn("w-full overflow-hidden rounded-[32px] group relative", className)}>
      <BannerCTAWrapper banner={banner} className="w-full h-full block">
        <div className={cn(
          "relative w-full h-full",
          aspectRatio === "video" && "aspect-video",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "portrait" && "aspect-[3/4]",
          aspectRatio === "auto" && "h-full"
        )}>
          <Image
            src={banner.image}
            alt={banner.title || "Banner"}
            fill
            className={cn(
              "object-cover transition-transform duration-1000 group-hover:scale-110",
              withOverlay && "grayscale brightness-[0.6]",
              imageClassName
            )}
            priority={priority}
            unoptimized={banner.image.endsWith('.gif')}
          />
          
          {withOverlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-8 pb-10">
              {banner.title && (
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                  {banner.title}
                </h2>
              )}
              {banner.subTitle && (
                <p className="text-white/80 text-xs mb-6 leading-relaxed max-w-[220px]">
                  {banner.subTitle}
                </p>
              )}
              <div className="w-fit bg-purple text-white hover:bg-purple/90 rounded-2xl h-[48px] px-6 text-sm font-bold flex items-center justify-center transition-all group-hover:shadow-lg">
                {banner.buttonLabel || "Explore More"}
                <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          )}
        </div>
      </BannerCTAWrapper>
    </div>
  );
};
