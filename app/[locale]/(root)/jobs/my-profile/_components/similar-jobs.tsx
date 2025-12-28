"use client";

import { Typography } from "@/components/typography";
import JobCard from "./job-card";
import Link from "next/link";
import JobsSectionTitle from "../../_components/jobs-section-title";

// Mock data - replace with actual API data
const similarJobs = [
  {
    id: "5",
    title: "UI UX Designer",
    company: "MyPcot Private Limited",
    experience: "1 to 4 years",
    salaryMin: 40000,
    salaryMax: 42000,
    location: "Dubai, UAE",
    jobType: "Full time",
    postedTime: "1hr ago",
  },
  {
    id: "6",
    title: "UI UX Designer",
    company: "MyPcot Private Limited",
    experience: "1 to 4 years",
    salaryMin: 40000,
    salaryMax: 42000,
    location: "Dubai, UAE",
    jobType: "Full time",
    postedTime: "1hr ago",
  },
  {
    id: "7",
    title: "UI UX Designer",
    company: "MyPcot Private Limited",
    experience: "1 to 4 years",
    salaryMin: 40000,
    salaryMax: 42000,
    location: "Dubai, UAE",
    jobType: "Full time",
    postedTime: "1hr ago",
  },
  {
    id: "8",
    title: "UI UX Designer",
    company: "MyPcot Private Limited",
    experience: "1 to 4 years",
    salaryMin: 40000,
    salaryMax: 42000,
    location: "Dubai, UAE",
    jobType: "Full time",
    postedTime: "1hr ago",
  },
];

export default function SimilarJobs() {
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
            {similarJobs.map((job) => (
              <JobCard key={job.id} onShare={() => {}} onFavorite={() => {}} {...job} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

