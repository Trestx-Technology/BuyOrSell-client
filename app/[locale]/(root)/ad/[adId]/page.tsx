"use client";

import React, { useState, useMemo } from "react";
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
import AdCard from "@/app/(root)/categories/_components/AdCard";
import ProductInfoTabs, { TabType } from "./_components/ProductInfoTabs";
import ProductInfoCardMobile from "./_components/ProductInfoCardMobile";
import AdDetailSkeleton from "./_components/AdDetailSkeleton";
import { ErrorCard } from "@/components/ui/error-card";
import { useLocale } from "@/hooks/useLocale";

export default function AdDetailPage() {
  const { adId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("specifications");
  const { t } = useLocale();

  // Fetch ad data by ID
  const { data: adResponse, isLoading, error } = useAdById(adId as string);
  const ad = adResponse?.data;

  // Memoize sections for reordering - must be called before early returns
  const sections = useMemo(() => {
    if (!ad) return [];

    return [
      {
        id: "description" as TabType,
        component: <DescriptionSection key="description" ad={ad} />,
      },
      {
        id: "specifications" as TabType,
        component: <SpecificationsSection key="specifications" ad={ad} />,
      },
      {
        id: "location" as TabType,
        component: <LocationSection key="location" ad={ad} />,
      },
      {
        id: "reviews" as TabType,
        component: <ReviewsSection key="reviews" ad={ad} />,
      },
    ];
  }, [ad]);

  // Reorder sections based on active tab with smooth animations
  const reorderedSections = useMemo(() => {
    if (sections.length === 0) return [];

    const activeIndex = sections.findIndex((s) => s.id === activeTab);
    return activeIndex >= 0
      ? [
          sections[activeIndex],
          ...sections.slice(0, activeIndex),
          ...sections.slice(activeIndex + 1),
        ]
      : sections;
  }, [sections, activeTab]);

  // Loading state
  if (isLoading) {
    return <AdDetailSkeleton />;
  }

  // Error state
  if (error || !adId) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center p-4">
        <ErrorCard
          variant="error"
          title={t.ad.errors.failedToLoad}
          description={error?.message || t.ad.errors.unableToFetch}
          className="max-w-md"
        />
      </div>
    );
  }

  // Ad not found state
  if (!ad) {
    return (
      <div className="w-full min-h-[500px] flex items-center justify-center p-4">
        <ErrorCard
          variant="warning"
          title={t.ad.errors.adNotFound}
          description={t.ad.errors.adNotFoundDescription}
          className="max-w-md"
        />
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
              onTabChange={(tab) => setActiveTab(tab)}
              initialTab="specifications"
            />
            <div className="space-y-6 relative">
              {/* Reorder sections based on active tab with smooth animations */}
              {reorderedSections.map((section, index) => (
                <div
                  key={section.id}
                  className="section-item transition-all duration-500 ease-in-out"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {section.component}
                </div>
              ))}
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
          {/* TODO: update the zindex of the gallery in the mobile layout */}
          <ProductGallery ad={ad} />
          <div className="bg-[#F9FAFC] space-y-6 relative z-10 rounded-t-xl -mt-8">
            <ProductInfoCardMobile ad={ad} />

            <ProductInfoTabs
              onTabChange={(tab) => setActiveTab(tab)}
              initialTab="specifications"
            />

            {/* Reorder sections based on active tab with smooth animations */}
            <div className="space-y-6 relative">
              {reorderedSections.map((section, index) => (
                <div
                  key={section.id}
                  className="section-item transition-all duration-500 ease-in-out"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {section.component}
                </div>
              ))}
            </div>

            {/* Seller Information */}
            <SellerInfo ad={ad} />

            {/* Safety Features */}
            <SafetyFeatures ad={ad} />

            {/* Contact Actions */}
            <ContactActions ad={ad} />
          </div>
        </div>

        {/* Similar Ads */}
        <SimilarAds adId={adId as string} />
      </div>
    </div>
  );
}
