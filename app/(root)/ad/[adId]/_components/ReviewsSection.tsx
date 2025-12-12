"use client";

import React, { useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AD } from "@/interfaces/ad";
import { useAdReviews } from "@/hooks/useReviews";
import { formatDate } from "@/utils/format-date";

interface ReviewsSectionProps {
  ad: AD;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ ad }) => {
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");

  const adId = ad._id;

  // Fetch ad reviews
  const { data: reviewsResponse, isLoading } = useAdReviews(
    adId,
    {
      page: 1,
      limit: 10,
      sortBy,
    }
  );

  // Transform API reviews to component format
  const transformedReviews = useMemo(() => {
    if (!reviewsResponse?.data?.reviews) return [];

    return reviewsResponse.data.reviews.map((review) => {
      // Get user initials for avatar
      const userName = review.userName || "User";
      const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      // Format time ago
      const timeAgo = review.createdAt ? formatDate(review.createdAt) : "Recently";

      return {
        id: review._id,
        userName,
        rating: review.rating,
        comment: review.comment || review.fullComment || "",
        timeAgo,
        avatar: initials || "U",
        fullComment: review.fullComment || review.comment || "",
      };
    });
  }, [reviewsResponse]);

  // Get overall rating and total from API response
  const overallRating = reviewsResponse?.data?.overallRating || 0;
  const totalReviews = reviewsResponse?.data?.total || 
                      reviewsResponse?.data?.ratingCount || 
                      transformedReviews.length;

  const reviewData = {
    overallRating,
    totalReviews,
    reviews: transformedReviews,
  };

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

  // Hide component if no reviews and not loading
  if (!isLoading && reviewData.totalReviews === 0 && reviewData.reviews.length === 0) {
    return null;
  }

  return (
    <div className=" bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Title */}
      <Typography
        variant="h3"
        className="text-base font-semibold text-dark-blue mb-6"
      >
        User Reviews & Rating
      </Typography>

      {/* Overall Rating Section */}
      <div className="flex items-start justify-start gap-2 mb-6">
        {/* Large Star Rating */}
        <Star className="size-6 text-yellow-500" fill="#FFB319" />
        {/* Rating Details */}
        <Typography
          variant="h2"
          className="text-2xl font-semibold text-dark-blue"
        >
          {reviewData.overallRating > 0 ? reviewData.overallRating.toFixed(1) : "0.0"}
        </Typography>
        <div>
          <Typography variant="sm-regular" className="text-grey-blue">
            Overall Rating
          </Typography>
          <Typography variant="sm-regular" className="text-grey-blue">
            Based on{" "}
            <span className="font-bold">{reviewData.totalReviews} reviews</span>
          </Typography>
        </div>
      </div>

      {/* Reviews Count with Sort Dropdown */}
      <div className="flex items-center justify-between mb-6">
        <Typography
          variant="body-small"
          className="text-dark-blue font-semibold text-sm"
        >
          {reviewData.totalReviews} Rating and Reviews
        </Typography>

        {/* Sort Select */}
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
          <SelectTrigger className="w-24 h-8 border-purple-100 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest</SelectItem>
            <SelectItem value="lowest">Lowest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <Typography variant="body-small" className="text-grey-blue">
            Loading reviews...
          </Typography>
        </div>
      )}

      {/* Individual Reviews */}
      {!isLoading && (
        <div className="space-y-4">
          {reviewData.reviews.length > 0 ? (
            reviewData.reviews.map((review) => (
          <div key={review.id} className="flex items-start gap-4">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-[#9FB7E4] rounded-full flex items-center justify-center flex-shrink-0">
              <Typography
                variant="body-small"
                className="text-white font-semibold text-sm"
              >
                {review.avatar}
              </Typography>
            </div>

            {/* Review Content */}
            <div className="flex-1">
              {/* User Name */}
              <div className="mb-2 space-y-1">
                <Typography
                  variant="body-small"
                  className="text-dark-blue font-semibold text-sm"
                >
                  {review.userName}
                </Typography>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating, "small")}
                  <Typography
                    variant="body-small"
                    className="text-dark-blue font-semibold text-xs"
                  >
                    {review.rating}
                  </Typography>
                </div>
              </div>

              {/* Review Comment */}
              <Typography
                variant="body-small"
                className="text-dark-blue font-semibold text-md"
              >
                {review.comment}
              </Typography>

              {/* Full Comment */}
              <Typography
                variant="body-small"
                className="text-black text-sm leading-relaxed mb-4"
              >
                {review.fullComment}
              </Typography>
            </div>
          </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Typography variant="body-small" className="text-grey-blue">
                No reviews yet. Be the first to review!
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
