"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetMainCategories } from "@/hooks/useCategories";
import { cn } from "@/lib/utils";

interface CategoryDropdownProps {
  selectedCategory: string;
  setSelectedCategory: (categories: string) => void;
}

export function CategoryDropdown({
  selectedCategory,
  setSelectedCategory,
}: CategoryDropdownProps) {
  const { data: categoriesData, isLoading, error } = useGetMainCategories();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          icon={<ChevronDown className="-ml-3" />}
          iconPosition="right"
          className="px-2 text-xs text-gray-600 hover:text-purple transition-colors h-full  border-[#929292] rounded-none hover:bg-transparent data-[state=open]:text-purple lg:flex hidden"
        >
          {selectedCategory || "All Categories"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48 z-[60] max-h-[300px] overflow-y-auto"
        align="start"
      >
        <DropdownMenuItem onClick={() => setSelectedCategory("All Categories")}>
          All Categories
        </DropdownMenuItem>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <DropdownMenuItem key={i}>
              <div className="animate-pulse bg-gray-300 h-7 w-full rounded-sm"></div>
            </DropdownMenuItem>
          ))
        ) : error ? (
          <DropdownMenuItem>Error: {error.message}</DropdownMenuItem>
        ) : (
          categoriesData?.map((category) => (
            <DropdownMenuItem
              className={cn(
                "cursor-pointer",
                selectedCategory === category.name
                  ? "bg-purple/20 text-purple"
                  : ""
              )}
              key={category._id}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


