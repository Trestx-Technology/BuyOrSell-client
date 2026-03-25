"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import MyAdCard from "../_components/my-ads-card";
import { H2, Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { useMyAds, useFeatureAd } from "@/hooks/useAds";
import { AD, AdLocation } from "@/interfaces/ad";
import { formatDate } from "@/utils/format-date";
import { MyAdCardProps } from "../_components/my-ads-card";
import { Container1080 } from "@/components/layouts/container-1080";
import { useRouter } from "nextjs-toploader/app";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Transform AD to MyAdCard props
const transformAdToMyAdCard = (ad: AD, locale?: string): MyAdCardProps => {
      const isArabic = locale === "ar";

      // Build AdLocation object from address fields
      const getAddress = (): AdLocation => {
            const loc: AdLocation = {};
            if (ad.address && typeof ad.address === "object") {
                  Object.assign(loc, ad.address);
            } else if (ad.location && typeof ad.location === "object") {
                  Object.assign(loc, ad.location);
            } else if (typeof ad.location === "string") {
                  loc.address = ad.location;
            }
            return loc;
      };

      // Calculate discount and original price
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const extraFieldsObj = Array.isArray(ad.extraFields)
            ? ad.extraFields.reduce((acc, field) => {
                  if (
                        field &&
                        typeof field === "object" &&
                        "name" in field &&
                        "value" in field
                  ) {
                        acc[field.name] = field.value;
                  }
                  return acc;
            }, {} as Record<string, any>)
            : ad.extraFields || {};

      const discountPercentage =
            ad.deal && extraFieldsObj.discountedPercent
                  ? Number(extraFieldsObj.discountedPercent)
                  : undefined;

      const originalPrice =
            discountPercentage && ad.price
                  ? Math.round(ad.price / (1 - discountPercentage / 100))
                  : undefined;

      return {
            id: ad._id,
            title: isArabic && ad.titleAr ? ad.titleAr : ad.title,
            price: ad.price,
            originalPrice,
            discount: discountPercentage,
            currency: "AED",
            location: getAddress(),
            images: ad.images || [],
            extraFields: ad.extraFields,
            postedTime: ad.createdAt ? formatDate(ad.createdAt) : "Recently",
            views: ad.views || 0,
            isPremium: ad.isFeatured || false,
            validity: ad.validity,
            isSaved: ad.isSaved || false,
            status: ad.status || "created",
            categoryId: (ad.category as any)?._id,
            categoryName: (ad.category as any)?.name,
            // relatedCategories[0] is the top-level category name used to match subscription plan types
            categoryType: ad.relatedCategories?.[0],
            adType: ad.adType,
      };
};

const MyAdsPage = () => {
      const router = useRouter();
      const { t, localePath, locale } = useLocale();
      const searchParams = useSearchParams();
      const featureAdMutation = useFeatureAd();
      // Prevent double-firing on StrictMode double-mount
      const featureHandledRef = useRef(false);

      // ── Handle return from Stripe featured-ad checkout ──────────────────────
      useEffect(() => {
        const featurePayment = searchParams.get("feature_payment");
        const featuredAdId = searchParams.get("featured_ad_id");

        if (featureHandledRef.current) return;

        if (featurePayment === "success" && featuredAdId) {
          featureHandledRef.current = true;
          featureAdMutation.mutate(
            { id: featuredAdId },
            {
              onSuccess: () => {
                toast.success("Ad marked as featured successfully!");
              },
              onError: () => {
                toast.error(
                  "Payment was received but we could not update your ad. Please contact support.",
                );
              },
            },
          );
          // Clean the URL so params don't persist on refresh
          const clean = new URL(window.location.href);
          clean.searchParams.delete("feature_payment");
          clean.searchParams.delete("featured_ad_id");
          clean.searchParams.delete("session_id");
          router.replace(clean.pathname + (clean.search || ""));
        } else if (featurePayment === "cancelled") {
          featureHandledRef.current = true;
          toast.info("Featured ad payment was cancelled.");
          const clean = new URL(window.location.href);
          clean.searchParams.delete("feature_payment");
          router.replace(clean.pathname + (clean.search || ""));
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [searchParams]);
      // ────────────────────────────────────────────────────────────────────────

      // Fetch user's ads
      const {
            data: myAdsResponse,
            isLoading: isLoadingAds,
            error: adsError,
      } = useMyAds({
            limit: 50, // Increase limit for standalone page
      });

      // Transform ads data
      const ads =
            myAdsResponse?.data?.ads ||
            myAdsResponse?.data?.adds ||
            myAdsResponse?.ads ||
            myAdsResponse?.adds ||
            [];
      
      const transformedAds = ads.map((ad) => transformAdToMyAdCard(ad, locale));

      const [activeTab, setActiveTab] = useState("all");

      const filteredAds = useMemo(() => {
            const now = new Date();
            return transformedAds.filter((ad) => {
                  const isExpired = ad.validity ? new Date(ad.validity) < now : false;
                  
                  if (activeTab === "all") return true;
                  if (activeTab === "live") return ad.status === "live" && !isExpired;
                  if (activeTab === "expired") return isExpired;
                  if (activeTab === "pending") return ad.status === "created";
                  if (activeTab === "rejected") return ad.status === "rejected";
                  return true;
            });
      }, [transformedAds, activeTab]);

      return (
            <Container1080>
                  <MobileStickyHeader title={t.user.profile.myAds} />

                  <div className="flex flex-col gap-5 py-8 px-4 xl:px-0">
                        <Breadcrumbs items={[
                              {
                                    href: localePath("/user/profile"),
                                    label: t.user.profile.myProfile,
                                    id: "profile"
                              },
                              {
                                    href: localePath("/user/my-ads"),
                                    label: t.user.profile.myAds,
                                    id: "my-ads"
                              }
                        ]} />

                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 min-h-[400px]">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                    <div className="flex flex-col gap-1">
                                          <H2 className="font-bold text-dark-blue dark:text-white">
                                                {t.user.profile.myAds} ({filteredAds.length})
                                          </H2>
                                          <Typography variant="body-small" className="text-gray-500">
                                                Manage and monitor your posted advertisements
                                          </Typography>
                                    </div>

                                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                                          <TabsList className="bg-gray-50 dark:bg-gray-800/50 p-1 rounded-xl border border-gray-100 dark:border-gray-700 w-full md:w-auto flex overflow-x-auto scrollbar-hide">
                                                <TabsTrigger value="all" className="flex-1 md:flex-none py-2 px-4 rounded-lg transition-all">All</TabsTrigger>
                                                <TabsTrigger value="live" className="flex-1 md:flex-none py-2 px-4 rounded-lg transition-all">Live</TabsTrigger>
                                                <TabsTrigger value="pending" className="flex-1 md:flex-none py-2 px-4 rounded-lg transition-all">Pending</TabsTrigger>
                                                <TabsTrigger value="expired" className="flex-1 md:flex-none py-2 px-4 rounded-lg transition-all">Expired</TabsTrigger>
                                                <TabsTrigger value="rejected" className="flex-1 md:flex-none py-2 px-4 rounded-lg transition-all">Rejected</TabsTrigger>
                                          </TabsList>
                                    </Tabs>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                                    {isLoadingAds ? (
                                          <div className="col-span-full w-full flex flex-col items-center justify-center py-24 gap-3">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple"></div>
                                                <Typography variant="body-small" className="text-gray-500">
                                                      {t.common.loading}
                                                </Typography>
                                          </div>
                                    ) : adsError ? (
                                          <div className="col-span-full w-full flex items-center justify-center py-24">
                                                <Typography variant="body-small" className="text-red-500 font-medium">
                                                      {t.common.error}
                                                </Typography>
                                          </div>
                                    ) : filteredAds.length === 0 ? (
                                          <div className="col-span-full w-full flex flex-col items-center justify-center py-24 gap-6 text-center">
                                                <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-full">
                                                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                      </svg>
                                                </div>
                                                <div className="max-w-xs">
                                                      <Typography variant="h6" className="font-bold text-gray-900 dark:text-white mb-2">
                                                            {activeTab === "all" ? t.user.profile.noAds : "No ads found"}
                                                      </Typography>
                                                      <Typography variant="body-small" className="text-gray-500 mb-6">
                                                            {activeTab === "all" 
                                                              ? "You haven't posted any ads yet. Start selling today!" 
                                                              : `There are no ads with "${activeTab}" status.`}
                                                      </Typography>
                                                </div>
                                                {activeTab === "all" && (
                                                      <Link
                                                            href={localePath("/post-ad")}
                                                            className="bg-purple text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple/20 hover:bg-purple/90 transition-all hover:scale-105"
                                                      >
                                                            Post an Ad
                                                      </Link>
                                                )}
                                          </div>
                                    ) : (
                                          filteredAds.map((ad) => (
                                                <MyAdCard
                                                      key={ad.id}
                                                      {...ad}
                                                      onFavorite={(id) => console.log("Favorited:", id)}
                                                      onShare={(id) => console.log("Shared:", id)}
                                                      onClick={(id) => router.push(`/ad/${id}`)}
                                                      className="min-h-[284px] w-full"
                                                />
                                          ))
                                    )}
                              </div>
                        </div>
                  </div>
            </Container1080>
      );
};

export default MyAdsPage;
