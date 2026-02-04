"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function JobListingCardSkeleton() {
  return (
    <div className="bg-white w-full rounded-2xl border border-[#E2E2E2] p-4 shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)]">
      <div className="flex flex-col gap-[21.33px]">
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-20 rounded-[24px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="size-5 rounded-full" />
          </div>
        </div>

        <div className="flex items-center gap-2 justify-start">
          <Skeleton className="size-[38px] rounded-full flex-shrink-0" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-5 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Skeleton className="size-5 rounded" />
            <Skeleton className="h-4 w-1/3 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function JobDetailContentSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E2E2] p-6 space-y-8 w-full">
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-4">
          <Skeleton className="h-7 w-48 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-11/12 rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>
          {section > 1 && (
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Skeleton className="size-5 rounded-full mt-0.5" />
                  <Skeleton className="h-4 w-3/4 rounded mt-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function JobHeaderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E2E2] p-6 w-full space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </div>
      </div>
      <div className="flex gap-4">
         <Skeleton className="h-10 w-32 rounded-lg" />
         <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}
