"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBannersBySlug } from "@/hooks/useBanners";
import { CarouselWrapper } from "@/components/global/carousel-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

export function ExploreDealsBanner() {
  const {
    data: exploreDealsBanners,
    isLoading,
    error,
  } = useBannersBySlug("explore-deals");

  if (isLoading) {
    return <Skeleton className="h-[380px] w-full rounded-[32px]" />;
  }

  // Handle both flat and nested response structures from the API
  const bannersData = (exploreDealsBanners as any)?.data || exploreDealsBanners;
  const banners = bannersData?.banners || [];


  if (!banners || banners.length === 0) {
    // Fallback if no banners are returned from API
    return (
      <div className="relative rounded-[32px] overflow-hidden max-w-[338px] h-[380px] group border border-white/10 shadow-xl">
        <Image
          src="/images/hero/dubai-skyline.png"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale brightness-75"
          alt="Dubai Skyline"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-8 pb-10">
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            Post an Ad for Free
          </h2>
          <p className="text-white/80 text-xs mb-6 leading-relaxed max-w-[220px]">
            Explore our exclusive collection of premium properties in UAE.
          </p>
          <Button
            className="w-fit bg-white text-black hover:bg-gray-100 dark:bg-white dark:text-black rounded-full h-[48px] px-6 text-sm font-bold group transition-all"
            asChild
          >
            <Link href="/ad/create">
              Explore More
              <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <CarouselWrapper
      className="h-[380px] max-w-[338px]"
      containerClassName="h-full"
      shadowColorClassName="from-black/50 to-transparent"
    >
      {banners.map((banner: any, index: number) => (
        <div
          key={index}
          className="relative min-w-full h-full rounded-[32px] overflow-hidden group border border-white/10 shadow-xl"
        >
          <Image
            src={banner.image || banner.imageUrl || "/images/placeholder.png"}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale brightness-[0.6]"
            alt={banner.title || "Explore Deals"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-8 pb-10">
            <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
              {banner.title || "Post an Ad for Free"}
            </h2>
            <p className="text-white/80 text-xs mb-6 leading-relaxed max-w-[220px]">
              {banner.subTitle ||
                banner.description ||
                "Explore our exclusive collection of premium properties in UAE."}
            </p>
            <Button
              className="w-fit bg-white text-black hover:bg-gray-100 dark:bg-white dark:text-black rounded-full h-[48px] px-6 text-sm font-bold group transition-all"
              asChild
            >
              <Link href={banner.sponsoredLink || banner.link || "/ad/create"}>
                {banner.buttonLabel || "Explore More"}
                <ChevronRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </CarouselWrapper>
  );
}
