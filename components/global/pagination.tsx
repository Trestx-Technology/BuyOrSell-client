"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
  variant?: "light" | "dark";
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  className,
  variant = "light",
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 mt-8", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={cn(
          "border-border hover:border-purple hover:text-purple disabled:opacity-50 bg-card text-foreground"
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className={cn(
                "px-2 text-sm",
                variant === "dark" ? "text-white/40" : "text-[#8A8A8A]"
              )}
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = currentPage === pageNum;
        return (
          <Button
            key={pageNum}
            variant={isActive ? "primary" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            disabled={isLoading}
            className={cn(
              "min-w-[40px]",
              isActive
                ? "bg-purple text-white hover:bg-purple/90 border-purple"
                : "border-border hover:border-purple hover:text-purple bg-card text-foreground"
            )}
          >
            {pageNum}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={cn(
          "border-border hover:border-purple hover:text-purple disabled:opacity-50 bg-card text-foreground"
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
