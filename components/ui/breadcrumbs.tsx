"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronsRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  showHomeIcon?: boolean;
  homeHref?: string;
  homeLabel?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  maxItems?: number;
  showEllipsis?: boolean;
  variant?: "default" | "compact" | "minimal";
}

const Breadcrumbs = React.forwardRef<HTMLDivElement, BreadcrumbsProps>(
  (
    {
      items,
      className,
      separator,
      showHomeIcon = true,
      homeHref = "/",
      homeLabel = "Home",
      onItemClick,
      maxItems,
      showEllipsis = true,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const handleItemClick = (item: BreadcrumbItem, index: number) => {
      if (item.disabled) return;
      if (onItemClick) {
        onItemClick(item, index);
      }
    };

    const defaultSeparator = (
      <ChevronsRight className="h-5 w-5 text-[#8A8A8A]" aria-hidden="true" />
    );

    // Handle max items with ellipsis
    const getDisplayItems = () => {
      if (!maxItems || items.length <= maxItems) {
        return items;
      }

      const firstItem = items[0];
      const lastItems = items.slice(-(maxItems - 1));

      return [
        firstItem,
        ...(showEllipsis ? [{ label: "...", disabled: true }] : []),
        ...lastItems,
      ];
    };

    const displayItems = getDisplayItems();

    const getVariantClasses = () => {
      switch (variant) {
        case "compact":
          return "text-xs";
        case "minimal":
          return "text-xs gap-0.5";
        default:
          return "text-xs";
      }
    };

    return (
      <nav
        ref={ref}
        className={cn(
          "flex items-center gap-1",
          getVariantClasses(),
          className
        )}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex items-center gap-0">
          {showHomeIcon && (
            <li className="flex items-center">
              <button
                onClick={() =>
                  handleItemClick({ label: homeLabel, href: homeHref }, 0)
                }
                className="flex items-center justify-center w-6 h-6 text-[#8A8A8A] hover:text-[#8B31E1] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B31E1] focus:ring-opacity-50 rounded"
                aria-label={homeLabel}
              >
                <Home className="w-4 h-4" />
              </button>
            </li>
          )}

          {showHomeIcon && displayItems.length > 0 && (
            <li className="flex items-center">
              {separator || defaultSeparator}
            </li>
          )}

          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const isActive = item.isActive ?? isLast;
            const isEllipsis = item.label === "...";

            return (
              <React.Fragment key={index}>
                <li className="flex items-center">
                  {isEllipsis ? (
                    <span className="text-[#8A8A8A] px-1">...</span>
                  ) : item.href && !isActive && !item.disabled ? (
                    <button
                      onClick={() =>
                        handleItemClick(item, index + (showHomeIcon ? 1 : 0))
                      }
                      className="flex items-center gap-1 font-normal text-[#8A8A8A] hover:text-purple cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B31E1] focus:ring-opacity-50 rounded px-1"
                    >
                      {item.icon && (
                        <span className="flex items-center">{item.icon}</span>
                      )}
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <span
                      className={cn(
                        "flex items-center gap-1 transition-colors duration-200 px-1",
                        isActive
                          ? "font-semibold text-[#8B31E1]"
                          : item.disabled
                            ? "font-normal text-[#8A8A8A] cursor-not-allowed"
                            : "font-normal text-[#8A8A8A]"
                      )}
                    >
                      {item.icon && (
                        <span className="flex items-center">{item.icon}</span>
                      )}
                      <span>{item.label}</span>
                    </span>
                  )}
                </li>

                {!isLast && (
                  <li className="flex items-center">
                    {separator || defaultSeparator}
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = "Breadcrumbs";

export { Breadcrumbs };
