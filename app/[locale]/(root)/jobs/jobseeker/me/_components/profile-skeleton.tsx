import React from "react";
import { cn } from "@/lib/utils";

export function JobseekerProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse w-full max-w-[1080px] mx-auto">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-gray-900 border border-[#E2E2E2] dark:border-gray-800 rounded-2xl p-6 relative flex flex-col md:flex-row gap-6">
        <div className="size-[170px] rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>

      {/* Content Sections Skeletons */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-900 border border-[#E2E2E2] dark:border-gray-800 rounded-2xl p-6 space-y-4">
          <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
