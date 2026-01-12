"use client";

import { BannerCarousel } from "@/components/global/banner-carousel";
import { useBannersByLocation } from "@/hooks/useBanners";
import { motion, Variants } from "framer-motion";

export function HomeCarousel() {
  const {
    data: bannersData,
    isLoading: isLoadingBanners,
    error: errorBanners,
  } = useBannersByLocation("homepage-carousel");

  // Optimized blur fade animation variants
  const blurFadeVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smoother animation
      },
    },
  };

  return (
    <motion.div
      variants={blurFadeVariants}
      viewport={{ once: true, amount: 0.3 }}
    >
      <BannerCarousel
        banners={bannersData?.data?.banners || []}
        isLoading={isLoadingBanners}
        error={errorBanners}
        showSponsoredBanner={true}
        autoPlay={true}
        autoPlayInterval={5000}
        showDots={true}
        showNavigation={true}
      />
    </motion.div>
  );
}
