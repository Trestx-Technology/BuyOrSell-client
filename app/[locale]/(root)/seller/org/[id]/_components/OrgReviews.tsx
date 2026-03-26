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
  useOrganizationReviews,
  useCreateOrganizationReview,
} from "@/hooks/useReviews";
import { Review } from "@/interfaces/review.types";
import { Organization } from "@/interfaces/organization.types";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

interface OrgReviewsProps {
  organizationId: string;
  organization: Organization;
}

const OrgReviews: React.FC<OrgReviewsProps> = ({ organizationId, organization }) => {
  const { t, locale } = useLocale();
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "highest" | "lowest">("latest");
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.session.user);
  const createOrgReviewMutation = useCreateOrganizationReview();

  const isOwner = useMemo(() => {
    if (!user) return false;
    const ownerId =
      typeof organization.owner === "string"
        ? organization.owner
        : organization.owner?._id;
    return user._id === ownerId;
  }, [user, organization]);

  const { data: reviewsData, isLoading, error } = useOrganizationReviews(
    organizationId,
    { sortBy, limit: 100 },
    true
  );

  const reviews = useMemo(() => {
    if (!reviewsData) return [];
    const responseData = reviewsData.data;
    if (Array.isArray(responseData)) return responseData as Review[];
    if (responseData && typeof responseData === "object" && "data" in responseData) {
      const nested = (responseData as { data: unknown }).data;
      if (Array.isArray(nested)) return nested as Review[];
    }
    return [];
  }, [reviewsData]);

  const reviewData = useMemo(() => {
    const overallRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : organization.ratingAvg || 0;

    return {
      overallRating,
      totalReviews: organization.ratingCount || reviews.length,
      reviews: reviews.map((review: Review) => {
        const userName = review.reviewerName || "Anonymous";
        const initials = userName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return {
          id: review._id,
          userName,
          rating: review.rating,
          comment: review.review || "",
          timeAgo: review.createdAt
            ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })
            : "",
          avatar: initials || "A",
        };
      }),
    };
  }, [reviews, organization]);

  const displayReviews = showAllReviews
    ? reviewData.reviews
    : reviewData.reviews.slice(0, 3);

  const renderStars = (rating: number, size: "small" | "large" = "small") => {
    const cls = size === "large" ? "h-7 w-7" : "h-4 w-4";
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${cls} ${i < Math.floor(rating) ? "text-yellow-500 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) { toast.error("Please log in to write a review"); return; }
    if (isOwner) { toast.error("You cannot review your own organization"); return; }
    setIsWriteReviewOpen(true);
  };

  const handleStarClick = useCallback((r: number) => setUserRating(r), []);
  const handleStarHover = useCallback((r: number) => setHoverRating(r), []);
  const handleStarLeave = useCallback(() => setHoverRating(0), []);

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user?._id) { toast.error("Please log in"); return; }
    if (userRating === 0) { toast.error("Please select a rating"); return; }
    try {
      await createOrgReviewMutation.mutateAsync({
        organizationId,
        rating: userRating,
        review: reviewText.trim() || "",
        reviewerId: user._id,
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

  const isPending = createOrgReviewMutation.isPending;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-20 bg-gray-200 dark:bg-slate-800 rounded" />
          <div className="h-32 bg-gray-200 dark:bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-4">
        <Typography variant="body" className="text-red-500 dark:text-red-400">
          Failed to load reviews. Please try again later.
        </Typography>
      </div>
    );
  }

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-6 transition-all">
      {/* Write Review Button */}
      {!isOwner && (
        <Button
          onClick={handleWriteReview}
          variant="outline"
          icon={<Edit className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          className="absolute top-4 right-4 flex items-center gap-2 border-purple text-purple hover:bg-purple/10 dark:hover:bg-purple-900/20"
        >
          {t.seller.reviews.writeReview}
        </Button>
      )}

      <Typography variant="h3" className="text-base font-semibold text-dark-blue dark:text-white mb-6">
        {t.seller.reviews.title}
      </Typography>

      {reviewData.totalReviews > 0 && (
        <div className="flex items-start gap-2 mb-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
          <Star className="size-6 text-yellow-500" fill="#FFB319" />
          <Typography variant="h2" className="text-2xl font-semibold text-dark-blue dark:text-white">
            {reviewData.overallRating.toFixed(1)}
          </Typography>
          <div>
            <Typography variant="sm-regular" className="text-grey-blue dark:text-slate-400">
              {t.seller.reviews.overallRating}
            </Typography>
            <Typography variant="sm-regular" className="text-grey-blue dark:text-slate-400">
              {t.seller.reviews.basedOn}{" "}
              <span className="font-bold text-dark-blue dark:text-white">
                {reviewData.totalReviews} {t.seller.reviews.reviews}
              </span>
            </Typography>
          </div>
        </div>
      )}

      {reviewData.totalReviews > 0 && (
        <div className="flex items-center justify-between mb-6">
          <Typography variant="md-semibold" className="text-dark-blue dark:text-white">
            {reviewData.totalReviews} {t.seller.reviews.ratingAndReviews}
          </Typography>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-fit h-8 border-purple/20 dark:border-purple-800/30 rounded-lg dark:bg-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
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
            <div key={review.id} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800/50 transition-all">
              <div className="w-10 h-10 bg-purple/10 dark:bg-purple/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Typography variant="body-small" className="text-purple dark:text-purple-300 font-semibold text-sm">
                  {review.avatar}
                </Typography>
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <Typography variant="body-small" className="text-dark-blue dark:text-white font-semibold text-sm">
                    {review.userName}
                  </Typography>
                  <div className="flex items-center gap-1 mt-0.5">
                    {renderStars(review.rating, "small")}
                    <Typography variant="body-small" className="text-dark-blue dark:text-white font-bold text-xs ml-1">
                      {review.rating}
                    </Typography>
                    <Typography variant="body-small" className="text-grey-blue dark:text-slate-400 text-xs ml-1">
                      · {review.timeAgo}
                    </Typography>
                  </div>
                </div>
                {review.comment && (
                  <Typography variant="body-small" className="text-dark-blue dark:text-slate-300 text-sm leading-relaxed">
                    {review.comment}
                  </Typography>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Typography variant="body" className="text-grey-blue dark:text-slate-400">
            No reviews yet. Be the first to review this organization!
          </Typography>
        </div>
      )}

      {reviewData.reviews.length > 3 && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setShowAllReviews(!showAllReviews)}
            variant="ghost"
            icon={
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showAllReviews ? "rotate-180" : ""}`}
              />
            }
            iconPosition="center"
            className="text-purple hover:text-purple/80 flex items-center gap-1"
          >
            {showAllReviews ? t.seller.reviews.showLess : t.seller.reviews.viewAll}
          </Button>
        </div>
      )}

      <Dialog open={isWriteReviewOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="dark:text-white">{t.seller.reviews.writeReviewDialog.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-dark-blue dark:text-slate-200 mb-2 block">
                {t.seller.reviews.writeReviewDialog.rating}
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoverRating || userRating);
                  return (
                    <Star
                      key={star}
                      className={`h-6 w-6 cursor-pointer transition-colors ${
                        isFilled ? "text-yellow-500 fill-current" : "text-gray-300"
                      }`}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-dark-blue dark:text-slate-200 mb-2 block">
                {t.seller.reviews.writeReviewDialog.yourReview}
              </label>
              <textarea
                className="w-full p-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
                rows={4}
                placeholder={t.seller.reviews.writeReviewDialog.placeholder}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isPending}
                className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t.seller.reviews.writeReviewDialog.cancel}
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitReview}
                disabled={isPending || userRating === 0}
              >
                {isPending ? "Submitting..." : t.seller.reviews.writeReviewDialog.submitReview}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgReviews;
