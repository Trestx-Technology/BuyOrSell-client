"use client";

import { BannerCarousel } from "@/components/global/banner-carousel";
import { banners } from "@/constants/banners";
import { motion } from "framer-motion";

export function HomeCarousel() {
  // Blur fade animation variants
  const blurFadeVariants = {
    hidden: {
      opacity: 0.5,
      delay: 0.5,
      filter: "blur(5px)",
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 25,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.div
      variants={blurFadeVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <BannerCarousel
        banners={banners}
        showSponsoredBanner={true}
        autoPlay={true}
        autoPlayInterval={5000}
        showDots={true}
        showNavigation={true}
      />
    </motion.div>
  );
}
