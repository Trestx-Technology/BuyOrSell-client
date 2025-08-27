"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { sampleListings, ListingItem } from "@/constants/sample-listings";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { ListingCard } from "@/components/global/listing-card";

export default function RecentViews() {
  const [listings, setListings] = useState<ListingItem[]>(sampleListings);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Intersection Observer for animation
  const setRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldAnimate(true);
          }
        },
        {
          threshold: 0.01,
          rootMargin: "0px",
        }
      );
      observer.observe(node);
    }
  }, []);

  const handleFavoriteToggle = (id: string | number) => {
    setListings((prev) =>
      prev.map((item: ListingItem) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.section
      ref={setRef}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      className="py-8 max-w-[1180px] mx-auto px-4 xl:px-0"
    >
      <CardsCarousel title="Recently Viewed">
        {listings.map((item: ListingItem) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="flex-[0_0_auto] max-w-[190px] w-full"
          >
            <ListingCard
              {...item}
              // Use the new dynamic specs system
              specs={{
                transmission: item.transmission,
                fuelType: item.fuelType,
                mileage: item.mileage,
                year: item.year,
              }}
              category="car"
              onFavoriteToggle={handleFavoriteToggle}
            />
          </motion.div>
        ))}
      </CardsCarousel>
    </motion.section>
  );
}
