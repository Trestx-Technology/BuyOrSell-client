"use client";

import { BannerCarousel } from "@/components/global/banner-carousel";
import { banners } from "@/constants/banners";

export function HomeCarousel() {
  return (
    <BannerCarousel
      banners={banners}
      showSponsoredBanner={true}
      autoPlay={true}
      autoPlayInterval={5000}
      showDots={true}
      showNavigation={true}
    />
  );
}
