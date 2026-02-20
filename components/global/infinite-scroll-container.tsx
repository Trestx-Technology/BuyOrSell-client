"use client"

import React, { useCallback, useRef, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface InfiniteScrollContainerProps {
  children: ReactNode
  onLoadMore: () => Promise<void>
  isLoading?: boolean
  hasMore?: boolean
  loadingComponent?: ReactNode
  threshold?: number
  className?: string
  style?: React.CSSProperties
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchMove?: (e: React.TouchEvent) => void
  onTouchEnd?: () => void
  onWheel?: (e: React.WheelEvent) => void
}

/**
 * InfiniteScrollContainer
 * A reusable flex-1 container that handles infinite scroll with:
 * - Auto-detection of scroll to bottom
 * - Loading state management
 * - Preservation of previous items while loading
 * - Customizable threshold and loading indicator
 */
export const InfiniteScrollContainer = React.forwardRef<HTMLDivElement, InfiniteScrollContainerProps>(
  ({ children, onLoadMore, isLoading = false, hasMore = true, loadingComponent, threshold = 0.1, className, style, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const loadingRef = useRef<HTMLDivElement>(null)
    const canLoadMoreRef = useRef(true)

    const handleScroll = useCallback(() => {
      if (!containerRef.current || isLoading || !hasMore || !canLoadMoreRef.current) {
        return
      }

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const distanceToBottom = scrollHeight - (scrollTop + clientHeight)
      const triggerDistance = clientHeight * threshold

      if (distanceToBottom < triggerDistance) {
        canLoadMoreRef.current = false
        onLoadMore().finally(() => {
          canLoadMoreRef.current = true
        })
      }
    }, [isLoading, hasMore, onLoadMore, threshold])

    useEffect(() => {
      const container = containerRef.current
      if (!container) return

      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }, [handleScroll])

    // Use Intersection Observer as fallback for better performance
    useEffect(() => {
      if (!loadingRef.current || isLoading || !hasMore) return

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && canLoadMoreRef.current) {
            canLoadMoreRef.current = false
            onLoadMore().finally(() => {
              canLoadMoreRef.current = true
            })
          }
        },
        { root: containerRef.current, threshold: 0 },
      )

      observer.observe(loadingRef.current)
      return () => observer.disconnect()
    }, [isLoading, hasMore, onLoadMore])

    // Expose the internal containerRef to the external ref
    useEffect(() => {
      if (typeof ref === "function") {
        ref(containerRef.current)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current
      }
    }, [ref])

    return (
      <div
        ref={containerRef}
        className={cn("flex flex-1 flex-col overflow-y-auto", className)}
        style={style}
        {...props}
      >
        {children}

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            {loadingComponent ?? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-primary" />
                <p className="text-sm text-muted-foreground">Loading more items...</p>
              </div>
            )}
          </div>
        )}

        <div ref={loadingRef} className="h-0" />
      </div>
    )
  },
)

InfiniteScrollContainer.displayName = "InfiniteScrollContainer"
