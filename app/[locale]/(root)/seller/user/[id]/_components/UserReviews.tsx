"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Edit, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/hooks/useLocale";
import {
  useUserReviews,
  useCreateUserReview,
  useUserAverageRating,
} from "@/hooks/useReviews";
import { Review } from "@/interfaces/review.types";
import { User } from "@/interfaces/user.types";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

interface UserReviewsProps {
  userId: string;
  user: User;
}

const UserReviews: React.FC<UserReviewsProps> = ({ userId }) => {
  const { t, locale } = useLocale();
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUser = useAuthStore((state) => state.session.user);
  const createReviewMutation = useCreateUserReview();

  const isOwner = useMemo(() => currentUser?._id === userId, [currentUser, userId]);

  const { data: reviewsData, isLoading, error } = useUserReviews(userId, { sortBy, limit: 100 }, !!userId);
  const userAvgRating = useUserAverageRating(userId, !!userId);

  const reviews = useMemo(() => {
    if (!reviewsData) return [];
    const d = reviewsData.data;
    if (Array.isArray(d)) return d as Review[];
    if (d && typeof d === "object" && "data" in d) {
      const nested = (d as { data: unknown }).data;
      if (Array.isArray(nested)) return nested as Review[];
    }
    return [];
  }, [reviewsData]);

  const reviewData = useMemo(() => {
    const overallRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : userAvgRating.data?.data || 0;
    return {
      overallRating,
      totalReviews: reviews.length,
      reviews: reviews.map((r: Review) => {
        const name = r.reviewerName || "Anonymous";
        const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
        return {
          id: r._id,
          userName: name,
          rating: r.rating,
          comment: r.review || "",
          timeAgo: r.createdAt ? formatDistanceToNow(new Date(r.createdAt), { addSuffix: true }) : "",
          avatar: initials || "A",
        };
      }),
    };
  }, [reviews, userAvgRating]);

  const displayReviews = showAllReviews ? reviewData.reviews : reviewData.reviews.slice(0, 3);
  const renderStars = (rating: number, size: "small" | "large" = "small") => {
    const cls = size === "large" ? "h-7 w-7" : "h-4 w-4";
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`${cls} ${i < Math.floor(rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
    ));
  };

  const handleStarClick = useCallback((r: number) => setUserRating(r), []);
  const handleStarHover = useCallback((r: number) => setHoverRating(r), []);
  const handleStarLeave = useCallback(() => setHoverRating(0), []);

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !currentUser?._id) { toast.error("Please log in"); return; }
    if (userRating === 0) { toast.error("Please select a rating"); return; }
    try {
      await createReviewMutation.mutateAsync({
        userId,
        rating: userRating,
        review: reviewText.trim() || "",
        reviewerId: currentUser._id,
        language: locale,
      });
      setUserRating(0); setReviewText(""); setHoverRating(0); setIsWriteReviewOpen(false);
      toast.success("Thank you for your review!");
    } catch {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setUserRating(0); setReviewText(""); setHoverRating(0); setIsWriteReviewOpen(false);
  };

  const isPending = createReviewMutation.isPending;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Typography variant="body" className="text-red-500">
          Failed to load reviews.
        </Typography>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      {!isOwner && (
        <Button
          onClick={() => {
            if (!isAuthenticated) { toast.error("Please log in to write a review"); return; }
            setIsWriteReviewOpen(true);
          }}
          variant="outline"
          icon={<Edit className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          className="absolute top-4 right-4 border-purple text-purple hover:bg-purple/10"
        >
          {t.seller.reviews.writeReview}
        </Button>
      )}

      <Typography variant="h3" className="text-base font-semibold text-dark-blue mb-6">
        {t.seller.reviews.title}
      </Typography>

      {reviewData.totalReviews > 0 && (
        <div className="flex items-start gap-2 mb-6">
          <Star className="size-6 text-yellow-500" fill="#FFB319" />
          <Typography variant="h2" className="text-2xl font-semibold text-dark-blue">
            {reviewData.overallRating.toFixed(1)}
          </Typography>
          <div>
            <Typography variant="sm-regular" className="text-grey-blue">
              {t.seller.reviews.overallRating}
            </Typography>
            <Typography variant="sm-regular" className="text-grey-blue">
              {t.seller.reviews.basedOn}{" "}
              <span className="font-bold">{reviewData.totalReviews} {t.seller.reviews.reviews}</span>
            </Typography>
          </div>
        </div>
      )}

      {reviewData.totalReviews > 0 && (
        <div className="flex items-center justify-between mb-6">
          <Typography variant="md-semibold" className="text-dark-blue">
            {reviewData.totalReviews} {t.seller.reviews.ratingAndReviews}
          </Typography>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-fit h-8 border-purple/20 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">{t.seller.reviews.sortBy.latest}</SelectItem>
              <SelectItem value="oldest">{t.seller.reviews.sortBy.oldest}</SelectItem>
              <SelectItem value="highest">{t.seller.reviews.sortBy.highest}</SelectItem>
              <SelectItem value="lowest">{t.seller.reviews.sortBy.lowest}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {displayReviews.length > 0 ? (
        <div className="space-y-4">
          {displayReviews.map((review) => (
            <div key={review.id} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#9FB7E4] rounded-full flex items-center justify-center flex-shrink-0">
                <Typography variant="body-small" className="text-white font-semibold text-sm">
                  {review.avatar}
                </Typography>
              </div>
              <div className="flex-1">
                <Typography variant="body-small" className="text-dark-blue font-semibold text-sm">
                  {review.userName}
                </Typography>
                <div className="flex items-center gap-1 mt-0.5">
                  {renderStars(review.rating)}
                  <Typography variant="body-small" className="text-xs text-grey-blue ml-1">
                    · {review.timeAgo}
                  </Typography>
                </div>
                {review.comment && (
                  <Typography variant="body-small" className="text-dark-blue text-sm leading-relaxed mt-1">
                    {review.comment}
                  </Typography>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Typography variant="body" className="text-grey-blue">
            No reviews yet. Be the first to review!
          </Typography>
        </div>
      )}

      {reviewData.reviews.length > 3 && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setShowAllReviews(!showAllReviews)}
            variant="ghost"
            icon={<ChevronDown className={`h-4 w-4 transition-transform ${showAllReviews ? "rotate-180" : ""}`} />}
            iconPosition="center"
            className="text-purple hover:text-purple/80"
          >
            {showAllReviews ? t.seller.reviews.showLess : t.seller.reviews.viewAll}
          </Button>
        </div>
      )}

      <Dialog open={isWriteReviewOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.seller.reviews.writeReviewDialog.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-blue mb-2 block">
                {t.seller.reviews.writeReviewDialog.rating}
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      star <= (hoverRating || userRating) ? "text-yellow-500 fill-current" : "text-gray-300"
                    }`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-dark-blue mb-2 block">
                {t.seller.reviews.writeReviewDialog.yourReview}
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
                rows={4}
                placeholder={t.seller.reviews.writeReviewDialog.placeholder}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseDialog} disabled={isPending}>
                {t.seller.reviews.writeReviewDialog.cancel}
              </Button>
              <Button variant="primary" onClick={handleSubmitReview} disabled={isPending || userRating === 0}>
                {isPending ? "Submitting..." : t.seller.reviews.writeReviewDialog.submitReview}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReviews;
