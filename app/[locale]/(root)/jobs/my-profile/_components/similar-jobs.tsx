"use client";

import { Typography } from "@/components/typography";
import JobCard from "./job-card";
import Link from "next/link";
import JobsSectionTitle from "../../_components/jobs-section-title";
import { JobData } from "@/interfaces/job.types";
import { formatDistanceToNow } from "date-fns";

interface SimilarJobsProps {
  similarJobs?: {
    page: number;
    limit: number;
    total: number;
    items: JobData[];
    profileMatched?: {
      desiredRoles?: string[];
      skills?: string[];
      preferredLocations?: string[];
      preferredJobTypes?: string[];
    };
  };
  isLoading?: boolean;
}

export default function SimilarJobs({
  similarJobs: similarJobsData,
  isLoading,
}: SimilarJobsProps) {
  const jobs = similarJobsData?.items || [];

  if (isLoading) {
    return (
      <section className="w-full bg-white py-8 px-4 lg:px-[100px]">
        <div className="max-w-[1080px] mx-auto">
          <div className="flex flex-wrap gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg w-[256px] h-[300px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return null;
  }
  return (
    <section className="w-full bg-white py-8 px-4 lg:px-[100px]">
      <div className="max-w-[1080px] mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center w-full">
           <JobsSectionTitle>Similar Jobs</JobsSectionTitle>
            <Link href="/jobs/similar">
              <Typography
                variant="body-large"
                className="text-purple font-semibold text-base hover:underline"
              >
                View all
              </Typography>
            </Link>
          </div>

          {/* Jobs Grid */}
          <div className="flex flex-wrap gap-5">
            {jobs.map((job) => {
              const jobCardProps = {
                id: job._id,
                title: job.title,
                company: job.organization?.tradeName || job.company || "",
                experience: job.experience || "",
                salaryMin: job.salaryMin || 0,
                salaryMax: job.salaryMax || 0,
                location:
                  typeof job.location === "string"
                    ? job.location
                    : `${job.location?.city || ""} ${job.location?.state || ""}`.trim() ||
                      "",
                jobType: job.jobType || "",
                postedTime: job.postedAt
                  ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })
                  : "",
              };
              return (
                <JobCard
                  key={job._id}
                  onShare={() => {}}
                  onFavorite={() => {}}
                  {...jobCardProps}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

