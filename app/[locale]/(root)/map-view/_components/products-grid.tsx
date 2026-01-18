"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import ListingCard from "@/components/features/listing-card/listing-card";
import { useRouter } from "nextjs-toploader/app";
import { AD } from "@/interfaces/ad";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { useLocale } from "@/hooks/useLocale";

export interface ProductsGridProps {
  className?: string;
  ads: AD[];
  isLoading?: boolean;
  title?: string;
  showReturnButton?: boolean;
  onProductClick?: (ad: AD) => void;
  onFavoriteToggle?: (adId: string) => void;
  gridClassName?: string;
}

export default function ProductsGrid({
  className,
  ads,
  isLoading = false,
  title = "Properties for sale in UAE",
  showReturnButton = true,
  onProductClick,
  onFavoriteToggle,
  gridClassName,
}: ProductsGridProps) {
  const { locale } = useLocale();
  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        duration: 0.5,
      },
    },
  };

  const handleProductClick = (ad: AD) => {
    onProductClick?.(ad);
  };

  const handleFavoriteToggle = (adId: string) => {
    onFavoriteToggle?.(adId);
  };

  const router = useRouter();

  // Transform ads to listing card props
  const listingCards = ads.map((ad) => transformAdToListingCard(ad, locale));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "w-full mx-auto h-full flex flex-col overflow-y-auto",
        className
      )}
    >
      {/* Products Grid */}
      {isLoading ? (
        <div
          className={cn("grid grid-cols-1 md:grid-cols-2 gap-3", gridClassName)}
        >
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-64 bg-gray-200 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-2 gap-3 overflow-y-auto h-full"
            // gridClassName
          )}
        >
          {listingCards.length > 0 ? (
            listingCards.map((listingCard) => {
              const ad = ads.find((a) => a._id === listingCard.id);
              if (!ad || !listingCard) return null;

              return (
                <motion.div
                  key={listingCard.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="group cursor-pointer"
                  onClick={() => handleProductClick(ad)}
                >
                  <ListingCard {...listingCard} />
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 font-inter">No products found</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && ads.length === 0 && (
        <motion.div variants={itemVariants} className="text-center py-12">
          <p className="text-gray-500 font-inter">No products found</p>
        </motion.div>
      )}
    </motion.div>
  );
}
