"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAdById } from "@/hooks/useAds";
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
import { Typography } from "@/components/typography";

export default function AdDetailPage() {
  const params = useParams();
  const adId = params.adId as string;

  // Fetch ad data by ID
  const { data: adResponse, isLoading, error } = useAdById(adId);
  const ad = adResponse?.data;

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center">
        <Typography variant="body" className="text-gray-500">
          Loading ad details...
        </Typography>
      </div>
    );
  }

  // Error state
  if (error || !ad) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center">
        <Typography variant="body" className="text-red-500">
          {error ? "Failed to load ad details" : "Ad not found"}
        </Typography>
      </div>
    );
  }

  return (
    <div className=" w-full min-h-[500px]">
      {/* Header with Back, Share, Save */}
      <Header ad={ad} />

      <div className="w-full mx-auto py-0">
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 mb-6 gap-6">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-6 relative">
            {/* Product Gallery */}
            <ProductGallery ad={ad} />

            <ProductInfoTabs
              onTabChange={(activeTab) => {
                console.log("Active tab changed to:", activeTab);
                // Handle tab change logic here
              }}
              initialTab="specifications"
            />
            <div className="space-y-6">
              {/* Description Section */}
              <DescriptionSection ad={ad} />

              {/* Specifications Section */}
              <SpecificationsSection ad={ad} />

              {/* Location Section */}
              <LocationSection ad={ad} />

              {/* Reviews Section */}
              <ReviewsSection ad={ad} />
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 hidden md:block">
            {/* Product Information Card */}
            <ProductInfoCard ad={ad} />

            {/* Seller Information */}
            <SellerInfo ad={ad} />

            {/* Safety Features */}
            <SafetyFeatures ad={ad} />

            {/* Contact Actions */}
            {/* <ContactActions ad={ad} /> */}

            <AdCard className="min-h-[550px]" />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-6 mb-6 relative">
          <ProductGallery ad={ad} />
          <div className="bg-[#F9FAFC] space-y-6 relative z-20 rounded-t-xl -mt-8">
            <ProductInfoCardMobile ad={ad} />

            <ProductInfoTabs
              onTabChange={(activeTab) => {
                console.log("Active tab changed to:", activeTab);
                // Handle tab change logic here
              }}
              initialTab="specifications"
            />

            {/* Description Section */}
            <DescriptionSection ad={ad} />

            {/* Specifications Section */}
            <SpecificationsSection ad={ad} />

            {/* Seller Information */}
            <SellerInfo ad={ad} />

            {/* Safety Features */}
            <SafetyFeatures ad={ad} />

            {/* Location Section */}
            <LocationSection ad={ad} />

            {/* Reviews Section */}
            <ReviewsSection ad={ad} />

            {/* Contact Actions */}
            <ContactActions ad={ad} />
          </div>
        </div>

        {/* Similar Ads */}
        <SimilarAds adId={adId} />
      </div>
    </div>
  );
}

