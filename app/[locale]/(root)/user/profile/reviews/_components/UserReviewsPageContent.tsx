"use client";

import React, { useMemo } from "react";
import { useGetProfile } from "@/hooks/useUsers";
import {
  useInfiniteUserReviews,
  useUserAverageRating,
} from "@/hooks/useReviews";
import { InfiniteScrollContainer } from "@/components/global/infinite-scroll-container";
import { Typography } from "@/components/typography";
import { Star } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { Review, ReviewsResponseObject } from "@/interfaces/review.types";

export default function UserReviewsPageContent() {
  const { t, localePath } = useLocale();
  const { data: profileResponse, isLoading: isLoadingProfile } =
    useGetProfile();
  const userId = profileResponse?.data?.user?._id;

  const { data: averageRatingResponse, isLoading: isLoadingAverage } =
    useUserAverageRating(userId || "", !!userId);

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingReviews,
    error: reviewsError,
  } = useInfiniteUserReviews(
    userId || "",
    { limit: 10, sortBy: "latest" },
    !!userId,
  );

  const reviews = useMemo(() => {
    if (!reviewsData) return [];
    return reviewsData.pages.flatMap((page: any) => {
      if (Array.isArray(page)) return page;
      if (page && Array.isArray(page.data)) return page.data;
      if (page && page.data && Array.isArray(page.data.data))
        return page.data.data;
      return [];
    });
  }, [reviewsData]);

  const overallRating = averageRatingResponse?.data || 0;
  const totalReviews =
    reviewsData?.pages[0] && !Array.isArray(reviewsData.pages[0])
      ? (reviewsData.pages[0] as any).total ||
        (reviewsData.pages[0] as any).data?.total ||
        reviews.length
      : reviews.length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? "text-yellow-500 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const transformReview = (review: Review) => {
    const reviewerName = review.reviewerName || "Anonymous";
    const avatar = reviewerName.charAt(0).toUpperCase();
    const reviewText = review.review || "";
    const timeAgo = review.createdAt
      ? formatDate(review.createdAt)
      : "Recently";

    return {
      id: review._id,
      userName: reviewerName,
      rating: review.rating || 0,
      comment:
        reviewText.length > 50
          ? reviewText.substring(0, 50) + "..."
          : reviewText,
      timeAgo,
      avatar,
      fullComment: reviewText,
    };
  };

  const transformedReviews = reviews.map(transformReview);

  if (isLoadingProfile || isLoadingReviews || isLoadingAverage) {
    return (
      <Container1080>
        <MobileStickyHeader
          title={t.user.profile.ratingAndReviews.replace("{count}", "")}
        />
        <div className="flex flex-col gap-5 py-8 px-4 xl:px-0 min-h-screen animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 mb-4">
            <div className="flex items-start justify-start gap-4">
              <Skeleton className="w-14 h-14 rounded-lg" />
              <div className="space-y-2 pt-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex-1 flex flex-col min-h-[500px]">
            <Skeleton className="h-6 w-32 mb-8" />
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                >
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container1080>
    );
  }

  return (
    <Container1080>
      <MobileStickyHeader
        title={t.user.profile.ratingAndReviews.replace(
          "{count}",
          totalReviews.toString(),
        )}
      />

      <div className="flex flex-col gap-5 py-8 px-4 xl:px-0 min-h-screen">
        <Breadcrumbs
          items={[
            {
              id: "profile",
              label: t.user.profile.myProfile,
              href: localePath("/user/profile"),
            },
            {
              id: "reviews",
              label: "All Reviews",
              href: localePath("/user/profile/reviews"),
            },
          ]}
        />

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 mb-4">
          <div className="flex items-start justify-start gap-2">
            <Star className="size-6 text-yellow-500" fill="#FFB319" />
            <Typography
              variant="h2"
              className="text-2xl font-semibold text-dark-blue dark:text-white"
            >
              {overallRating.toFixed(1)}
            </Typography>
            <div>
              <Typography variant="sm-regular" className="text-grey-blue">
                {t.user.profile.overallRating}
              </Typography>
              <Typography
                variant="sm-regular"
                className="text-black dark:text-gray-100 font-semibold"
              >
                {t.user.profile.basedOnReviews.replace(
                  "{count}",
                  totalReviews.toString(),
                )}
              </Typography>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 flex-1 flex flex-col min-h-[500px]">
          <Typography
            variant="h3"
            className="text-lg font-semibold text-dark-blue dark:text-white mb-6"
          >
            All Reviews
          </Typography>

          <InfiniteScrollContainer
            onLoadMore={async () => {
              if (hasNextPage) {
                await fetchNextPage();
              }
            }}
            isLoading={isFetchingNextPage}
            hasMore={hasNextPage}
            className="flex-1 pr-2 pb-10"
          >
            {reviewsError ? (
              <Typography
                variant="body-small"
                className="text-red-500 text-center py-8"
              >
                Failed to load reviews.
              </Typography>
            ) : transformedReviews.length === 0 ? (
              <div className="text-center py-8">
                <Typography variant="body-small" className="text-gray-500">
                  {t.user.profile.noReviews}
                </Typography>
              </div>
            ) : (
              <div className="space-y-6">
                {transformedReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-start gap-4 pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0"
                  >
                    <div className="w-12 h-12 bg-[#9FB7E4] rounded-full flex items-center justify-center flex-shrink-0">
                      <Typography
                        variant="body"
                        className="text-white font-semibold flex items-center justify-center pt-2"
                      >
                        {review.avatar}
                      </Typography>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <Typography
                          variant="body"
                          className="text-dark-blue dark:text-white font-semibold"
                        >
                          {review.userName}
                        </Typography>
                        <Typography
                          variant="body-small"
                          className="text-gray-400 text-xs mt-1"
                        >
                          {review.timeAgo}
                        </Typography>
                      </div>

                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(review.rating || 0)}
                        <Typography
                          variant="body-small"
                          className="text-dark-blue dark:text-white font-semibold text-xs ml-1"
                        >
                          {review.rating ? review.rating.toFixed(1) : "0.0"}
                        </Typography>
                      </div>

                      <Typography
                        variant="body-small"
                        className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line"
                      >
                        {review.fullComment}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </InfiniteScrollContainer>
        </div>
      </div>
    </Container1080>
  );
}
