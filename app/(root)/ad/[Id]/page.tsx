"use client";

import React from "react";
import { useParams } from "next/navigation";
import Header from "./_components/Header";
import ProductGallery from "./_components/ProductGallery";
import SellerInfo from "./_components/SellerInfo";
import SafetyFeatures from "./_components/SafetyFeatures";
import ContactActions from "./_components/ContactActions";
import DescriptionSection from "./_components/DescriptionSection";
import SpecificationsSection from "./_components/SpecificationsSection";
import LocationSection from "./_components/LocationSection";
import ReviewsSection from "./_components/ReviewsSection";
import SimilarAds from "./_components/SimilarAds";
import ProductInfoCard from "./_components/ProductInfoCard";
import AdCard from "../../categories/_components/AdCard";
import ProductInfoTabs from "./_components/ProductInfoTabs";
import ProductInfoCardMobile from "./_components/ProductInfoCardMobile";

export default function AdDetailPage() {
  const params = useParams();
  const adId = params.adId as string;

  return (
    <div className=" w-full min-h-[500px]">
      {/* Header with Back, Share, Save */}
      <Header />

      <div className="w-full mx-auto py-0">
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 mb-6 gap-6">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-6 relative">
            {/* Product Gallery */}
            <ProductGallery adId={adId} />

            <ProductInfoTabs
              onTabChange={(activeTab) => {
                console.log("Active tab changed to:", activeTab);
                // Handle tab change logic here
              }}
              initialTab="specifications"
            />
            <div className="space-y-6">
              {/* Description Section */}
              <DescriptionSection adId={adId} />

              {/* Specifications Section */}
              <SpecificationsSection adId={adId} />

              {/* Location Section */}
              <LocationSection adId={adId} />

              {/* Reviews Section */}
              <ReviewsSection adId={adId} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 hidden md:block">
            {/* Product Information Card */}
            <ProductInfoCard adId={adId} />

            {/* Seller Information */}
            <SellerInfo adId={adId} />

            {/* Safety Features */}
            <SafetyFeatures adId={adId} />

            {/* Contact Actions */}
            {/* <ContactActions adId={adId} /> */}

            <AdCard className="min-h-[550px]" />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-6 mb-6 relative">
          <ProductGallery adId={adId} />
          <div className="bg-[#F9FAFC] space-y-6 relative z-20 rounded-t-xl -mt-8">
            <ProductInfoCardMobile adId={adId} />

            <ProductInfoTabs
              onTabChange={(activeTab) => {
                console.log("Active tab changed to:", activeTab);
                // Handle tab change logic here
              }}
              initialTab="specifications"
            />

            {/* Description Section */}
            <DescriptionSection adId={adId} />

            {/* Specifications Section */}
            <SpecificationsSection adId={adId} />

            {/* Seller Information */}
            <SellerInfo adId={adId} />

            {/* Safety Features */}
            <SafetyFeatures adId={adId} />

            {/* Location Section */}
            <LocationSection adId={adId} />

            {/* Reviews Section */}
            <ReviewsSection adId={adId} />

            {/* Contact Actions */}
            <ContactActions adId={adId} />
          </div>
        </div>

        {/* Similar Ads */}
        <SimilarAds adId={adId} />
      </div>
    </div>
  );
}
