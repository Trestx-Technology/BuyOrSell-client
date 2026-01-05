"use client";

import { Typography } from "@/components/typography";
import JobCard from "./job-card";
import Link from "next/link";
import JobsSectionTitle from "../../_components/jobs-section-title";
import { useAds } from "@/hooks/useAds";
import { AD } from "@/interfaces/ad";
import { transformAdToJobCard } from "@/utils/transform-ad-to-job-card";

export default function FeaturedJobs() {
  const { data: adsData, isLoading } = useAds({
    isFeatured: true,
    adType: "JOB",
    limit: 4,
    page: 1,
  });

  const jobs = (adsData?.data?.adds || adsData?.data?.ads || []) as AD[];

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
            <JobsSectionTitle>Featured Jobs</JobsSectionTitle>
            <Link href="/jobs/featured">
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
              const jobCardProps = transformAdToJobCard(job);
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
