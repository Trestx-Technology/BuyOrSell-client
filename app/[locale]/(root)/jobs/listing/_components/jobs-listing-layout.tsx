"use client";

import React, { useState } from "react";
import { AD } from "@/interfaces/ad";
import Pagination from "@/components/global/pagination";
import JobListingCard from "./job-listing-card";
import JobHeaderCard from "./job-header-card";
import JobDetailContent from "./job-detail-content";

export interface JobsListingLayoutProps {
  jobs: AD[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  transformAdToJobCardProps: (ad: AD) => {
    id: string;
    title: string;
    company: string;
    experience: string;
    salaryMin: number;
    salaryMax: number;
    location: string;
    jobType: string;
    postedTime: string;
    logo?: string;
  };
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  isLoading?: boolean;
}

export default function JobsListingLayout({
  jobs,
  currentPage,
  totalPages,
  onPageChange,
  transformAdToJobCardProps,
  onFavorite,
  onShare,
  isLoading = false,
}: JobsListingLayoutProps) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    jobs.length > 0 ? jobs[0]._id : null
  );

  const selectedJob = jobs.find((job) => job._id === selectedJobId) || jobs[0];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Loading jobs...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No jobs found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFC] min-h-screen">
      <div className="max-w-[1080px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-[19px]">
          {/* Left Column - Job Listings Sidebar */}
          <div className="space-y-[19px]">
            {jobs.map((job) => (
              <JobListingCard
                key={job._id}
                job={job}
                isSelected={selectedJobId === job._id}
                onClick={() => setSelectedJobId(job._id)}
                transformAdToJobCardProps={transformAdToJobCardProps}
              />
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl p-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                  isLoading={false}
                />
              </div>
            )}
          </div>

          {/* Right Column - Job Detail View */}
          <div className="space-y-6">
            {selectedJob && (
              <>
                <JobHeaderCard job={selectedJob} />
                <JobDetailContent job={selectedJob} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
