"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function ListingCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full lg:w-[220px] overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow transition-shadow duration-300 flex flex-col",
        className
      )}
    >
      <div className="p-0 flex flex-col flex-1">
        {/* Image Section Skeleton */}
        <Skeleton className="h-48 w-full rounded-none" />

        {/* Info Section Skeleton */}
        <div className="p-3 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="flex flex-wrap gap-2 py-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        {/* Footer Section Skeleton */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
}

export function HorizontalListingCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800", className)}>
      <Skeleton className="w-full sm:w-48 h-48 sm:h-32 rounded-xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="flex items-center gap-2 pt-2">
           <Skeleton className="h-6 w-6 rounded-full" />
           <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}
