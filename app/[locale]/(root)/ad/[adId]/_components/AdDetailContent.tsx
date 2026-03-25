"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useAdById } from "@/hooks/useAds";
import Header from "./Header";
import ProductGallery from "./ProductGallery";
import SellerInfo from "./SellerInfo";
import OrganizationInfo from "./OrganizationInfo";
import SafetyFeatures from "./SafetyFeatures";
import ContactActions from "./ContactActions";
import DescriptionSection from "./DescriptionSection";
import SpecificationsSection from "./SpecificationsSection";
import LocationSection from "./LocationSection";
import ReviewsSection from "./ReviewsSection";
import SimilarAds from "./SimilarAds";
import ProductInfoCard from "./ProductInfoCard";
import ProductInfoTabs, { TabType } from "./ProductInfoTabs";
import ProductInfoCardMobile from "./ProductInfoCardMobile";
import AdDetailSkeleton from "./AdDetailSkeleton";
import { ErrorCard } from "@/components/ui/error-card";
import { useLocale } from "@/hooks/useLocale";
import AdCard from "../../../(categories)/_components/AdCard";
import { Container1080 } from "@/components/layouts/container-1080";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";
import ReportDialog from "./ReportDialog";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export default function AdDetailContent() {
  const { adId } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const { t } = useLocale();

  const user = useAuthStore((state) => state.session.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Fetch ad data by ID
  const { data: adResponse, isLoading, error } = useAdById(adId as string);
  const ad = adResponse?.data;

  const isOwner = user?._id === ad?.owner?._id;
  const showReportButton = isAuthenticated && !isOwner;

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
    <GoogleMapsProvider>
      <Container1080>
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
                initialTab="description"
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

              {/* Organization Information */}
              {ad.organization && <OrganizationInfo ad={ad} />}

              {/* Safety Features */}
              {/* <SafetyFeatures ad={ad} /> */}

              {/* Contact Actions */}
              {/* <ContactActions ad={ad} /> */}

              <AdCard className="min-h-[550px]" />

              {showReportButton && (
                <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-3 text-gray-400 hover:text-red-500 hover:bg-red-50/50 dark:text-gray-500 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all duration-300 rounded-2xl py-7 border border-gray-100/50 dark:border-gray-800/50 hover:border-red-200 dark:hover:border-red-900/30 group shadow-sm hover:shadow-md"
                    onClick={() => setIsReportDialogOpen(true)}
                    icon={
                      <Flag className="h-4 w-4 transition-transform group-hover:scale-110 -mr-2" />
                    }
                    iconPosition="center"
                  >
                    <span className="font-semibold text-sm tracking-wide uppercase">
                      {t.ad.report.button}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-6 mb-6 relative">
            {/* TODO: update the zindex of the gallery in the mobile layout */}
            <ProductGallery ad={ad} />
            <div className="bg-[#F9FAFC] dark:bg-slate-900/50 space-y-6 relative z-10 rounded-t-xl -mt-8">
              <ProductInfoCardMobile ad={ad} />

              <ProductInfoTabs
                onTabChange={(tab) => setActiveTab(tab)}
                initialTab="description"
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

              {/* Organization Information */}
              {ad.organization && <OrganizationInfo ad={ad} />}

              {/* Safety Features */}
              <SafetyFeatures ad={ad} />

              {/* Contact Actions */}
              <ContactActions ad={ad} />

              {showReportButton && (
                <div className="pb-10 px-4">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-center gap-3 text-gray-400 hover:text-red-500 hover:bg-red-50/50 dark:text-gray-500 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-all duration-300 rounded-2xl py-7 border border-gray-100 dark:border-gray-800 hover:border-red-200 dark:hover:border-red-900/30 group shadow-sm hover:shadow-md"
                    onClick={() => setIsReportDialogOpen(true)}
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                      <Flag className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </div>
                    <span className="font-semibold text-sm tracking-wide uppercase">
                      {t.ad.report.button}
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Similar Ads */}
          <SimilarAds adId={adId as string} />
        </div>

        <ReportDialog
          open={isReportDialogOpen}
          onOpenChange={setIsReportDialogOpen}
          reportedId={adId as string}
          reportedType="ad"
        />
      </Container1080>
    </GoogleMapsProvider>
  );
}
