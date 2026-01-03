"use client";

import React, { useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from "@/components/ui/responsive-modal";
import { useUserReviews } from "@/hooks/useReviews";
import { useLocale } from "@/hooks/useLocale";
import { formatDate } from "@/utils/format-date";
import {
  Review,
  ReviewsResponseObject,
  ReviewsResponse,
} from "@/interfaces/review.types";

interface AllReviewsModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSortBy?: "latest" | "oldest" | "highest" | "lowest";
}

const AllReviewsModal: React.FC<AllReviewsModalProps> = ({
  userId,
  open,
  onOpenChange,
  initialSortBy = "latest",
}) => {
  const { t } = useLocale();
  const [sortBy, setSortBy] = useState<
    "latest" | "oldest" | "highest" | "lowest"
  >(initialSortBy);
  const [page, setPage] = useState(1);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const limit = 10;

  // Fetch reviews with pagination
  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = useUserReviews(
    userId,
    {
      page,
      limit,
      sortBy,
    },
    open && !!userId
  );

  // Extract reviews from response and accumulate them
  const currentReviews = useMemo(() => {
    if (!reviewsResponse) return [];
    if (Array.isArray(reviewsResponse)) {
      return reviewsResponse;
    }
    const responseObj = reviewsResponse as ReviewsResponseObject;
    return responseObj.data || [];
  }, [reviewsResponse]);

  // Reset when sort changes or modal opens
  React.useEffect(() => {
    if (open) {
      setPage(1);
      setAllReviews([]);
    }
  }, [sortBy, open]);

  // Update accumulated reviews when new data arrives
  React.useEffect(() => {
    if (currentReviews.length > 0 && open) {
      if (page === 1) {
        // Reset on first page or when sort changes
        setAllReviews(currentReviews);
      } else {
        // Append new reviews for subsequent pages
        setAllReviews((prev) => {
          // Avoid duplicates by checking if review already exists
          const existingIds = new Set(prev.map((r) => r._id));
          const newReviews = currentReviews.filter(
            (r) => !existingIds.has(r._id)
          );
          return [...prev, ...newReviews];
        });
      }
    }
  }, [currentReviews, page, open]);

  const hasMore = currentReviews.length === limit;
  const totalReviews = allReviews.length;

  // Transform Review to display format
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
      rating: review.rating,
      comment:
        reviewText.length > 50 ? reviewText.substring(0, 50) + "..." : reviewText,
      timeAgo,
      avatar,
      fullComment: reviewText,
    };
  };

  const transformedReviews = allReviews.map(transformReview);

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

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const handleSortChange = (value: "latest" | "oldest" | "highest" | "lowest") => {
    setSortBy(value);
    setPage(1);
    setAllReviews([]);
  };

  return (
    <ResponsiveModal open={open} onOpenChange={onOpenChange}>
      <ResponsiveModalContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <ResponsiveModalHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <ResponsiveModalTitle>
              {t.user.profile.ratingAndReviews.replace(
                "{count}",
                totalReviews.toString()
              )}
            </ResponsiveModalTitle>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-fit h-8 border-purple/20 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">{t.user.profile.latest}</SelectItem>
                <SelectItem value="oldest">{t.user.profile.oldest}</SelectItem>
                <SelectItem value="highest">{t.user.profile.highest}</SelectItem>
                <SelectItem value="lowest">{t.user.profile.lowest}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </ResponsiveModalHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {isLoading && page === 1 ? (
            <div className="flex items-center justify-center py-8">
              <Typography variant="body-small" className="text-gray-500">
                {t.common.loading}
              </Typography>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <Typography variant="body-small" className="text-red-500">
                {t.common.error}
              </Typography>
            </div>
          ) : transformedReviews.length === 0 ? (
            <div className="text-center py-8">
              <Typography variant="body-small" className="text-gray-500">
                {t.user.profile.noReviews}
              </Typography>
            </div>
          ) : (
            <div className="space-y-4">
              {transformedReviews.map((review) => (
                <div key={review.id} className="flex items-start gap-3 pb-4 border-b border-gray-200 last:border-b-0">
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
              ))}

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? t.common.loading : t.common.showMore}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
};

export default AllReviewsModal;
