"use client";

import React from "react";
import Link from "next/link";
import { Typography } from "@/components/typography";
import JobCard from "@/app/[locale]/(root)/jobs/my-profile/_components/job-card";
import { AD } from "@/interfaces/ad";
import { Organization } from "@/interfaces/organization.types";
import { EmployerProfile } from "@/interfaces/job.types";

interface EmployerJobsProps {
  employerId: string;
  organization: Organization & Partial<EmployerProfile>;
}

export default function EmployerJobs({ employerId, organization }: EmployerJobsProps) {
  // Use jobs from organization data
  const jobs = (organization.latestJobs || []) as AD[];

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
    <div className="rounded-2xl">
      <div className="flex justify-between items-end mb-6">
        <Typography
          variant="h2"
          className="text-dark-blue font-bold text-2xl"
        >
          Active Job Postings by {organization.tradeName}
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
          return <JobCard key={job._id} job={job} />;
        })}
      </div>
    </div>
  );
}

