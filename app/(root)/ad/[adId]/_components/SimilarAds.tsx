"use client";

import React from "react";
import { mockAds } from "@/constants/sample-listings";
import { ListingCard } from "@/components/global/listing-card";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { ProductExtraFields } from "@/interfaces/ad";

interface SimilarAdsProps {
  adId: string;
}

const SimilarAds: React.FC<SimilarAdsProps> = ({ adId }) => {
  // TODO: Use adId to fetch similar ads from API instead of mockAds
  // For now, using mockAds for demonstration
  // Future: const { data: similarAds } = useSimilarAds(adId);
  // Reference adId to avoid unused variable warning (will be used when API is ready)
  const _currentAdId = adId;
  void _currentAdId;
  
  // Transform mockAds to match ListingCard props
  const transformedAds = mockAds.map((item) => {
    // Convert specifications object to extraFields array format
    const extraFields: ProductExtraFields = Object.entries(
      item.specifications || {}
    ).map(([name, value]) => ({
      name,
      type: typeof value === "number" ? "number" : "string",
      value: value as string | number,
    }));

    // Map seller type: "Owner" -> "Individual"
    const sellerType =
      item.seller?.type === "Owner" ? "Individual" : item.seller?.type || "Individual";

    return {
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      discount: item.discount,
      currency: item.currency || "AED",
      location: item.location,
      images: item.images,
      extraFields,
      postedTime: item.postedTime,
      views: item.views,
      isPremium: item.isPremium,
      isFavorite: item.isFavorite,
      showSeller: true,
      seller: item.seller
        ? {
            name: item.seller.name,
            type: sellerType as "Agent" | "Individual",
            isVerified: item.seller.isVerified,
            image: null,
          }
        : undefined,
    };
  });

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
        {transformedAds.map((item) => (
          <div
            key={item.id}
            className="flex-[0_0_auto] max-w-[220px] sm:max-w-[255px] w-full"
          >
            <ListingCard
              id={item.id}
              title={item.title}
              price={item.price}
              originalPrice={item.originalPrice}
              discount={item.discount}
              currency={item.currency}
              location={item.location}
              images={item.images}
              extraFields={item.extraFields}
              postedTime={item.postedTime}
              views={item.views}
              isPremium={item.isPremium}
              isFavorite={item.isFavorite}
              showSeller={item.showSeller}
              seller={item.seller}
            />
          </div>
        ))}
      </CardsCarousel>
    </div>
  );
};

export default SimilarAds;
