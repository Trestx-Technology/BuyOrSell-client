"use client";

import React from "react";
import ApplicantCard from "./applicant-card";
import { JobApplicant } from "@/interfaces/job.types";
import { Typography } from "@/components/typography";

interface ApplicantsListProps {
  applicants: JobApplicant[];
  onStatusChange?: (applicantId: string, status: JobApplicant["status"]) => void;
  isLoading?: boolean;
}

export default function ApplicantsList({
  applicants,
  onStatusChange,
  isLoading,
}: ApplicantsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-2xl h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (applicants.length === 0) {
    return (
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-12 text-center">
        <Typography
          variant="body-large"
          className="text-[#8A8A8A] text-lg"
        >
          No applicants found
        </Typography>
        <Typography
          variant="body-small"
          className="text-[#8A8A8A] text-sm mt-2"
        >
          Try adjusting your filters or check back later
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applicants.map((applicant) => {
        const userName = applicant.user?.firstName && applicant.user?.lastName
          ? `${applicant.user.firstName} ${applicant.user.lastName}`
          : applicant.user?.name || "Unknown";
        const userLocation = applicant.availability || "N/A";
        const userImage = applicant.user?.image;
        
        return (
          <ApplicantCard
            key={applicant._id}
            id={applicant._id}
            name={userName}
            role="Applicant"
            company="N/A"
            experience={applicant.experience || "0 years"}
            salaryMin={applicant.expectedSalary || 0}
            salaryMax={applicant.expectedSalary || 0}
            location={userLocation}
            jobType={applicant.availability || "Full-time"}
            postedTime={applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : "N/A"}
            logo={userImage}
            isFavorite={false}
          />
        );
      })}
    </div>
  );
}

