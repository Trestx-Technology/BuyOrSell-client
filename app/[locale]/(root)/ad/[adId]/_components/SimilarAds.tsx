"use client";

import React, { useMemo } from "react";
import { ListingCard } from "@/components/features/listing-card/listing-card";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { useSimilarAds } from "@/hooks/useAds";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { useAuthStore } from "@/stores/authStore";
import { AD } from "@/interfaces/ad";

interface SimilarAdsProps {
  adId: string;
}

const SimilarAds: React.FC<SimilarAdsProps> = ({ adId }) => {
  const router = useRouter();
  const { t, locale } = useLocale();
  const session = useAuthStore((state) => state.session);

  // Fetch similar ads from API
  const { data: similarAdsResponse, isLoading } = useSimilarAds(adId, {
    limit: 10, // Default limit as per API docs
    viewerId: session.user?._id,
  });

  // Transform API ads to listing card format
  const transformedAds = useMemo(() => {
    // Handle different response structures
    let ads: AD[] = [];

    if (Array.isArray(similarAdsResponse)) {
      // API returns array directly
      ads = similarAdsResponse;
    } else if (Array.isArray(similarAdsResponse?.data)) {
      // API returns { data: [...] }
      ads = similarAdsResponse.data;
    } else if (similarAdsResponse?.data?.ads) {
      // API returns { data: { ads: [...] } }
      ads = similarAdsResponse.data.ads;
    } else if (similarAdsResponse?.data?.adds) {
      // Legacy: API returns { data: { adds: [...] } }
      ads = similarAdsResponse.data.adds;
    } else if (similarAdsResponse?.ads) {
      // API returns { ads: [...] }
      ads = similarAdsResponse.ads;
    } else if (similarAdsResponse?.adds) {
      // Legacy: API returns { adds: [...] }
      ads = similarAdsResponse.adds;
    }

    if (!ads || ads.length === 0) return [];

    return ads.map((ad) => transformAdToListingCard(ad, locale));
  }, [similarAdsResponse, locale]);

  // Handle navigation to ad detail page
  const handleCardClick = (id: string) => {
    router.push(`/${locale}/ad/${id}`);
  };

  // Hide component if no ads are available
  if (isLoading) {
    return null; // Or show a loading skeleton if preferred
  }

  if (!transformedAds || transformedAds.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <CardsCarousel
        className="space-y-0"
        titleClassName="text-md font-semibold"
        title={t.ad.similarAds.title}
        breakpoints={{
          mobile: 2,
          tablet: 3,
          desktop: 4,
          wide: 5,
        }}
      >
        {transformedAds.map((ad) => (
          <div
            key={ad.id}
            className="flex-[0_0_auto] max-w-[220px] sm:max-w-[255px] w-full"
          >
            <ListingCard {...ad} />
          </div>
        ))}
      </CardsCarousel>
    </div>
  );
};

export default SimilarAds;
