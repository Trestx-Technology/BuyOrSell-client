"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobApplicant } from "@/interfaces/job.types";

interface ApplicantsFiltersProps {
  statusFilter?: JobApplicant["status"] | "all";
  onStatusFilterChange: (status: JobApplicant["status"] | "all") => void;
  experienceFilter?: string;
  onExperienceFilterChange: (experience: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function ApplicantsFilters({
  statusFilter = "all",
  onStatusFilterChange,
  experienceFilter = "all",
  onExperienceFilterChange,
  onClearFilters,
  hasActiveFilters,
}: ApplicantsFiltersProps) {
  return (
    <div className="w-full md:w-64 bg-white border border-[#E2E2E2] rounded-2xl p-6 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <Typography
          variant="h3"
          className="text-dark-blue font-semibold text-lg"
        >
          Filters
        </Typography>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-purple hover:text-purple/80 p-0 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Status Filter */}
        <div>
          <Typography
            variant="body-small"
            className="text-dark-blue font-medium text-sm mb-2"
          >
            Application Status
          </Typography>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as JobApplicant["status"] | "all")
            }
          >
            <SelectTrigger className="w-full border-[#E2E2E2] focus:border-purple">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Filter */}
        <div>
          <Typography
            variant="body-small"
            className="text-dark-blue font-medium text-sm mb-2"
          >
            Experience
          </Typography>
          <Select
            value={experienceFilter}
            onValueChange={onExperienceFilterChange}
          >
            <SelectTrigger className="w-full border-[#E2E2E2] focus:border-purple">
              <SelectValue placeholder="All Experience Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience Levels</SelectItem>
              <SelectItem value="0-1">0-1 years</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div>
            <Typography
              variant="body-small"
              className="text-dark-blue font-medium text-sm mb-2"
            >
              Active Filters
            </Typography>
            <div className="flex flex-wrap gap-2">
              {statusFilter !== "all" && (
                <Badge className="bg-purple/20 text-purple px-2 py-1">
                  {statusFilter}
                  <button
                    onClick={() => onStatusFilterChange("all")}
                    className="ml-2 hover:text-purple/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {experienceFilter !== "all" && (
                <Badge className="bg-purple/20 text-purple px-2 py-1">
                  {experienceFilter} years
                  <button
                    onClick={() => onExperienceFilterChange("all")}
                    className="ml-2 hover:text-purple/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

