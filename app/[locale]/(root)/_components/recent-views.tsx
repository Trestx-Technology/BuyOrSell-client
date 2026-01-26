"use client";

import { CardsCarousel } from "@/components/global/cards-carousel";
import ListingCard from "@/components/features/listing-card/listing-card";
import { AD } from "@/interfaces/ad";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { useLocale } from "@/hooks/useLocale";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface RecentViewsProps {
  recentlyViewedAds?: AD[];
  isLoading?: boolean;
}

export default function RecentViews({
  recentlyViewedAds = [],
  isLoading = false,
}: RecentViewsProps) {
  const { t, locale } = useLocale();
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1, rootMargin: "-50px" });

  // Transform AD objects to ListingCardProps (filter out any null/undefined ads)
  const listingItems = recentlyViewedAds
    .filter((ad): ad is AD => ad != null && ad.adType !== "JOB")
    .map((ad) => transformAdToListingCard(ad, locale));

  if (isLoading) {
    return (
      <section
        ref={ref as any}
        className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''}`}
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
      </section>
    );
  }

  if (listingItems.length === 0) {
    return null;
  }

  return (
    <section
      ref={ref as any}
      className={` max-w-[1220px] mx-auto reveal-on-scroll ${isVisible ? 'is-visible' : ''}`}
    >
      <CardsCarousel title={t.home.recentViews.title}>
        {listingItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-4"
          >
            <ListingCard
              {...item}
              isAddedInCollection={item.isAddedInCollection}
            />
          </div>
        ))}
      </CardsCarousel>
    </section>
  );
}
