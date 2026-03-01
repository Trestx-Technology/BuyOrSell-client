"use client";

import { useEffect } from "react";
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
  Eye,
  MapPin,
  Tag,
  ArrowLeft,
  Phone,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdPostingStore } from "@/stores/adPostingStore";
import { formatDistanceToNow } from "date-fns";
import JobCard from "@/app/[locale]/(root)/jobs/my-profile/_components/job-card";
import ListingCard from "@/components/features/listing-card/listing-card";
import { ListingCardSkeleton } from "@/components/global/listing-card-skeleton";
import { AD } from "@/interfaces/ad";

function StepCircle({ active, completed, number }: { active: boolean, completed: boolean, number: number }) {
  if (completed) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#5645EE] text-white flex items-center justify-center z-10 relative">
        <CheckCircle2 className="w-5 h-5" />
      </div>
    );
  }
  if (active) {
    return (
      <div className="w-8 h-8 rounded-full bg-[#5645EE] text-white flex items-center justify-center z-10 relative font-medium text-sm">
        {number}
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#F3F4F6] dark:bg-gray-800 text-[#9CA3AF] dark:text-gray-500 flex flex-col items-center justify-center z-10 relative font-medium text-sm border border-[#E5E7EB] dark:border-gray-700">
      {number}
    </div>
  );
}

export default function SuccessPage() {
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
          Post Not Found
        </Typography>
        <Button onClick={() => router.push(localePath("/"))}>
          Return to Home
        </Button>
      </Container1080>
    );
  }

  if (isLoading) {
    return (
      <Container1080 className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-10 shadow-sm border border-[#F3F4F6] dark:border-gray-800">
          <div className="flex items-center text-sm text-[#F3F4F6] dark:text-gray-800 mb-8 font-medium">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 animate-pulse mb-10"></div>
          
          {/* Stepper Skeleton */}
          <div className="relative flex justify-between items-start mb-12 sm:mb-16 mt-8">
            <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-gray-200 dark:bg-gray-800 z-0"></div>
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center flex-1 text-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 z-10 relative animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse mt-3"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-20 animate-pulse mt-2"></div>
              </div>
            ))}
          </div>
          
          {/* Info Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse mb-2"></div>
              <div className="h-12 border border-[#E5E7EB] dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-800/50 animate-pulse"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16 animate-pulse mb-2"></div>
              <div className="h-12 border border-[#E5E7EB] dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-800/50 animate-pulse"></div>
            </div>
          </div>
          <div className="mb-10 lg:w-[calc(50%-12px)]">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 animate-pulse mb-2"></div>
            <div className="h-12 border border-[#E5E7EB] dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-800/50 animate-pulse"></div>
          </div>

          <h2 className="text-lg font-bold text-[#111827] dark:text-white mb-4">Item details</h2>
          <div className="bg-[#F9FAFB] dark:bg-[#1F2937] rounded-xl p-4 sm:p-6 mb-8 border border-[#E5E7EB] dark:border-gray-800 flex flex-col sm:flex-row gap-8 items-start justify-between">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
               <ListingCardSkeleton />
            </div>
            <div className="flex-1 w-full bg-white dark:bg-[#111827] p-5 rounded-lg border border-[#E5E7EB] dark:border-gray-800">
               <div className="flex flex-col gap-4">
                 <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"></div>
                 <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"></div>
                 <div className="w-full h-px bg-[#E5E7EB] dark:bg-gray-700/50 my-2"></div>
                 <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full animate-pulse"></div>
               </div>
            </div>
          </div>
        </div>
      </Container1080>
    );
  }

  if (isError || !ad) {
    return (
      <Container1080 className="min-h-[60vh] flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <Typography variant="h3" className="text-red-500">
          Failed to load details
        </Typography>
        <Typography variant="body-small" className="text-gray-500 max-w-md">
          We couldn't retrieve the status of your post right now. However, if
          you didn't receive an error previously, it may still have been
          submitted successfully.
        </Typography>
        <Button onClick={() => router.push(localePath("/"))}>
          Return to Home
        </Button>
      </Container1080>
    );
  }

  const isLive = ad.status === "live";
  const isRejected = ad.status === "rejected";
  const isJob = ad.adType === "JOB";
  const typeText = isJob ? "Job" : "Ad";

  const adImage = ad.images && ad.images.length > 0 ? ad.images[0] : null;

  // Format date safely
  const formattedDate = ad.createdAt 
    ? new Date(ad.createdAt).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }) 
    : "Just now";

  const formattedTime = ad.createdAt
    ? new Date(ad.createdAt).toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    : "";

  return (
    <Container1080 className="py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-[#111827] rounded-3xl p-6 sm:p-10 shadow-sm border border-[#F3F4F6] dark:border-gray-800">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push(localePath("/"))}
          className="flex items-center text-sm text-[#4B5563] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </button>

        {/* Header Title section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div className="flex items-center flex-wrap gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-white">
              {typeText} details <span className="text-[#111827] dark:text-white">#{ad.slug || ad._id.substring(0, 8).toUpperCase()}</span>
            </h1>
            <span className={cn(
              "px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider",
              isLive ? "bg-[#EEF2FF] text-[#5645EE] dark:bg-[#5645EE]/10 dark:text-[#818CF8]" : 
              isRejected ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
              "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
            )}>
              {ad.status.toUpperCase()}
            </span>
          </div>
        </div>
        <p className="text-sm text-[#6B7280] dark:text-gray-400 mb-10">
          Date: {formattedDate}
        </p>

        {/* Stepper progress */}
        <div className="relative flex justify-between items-start mb-12 sm:mb-16 mt-8">
          {/* Progress Lines */}
          <div className="absolute top-4 left-[10%] right-[50%] h-[2px] bg-[#5645EE] z-0 hidden sm:block"></div>
          <div className={cn(
            "absolute top-4 left-[50%] right-[10%] h-[2px] z-0 hidden sm:block",
            isLive ? "bg-[#5645EE]" : "bg-[#F3F4F6] dark:bg-gray-800"
          )}></div>

          {/* Mobile Progress Lines */}
          <div className="absolute top-4 left-[16%] right-[50%] h-[2px] bg-[#5645EE] z-0 sm:hidden"></div>
          <div className={cn(
            "absolute top-4 left-[50%] right-[16%] h-[2px] z-0 sm:hidden",
            isLive ? "bg-[#5645EE]" : "bg-[#F3F4F6] dark:bg-gray-800"
          )}></div>

          {/* Step 1 */}
          <div className="flex flex-col items-center flex-1 text-center">
            <StepCircle active={true} completed={true} number={1} />
            <span className="mt-3 font-bold text-[11px] sm:text-sm text-[#111827] dark:text-white uppercase tracking-wide">Submitted</span>
            <span className="text-[10px] sm:text-xs text-[#6B7280] dark:text-gray-400 mt-1">{formattedTime}, {formattedDate}</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center flex-1 text-center">
            <StepCircle active={!isLive && !isRejected} completed={isLive || isRejected} number={2} />
            <span className="mt-3 font-bold text-[11px] sm:text-sm text-[#111827] dark:text-white uppercase tracking-wide">Under Review</span>
            <span className="text-[10px] sm:text-xs text-[#6B7280] dark:text-gray-400 mt-1">Admin Validation</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center flex-1 text-center">
            <StepCircle active={isLive} completed={isLive} number={3} />
            <span className="mt-3 font-bold text-[11px] sm:text-sm text-[#111827] dark:text-white uppercase tracking-wide">
              {isRejected ? "Rejected" : "Published"}
            </span>
            <span className="text-[10px] sm:text-xs text-[#6B7280] dark:text-gray-400 mt-1">
              {isLive ? "Visible to buyers" : isRejected ? "Did not pass review" : "Pending approval"}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm text-[#4B5563] dark:text-gray-400 mb-2">Category</label>
            <div className="border border-[#E5E7EB] dark:border-gray-800 rounded-lg p-3 text-sm text-[#111827] dark:text-white bg-white dark:bg-gray-900 truncate flex items-center gap-2 font-medium">
              <Tag className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              {typeof ad.category === "object" ? ad.category.name : "N/A"}
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#4B5563] dark:text-gray-400 mb-2">Location</label>
            <div className="border border-[#E5E7EB] dark:border-gray-800 rounded-lg p-3 text-sm text-[#111827] dark:text-white bg-white dark:bg-gray-900 truncate flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              {typeof ad.location === "object" ? `${ad.location.city || ''} ${ad.location.area || ''}`.trim() || 'Location not specified' : ad.location || 'Location not specified'}
            </div>
          </div>
        </div>

        {(ad.contactPhoneNumber || (ad as any).phoneNumber) && (
          <div className="mb-10 lg:w-[calc(50%-12px)]">
            <label className="block text-sm text-[#4B5563] dark:text-gray-400 mb-2">Contact Number</label>
            <div className="border border-[#E5E7EB] dark:border-gray-800 rounded-lg p-3 text-sm text-[#111827] dark:text-white bg-white dark:bg-gray-900 flex items-center gap-2 font-medium">
              <Phone className="w-4 h-4 text-[#9CA3AF] shrink-0" />
              {ad.contactPhoneNumber || (ad as any).phoneNumber}
            </div>
          </div>
        )}

        {/* Ad summary list - Replaced with Cards */}
        <h2 className="text-lg font-bold text-[#111827] dark:text-white mb-4">Item details</h2>
        <div className="bg-[#F9FAFB] dark:bg-[#1F2937] rounded-xl p-4 sm:p-6 mb-8 border border-[#E5E7EB] dark:border-gray-800 flex flex-col sm:flex-row gap-8 items-start justify-between">
          
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            {isJob ? (
              <JobCard job={ad as AD} />
            ) : (
              <ListingCard 
                id={ad._id}
                title={ad.title}
                price={ad.price as number}
                location={typeof ad.location === 'object' ? ad.location : { city: ad.location || '' }}
                images={ad.images || []}
                extraFields={ad.extraFields || {}}
                postedTime={ad.createdAt ? formatDistanceToNow(new Date(ad.createdAt), { addSuffix: true }) : 'Just now'}
                seller={ad.owner ? { ...ad.owner } : undefined}
              />
            )}
          </div>

          <div className="flex-1 w-full bg-white dark:bg-[#111827] p-5 rounded-lg border border-[#E5E7EB] dark:border-gray-800">
            {/* Subtotal section */}
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center text-[#4B5563] dark:text-gray-400">
                <span>Status</span>
                <span className="font-medium text-[#111827] dark:text-white">{isLive ? "Published" : isRejected ? "Rejected" : "Pending"}</span>
              </div>
              <div className="flex justify-between items-center text-[#4B5563] dark:text-gray-400">
                <span>Listing Fee</span>
                <span className="font-medium text-[#10B981] dark:text-[#34D399]">FREE</span>
              </div>
              
              <div className="w-full h-px bg-[#E5E7EB] dark:bg-gray-700/50 my-2"></div>
              
              <div className="flex justify-between items-center font-bold text-base text-[#111827] dark:text-white">
                <span>Action</span>
                {isLive ? (
                  <button 
                    onClick={() => router.push(localePath(`/${isJob ? "job" : "ad"}/${ad.slug || ad._id}`))}
                    className="text-[#5645EE] hover:underline flex items-center text-sm font-semibold"
                  >
                    View Live <Eye className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button 
                    onClick={() => router.push(localePath(`/my-ads`))}
                    className="text-[#5645EE] hover:underline flex items-center text-sm font-semibold"
                  >
                    My {isJob ? "Jobs" : "Ads"} <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </Container1080>
  );
}
