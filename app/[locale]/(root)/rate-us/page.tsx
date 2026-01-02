"use client";

import React, { useState, useMemo } from "react";
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
import { useLocale } from "@/hooks/useLocale";
import { toast } from "sonner";
import { useSubmitRating } from "@/hooks/useRateUs";
import { Container1080 } from "@/components/layouts/container-1080";

const RateUsPage = () => {
  const { t, localePath } = useLocale();
  const submitRatingMutation = useSubmitRating();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [comments, setComments] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error(t.rateUs.selectRating);
      return;
    }

    try {
      await submitRatingMutation.mutateAsync({
        rating,
        title: title.trim() || t.rateUs.title,
        comment: comments.trim(),
      });

      toast.success(`${t.rateUs.thankYouFeedback} ${t.rateUs.ratingSubmitted}`);

      // Reset form
      setRating(0);
      setHoverRating(0);
      setSelectedFeedback([]);
      setTitle("");
      setComments("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again later.");
    }
  };

  return (
    <Container1080>
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
          {t.rateUs.title}
        </Typography>
      </div>

      <div className="sm:px-4 xl:px-0 flex flex-col gap-5 sm:py-8">
        {/* Desktop Breadcrumbs */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            href={localePath("/")}
            className="text-gray-400 font-semibold text-sm hover:text-purple"
          >
            Home
          </Link>
          <ChevronsRight className="size-6 text-purple" />
          <Link
            href={localePath("/rate-us")}
            className="text-purple-600 font-semibold text-sm"
          >
            {t.rateUs.title}
          </Link>
        </div>

        {/* Rating Card */}
        <div className="sm:bg-white sm:rounded-2xl border-0 sm:border border-gray-200 sm:shadow-sm max-w-2xl w-full mx-auto">
          {/* Header */}
          <div className="hidden sm:block text-center py-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {t.rateUs.title}
            </h2>
          </div>

          <div className="px-6 sm:px-6">
            {/* Star Rating Section */}
            <div className="text-center py-8">
              <div className="mb-4">
                <span className="inline-block bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-full">
                  {t.rateUs.tapToRate}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t.rateUs.howWasExperience}
                </h3>
                <p className="text-sm text-gray-600">
                  {t.rateUs.feedbackHelps}
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
            {/* <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-900 text-center mb-4">
                {t.rateUs.quickFeedback}
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
            </div> */}

            {/* Title Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title (optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your feedback"
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
              />
            </div>

            {/* Comments Section */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                {t.rateUs.tellUsMore}
              </label>
              <div className="relative">
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder={t.rateUs.tellUsMorePlaceholder}
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
                disabled={submitRatingMutation.isPending}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white py-3 text-base font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitRatingMutation.isPending
                  ? "Submitting..."
                  : t.rateUs.submitRating}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container1080>
  );
};

export default RateUsPage;
