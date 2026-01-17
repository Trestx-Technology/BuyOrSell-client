export const PlanSkeleton = () => {
      return (
            <div className="w-full sm:max-w-xs rounded-2xl flex flex-col p-8 bg-white border border-gray-200">
                  {/* Icon Skeleton */}
                  <div className="flex justify-start mb-6">
                        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  </div>

                  {/* Plan Name Skeleton */}
                  <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-4" />

                  {/* Pricing Skeleton */}
                  <div className="h-10 w-2/3 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-6" />

                  {/* Description Skeleton */}
                  <div className="space-y-2 mb-6">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                  </div>


                  {/* Features Skeleton */}
                  <div className="space-y-3 flex-1 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                              <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse" />
                                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                              </div>
                        ))}
                  </div>

                  {/* Button Skeleton */}
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
            </div>
      );
};
