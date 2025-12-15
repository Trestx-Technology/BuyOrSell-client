"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdDetailSkeleton() {
  return (
    <div className="w-full min-h-[500px]">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>

      <div className="w-full mx-auto py-0">
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 mb-6 gap-6">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2 space-y-6 relative">
            {/* Product Gallery Skeleton */}
            <div className="w-full">
              <Skeleton className="w-full h-[500px] rounded-lg" />
              {/* Thumbnail row */}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-20 flex-shrink-0 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="w-full px-4 bg-white rounded-l-xl md:rounded-r-xl border border-gray-200 shadow-sm flex items-center gap-4 h-12">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>

            {/* Sections Skeleton */}
            <div className="space-y-6 relative">
              {/* Description Section Skeleton */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Specifications Section Skeleton */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Section Skeleton */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-64 w-full rounded-lg" />
              </div>

              {/* Reviews Section Skeleton */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 hidden md:block">
            {/* Product Information Card Skeleton */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-2 pt-4 border-t">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Seller Information Skeleton */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>

            {/* Safety Features Skeleton */}
            <div className="bg-white rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Ad Card Skeleton */}
            <div className="bg-white rounded-lg p-6 min-h-[550px] space-y-4">
              <Skeleton className="h-6 w-32" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-6 mb-6 relative">
          {/* Product Gallery Skeleton */}
          <div className="w-full">
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="flex gap-2 mt-4 overflow-x-auto px-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-16 flex-shrink-0 rounded-lg" />
              ))}
            </div>
          </div>

          <div className="bg-[#F9FAFC] space-y-6 relative z-10 rounded-t-xl -mt-8">
            {/* Product Info Card Mobile Skeleton */}
            <div className="bg-white rounded-lg p-4 mx-4 space-y-4">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="flex gap-4 pt-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="w-full px-4 bg-white rounded-l-xl md:rounded-r-xl border border-gray-200 shadow-sm flex items-center gap-4 h-12 mx-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>

            {/* Sections Skeleton */}
            <div className="space-y-6 relative px-4">
              {/* Description Section Skeleton */}
              <div className="bg-white rounded-lg p-4 space-y-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Specifications Section Skeleton */}
              <div className="bg-white rounded-lg p-4 space-y-3">
                <Skeleton className="h-5 w-36" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Section Skeleton */}
              <div className="bg-white rounded-lg p-4 space-y-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>

              {/* Reviews Section Skeleton */}
              <div className="bg-white rounded-lg p-4 space-y-3">
                <Skeleton className="h-5 w-28" />
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Seller Information Skeleton */}
            <div className="bg-white rounded-lg p-4 mx-4 space-y-3">
              <Skeleton className="h-5 w-28" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>

            {/* Safety Features Skeleton */}
            <div className="bg-white rounded-lg p-4 mx-4 space-y-3">
              <Skeleton className="h-5 w-32" />
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Actions Skeleton */}
            <div className="bg-white rounded-lg p-4 mx-4 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-12 flex-1 rounded-lg" />
                <Skeleton className="h-12 flex-1 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Similar Ads Skeleton */}
        <div className="mt-8 space-y-4">
          <Skeleton className="h-6 w-32 mx-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

