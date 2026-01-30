"use client"

import React, { useCallback, useRef, useEffect, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface InfiniteScrollContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  onLoadMore: () => Promise<void>
  isLoading?: boolean
  hasMore?: boolean
  loadingComponent?: ReactNode
  threshold?: number
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
  ({ children, onLoadMore, isLoading = false, hasMore = true, loadingComponent, threshold = 0.1, className, ...props }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const loadingRef = useRef<HTMLDivElement>(null)
    const canLoadMoreRef = useRef(true)

    // Sync external ref and internal ref
    const setRef = useCallback((node: HTMLDivElement | null) => {
      // @ts-ignore
      internalRef.current = node
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        // @ts-ignore
        ref.current = node
      }
    }, [ref])

    const handleScroll = useCallback(() => {
      if (!internalRef.current || isLoading || !hasMore || !canLoadMoreRef.current) {
        return
      }

      const { scrollTop, scrollHeight, clientHeight } = internalRef.current
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
      const container = internalRef.current
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
        { root: internalRef.current, threshold: 0 },
      )

      observer.observe(loadingRef.current)
      return () => observer.disconnect()
    }, [isLoading, hasMore, onLoadMore])

    return (
      <div ref={setRef} className={cn("flex flex-1 flex-col overflow-y-auto", className)} {...props}>
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
