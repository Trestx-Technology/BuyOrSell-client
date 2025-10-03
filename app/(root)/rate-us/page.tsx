"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronsRight,
  Star,
  ThumbsUp,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";

const RateUsPage = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [comments, setComments] = useState("");

  const feedbackOptions = [
    {
      id: "easy-to-use",
      label: "Easy to Use",
      icon: ThumbsUp,
      color: "text-green-500",
    },
    {
      id: "user-friendly",
      label: "User Friendly",
      icon: Heart,
      color: "text-red-500",
    },
    {
      id: "fast-reliable",
      label: "Fast & Reliable",
      icon: Star,
      color: "text-yellow-500",
    },
    {
      id: "would-recommend",
      label: "Would Recommend",
      icon: MessageCircle,
      color: "text-purple-500",
    },
  ];

  const handleFeedbackToggle = (feedbackId: string) => {
    setSelectedFeedback((prev) =>
      prev.includes(feedbackId)
        ? prev.filter((id) => id !== feedbackId)
        : [...prev, feedbackId]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a star rating");
      return;
    }

    const ratingData = {
      rating,
      feedback: selectedFeedback,
      comments,
    };

    console.log("Submitting rating:", ratingData);
    alert("Thank you for your feedback! Your rating has been submitted.");

    // Reset form
    setRating(0);
    setSelectedFeedback([]);
    setComments("");
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Mobile Header */}
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant="ghost"
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size="icon-sm"
          className="absolute left-4 text-purple"
          onClick={() => window.history.back()}
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          Rate Us
        </Typography>
      </div>

      <div className="sm:px-4 xl:px-0 flex flex-col gap-5 sm:py-8">
        {/* Desktop Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href="/?login=true"
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            Home
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <Link
            href="/rate-us"
            className="text-purple-600 font-semibold text-sm"
          >
            Rate Us
          </Link>
        </div>

        {/* Rating Card */}
        <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900">Rate Us</h2>
          </div>

          <div className="px-6 sm:px-6">
            {/* Star Rating Section */}
            <div className="text-center py-8">
              <div className="mb-4">
                <span className="inline-block bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-full">
                  Tap to rate
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How was your experience?
                </h3>
                <p className="text-sm text-gray-600">
                  Your feedback helps us improve
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating || rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Feedback */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 text-center mb-4">
                Quick Feedback
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {feedbackOptions.map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = selectedFeedback.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleFeedbackToggle(option.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "border-purple-300 bg-purple-50"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${option.color}`} />
                      <span className="text-sm text-gray-700">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comments Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tell us more (optional)
              </label>
              <div className="relative">
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Share your thoughts about our platform..."
                  rows={4}
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                  {comments.length}/200
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pb-6">
              <Button
                onClick={handleSubmit}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 text-base font-medium transition-colors"
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateUsPage;
