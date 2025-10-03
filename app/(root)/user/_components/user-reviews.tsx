"use client";

import React, { useState } from "react";
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

interface UserReviewsProps {
  userId: string;
}

const UserReviews: React.FC<UserReviewsProps> = () => {
  const [sortBy, setSortBy] = useState("latest");
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Mock data - replace with actual API call
  const reviewData = {
    overallRating: 4.5,
    totalReviews: 1,
    reviews: [
      {
        id: 1,
        userName: "Sameer Khan",
        rating: 4.8,
        comment: "Good Dealer",
        timeAgo: "2 days ago",
        avatar: "S",
        fullComment:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      {
        id: 2,
        userName: "Ahmed Ali",
        rating: 4.2,
        comment: "Excellent Service",
        timeAgo: "1 week ago",
        avatar: "A",
        fullComment:
          "Great experience with this dealer. Very professional and helpful throughout the entire process.",
      },
      {
        id: 3,
        userName: "Sarah Johnson",
        rating: 5.0,
        comment: "Outstanding",
        timeAgo: "2 weeks ago",
        avatar: "S",
        fullComment:
          "Best car buying experience I've ever had. Highly recommend this dealer to anyone looking for quality vehicles.",
      },
    ],
  };

  const displayReviews = showAllReviews
    ? reviewData.reviews
    : reviewData.reviews.slice(0, 1);

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
    // Handle review submission
    console.log("Review submitted");
    setIsWriteReviewOpen(false);
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Title */}
      <Typography
        variant="h3"
        className="text-base font-semibold text-dark-blue mb-6"
      >
        Your Reviews & Rating
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
          {reviewData.overallRating}
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
        <Typography variant="md-semibold" className="text-dark-blue">
          {reviewData.totalReviews} Rating and Reviews
        </Typography>

        {/* Sort Select */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-fit h-8 border-purple/20 rounded-lg">
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

      {/* Individual Reviews */}
      <div className="space-y-4">
        {displayReviews.map((review) => (
          <div key={review.id} className="flex items-start gap-3">
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
              {/* User Name and Rating */}
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

              {/* Review Comment */}
              <Typography
                variant="body-small"
                className="text-dark-blue font-semibold text-sm mb-1"
              >
                {review.comment}
              </Typography>

              {/* Full Comment */}
              <Typography
                variant="body-small"
                className="text-black text-sm leading-relaxed"
              >
                {review.fullComment}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {reviewData.reviews.length > 1 && (
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
            {showAllReviews ? "Show Less" : "View All"}
          </Button>
        </div>
      )}

      {/* Write Review Dialog */}
      <Dialog open={isWriteReviewOpen} onOpenChange={setIsWriteReviewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Rating Input */}
            <div>
              <label className="text-sm font-medium text-dark-blue mb-2 block">
                Rating
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

            {/* Comment Input */}
            <div>
              <label className="text-sm font-medium text-dark-blue mb-2 block">
                Your Review
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="Share your experience with this seller..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsWriteReviewOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmitReview}>
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserReviews;
