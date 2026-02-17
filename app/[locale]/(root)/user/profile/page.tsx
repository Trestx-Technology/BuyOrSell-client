"use client";
import React, { useState } from "react";
import ProfileCard from "../_components/profile-card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyAdCard from "../_components/my-ads-card";
import UserReviews from "../_components/user-reviews";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { useGetProfile } from "@/hooks/useUsers";
import { useMyAds } from "@/hooks/useAds";
import { useUserAverageRating, useUserReviews } from "@/hooks/useReviews";
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

const ProfilePage = () => {
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

  return (
    <Container1080>
      <MobileStickyHeader title={t.user.profile.myProfile} />

      <div className="flex flex-col gap-5 py-8 px-4 xl:px-0">
        <Breadcrumbs
          items={[
            { id: "profile", label: t.user.profile.myProfile, href: localePath("/user/profile") },
          ]}
        />

        {/* Profile Card */}
        {isLoadingProfile ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-center py-8">
              <Typography variant="body-small" className="text-gray-500">
                {t.common.loading}
              </Typography>
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
            totalRatings={reviewsResponse?.data?.length || 0}
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

export default ProfilePage;
