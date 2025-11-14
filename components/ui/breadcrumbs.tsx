"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChevronsRight, Home } from "lucide-react";
import Link from "next/link";
export interface BreadcrumbItem {
  id: string;
  label?: string;
  name?: string;
  href?: string;
  isActive?: boolean;
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
  showSelectCategoryLink?: boolean;
  selectCategoryHref?: string;
  selectCategoryLabel?: string;
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
      variant = "default",
      showSelectCategoryLink = true,
      selectCategoryHref = "/post-ad/select",
      selectCategoryLabel = "Select Category",
      ...props
    },
    ref
  ) => {
    const handleItemClick = (item: BreadcrumbItem, index: number) => {
      if (onItemClick) {
        onItemClick(item, index);
      }
    };

    const defaultSeparator = (
      <ChevronsRight className="h-5 w-5 text-[#8A8A8A]" aria-hidden="true" />
    );

    const displayItems = items.map((item) => ({
      ...item,
      label: item.label ?? item.name ?? "",
    }));

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
            <Link
              href={homeHref}
              onClick={() => {
                // Handle home icon click separately if needed
                if (onItemClick) {
                  onItemClick({ id: "home", label: homeLabel }, 0);
                }
              }}
              className="flex items-center justify-center w-fit text-[#8A8A8A] hover:text-[#8B31E1] transition-colors duration-200 rounded"
              aria-label={homeLabel}
            >
              <Home className="w-4 h-4" /> &nbsp; Home &nbsp;
            </Link>
          )}

          {showHomeIcon && displayItems.length > 0 && (
            <li className="flex items-center">
              {separator || defaultSeparator}
            </li>
          )}

          {showSelectCategoryLink && (
            <Link
              href={selectCategoryHref}
              className="flex items-center gap-1 font-normal text-[#8A8A8A] hover:text-purple cursor-pointer transition-colors duration-200 rounded px-1 whitespace-nowrap flex-shrink-0"
            >
              {selectCategoryLabel} <ChevronsRight className="w-5 h-5" />
            </Link>
          )}

          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const href = item.href ?? "#";
            const isActive = item.isActive ?? isLast;

            return (
              <React.Fragment key={item.id || index}>
                <Link
                  href={href}
                  onClick={() =>
                    handleItemClick(item, index + (showHomeIcon ? 1 : 0))
                  }
                  className={cn(
                    "flex items-center gap-1 font-normal cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#8B31E1] focus:ring-opacity-50 rounded px-1 whitespace-nowrap flex-shrink-0",
                    isActive
                      ? "text-[#8B31E1] font-semibold"
                      : "text-[#8A8A8A] hover:text-purple"
                  )}
                >
                  <span>{item.label}</span>
                </Link>

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
