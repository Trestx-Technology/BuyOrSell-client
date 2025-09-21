"use client";

import React from "react";
import { mockAds } from "@/constants/sample-listings";
import ListingCard from "@/app/(root)/categories/_components/ListingCard";
import { CardsCarousel } from "@/components/global/cards-carousel";

interface SimilarAdsProps {
  adId: string;
}

const SimilarAds: React.FC<SimilarAdsProps> = () => {
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
        {mockAds.map((item) => (
          <div
            key={item.id}
            className="flex-[0_0_auto] max-w-[220px] sm:max-w-[255px] w-full"
          >
            <ListingCard
              {...item}
              price={item.price}
              images={item.images}
              specifications={item.specifications}
              postedTime={item.postedTime}
            />
          </div>
        ))}
      </CardsCarousel>
    </div>
  );
};

export default SimilarAds;
