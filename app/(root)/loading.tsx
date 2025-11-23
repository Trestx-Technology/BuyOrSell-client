export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="max-w-[1280px] mx-auto">
        {/* Loading skeleton for home page */}
        <div className="space-y-8 p-4">
          {/* Banner skeleton */}
          <div className="h-[300px] bg-gray-200 animate-pulse rounded-xl"></div>
          
          {/* Categories skeleton */}
          <div className="flex gap-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-3 min-w-[100px]">
                <div className="rounded-full size-[70px] bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
          
          {/* Popular categories skeleton */}
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-[60px] bg-gray-200 rounded-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

