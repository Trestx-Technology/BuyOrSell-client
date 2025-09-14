"use client";

import React, { useState } from "react";
import { Typography } from "@/components/typography";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReviewsSectionProps {
  adId: string;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ adId }) => {
  const [sortBy, setSortBy] = useState("latest");

  // Mock data - replace with actual API call
  const reviewData = {
    overallRating: 4.8,
    totalReviews: 1,
    reviews: [
      {
        id: 1,
        userName: "Sameer Khan",
        rating: 4.8,
        comment: "Awesome Car",
        timeAgo: "Latest",
        avatar: "S",
        fullComment:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
    ],
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
        <Typography
          variant="body-small"
          className="text-dark-blue font-semibold text-sm"
        >
          {reviewData.totalReviews} Rating and Reviews
        </Typography>

        {/* Sort Select */}
        <Select value={sortBy} onValueChange={setSortBy}>
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

      {/* Individual Review */}
      <div className="space-y-4">
        {reviewData.reviews.map((review) => (
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
        ))}
      </div>
    </div>
  );
};

export default ReviewsSection;
