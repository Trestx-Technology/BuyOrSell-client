import React from "react";
import { Typography } from "@/components/typography";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { JobseekerProfile } from "@/interfaces/job.types";

interface StatCardProps {
  count: string | number;
  label: string;
  href?: string;
}

function StatCard({ count, label, href }: StatCardProps) {
  const content = (
    <div className="bg-white rounded-[16.6px] p-[33.2px] shadow-[0px_2.49px_6.64px_rgba(48,150,137,0.05)] flex flex-col items-center gap-[33.2px] w-full lg:w-[254px] lg:h-[232px]">
      <div className="flex flex-col items-center gap-0 mt-2">
        <Typography variant="h2" className="text-purple font-bold text-[32px]">
          {count}
        </Typography>
        <Typography
          variant="body-large"
          className="text-dark-blue font-bold text-[19.92px]"
        >
          {label}
        </Typography>
      </div>
      <Link
        href={href || "#"}
        className="text-purple px-[9.96px] py-[7px] flex items-center gap-[8.3px] font-semibold text-sm hover:scale-105 transition-all duration-300"
      >
        <span>View All</span>
        <ArrowRightIcon size={22} />
      </Link>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

interface StatsSectionProps {
  isLoading?: boolean;
  savedJobsCount?: number;
  appliedJobsCount?: number;
  shortlistedJobsCount?: number;
  rejectedJobsCount?: number;
}

export default function StatsSection({
  isLoading,
  savedJobsCount,
  appliedJobsCount,
  shortlistedJobsCount,
  rejectedJobsCount,
}: StatsSectionProps) {
  if (isLoading) {
    return (
      <section className="w-full px-4 lg:px-[100px] pt-6 pb-10">
        <div className="grid grid-cols-2 lg:flex gap-[21.33px] max-w-[1080px] mx-auto w-full lg:flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[16.6px] p-[33.2px] w-full lg:w-[254px] lg:h-[232px] animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-4 lg:px-[100px] pt-6 pb-10">
      <div className="grid grid-cols-2 lg:flex gap-[21.33px] max-w-[1080px] mx-auto w-full lg:flex-wrap">
        <StatCard
          count={savedJobsCount || 0}
          label="Saved Jobs"
          href="/jobs/saved"
        />
        <StatCard
          count={appliedJobsCount || 0}
          label="Applied Jobs"
          href="/jobs/applied"
        />
        <StatCard
          count={shortlistedJobsCount || 0}
          label="Shortlisted Jobs"
          href="/jobs/shortlisted"
        />
        <StatCard
          count={rejectedJobsCount || 0}
          label="Rejected Jobs"
          href="/jobs/rejected"
        />
      </div>
    </section>
  );
}
