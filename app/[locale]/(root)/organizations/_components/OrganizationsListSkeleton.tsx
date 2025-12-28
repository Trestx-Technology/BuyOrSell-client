"use client";

export function OrganizationsListSkeleton() {
  return (
    <div className="max-w-[1080px] mx-auto">
      {/* Organizations Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-[#E5E5E5] p-4 animate-pulse"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 flex-1">
                {/* Logo Skeleton */}
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  {/* Name Skeleton */}
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  {/* Type and Location Skeleton */}
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              {/* Status Badge Skeleton */}
              <div className="h-6 w-16 bg-gray-200 rounded-md"></div>
            </div>
            {/* Verified Badge Skeleton */}
            <div className="h-6 w-20 bg-gray-200 rounded mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

