"use client";

import React, { useState } from "react";
import ProfileCard from "../../_components/profile-card";
import UserReviews from "../../_components/user-reviews";
import MyAdCard, { MyAdCardProps } from "../../_components/my-ads-card";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { useGetProfile } from "@/hooks/useUsers";
import { useMyAds } from "@/hooks/useAds";
import { useUserAverageRating, useUserReviews } from "@/hooks/useReviews";
import { AD, AdLocation } from "@/interfaces/ad";
import { formatDate } from "@/utils/format-date";
import { Container1080 } from "@/components/layouts/container-1080";
import { useRouter } from "nextjs-toploader/app";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ListingCardSkeleton from "@/components/global/listing-card-skeleton";

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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const extraFieldsObj = Array.isArray(ad.extraFields)
    ? ad.extraFields.reduce(
        (acc, field) => {
          if (
            field &&
            typeof field === "object" &&
            "name" in field &&
            "value" in field
          ) {
            acc[field.name] = field.value;
          }
          return acc;
        },
        {} as Record<string, any>,
      )
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
  };
};

const UserProfileContent = () => {
  const router = useRouter();
  const { t, localePath, locale } = useLocale();
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "highest" | "lowest"
  >("latest");

  // Fetch user profile
  const {
    data: profileResponse,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useGetProfile();
  const user = profileResponse?.data?.user;

  // Fetch user's average rating
  const {
    data: averageRatingResponse,
    isLoading: isLoadingRating,
    error: averageRatingError,
  } = useUserAverageRating(user?._id || "", !!user?._id);

  // Fetch user reviews to get total ratings count
  const {
    data: reviewsResponse,
    isLoading: isLoadingReviews,
    error: reviewsError,
  } = useUserReviews(user?._id || "", { limit: 10, sortBy }, !!user?._id);

  // Fetch user's ads
  const {
    data: myAdsResponse,
    isLoading: isLoadingAds,
    error: adsError,
  } = useMyAds({
    limit: 20,
  });

  const handleEdit = () => {
    router.push(localePath("/user/profile/edit"));
  };

  // Format join date
  const formatJoinDate = (dateString?: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    const getOrdinalSuffix = (n: number): string => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    };

    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
  };

  // Get user name
  const getUserName = (): string => {
    if (!user) return "";
    if (user.name) return user.name;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.email || "";
  };

  // Get average rating from API (defaults to 0 if not available)
  const averageRating = averageRatingResponse?.data ?? 0;

  // Get total ratings count from reviews API
  // Handle case where API returns array directly (for user reviews)

  // Transform ads data
  const ads =
    myAdsResponse?.data?.ads ||
    myAdsResponse?.data?.adds ||
    myAdsResponse?.ads ||
    myAdsResponse?.adds ||
    [];
  const transformedAds = ads.map((ad) => transformAdToMyAdCard(ad, locale));

  const handlePostAd = () => {
    router.push(localePath("/post-ad/select"));
  };

  return (
    <Container1080>
      <MobileStickyHeader title={t.user.profile.myProfile} />

      <div className="flex flex-col gap-5 py-8 px-4 xl:px-0">
        <Breadcrumbs
          items={[
            {
              id: "profile",
              label: t.user.profile.myProfile,
              href: localePath("/user/profile"),
            },
          ]}
        />

        {/* Profile Card */}
        {isLoadingProfile ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
              <div className="flex-1 space-y-4 w-full text-center sm:text-left mt-4 sm:mt-0">
                <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
                <div className="flex justify-center sm:justify-start gap-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex justify-center sm:justify-start gap-2 pt-2">
                  <Skeleton className="h-10 w-28 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ) : profileError ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center py-8">
              <Typography variant="body-small" className="text-red-500">
                {t.common.error}
              </Typography>
            </div>
          </div>
        ) : user ? (
          <ProfileCard
            name={getUserName()}
            rating={averageRating || "No ratings yet"}
            totalRatings={
              Array.isArray(reviewsResponse)
                ? reviewsResponse.length
                : (reviewsResponse as any)?.total ||
                  (reviewsResponse as any)?.data?.length ||
                  0
            }
            joinDate={formatJoinDate(user.createdAt)}
            avatarUrl={user.image || "/images/ai-prompt/add-image.png"}
            isVerified={
              user.isVerified ||
              user.emailVerified ||
              user.phoneVerified ||
              false
            }
            onEdit={handleEdit}
          />
        ) : null}

        {/* My Ads Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Typography
                variant="h3"
                className="text-base font-semibold text-dark-blue dark:text-white"
              >
                My Ads ({transformedAds.length})
              </Typography>
            </div>

            <Button variant="primary" size="sm" onClick={handlePostAd}>
              Post New Ad
            </Button>
          </div>

          {isLoadingAds ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : adsError ? (
            <div className="flex items-center justify-center py-8">
              <Typography variant="body-small" className="text-red-500">
                Failed to load ads
              </Typography>
            </div>
          ) : transformedAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {transformedAds.map((ad) => (
                <MyAdCard key={ad.id} {...ad} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <Typography
                variant="body"
                className="text-gray-500 mb-4 font-medium"
              >
                You haven't posted any ads yet.
              </Typography>
              <Button
                variant="outline"
                onClick={handlePostAd}
                className="bg-white hover:bg-gray-50"
              >
                Post your first ad
              </Button>
            </div>
          )}
        </div>

        <UserReviews
          userId={user?._id || "1"}
          reviewsData={reviewsResponse}
          isLoadingReviews={isLoadingReviews}
          reviewsError={reviewsError}
          sortBy={sortBy}
          onSort={setSortBy}
        />
      </div>
    </Container1080>
  );
};

export default UserProfileContent;
