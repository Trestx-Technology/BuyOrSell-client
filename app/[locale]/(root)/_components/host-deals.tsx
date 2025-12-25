"use client";

import { useState, useMemo, useEffect } from "react";
import { Clock } from "lucide-react";
import { Typography } from "@/components/typography";
import HotDealsListingCard from "@/components/global/hot-deals-listing-card";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { motion } from "framer-motion";
import { CategoryTreeWithAds } from "@/interfaces/home.types";
import { formatDate } from "@/utils/format-date";
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

interface HostDealsProps {
  className?: string;
  categoryTreeWithDealAds?: CategoryTreeWithAds[];
  isLoading?: boolean;
}

export default function HostDeals({
  className = "",
  categoryTreeWithDealAds = [],
  isLoading = false,
}: HostDealsProps) {
  const { t, locale } = useLocale();
  // Get category names for tabs
  const categories = useMemo(() => {
    if (!categoryTreeWithDealAds || categoryTreeWithDealAds.length === 0) {
      return [];
    }

    const isArabic = locale === "ar";

    return categoryTreeWithDealAds
      .filter((category) => category.ads && category.ads.length > 0)
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
  }, [categoryTreeWithDealAds, locale]);

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

  // Get active category and its ads
  const activeCategory = useMemo(() => {
    return categoryTreeWithDealAds.find(
      (category) =>
        category.name.toLowerCase().replace(/\s+/g, "-") === activeTab
    );
  }, [categoryTreeWithDealAds, activeTab]);

  // Simple mapper function to transform API ad to component props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapAdToCardProps = (ad: any) => {
    // Get location from address (use Arabic if locale is Arabic)
    const getLocation = (): string => {
      const isArabic = locale === "ar";
      const address = isArabic ? ad.addressAr || ad.address : ad.address;

      if (!address) return t.ad.sellerInfo.locationNotSpecified;
      const { state, city } = address;
      if (city && state) return `${city}, ${state}`;
      if (city) return city;
      if (state) return state;
      return t.ad.sellerInfo.locationNotSpecified;
    };

    // Get title (use Arabic if locale is Arabic)
    const getTitle = (): string => {
      const isArabic = locale === "ar";
      return isArabic ? ad.titleAr || ad.title : ad.title;
    };

    return {
      id: ad._id || ad.id,
      title: getTitle(),
      price: ad.discountedPrice || ad.price,
      originalPrice: ad.discountedPrice ? ad.price : undefined,
      discount: ad.dealPercentage,
      location: getLocation(),
      images: ad.images || [],
      extraFields: ad.extraFields || [],
      isExchange: ad.exchanged || ad.isExchangeable || false,
      postedTime: formatDate(ad.createdAt),
      dealValidThrough: ad.dealValidThru || ad.dealValidThrough || null,
      discountText: ad.dealPercentage
        ? `FLAT ${Math.round(ad.dealPercentage)}% OFF`
        : undefined,
      showDiscountBadge: !!ad.dealPercentage,
      showTimer: !!(ad.dealValidThru || ad.dealValidThrough),
      seller: ad.owner
        ? {
            name: ad.owner.name,
            firstName: ad.owner.firstName,
            lastName: ad.owner.lastName,
            image: ad.owner.image || null,
          }
        : undefined,
    };
  };

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

  // Calculate earliest deal validity for main timer
  const earliestDealValidity = useMemo(() => {
    if (!activeCategory?.ads) return null;

    const validDeals = activeCategory.ads
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((ad: any) => ad.dealValidThru || ad.dealValidThrough)
      .filter(Boolean) as string[];

    if (validDeals.length === 0) return null;

    const sortedDeals = validDeals.sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    return sortedDeals[0];
  }, [activeCategory]);

  // Main timer state
  const [mainTimer, setMainTimer] = useState<string>("");

  // Update main timer
  useEffect(() => {
    if (!earliestDealValidity) {
      setMainTimer("");
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(earliestDealValidity).getTime();
      const distance = end - now;

      if (distance > 0) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setMainTimer(`${hours}h ${minutes}m ${seconds}s remaining`);
      } else {
        setMainTimer("EXPIRED");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [earliestDealValidity]);

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
          "radial-gradient(circle, rgba(180, 207, 199, 1) 0%, rgba(132, 75, 143, 1) 100%)",
      }}
      className={`bg-[#B7FBE9] lg:rounded-lg  max-w-[1180px] mx-auto py-5 ${className}`}
    >
      <div className="w-full mx-auto">
        {/* Header with Timer */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-4 px-5">
            {/* Hot Deals Title */}
            <Typography
              variant="lg-black-inter"
              className="text-lg font-medium text-white"
            >
              {t.home.hostDeals.title}
            </Typography>

            {/* Main Timer */}
            {mainTimer && (
              <div className="bg-white rounded px-2 py-1 flex items-center gap-1">
                <Clock className="w-4 h-4 text-red-500" />
                <Typography
                  variant="xs-black-inter"
                  className="text-error-100 text-sm font-medium"
                >
                  {mainTimer}
                </Typography>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          variants={tabsVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-4 pl-5"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Typography variant="body" className="text-white">
                {t.home.hostDeals.loading}
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
                  <TabsTrigger key={category.id} value={category.value}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Dynamic Tab Content */}
              {categories.map((category) => {
                const categoryData = categoryTreeWithDealAds.find(
                  (cat) =>
                    cat.name.toLowerCase().replace(/\s+/g, "-") ===
                    category.value
                );
                const categoryAds = categoryData?.ads || [];

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
                            {categoryAds.map((ad, index) => {
                              const deal = mapAdToCardProps(ad);
                              return (
                                <motion.div
                                  key={deal.id}
                                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                  viewport={{ once: true, margin: "-100px" }}
                                  transition={{
                                    type: "spring" as const,
                                    stiffness: 300,
                                    damping: 22,
                                    delay: 0.6 + index * 0.08,
                                  }}
                                  className="flex-[0_0_auto] max-w-[170px] w-full"
                                >
                                  <HotDealsListingCard
                                    {...deal}
                                    isFavorite={favorites.has(deal.id)}
                                    onFavorite={handleFavoriteToggle}
                                    showSeller={true}
                                    showSocials={true}
                                    className="w-full"
                                  />
                                </motion.div>
                              );
                            })}
                          </CardsCarousel>
                        ) : (
                          <div className="flex items-center justify-center py-10">
                            <Typography variant="body" className="text-white">
                              {t.home.hostDeals.noDealsAvailableForThisCategory}
                            </Typography>
                          </div>
                        )}
                      </div>

                      {/* Sponsored Banner
                      <div className="hidden lg:block relative max-w-[352px] w-full h-[290px] bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src="https://images.unsplash.com/photo-1629581678313-36cf745a9af9?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          alt="Sponsored Deal"
                          width={352}
                          height={290}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-white/80 rounded px-2.5 py-1">
                          <Typography
                            variant="xs-black-inter"
                            className="text-black text-sm font-medium"
                          >
                            {t.home.hostDeals.sponsored}
                          </Typography>
                        </div>
                      </div> */}
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
