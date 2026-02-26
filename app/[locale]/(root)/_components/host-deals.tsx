"use client";

import { useState, useMemo, useEffect } from "react";
import { Clock, ArrowRight } from "lucide-react";
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
import { AD, AdLocation } from "@/interfaces/ad";
import { DealTimer } from "@/components/global/deal-timer";
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
  const { t, locale, localePath } = useLocale();

  // Move hook to top level
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-50px" });

  // Simple mapper function to transform API ad to component props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapAdToCardProps = (ad: any): HotDealsListingCardProps => {
    // Build AdLocation object from address (both English and Arabic)
    const getAddress = (): AdLocation => {
      const loc: AdLocation = {};
      if (ad.address) {
        const raw = ad.address;
        // Detect nested shape: { state: { state, city, area } }
        // Detect flat shape:   { state: "Dubai", city: "Dubai", address: "...", ... }
        const isNested = raw.state && typeof raw.state === "object";
        const addr = isNested ? raw.state : raw;

        loc.state = typeof addr.state === "string" ? addr.state : undefined;
        loc.city = typeof addr.city === "string" ? addr.city : undefined;
        loc.area = addr.area || undefined;
        loc.address = addr.address || undefined;
        loc.country = addr.country || undefined;
        loc.zipCode = addr.zipCode || undefined;

        // Arabic fields — may sit on the flat address object itself
        loc.stateAr = addr.stateAr || undefined;
        loc.cityAr = addr.cityAr || undefined;
        loc.addressAr = addr.addressAr || undefined;
      }
      // Also merge top-level addressAr if present (older nested format)
      if (ad.addressAr) {
        const ar = ad.addressAr;
        // addressAr can be flat { state, city } or nested { state: { state, city } }
        const arSrc = (ar.state && typeof ar.state === "object") ? ar.state : ar;
        loc.stateAr = loc.stateAr || (typeof arSrc.state === "string" ? arSrc.state : undefined);
        loc.cityAr = loc.cityAr || (typeof arSrc.city === "string" ? arSrc.city : undefined);
        loc.addressAr = loc.addressAr || arSrc.address || undefined;
      }
      return loc;
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
      location: getAddress(),
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
      // .filter((category) => {
      //   // Only show categories that have transformed ads
      //   const categoryName = category.name.toLowerCase().replace(/\s+/g, "-");
      //   const ads = transformedAdsByCategory[categoryName] || [];
      //   return ads.length > 0;
      // })
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
            <DealTimer  validThrough={biggestDealValidity} />
          </div>

          <div className="flex items-center gap-2 px-5">
            <button
              onClick={() => (window.location.href = localePath("/deals"))}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 rounded-full transition-colors group"
            >
              {t.home.hostDeals.viewAll}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
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


