"use client";

import { motion } from "framer-motion";
import { CardsCarousel } from "@/components/global/cards-carousel";
import ListingCard from "@/components/global/listing-card";
import { AD } from "@/interfaces/ad";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { useLocale } from "@/hooks/useLocale";
import { containerVariants, itemVariants } from "@/utils/animation-variants";

interface RecentViewsProps {
  recentlyViewedAds?: AD[];
  isLoading?: boolean;
}

export default function RecentViews({
  recentlyViewedAds = [],
  isLoading = false,
}: RecentViewsProps) {
  const { t, locale } = useLocale();

  // Transform AD objects to ListingCardProps (filter out any null/undefined ads)
  const listingItems = recentlyViewedAds
    .filter((ad): ad is AD => ad != null)
    .map((ad) => transformAdToListingCard(ad, locale));

  if (isLoading) {
    return (
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1180px] mx-auto px-4 xl:px-0"
      >
        <CardsCarousel title={t.home.recentViews.title}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-[0_0_auto] max-w-[190px] w-full bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
            >
              <div className="h-32 bg-gray-200"></div>
              <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </CardsCarousel>
      </motion.section>
    );
  }

  if (listingItems.length === 0) {
    return null;
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-[1180px] mx-auto"
    >
      <CardsCarousel title={t.home.recentViews.title}>
        {listingItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="flex gap-4 items-center"
          >
            <ListingCard
              {...item}
              isAddedInCollection={item.isAddedInCollection}
            />
          </motion.div>
        ))}
      </CardsCarousel>
    </motion.section>
  );
}
