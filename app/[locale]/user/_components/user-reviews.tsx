"use client";

import React, { useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserReviews, useUserAverageRating } from "@/hooks/useReviews";
import { useLocale } from "@/hooks/useLocale";
import { formatDate } from "@/utils/format-date";
import { Review } from "@/interfaces/review.types";

interface UserReviewsProps {
  userId: string;
}

const UserReviews: React.FC<UserReviewsProps> = ({ userId }) => {
  const { t } = useLocale();
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "highest" | "lowest"
  >("latest");
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Fetch user reviews
  const {
    data: reviewsResponse,
    isLoading: isLoadingReviews,
    error: reviewsError,
  } = useUserReviews(userId, {
    sortBy,
    limit: 50,
  });

  // Fetch average rating
  const {
    data: averageRatingResponse,
    isLoading: isLoadingAverage,
    error: averageError,
  } = useUserAverageRating(userId);

  // Extract reviews from response
  const reviews = useMemo(() => {
    if (!reviewsResponse) return [];
    return reviewsResponse.data?.reviews || reviewsResponse.reviews || [];
  }, [reviewsResponse]);

  // Get overall rating and total count
  const overallRating =
    averageRatingResponse?.data || reviewsResponse?.data?.overallRating || 0;
  const totalReviews =
    reviewsResponse?.data?.total ||
    reviewsResponse?.data?.ratingCount ||
    reviews.length;

  // Transform Review to display format
  const transformReview = (review: Review) => {
    const reviewerName = review.reviewerName || review.userName || "Anonymous";
    const avatar = reviewerName.charAt(0).toUpperCase();
    const comment = review.comment || review.review || "";
    const fullComment = review.fullComment || review.review || comment;
    const timeAgo = review.createdAt
      ? formatDate(review.createdAt)
      : "Recently";

    return {
      id: review._id,
      userName: reviewerName,
      rating: review.rating,
      comment: comment.length > 50 ? comment.substring(0, 50) + "..." : comment,
      timeAgo,
      avatar,
      fullComment,
    };
  };

  const transformedReviews = reviews.map(transformReview);

  // Sort reviews based on sortBy
  const sortedReviews = useMemo(() => {
    const sorted = [...transformedReviews];
    switch (sortBy) {
      case "latest":
        return sorted.sort((a, b) => {
          const reviewA = reviews.find((r) => r._id === a.id);
          const reviewB = reviews.find((r) => r._id === b.id);
          const dateA = reviewA?.createdAt
            ? new Date(reviewA.createdAt).getTime()
            : 0;
          const dateB = reviewB?.createdAt
            ? new Date(reviewB.createdAt).getTime()
            : 0;
          return dateB - dateA;
        });
      case "oldest":
        return sorted.sort((a, b) => {
          const reviewA = reviews.find((r) => r._id === a.id);
          const reviewB = reviews.find((r) => r._id === b.id);
          const dateA = reviewA?.createdAt
            ? new Date(reviewA.createdAt).getTime()
            : 0;
          const dateB = reviewB?.createdAt
            ? new Date(reviewB.createdAt).getTime()
            : 0;
          return dateA - dateB;
        });
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [transformedReviews, sortBy, reviews]);

  const displayReviews = showAllReviews
    ? sortedReviews
    : sortedReviews.slice(0, 1);

  const renderStars = (rating: number, size: "small" | "large" = "small") => {
    const starSize = size === "large" ? "h-8 w-8" : "h-4 w-4";
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${starSize} ${
          index < Math.floor(rating)
            ? "text-yellow-500 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleSubmitReview = () => {
    console.log("Review submitted");
    setIsWriteReviewOpen(false);
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <Typography
        variant="h3"
        className="text-base font-semibold text-dark-blue mb-6"
      >
        {t.user.profile.ratingAndReviews.replace(
          "{count}",
          totalReviews.toString()
        )}
      </Typography>

      {/* Loading State */}
      {(isLoadingReviews || isLoadingAverage) && (
        <div className="flex items-center justify-center py-8">
          <Typography variant="body-small" className="text-gray-500">
            {t.common.loading}
          </Typography>
        </div>
      )}

      {/* Error State */}
      {(reviewsError || averageError) && (
        <div className="flex items-center justify-center py-8">
          <Typography variant="body-small" className="text-red-500">
            {t.common.error}
          </Typography>
        </div>
      )}

      {/* Content */}
      {!isLoadingReviews &&
        !isLoadingAverage &&
        !reviewsError &&
        !averageError && (
          <>
            <div className="flex items-start justify-start gap-2 mb-6">
              <Star className="size-6 text-yellow-500" fill="#FFB319" />
              <Typography
                variant="h2"
                className="text-2xl font-semibold text-dark-blue"
              >
                {overallRating.toFixed(1)}
              </Typography>
              <div>
                <Typography variant="sm-regular" className="text-grey-blue">
                  {t.user.profile.overallRating}
                </Typography>
                <Typography variant="sm-regular" className="text-grey-blue">
                  {t.user.profile.basedOnReviews.replace(
                    "{count}",
                    totalReviews.toString()
                  )}
                </Typography>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <Typography variant="md-semibold" className="text-dark-blue">
                {t.user.profile.ratingAndReviews.replace(
                  "{count}",
                  totalReviews.toString()
                )}
              </Typography>

              <Select
                value={sortBy}
                onValueChange={(
                  value: "latest" | "oldest" | "highest" | "lowest"
                ) => setSortBy(value)}
              >
                <SelectTrigger className="w-fit h-8 border-purple/20 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">
                    {t.user.profile.latest}
                  </SelectItem>
                  <SelectItem value="oldest">
                    {t.user.profile.oldest}
                  </SelectItem>
                  <SelectItem value="highest">
                    {t.user.profile.highest}
                  </SelectItem>
                  <SelectItem value="lowest">
                    {t.user.profile.lowest}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {displayReviews.length === 0 ? (
                <div className="text-center py-8">
                  <Typography variant="body-small" className="text-gray-500">
                    {t.user.profile.noReviews}
                  </Typography>
                  <Typography
                    variant="body-small"
                    className="text-gray-400 text-sm"
                  >
                    {t.user.profile.noReviewsDescription}
                  </Typography>
                </div>
              ) : (
                displayReviews.map((review) => (
                  <div key={review.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#9FB7E4] rounded-full flex items-center justify-center flex-shrink-0">
                      <Typography
                        variant="body-small"
                        className="text-white font-semibold text-sm"
                      >
                        {review.avatar}
                      </Typography>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2">
                        <Typography
                          variant="body-small"
                          className="text-dark-blue font-semibold text-sm"
                        >
                          {review.userName}
                        </Typography>
                        <div className="flex items-center gap-1 mt-1">
                          {renderStars(review.rating, "small")}
                          <Typography
                            variant="body-small"
                            className="text-dark-blue font-semibold text-xs"
                          >
                            {review.rating}
                          </Typography>
                        </div>
                      </div>

                      {review.comment && (
                        <Typography
                          variant="body-small"
                          className="text-dark-blue font-semibold text-sm mb-1"
                        >
                          {review.comment}
                        </Typography>
                      )}

                      <Typography
                        variant="body-small"
                        className="text-black text-sm leading-relaxed"
                      >
                        {review.fullComment}
                      </Typography>

                      <Typography
                        variant="body-small"
                        className="text-gray-400 text-xs mt-1"
                      >
                        {review.timeAgo}
                      </Typography>
                    </div>
                  </div>
                ))
              )}
            </div>

            {sortedReviews.length > 1 && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  variant="ghost"
                  icon={
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showAllReviews ? "rotate-180" : ""
                      }`}
                    />
                  }
                  iconPosition="center"
                  className="text-purple hover:text-purple/80 flex items-center gap-1"
                >
                  {showAllReviews
                    ? t.user.profile.showLess
                    : t.user.profile.viewAll}
                </Button>
              </div>
            )}
          </>
        )}

      <Dialog open={isWriteReviewOpen} onOpenChange={setIsWriteReviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.user.profile.writeReview}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-blue mb-2 block">
                {t.user.profile.rating}
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-6 w-6 text-gray-300 hover:text-yellow-500 cursor-pointer"
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-dark-blue mb-2 block">
                {t.user.profile.writeReview}
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="Share your experience with this seller..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsWriteReviewOpen(false)}
              >
                {t.user.profile.cancel}
              </Button>
              <Button variant="primary" onClick={handleSubmitReview}>
                {t.user.profile.submitReview}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReviews;
