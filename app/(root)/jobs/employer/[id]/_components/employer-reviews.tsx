"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { EmployerReview } from "@/interfaces/job.types";

interface EmployerReviewsProps {
  reviews: EmployerReview[];
  averageRating?: number;
  totalReviews?: number;
}

export default function EmployerReviews({
  reviews,
  averageRating,
  totalReviews,
}: EmployerReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
        <Typography
          variant="h2"
          className="text-dark-blue font-bold text-2xl mb-6"
        >
          Reviews
        </Typography>
        <div className="text-center py-12">
          <Typography
            variant="body-large"
            className="text-[#8A8A8A] text-lg"
          >
            No reviews yet
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl mb-2"
          >
            Reviews
          </Typography>
          {averageRating !== undefined && totalReviews !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <Typography
                  variant="body-large"
                  className="text-dark-blue font-semibold"
                >
                  {averageRating.toFixed(1)}
                </Typography>
              </div>
              <Typography
                variant="body-small"
                className="text-[#8A8A8A] text-sm"
              >
                ({totalReviews} reviews)
              </Typography>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border-b border-[#E2E2E2] pb-6 last:border-0 last:pb-0"
          >
            <div className="flex items-start gap-4">
              <div className="size-12 bg-[#FAFAFC] rounded-full flex items-center justify-center flex-shrink-0">
                {review.user?.image ? (
                  <Image
                    src={review.user.image}
                    alt={review.user.name || "Reviewer"}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-purple font-semibold">
                    {(review.user?.name || "R").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <Typography
                      variant="body-large"
                      className="text-dark-blue font-semibold"
                    >
                      {review.user?.name || "Anonymous"}
                    </Typography>
                    {review.jobTitle && (
                      <Typography
                        variant="body-small"
                        className="text-[#8A8A8A] text-sm"
                      >
                        {review.jobTitle}
                      </Typography>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.title && (
                  <Typography
                    variant="h3"
                    className="text-dark-blue font-semibold text-lg mb-2"
                  >
                    {review.title}
                  </Typography>
                )}
                {review.comment && (
                  <Typography
                    variant="body-large"
                    className="text-[#8A8A8A] text-base mb-3"
                  >
                    {review.comment}
                  </Typography>
                )}
                {review.pros && review.pros.length > 0 && (
                  <div className="mb-2">
                    <Typography
                      variant="body-small"
                      className="text-green-600 font-medium text-sm mb-1"
                    >
                      Pros:
                    </Typography>
                    <ul className="list-disc list-inside text-sm text-[#8A8A8A]">
                      {review.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.cons && review.cons.length > 0 && (
                  <div>
                    <Typography
                      variant="body-small"
                      className="text-red-600 font-medium text-sm mb-1"
                    >
                      Cons:
                    </Typography>
                    <ul className="list-disc list-inside text-sm text-[#8A8A8A]">
                      {review.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.employmentStatus && (
                  <Badge
                    className={`mt-2 ${
                      review.employmentStatus === "current"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {review.employmentStatus === "current"
                      ? "Current Employee"
                      : "Former Employee"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

