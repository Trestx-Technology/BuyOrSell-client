"use client";

import React from "react";
import Link from "next/link";
import { Typography } from "@/components/typography";
import JobCard from "@/app/(root)/jobs/my-profile/_components/job-card";
import { useAds } from "@/hooks/useAds";
import { AD } from "@/interfaces/ad";
import { transformAdToJobCard } from "@/utils/transform-ad-to-job-card";

interface EmployerJobsProps {
  employerId: string;
}

export default function EmployerJobs({ employerId }: EmployerJobsProps) {
  const { data: adsData, isLoading } = useAds({
    adType: "JOB",
    limit: 10,
    page: 1,
  });

  // Filter jobs by organization/employer
  // Note: This assumes the AD has an organization field that matches employerId
  const jobs = (adsData?.data?.adds || []).filter(
    (job: AD) => job.organization?._id === employerId
  );

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
        <div className="flex flex-wrap gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-2xl w-[256px] h-[400px] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
        <Typography
          variant="h2"
          className="text-dark-blue font-bold text-2xl mb-6"
        >
          Active Job Postings
        </Typography>
        <div className="text-center py-12">
          <Typography
            variant="body-large"
            className="text-[#8A8A8A] text-lg"
          >
            No active job postings
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      <div className="flex justify-between items-end mb-6">
        <Typography
          variant="h2"
          className="text-dark-blue font-bold text-2xl"
        >
          Active Job Postings
        </Typography>
        <Link href={`/jobs/listing?employer=${employerId}`}>
          <Typography
            variant="body-large"
            className="text-purple font-semibold text-base hover:underline"
          >
            View all
          </Typography>
        </Link>
      </div>

      <div className="flex flex-wrap gap-5">
        {jobs.slice(0, 6).map((job: AD) => {
          const jobCardProps = transformAdToJobCard(job);
          return <JobCard key={job._id} {...jobCardProps} />;
        })}
      </div>
    </div>
  );
}

