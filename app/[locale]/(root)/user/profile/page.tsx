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
import { MyAdCardProps, FieldWithIcon } from "../_components/my-ads-card";
import { Container1080 } from "@/components/layouts/container-1080";
import { useRouter } from "nextjs-toploader/app";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";

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
      const cityAr = ad.addressAr.city;
      const stateAr = ad.addressAr.state;
      if (cityAr && stateAr) return `${cityAr}, ${stateAr}`;
      if (cityAr) return cityAr;
      if (stateAr) return stateAr;
    }

    const city = locationData.city?.trim();
    const state = locationData.state?.trim();
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    if (locationData.area?.trim()) return locationData.area.trim();
    if (locationData.street?.trim()) return locationData.street.trim();

    return "Location not specified";
  };

  // Normalize extraFields: handle both array and object formats, preserving icon info
  const normalizeExtraFields = (): FieldWithIcon[] => {
    if (!ad.extraFields) return [];

    // If it's an array, use it directly (preserves icon info)
    if (Array.isArray(ad.extraFields)) {
      return ad.extraFields
        .filter(
          (field) =>
            field &&
            typeof field === "object" &&
            "name" in field &&
            "value" in field
        )
        .map((field) => ({
          name: field.name,
          value: field.value,
          icon: field.icon,
        }))
        .filter(
          (field) =>
            field.value !== null &&
            field.value !== undefined &&
            field.value !== ""
        );
    }

    // If it's an object, convert to array format (no icon info available)
    const fields: FieldWithIcon[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(ad.extraFields as Record<string, any>).forEach(
      ([name, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          fields.push({ name, value });
        }
      }
    );
    return fields;
  };

  const extraFieldsList = normalizeExtraFields();

  // Get first 4 fields for display (2 per row)
  const displayFields = extraFieldsList.slice(0, 4);

  // Calculate discount and original price
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
    extraFields: displayFields,
    postedTime: ad.createdAt ? formatDate(ad.createdAt) : "Recently",
    views: ad.views || 0,
    isPremium: ad.isFeatured || false,
    isFavorite: ad.isAddedInCollection || false,
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
        <Link
          href={localePath("/user/profile")}
          className="text-purple-600 font-semibold text-sm w-fit hover:underline"
        >
          {t.user.profile.myProfile}
        </Link>

        {/* Profile Card */}
        {isLoadingProfile ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-center py-8">
              <Typography variant="body-small" className="text-gray-500">
                {t.common.loading}
              </Typography>
            </div>
          </div>
        ) : profileError ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
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

        <Tabs
          defaultValue="ads"
          className="w-full mx-auto flex justify-center flex-col items-center"
        >
          <TabsList className="w-full">
            <TabsTrigger className="w-full sm:w-[150px]" value="ads">
              {t.user.profile.myAds}
            </TabsTrigger>
            <TabsTrigger className="w-full sm:w-[150px]" value="reviews">
              {t.user.profile.myRatings}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            className=" w-full grid grid-cols-2 sm:flex flex-wrap gap-3 justify-center mt-4"
            value="ads"
          >
            {isLoadingAds ? (
              <div className="col-span-2 w-full flex items-center justify-center py-8">
                <Typography variant="body-small" className="text-gray-500">
                  {t.common.loading}
                </Typography>
              </div>
            ) : adsError ? (
              <div className="col-span-2 w-full flex items-center justify-center py-8">
                <Typography variant="body-small" className="text-red-500">
                  {t.common.error}
                </Typography>
              </div>
            ) : transformedAds.length === 0 ? (
              <div className="col-span-2 w-full flex items-center justify-center py-8">
                <Typography variant="body-small" className="text-gray-500">
                  {t.user.profile.noAds}
                </Typography>
              </div>
            ) : (
              transformedAds.map((ad) => (
                <MyAdCard
                  key={ad.id}
                  {...ad}
                  onFavorite={(id) => console.log("Favorited:", id)}
                  onShare={(id) => console.log("Shared:", id)}
                  onClick={(id) => router.push(`/ad/${id}`)}
                  className="min-h-[284px] w-full max-w-[255px]"
                />
              ))
            )}
          </TabsContent>
          <TabsContent className=" w-full" value="reviews">
            <UserReviews
              userId={user?._id || "1"}
              reviewsData={reviewsResponse}
              isLoadingReviews={isLoadingReviews}
              reviewsError={reviewsError}
              sortBy={sortBy}
              onSort={setSortBy}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Container1080>
  );
};

export default ProfilePage;
