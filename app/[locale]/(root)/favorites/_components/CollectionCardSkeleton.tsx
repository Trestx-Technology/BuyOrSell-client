"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-full lg:max-w-64 sm:p-4 sm:bg-white dark:sm:bg-gray-800 rounded-xl sm:border border-gray-200 dark:border-gray-700 sm:shadow-sm">
      {/* Image Grid Section Skeleton */}
      <div className="relative h-48 rounded-t-xl rounded-b-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
        <div className="flex gap-1 h-full">
          {/* Main image skeleton */}
          <Skeleton className="w-full h-full rounded-none" />
          
          {/* Right side skeletons */}
          <div className="grid grid-rows-2 gap-1 w-full">
            <Skeleton className="w-full h-full rounded-none" />
            <Skeleton className="w-full h-full rounded-none" />
          </div>
        </div>

        {/* Collection count overlay skeleton */}
        <div className="absolute bottom-2 left-2 px-2 py-1">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Collection Info Section Skeleton */}
      <div className="pt-2 sm:pt-4 flex justify-between items-center gap-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );
}
