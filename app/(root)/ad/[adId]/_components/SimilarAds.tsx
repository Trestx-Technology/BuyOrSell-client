"use client";

import React, { useMemo } from "react";
import { ListingCard } from "@/components/global/listing-card";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { useSimilarAds } from "@/hooks/useAds";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { useRouter } from "next/navigation";

interface SimilarAdsProps {
  adId: string;
}

const SimilarAds: React.FC<SimilarAdsProps> = ({ adId }) => {
  const router = useRouter();
  
  // Fetch similar ads from API
  const { data: similarAdsResponse, isLoading } = useSimilarAds(adId, {
    limit: 10, // Default limit as per API docs
  });

  // Transform API ads to listing card format
  const transformedAds = useMemo(() => {
    if (!similarAdsResponse?.data?.adds) return [];
    return similarAdsResponse.data.adds.map(transformAdToListingCard);
  }, [similarAdsResponse]);

  // Handle navigation to ad detail page
  const handleCardClick = (id: string) => {
    router.push(`/ad/${id}`);
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
        title="Similar Ads"
        breakpoints={{
          mobile: 1,
          tablet: 2,
          desktop: 2,
          wide: 3,
        }}
      >
        {transformedAds.map((ad) => (
          <div
            key={ad.id}
            className="flex-[0_0_auto] max-w-[220px] sm:max-w-[255px] w-full"
          >
            <ListingCard
              {...ad}
              onFavorite={(id) => console.log("Favorited:", id)}
              onShare={(id) => console.log("Shared:", id)}
              onClick={handleCardClick}
            />
          </div>
        ))}
      </CardsCarousel>
    </div>
  );
};

export default SimilarAds;
