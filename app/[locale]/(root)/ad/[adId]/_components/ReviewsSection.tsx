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
import { Button } from "@/components/ui/button";
import { AD } from "@/interfaces/ad";
import { useAdReviews, useAdAverageRating } from "@/hooks/useReviews";
import { Review } from "@/interfaces/review.types";
import { useAuthStore } from "@/stores/authStore";
import { LoginRequiredDialog } from "@/components/auth/login-required-dialog";
import { useLocale } from "@/hooks/useLocale";
import { formatDate } from "@/utils/format-date";
import ReviewDialog from "./ReviewDialog";

interface ReviewsSectionProps {
  ad: AD;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ ad }) => {
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "highest" | "lowest"
  >("latest");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const { t } = useLocale();
  const { isAuthenticated, session } = useAuthStore((state) => state);

  // Check if current user is the owner of the ad
  const isOwner = useMemo(() => {
    if (!session.user?._id) return false;

    const currentUserId = session.user._id;
    const adOwnerId = typeof ad.owner === "string" ? ad.owner : ad.owner?._id;
    const orgOwnerId = ad.organization?.owner;

    return currentUserId === adOwnerId || currentUserId === orgOwnerId;
  }, [session.user?._id, ad.owner, ad.organization?.owner]);

  const adId = ad._id;

  // Fetch ad reviews
  const { data: reviewsResponse, isLoading: isLoadingReviews } = useAdReviews(adId, {
    page: 1,
    limit: 10,
    sortBy,
  });

  // Fetch average rating
  const { data: averageRatingResponse, isLoading: isLoadingAverage } = useAdAverageRating(adId);
  const isLoading = isLoadingReviews || isLoadingAverage;

  // Extract reviews from response
  const reviews = useMemo(() => {
    if (!reviewsResponse) return [];
    // Handle structured response object or array directly if it happens
    if (Array.isArray(reviewsResponse)) return reviewsResponse;
    if (reviewsResponse.data && Array.isArray(reviewsResponse.data)) return reviewsResponse.data;
    // Fallback for deeply nested structure if seen elsewhere
    if ((reviewsResponse as any).data?.data && Array.isArray((reviewsResponse as any).data.data)) 
      return (reviewsResponse as any).data.data;
    
    return [];
  }, [reviewsResponse]);

  // Extract total count
  const totalReviewsCount = useMemo(() => {
    if (!reviewsResponse) return 0;
    if (Array.isArray(reviewsResponse)) return reviewsResponse.length;
    return reviewsResponse.total || reviews.length;
  }, [reviewsResponse, reviews]);

  // Transform API reviews to component format
  const transformedReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];

    return reviews.map((review: Review) => {
      // Get user initials for avatar - use reviewerName if available
      const userName = review.reviewerName || "User";
      const initials = userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      // Format time ago
      const timeAgo = review.createdAt
        ? formatDate(review.createdAt)
        : "Recently";

      // Use review field
      const reviewText = review.review || "";

      return {
        id: review._id,
        userName,
        rating: review.rating,
        comment: reviewText,
        timeAgo,
        avatar: initials || "U",
        fullComment: reviewText,
      };
    });
  }, [reviews]);

  // Get overall rating from hook or fallback to calculation
  const overallRatingValue = useMemo(() => {
    if (averageRatingResponse?.data !== undefined) return averageRatingResponse.data;
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc: number, review: Review) => acc + (review.rating || 0), 0);
    return sum / reviews.length;
  }, [averageRatingResponse, reviews]);

  const totalReviews = totalReviewsCount;

  // Handle opening review dialog
  const handleOpenReviewDialog = () => {
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true);
      return;
    }
    if (isOwner) {
      // This shouldn't happen since the button is hidden, but add safety check
      return;
    }
    setIsReviewDialogOpen(true);
  };

  // Handle review submission success
  const handleReviewSuccess = () => {
    // The dialog will handle closing and the query will refetch automatically
  };

  const reviewData = {
    overallRating: overallRatingValue,
    totalReviews,
    reviews: transformedReviews,
  };

  const renderStars = (rating: number, size: "small" | "large" = "small") => {
    const starSize = size === "large" ? "h-8 w-8" : "h-4 w-4";
    return Array.from({ length: 5 }, (_, index) => {
      const isActive = index < Math.floor(rating);

      return (
        <Star
          key={index}
          className={`${starSize} ${
            isActive ? "text-yellow-500 fill-current" : "text-gray-300"
          }`}
        />
      );
    });
  };

  // Show reviews if we have any reviews, regardless of totalReviews count
  const hasReviews = reviewData.reviews.length > 0;

  return (
    <div className=" bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
      {/* Title */}
      <Typography
        variant="h3"
        className="text-base font-semibold text-dark-blue dark:text-gray-100 mb-6"
      >
        User Reviews & Rating
      </Typography>

      {/* Rate This Seller Section - Only show if user is not the owner */}
      {!isOwner && (
        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 mb-6 border border-gray-200 dark:border-slate-700">
          <Typography
            variant="body-small"
            className="text-dark-blue dark:text-gray-100 font-semibold mb-3"
          >
            Rate this seller
          </Typography>

          <Button
            onClick={handleOpenReviewDialog}
            className="w-full sm:w-auto bg-purple hover:bg-purple/90 text-white"
          >
            Write a Review
          </Button>

          {!isAuthenticated && (
            <Typography variant="body-small" className="text-gray-500 dark:text-gray-400 mt-2">
              Please log in to leave a review
            </Typography>
          )}
        </div>
      )}

      {/* Overall Rating Section */}
      <div className="flex items-start justify-start gap-2 mb-6">
        {/* Large Star Rating */}
        <Star className="size-6 text-yellow-500" fill="#FFB319" />
        {/* Rating Details */}
        <Typography
          variant="h2"
          className="text-2xl font-semibold text-dark-blue dark:text-gray-100"
        >
          {reviewData.overallRating > 0
            ? reviewData.overallRating.toFixed(1)
            : "0.0"}
        </Typography>
        <div>
          <Typography variant="sm-regular" className="text-grey-blue dark:text-gray-400">
            Overall Rating
          </Typography>
          <Typography variant="sm-regular" className="text-grey-blue dark:text-gray-400">
            Based on{" "}
            <span className="font-bold dark:text-gray-200">{reviewData.totalReviews} reviews</span>
          </Typography>
        </div>
      </div>

      {/* Reviews Section - Only show if there are reviews */}
      {hasReviews && (
        <>
          {/* Reviews Count with Sort Dropdown */}
          <div className="flex items-center justify-between mb-6">
            <Typography
              variant="body-small"
              className="text-dark-blue dark:text-gray-100 font-semibold text-sm"
            >
              {reviewData.totalReviews} Rating and Reviews
            </Typography>

            {/* Sort Select */}
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as typeof sortBy)}
            >
              <SelectTrigger className="w-24 h-8 border-purple-100 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
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
              <Typography variant="body-small" className="text-grey-blue dark:text-gray-400">
                Loading reviews...
              </Typography>
            </div>
          )}

          {/* Individual Reviews */}
          {!isLoading && (
            <div className="space-y-4">
              {reviewData.reviews.length > 0 ? (
                reviewData.reviews.map((review: any) => (
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
                          className="text-dark-blue dark:text-gray-100 font-semibold text-sm"
                        >
                          {review.userName}
                        </Typography>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating, "small")}
                          <Typography
                            variant="body-small"
                            className="text-dark-blue dark:text-gray-100 font-semibold text-xs"
                          >
                            {review.rating}
                          </Typography>
                        </div>
                      </div>

                      {/* Review Comment */}
                      <Typography
                        variant="body-small"
                        className="text-dark-blue dark:text-gray-100 font-semibold text-md"
                      >
                        {review.comment}
                      </Typography>

                      {/* Full Comment */}
                      <Typography
                        variant="body-small"
                        className="text-black dark:text-gray-300 text-sm leading-relaxed mb-4"
                      >
                        {review.fullComment}
                      </Typography>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                    <Typography variant="body-small" className="text-grey-blue dark:text-gray-400">
                    No reviews yet. Be the first to review!
                  </Typography>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Review Dialog */}
      <ReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        adId={adId}
        onSuccess={handleReviewSuccess}
      />

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        redirectUrl={
          typeof window !== "undefined" ? window.location.pathname : ""
        }
        message="You need to be logged in to leave a review. Would you like to login?"
      />
    </div>
  );
};

export default ReviewsSection;
