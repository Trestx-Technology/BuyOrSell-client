"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container1080 } from "@/components/layouts/container-1080";
import { Button } from "@/components/ui/button";
import { useAdById } from "@/hooks/useAds";
import { useLocale } from "@/hooks/useLocale";
import { Typography } from "@/components/typography";
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  Share2,
  Eye,
  Briefcase,
  MapPin,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdPostingStore } from "@/stores/adPostingStore";

export default function PostJobSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { localePath } = useLocale();
  const adId = searchParams.get("id");
  const { clearCategoryArray } = useAdPostingStore((state) => state);

  const { data: adResponse, isLoading, isError } = useAdById(adId || "");
  const ad = adResponse?.data;

  useEffect(() => {
    // Clear the ad posting store when they reach success page
    clearCategoryArray();
  }, [clearCategoryArray]);

  if (!adId) {
    return (
      <Container1080 className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Typography variant="h3" className="mb-4">
          Job Not Found
        </Typography>
        <Button onClick={() => router.push(localePath("/"))}>
          Return to Home
        </Button>
      </Container1080>
    );
  }

  if (isLoading) {
    return (
      <Container1080 className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-4">
        <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
        <Typography variant="body" className="text-gray-500">
          Loading job status...
        </Typography>
      </Container1080>
    );
  }

  if (isError || !ad) {
    return (
      <Container1080 className="min-h-[60vh] flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <Typography variant="h3" className="text-red-500">
          Failed to load job details
        </Typography>
        <Typography variant="body-small" className="text-gray-500">
          We couldn't retrieve the status of your job post right now. However,
          if you didn't receive an error previously, your job may still have
          been submitted successfully.
        </Typography>
        <Button onClick={() => router.push(localePath("/"))}>
          Return to Home
        </Button>
      </Container1080>
    );
  }

  const isApproved = ad.status === "live";

  return (
    <Container1080 className="py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Status Header Block */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 sm:p-12 text-center shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple via-blue-500 to-indigo-500"></div>

          <div className="flex justify-center mb-6">
            <div
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center ring-8 transition-colors",
                isApproved
                  ? "bg-success-100 text-success-600 ring-success-50"
                  : "bg-blue-50 text-blue-500 ring-blue-50/50 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-900/10",
              )}
            >
              {isApproved ? (
                <CheckCircle2 className="w-12 h-12" strokeWidth={2} />
              ) : (
                <Clock className="w-12 h-12" strokeWidth={2} />
              )}
            </div>
          </div>

          <Typography
            variant="h1"
            className="text-2xl sm:text-3xl font-bold mb-3 text-gray-900 dark:text-white"
          >
            {isApproved ? "Your Job is Live!" : "Your Job is Submitted!"}
          </Typography>

          <Typography
            variant="body"
            className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8 text-sm sm:text-base leading-relaxed"
          >
            {isApproved
              ? "Great news! Your job post has been approved and is now visible to thousands of potential candidates on BuyOrSell."
              : "Thank you for posting! Our admin team is currently reviewing your job. Once approved, it will be published and visible to candidates."}
          </Typography>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto h-12 px-6 rounded-full font-medium"
              onClick={() => router.push(localePath("/"))}
            >
              Back to Home
            </Button>
            {isApproved && (
              <Button
                className="w-full sm:w-auto h-12 px-6 rounded-full bg-purple hover:bg-purple/90 text-white font-medium"
                onClick={() =>
                  router.push(localePath(`/job/${ad.slug || ad._id}`))
                }
              >
                View Live Job <Eye className="w-4 h-4 ml-2" />
              </Button>
            )}
            {!isApproved && (
              <Button
                className="w-full sm:w-auto h-12 px-6 rounded-full bg-purple hover:bg-purple/90 text-white font-medium"
                onClick={() => router.push(localePath(`/my-ads`))}
              >
                Go to My Ads <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>

        {/* Ad Details Preview */}
        <div className="mt-8">
          <Typography
            variant="h3"
            className="text-lg font-semibold mb-4 text-gray-900 dark:text-white px-2"
          >
            Job Preview
          </Typography>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row gap-6">
            {/* Image Placeholder */}
            <div className="w-full sm:w-48 aspect-[4/3] sm:aspect-square bg-blue-50 dark:bg-blue-900/20 rounded-xl overflow-hidden relative shrink-0 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center">
              <Briefcase className="w-16 h-16 text-blue-300 dark:text-blue-700/50" />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider">
                {ad.status === "live" ? "Live" : "Pending"}
              </div>
            </div>

            {/* Ad Info */}
            <div className="flex-1 flex flex-col py-1">
              <div className="flex justify-between items-start gap-4 mb-2">
                <Typography
                  variant="h3"
                  className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2"
                >
                  {ad.title}
                </Typography>
              </div>

              <div className="text-xl sm:text-2xl font-bold text-purple mb-4">
                {ad.minSalary && ad.maxSalary
                  ? `${ad.minSalary.toLocaleString()} - ${ad.maxSalary.toLocaleString()} AED`
                  : "Salary on request"}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 mt-auto text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="truncate">
                    {typeof ad.category === "object"
                      ? ad.category.name
                      : "Category"}
                  </span>
                </div>
                {ad.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">
                      {typeof ad.location === "object"
                        ? ad.location.city || ad.location.area || "Location"
                        : ad.location}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Posted just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container1080>
  );
}
