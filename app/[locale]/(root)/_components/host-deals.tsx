"use client";

import { useState, useMemo, useEffect } from "react";
import { Clock } from "lucide-react";
import { Typography } from "@/components/typography";
import HotDealsListingCard from "@/components/features/hot-deals-listing-card/hot-deals-listing-card";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryTreeWithAds } from "@/interfaces/home.types";
import { formatDate } from "@/utils/format-date";
import { useLocale } from "@/hooks/useLocale";
import { ListingCardSkeleton } from "@/components/global/listing-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { HotDealsListingCardProps } from "@/components/features/hot-deals-listing-card/hot-deals-listing-card";
import { AD } from "@/interfaces/ad";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";


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

  // Move hook to top level
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-50px" });

  // Simple mapper function to transform API ad to component props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapAdToCardProps = (ad: any): HotDealsListingCardProps => {
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

  // Transform and filter deal ads from categoryTreeWithDealAds
  const transformedAdsByCategory = useMemo(() => {
    if (!categoryTreeWithDealAds || categoryTreeWithDealAds.length === 0) {
      return {} as Record<string, HotDealsListingCardProps[]>;
    }

    const adsByCategory: Record<string, HotDealsListingCardProps[]> = {};

    categoryTreeWithDealAds.forEach((category) => {
      if (category.ads && category.ads.length > 0) {
        const categoryName = category.name.toLowerCase().replace(/\s+/g, "-");

        // Transform all ads for this category
        adsByCategory[categoryName] = (category.ads as AD[]).map((ad) =>
          mapAdToCardProps(ad)
        );
      }
    });

    return adsByCategory;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryTreeWithDealAds, locale, t]);

  // Get category names for tabs
  const categories = useMemo(() => {
    if (!categoryTreeWithDealAds || categoryTreeWithDealAds.length === 0) {
      return [];
    }

    const isArabic = locale === "ar";

    return categoryTreeWithDealAds
      .filter((category) => {
        // Only show categories that have transformed ads
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
  }, [categoryTreeWithDealAds, transformedAdsByCategory, locale]);

  // Get default tab value
  const defaultTab = categories.length > 0 ? categories[0].value : "";

  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update active tab when categories change
  useEffect(() => {
    if (defaultTab && !activeTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, activeTab]);

  // Find the biggest deal (highest discount percentage) from all ads across all categories
  const biggestDealValidity = useMemo(() => {
    if (!categoryTreeWithDealAds || categoryTreeWithDealAds.length === 0) {
      return null;
    }

    // Collect all ads from all categories
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allAds: any[] = [];
    categoryTreeWithDealAds.forEach((category) => {
      if (category.ads && category.ads.length > 0) {
        allAds.push(...category.ads);
      }
    });

    if (allAds.length === 0) return null;

    // Find the ad with the highest discount percentage
    const biggestDeal = allAds.reduce((biggest, current) => {
      const currentDiscount = current.dealPercentage || 0;
      const biggestDiscount = biggest.dealPercentage || 0;
      return currentDiscount > biggestDiscount ? current : biggest;
    });

    // Return the validity date of the biggest deal
    return biggestDeal.dealValidThru || biggestDeal.dealValidThrough || null;
  }, [categoryTreeWithDealAds]);

  // Don't render if no categories
  if (!isLoading && categories.length === 0) {
    return null;
  }

  return (
    <section
      ref={ref as any}
      style={{
        background:
          "radial-gradient(circle, rgba(180, 207, 199, 1) 0%, rgba(132, 75, 143, 1) 100%)",
      }}
      className={`bg-[#B7FBE9] xl:rounded-lg max-w-[1180px] mx-auto py-5 reveal-on-scroll ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      <div className="w-full mx-auto">
        {/* Header with Timer */}
        <div
          className={`flex items-center justify-between mb-4 reveal-on-scroll reveal-delay-100 ${isVisible ? 'is-visible' : ''}`}
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
            <DealTimer validThrough={biggestDealValidity} />
          </div>
        </div>

        {/* Category Tabs */}
        <div
          className={`mb-4 reveal-on-scroll reveal-delay-200 ${isVisible ? 'is-visible' : ''}`}
        >
          {isLoading ? (
            <>
              {/* Skeleton Tabs */}
              <div className="flex px-5 items-center justify-start w-full bg-transparent gap-3 overflow-x-auto scrollbar-hide mb-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-24 rounded-md" />
                ))}
              </div>

              {/* Skeleton Cards Carousel */}
              <div className="flex-1 overflow-hidden">
                <CardsCarousel title="" showNavigation={true}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className=""
                    >
                      <ListingCardSkeleton
                        showTimer={true}
                        showDiscountBadge={true}
                        showImageCounter={true}
                        showSeller={true}
                        showExtraFields={true}
                      />
                    </div>
                  ))}
                </CardsCarousel>
              </div>
            </>
          ) : categories.length > 0 ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="flex items-center justify-start w-full bg-transparent gap-3 overflow-x-auto scrollbar-hide px-5">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.value}>
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
                    <div
                      className={`flex gap-4 items-center reveal-fade-in ${isVisible ? 'is-visible' : ''}`}
                    >
                      {/* Deals Carousel */}
                      <div className="flex-1 overflow-hidden ">
                        {categoryAds.length > 0 ? (
                          <CardsCarousel title="" showNavigation={true}>
                            {categoryAds.map((deal) => (
                              <div
                                key={deal.id}
                              >
                                <HotDealsListingCard
                                  {...deal}
                                  isAddedInCollection={deal.isAddedInCollection}
                                  showSeller={true}
                                  showSocials={true}
                                />
                              </div>
                            ))}
                          </CardsCarousel>
                        ) : (
                          <div className="flex items-center justify-center py-10">
                            <Typography variant="body" className="text-white">
                              {t.home.hostDeals.noDealsAvailableForThisCategory}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function DealTimer({ validThrough }: { validThrough: string | null | Date }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!validThrough) {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(validThrough).getTime();
      const distance = end - now;

      if (distance > 0) {
        const totalSeconds = Math.floor(distance / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;
        const minutes = totalMinutes % 60;

        // Format based on remaining time for better readability
        let timeString = "";
        if (days > 0) {
          // Show days and hours (e.g., "5d 12h remaining")
          timeString = `${days}d ${hours}h remaining`;
        } else if (totalHours > 0) {
          // Show hours and minutes (e.g., "12h 30m remaining")
          timeString = `${totalHours}h ${minutes}m remaining`;
        } else {
          // Show minutes only (e.g., "30m remaining")
          timeString = `${totalMinutes}m remaining`;
        }
        setTimeLeft(timeString);
      } else {
        setTimeLeft("EXPIRED");
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [validThrough]);

  if (!timeLeft) return null;

  return (
    <div className="bg-white rounded px-2 py-1 flex items-center gap-1">
      <Clock className="w-4 h-4 text-red-500" />
      <Typography
        variant="xs-black-inter"
        className="text-error-100 text-sm font-medium"
      >
        {timeLeft}
      </Typography>
    </div>
  );
}
