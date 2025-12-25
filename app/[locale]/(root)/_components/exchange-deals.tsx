"use client";

import { useState, useMemo, useEffect } from "react";
import { Typography } from "@/components/typography";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import ListingCard from "@/components/global/listing-card";
import { CategoryTreeWithAds, DealAd } from "@/interfaces/home.types";
import { AD } from "@/interfaces/ad";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { ListingCardProps } from "@/components/global/listing-card";
import { useLocale } from "@/hooks/useLocale";

// Framer Motion animation variants - using improved patterns from AI search bar
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
      delay: 0.1,
    },
  },
};

const tabsVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
      delay: 0.3,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
      delay: 0.5,
    },
  },
};

interface ExchangeDealsProps {
  className?: string;
  categoryTreeWithExchangeAds?: CategoryTreeWithAds[];
  isLoading?: boolean;
}

// Helper function to check if ad is premium
const isPremiumAd = (ad: AD | DealAd): boolean => {
  if ("_id" in ad && "isFeatured" in ad) {
    return (ad as AD).isFeatured === true;
  }
  // For DealAd, check if it has premium indicators (if any)
  return false;
};

// Helper function to check if ad has exchange available
const hasExchangeAvailable = (ad: AD | DealAd): boolean => {
  if ("_id" in ad) {
    const adObj = ad as AD;
    return Boolean(
      adObj.upForExchange ||
        adObj.isExchangable ||
        adObj.exchanged ||
        adObj.exchangeWith // If exchangeWith exists, exchange is available
    );
  }
  if ("id" in ad) {
    const dealAd = ad as DealAd;
    return Boolean(
      dealAd.isExchangeable || dealAd.exchanged || dealAd.exchangeWith // If exchangeWith exists, exchange is available
    );
  }
  return false;
};

export default function ExchangeDeals({
  className = "",
  categoryTreeWithExchangeAds = [],
  isLoading = false,
}: ExchangeDealsProps) {
  const { t, locale } = useLocale();
  // Transform and filter exchange ads from categoryTreeWithExchangeAds
  const transformedAdsByCategory = useMemo(() => {
    if (
      !categoryTreeWithExchangeAds ||
      categoryTreeWithExchangeAds.length === 0
    ) {
      return {};
    }

    const adsByCategory: Record<string, ListingCardProps[]> = {};

    categoryTreeWithExchangeAds.forEach((category) => {
      if (category.ads && category.ads.length > 0) {
        const categoryName = category.name.toLowerCase().replace(/\s+/g, "-");

        // Filter ads: must be premium OR have exchange available
        // categoryTreeWithExchangeAds should contain AD[] type
        const filteredAds = (category.ads as AD[]).filter((ad) => {
          return isPremiumAd(ad) || hasExchangeAvailable(ad);
        });

        // Transform filtered ads
        adsByCategory[categoryName] = filteredAds
          .map((ad) => transformAdToListingCard(ad, locale))
          .map((card) => ({
            ...card,
            isExchange: true, // All ads in exchange deals should show exchange badge
          }));
      }
    });

    return adsByCategory;
  }, [categoryTreeWithExchangeAds]);

  // Get category names for tabs
  const categories = useMemo(() => {
    if (
      !categoryTreeWithExchangeAds ||
      categoryTreeWithExchangeAds.length === 0
    ) {
      return [];
    }

    const isArabic = locale === "ar";

    return categoryTreeWithExchangeAds
      .filter((category) => {
        // Only show categories that have filtered ads
        const categoryName = category.name.toLowerCase().replace(/\s+/g, "-");
        const ads = transformedAdsByCategory[categoryName] || [];
        return ads.length > 0;
      })
      .map((category) => {
        const name = isArabic
          ? category.nameAr || category.name
          : category.name;
        return {
          id: category._id,
          name,
          value: category.name.toLowerCase().replace(/\s+/g, "-"), // Keep original name for value to maintain consistency
        };
      });
  }, [categoryTreeWithExchangeAds, transformedAdsByCategory, locale]);

  // Get default tab value
  const defaultTab = categories.length > 0 ? categories[0].value : "";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Update active tab when categories change
  useEffect(() => {
    if (defaultTab && !activeTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, activeTab]);

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  // Don't render if no categories
  if (!isLoading && categories.length === 0) {
    return null;
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      style={{
        background:
          "radial-gradient(circle,rgba(55, 231, 182, 1) 0%, rgba(46, 31, 148, 1) 100%)",
      }}
      className={`bg-[#B7FBE9] xl:rounded-lg max-w-[1180px] mx-auto py-5 ${className}`}
    >
      <div className="w-full mx-auto pl-5">
        {/* Header with Timer */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center justify-between mb-4"
        >
          {/* Hot Deals Title */}
          <Typography
            variant="lg-black-inter"
            className="text-lg font-medium text-white"
          >
            {t.home.exchangeDeals.title}
          </Typography>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          variants={tabsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-4"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Typography variant="body" className="text-white">
                Loading exchange offers...
              </Typography>
            </div>
          ) : categories.length > 0 ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex items-center justify-start w-full bg-transparent gap-3 overflow-x-auto scrollbar-hide">
                {categories.map((category, index) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.value}
                    className={`data-[state=active]:bg-teal hover:data-[state=inactive]:bg-teal w-fit ${
                      index === 0 && "data-[state=active]:bg-teal"
                    }`}
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Dynamic Tab Content */}
              {categories.map((category) => {
                const categoryAds =
                  transformedAdsByCategory[category.value] || [];

                return (
                  <TabsContent
                    key={category.id}
                    value={category.value}
                    className="mt-4"
                  >
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      className="flex gap-4 items-center"
                    >
                      {/* Deals Carousel */}
                      <div className="flex-1 overflow-hidden">
                        {categoryAds.length > 0 ? (
                          <CardsCarousel title="" showNavigation={true}>
                            {categoryAds.map((ad, index) => (
                              <motion.div
                                key={ad.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{
                                  type: "spring" as const,
                                  stiffness: 300,
                                  damping: 22,
                                  delay: 0.6 + index * 0.08,
                                }}
                                className="flex-[0_0_auto] max-w-[220px] w-full"
                              >
                                <ListingCard
                                  {...ad}
                                  isFavorite={favorites.has(ad.id)}
                                  onFavorite={handleFavoriteToggle}
                                  showSeller={true}
                                  showSocials={true}
                                  className="w-full"
                                />
                              </motion.div>
                            ))}
                          </CardsCarousel>
                        ) : (
                          <div className="flex items-center justify-center py-10">
                            <Typography variant="body" className="text-white">
                              No exchange offers available for this category
                            </Typography>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : null}
        </motion.div>
      </div>
    </motion.section>
  );
}
