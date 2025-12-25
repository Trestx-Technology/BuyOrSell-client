"use client";

import React, { useState, useCallback } from "react";
import { Star, Send, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/typography";
import { useCreateAdReview } from "@/hooks/useReviews";
import { useAuthStore } from "@/stores/authStore";
import { useLocale } from "@/hooks/useLocale";
import { toast } from "sonner";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adId: string;
  onSuccess?: () => void;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  adId,
  onSuccess,
}) => {
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const { locale } = useLocale();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.session.user);
  const createReviewMutation = useCreateAdReview();

  const handleStarClick = useCallback((rating: number) => {
    setUserRating(rating);
  }, []);

  const handleStarHover = useCallback((rating: number) => {
    setHoverRating(rating);
  }, []);

  const handleStarLeave = useCallback(() => {
    setHoverRating(0);
  }, []);

  const handleSubmit = async () => {
    if (!isAuthenticated || !user?._id) {
      toast.error("Please log in to submit a review");
      return;
    }

    if (userRating === 0) {
      toast.error("Please select a rating before submitting");
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        adId,
        rating: userRating,
        review: reviewText.trim() || "",
        reviewerId: user._id,
        language: locale,
      });

      // Reset form
      setUserRating(0);
      setReviewText("");
      onOpenChange(false);
      onSuccess?.();
      toast.success("Thank you for your review!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleClose = () => {
    setUserRating(0);
    setReviewText("");
    setHoverRating(0);
    onOpenChange(false);
  };

  const renderStars = (interactive: boolean = true) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starRating = index + 1;
      const isActive = starRating <= (hoverRating || userRating);

      return (
        <Star
          key={index}
          className={`h-8 w-8 cursor-pointer transition-colors ${
            isActive ? "text-yellow-500 fill-current" : "text-gray-300"
          }`}
          onClick={interactive ? () => handleStarClick(starRating) : undefined}
          onMouseEnter={interactive ? () => handleStarHover(starRating) : undefined}
          onMouseLeave={interactive ? handleStarLeave : undefined}
        />
      );
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-[95%] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-dark-blue">
            Rate this seller
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Typography variant="body-small" className="text-dark-blue font-medium">
              Your Rating
            </Typography>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">{renderStars()}</div>
              {userRating > 0 && (
                <Typography variant="body-small" className="text-gray-600">
                  {userRating} star{userRating !== 1 ? "s" : ""}
                </Typography>
              )}
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Typography variant="body-small" className="text-dark-blue font-medium">
              Your Review
            </Typography>
            <Textarea
              placeholder="Share your experience with this seller (optional)"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={createReviewMutation.isPending}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={createReviewMutation.isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createReviewMutation.isPending || userRating === 0}
            className="w-full sm:w-auto bg-purple hover:bg-purple/90 text-white"
            icon={<Send className="h-4 w-4" />}
            isLoading={createReviewMutation.isPending}
            iconPosition="left"
          >
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;

