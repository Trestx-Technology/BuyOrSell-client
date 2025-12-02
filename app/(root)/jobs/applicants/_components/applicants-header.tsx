"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";

interface ApplicantsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  totalApplicants?: number;
}

export default function ApplicantsHeader({
  searchQuery,
  onSearchChange,
  onSearch,
  totalApplicants,
}: ApplicantsHeaderProps) {
  return (
    <div className="w-full bg-white border-b border-[#E2E2E2] py-6">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Title and Count */}
          <div className="flex flex-col gap-1">
            <Typography
              variant="h1"
              className="text-dark-blue font-bold text-3xl"
            >
              Job Applicants
            </Typography>
            {totalApplicants !== undefined && (
              <Typography
                variant="body-small"
                className="text-[#8A8A8A] text-sm"
              >
                {totalApplicants} applicant{totalApplicants !== 1 ? "s" : ""}
              </Typography>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-initial md:min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8A8A8A]" />
              <Input
                type="text"
                placeholder="Search applicants..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch();
                }}
                className="pl-10 border-[#E2E2E2] focus:border-purple focus:ring-purple/20"
              />
            </div>
            <Button
              onClick={onSearch}
              className="bg-purple text-white hover:bg-purple/90"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

