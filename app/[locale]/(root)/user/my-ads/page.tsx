"use client";
import React from "react";
import Link from "next/link";
import MyAdCard from "../_components/my-ads-card";
import { H2, Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { useMyAds } from "@/hooks/useAds";
import { AD } from "@/interfaces/ad";
import { formatDate } from "@/utils/format-date";
import { MyAdCardProps } from "../_components/my-ads-card";
import { Container1080 } from "@/components/layouts/container-1080";
import { useRouter } from "nextjs-toploader/app";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

// Transform AD to MyAdCard props
const transformAdToMyAdCard = (ad: AD, locale?: string): MyAdCardProps => {
      const isArabic = locale === "ar";

      // Get location string
      const getLocation = (): string => {
            const locationData = ad.location || ad.address;
            if (!locationData) return "Location not specified";

            if (typeof locationData === "string") {
                  return locationData.trim() || "Location not specified";
            }

            // Use Arabic address if available and locale is Arabic
            if (isArabic && ad.addressAr) {
                  const cityAr = ad.address?.cityAr;
                  const stateAr = ad.address?.stateAr;
                  if (cityAr && stateAr) return `${cityAr}, ${stateAr}`;
                  if (cityAr) return cityAr;
                  if (stateAr) return stateAr;
            }

            const city = locationData?.city?.trim();
            const state = locationData?.state?.trim();
            if (city && state) return `${city}, ${state}`;
            if (city) return city;
            if (state) return state;
            if (locationData.area?.trim()) return locationData.area.trim();
            if (locationData.street?.trim()) return locationData.street.trim();

            return "Location not specified";
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
            location: getLocation(),
            images: ad.images || [],
            extraFields: ad.extraFields,
            postedTime: ad.createdAt ? formatDate(ad.createdAt) : "Recently",
            views: ad.views || 0,
            isPremium: ad.isFeatured || false,
            validity: ad.validity,
            isSaved: ad.isSaved || false,
      };
};

const MyAdsPage = () => {
      const router = useRouter();
      const { t, localePath, locale } = useLocale();

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

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                              <div className="flex items-center justify-between mb-6">
                                    <H2 className="font-bold text-dark-blue">
                                          {t.user.profile.myAds} ({transformedAds.length})
                                    </H2>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 justify-items-center">
                                    {isLoadingAds ? (
                                          <div className="col-span-full w-full flex items-center justify-center py-12">
                                                <Typography variant="body-small" className="text-gray-500 animate-pulse">
                                                      {t.common.loading}
                                                </Typography>
                                          </div>
                                    ) : adsError ? (
                                          <div className="col-span-full w-full flex items-center justify-center py-12">
                                                <Typography variant="body-small" className="text-red-500">
                                                      {t.common.error}
                                                </Typography>
                                          </div>
                                    ) : transformedAds.length === 0 ? (
                                          <div className="col-span-full w-full flex flex-col items-center justify-center py-12 gap-4">
                                                <Typography variant="body-small" className="text-gray-500">
                                                      {t.user.profile.noAds}
                                                </Typography>
                                                <Link
                                                      href={localePath("/post-ad")}
                                                      className="bg-purple text-white px-6 py-2 rounded-lg font-medium hover:bg-purple/90 transition-colors"
                                                >
                                                      Post an Ad
                                                </Link>
                                          </div>
                                    ) : (
                                          transformedAds.map((ad) => (
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
