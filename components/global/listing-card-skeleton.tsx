import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ListingCardSkeletonProps {
  /**
   * Maximum width of the card (default: "max-w-[170px]")
   */
  maxWidth?: string;
  /**
   * Show image counter badge skeleton
   */
  showImageCounter?: boolean;
  /**
   * Show views counter skeleton
   */
  showViewsCounter?: boolean;
  /**
   * Show premium badge skeleton
   */
  showPremiumBadge?: boolean;
  /**
   * Show exchange badge skeleton
   */
  showExchangeBadge?: boolean;
  /**
   * Show discount badge skeleton
   */
  showDiscountBadge?: boolean;
  /**
   * Show timer skeleton (for deals cards)
   */
  showTimer?: boolean;
  /**
   * Show seller info skeleton
   */
  showSeller?: boolean;
  /**
   * Show extra fields/specs skeleton (2x2 grid)
   */
  showExtraFields?: boolean;
  /**
   * Number of extra fields to show (default: 4)
   */
  extraFieldsCount?: number;
  /**
   * Additional className for the card container
   */
  className?: string;
}

export const ListingCardSkeleton: React.FC<ListingCardSkeletonProps> = ({
  maxWidth = "max-w-[170px]",
  showImageCounter = true,
  showViewsCounter = false,
  showPremiumBadge = false,
  showExchangeBadge = false,
  showDiscountBadge = false,
  showTimer = false,
  showSeller = false,
  showExtraFields = true,
  extraFieldsCount = 4,
  className,
}) => {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border-purple-100 bg-white",
        maxWidth,
        className
      )}
    >
      <div className="p-0">
        {/* Image Section */}
        <div className="relative aspect-[3/3] sm:aspect-[4/3] bg-gray-200 w-full h-full min-h-[122px] max-h-[177px] overflow-hidden">
          {/* Main Image Skeleton */}
          <Skeleton className="w-full h-full rounded-none" />

          {/* Premium Badge Skeleton */}
          {showPremiumBadge && (
            <div className="absolute top-3 left-3">
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          )}

          {/* Exchange Badge Skeleton */}
          {showExchangeBadge && (
            <div className="absolute top-3 left-12">
              <Skeleton className="h-6 w-24 rounded" />
            </div>
          )}

          {/* Discount Badge Skeleton */}
          {showDiscountBadge && (
            <div className="absolute top-0 left-0">
              <Skeleton className="h-6 w-12 rounded-tl-lg rounded-br-lg" />
            </div>
          )}

          {/* Image Counter Skeleton */}
          {showImageCounter && (
            <div className="absolute bottom-3 left-3">
              <Skeleton className="h-6 w-12 rounded-lg" />
            </div>
          )}

          {/* Views Counter Skeleton */}
          {showViewsCounter && (
            <div className="absolute bottom-3 right-3">
              <Skeleton className="h-6 w-12 rounded-lg" />
            </div>
          )}

          {/* Timer Skeleton */}
          {showTimer && (
            <div className="absolute bottom-0 right-0">
              <Skeleton className="h-6 w-16 rounded-tl-lg" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="pt-2 space-y-3">
          {/* Price Section */}
          <div className="flex items-center gap-1 px-2.5">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-5 w-16 rounded" />
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-8 rounded" />
          </div>

          {/* Title */}
          <div className="px-2.5">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-3/4 rounded mt-1" />
          </div>

          {/* Location */}
          <div className="flex px-1 gap-1 items-center">
            <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>

          {/* Dynamic Specs - Grid with 2 columns */}
          {showExtraFields && (
            <div className="hidden sm:grid grid-cols-2 gap-2 px-2.5">
              {Array.from({ length: Math.min(extraFieldsCount, 4) }).map(
                (_, index) => (
                  <div key={index} className="flex items-center gap-1 min-w-0">
                    <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
                    <Skeleton className="h-3 w-full rounded flex-1" />
                  </div>
                )
              )}
            </div>
          )}

          {/* Seller Info Section */}
          <div className="text-xs text-grey-blue font-regular border-t border-grey-blue/20 p-2.5 flex items-start justify-between">
            {showSeller && (
              <div className="hidden sm:flex items-center gap-2">
                <Skeleton className="w-[22px] h-[22px] rounded-full flex-shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-2 w-16 rounded" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper component to render multiple listing card skeletons
 * Useful for loading states in carousels, grids, or lists
 */
export interface ListingCardSkeletonListProps
  extends Omit<ListingCardSkeletonProps, "className"> {
  /**
   * Number of skeleton cards to render (default: 6)
   */
  count?: number;
  /**
   * Container className for the list wrapper
   */
  containerClassName?: string;
  /**
   * Gap between cards (default: "gap-4")
   */
  gap?: string;
  /**
   * Layout direction: "row" for horizontal, "column" for vertical (default: "row")
   */
  direction?: "row" | "column";
}

export const ListingCardSkeletonList: React.FC<
  ListingCardSkeletonListProps
> = ({
  count = 6,
  containerClassName,
  gap = "gap-4",
  direction = "row",
  ...skeletonProps
}) => {
  return (
    <div
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        gap,
        containerClassName
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ListingCardSkeleton key={index} {...skeletonProps} />
      ))}
    </div>
  );
};

export default ListingCardSkeleton;

