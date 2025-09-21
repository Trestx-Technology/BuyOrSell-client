"use client";

import { GenericCarousel } from "@/components/global/generic-carousel";
import { deals, type DealItem } from "@/constants/deals";
import { motion } from "framer-motion";

export default function HotDealsCarousel() {
  const bannerItems = deals.map((deal: DealItem) => ({
    id: deal.id,
    image: deal.image,
    callToAction: deal.title,
    alt: deal.title,
  }));

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
      <GenericCarousel
        banners={bannerItems}
        autoPlay={true}
        autoPlayInterval={4000}
        showDots={true}
        showNavigation={true}
        height="h-fit md:h-[400px]"
        className=" rounded-xl sm:rounded-none overflow-hidden w-full mx-auto"
      />
    </motion.div>
  );
}
