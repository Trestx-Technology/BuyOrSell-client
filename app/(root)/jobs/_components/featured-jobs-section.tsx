"use client";

import React from "react";
import Link from "next/link";
import { Typography } from "@/components/typography";
import JobCard from "@/app/(root)/jobs/my-profile/_components/job-card";
import { JobData } from "@/interfaces/job.types";
import { transformJobDataToJobCard } from "@/utils/transform-job-data-to-job-card";
import JobsSectionTitle from "@/app/(root)/jobs/_components/jobs-section-title";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeaturedJobsSectionProps {
  jobs?: JobData[];
  isLoading?: boolean;
}

export default function FeaturedJobsSection({ 
  jobs: jobsProp, 
  isLoading: isLoadingProp 
}: FeaturedJobsSectionProps = {}) {
  const jobs = jobsProp || [];
  const isLoading = isLoadingProp ?? false;

  if (isLoading) {
    return (
      <section className="w-full bg-[#F2F4F7] py-8">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex flex-wrap gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl w-[256px] h-[400px] animate-pulse"
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
    <section className="w-full bg-white py-8">
      <div className="max-w-[1080px] mx-auto px-4 lg:px-0">
        <div className=" py-8">
          {/* Header */}
          <div className="flex justify-between items-center gap-[35.56px] w-full">
            <JobsSectionTitle>Recent Jobs</JobsSectionTitle>
            <Link href="/jobs/listing">
              <Typography
                variant="body-large"
                className="text-purple font-semibold text-base hover:underline"
              >
                View all
              </Typography>
            </Link>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList >
              <TabsTrigger className="text-xs" value="Programming">Programming</TabsTrigger>
              <TabsTrigger value="Design" className="text-xs">Design</TabsTrigger>
              <TabsTrigger value="Marketing" className="text-xs">Marketing</TabsTrigger>
              <TabsTrigger value="Sales" className="text-xs">Sales</TabsTrigger>
              <TabsTrigger value="Customer Support" className="text-xs">Customer Support</TabsTrigger>
              <TabsTrigger value="Engineering" className="text-xs">Engineering</TabsTrigger>
              <TabsTrigger value="Product" className="text-xs">Product</TabsTrigger>
              <TabsTrigger value="Business" className="text-xs">Business</TabsTrigger>
              <TabsTrigger value="Legal" className="text-xs">Legal</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Jobs Grid */}
          <div className="flex flex-wrap gap-5 mt-5">
            {jobs.slice(0, 8).map((job: JobData) => {
              const jobCardProps = transformJobDataToJobCard(job);
              return <JobCard key={job._id} {...jobCardProps} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

