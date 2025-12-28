import React from 'react'
import { Typography } from '@/components/typography';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
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
        <Typography
          variant="h2"
          className="text-purple font-bold text-[32px]"
        >
          {count}
        </Typography>
        <Typography
          variant="body-large"
          className="text-dark-blue font-bold text-[19.92px]"
        >
          {label}
        </Typography>
      </div>
      <Link href={href || '#'} className="text-purple px-[9.96px] py-[7px] flex items-center gap-[8.3px]">
        <span className="font-medium text-sm">View All</span>
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
  profile?: JobseekerProfile;
  isLoading?: boolean;
}

export default function StatsSection({ profile, isLoading }: StatsSectionProps) {
  if (isLoading) {
    return (
      <section className='w-full px-4 lg:px-[100px] pt-6 pb-10'>
        <div className="grid grid-cols-2 lg:flex gap-[21.33px] max-w-[1080px] mx-auto w-full lg:flex-wrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[16.6px] p-[33.2px] w-full lg:w-[254px] lg:h-[232px] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // Extract stats from profile - these might come from a statistics object or need to be calculated
  // For now, using direct access to profile properties
  const savedJobsCount = (profile as { savedJobsCount?: number })?.savedJobsCount || 0;
  const appliedJobsCount = (profile as { appliedJobsCount?: number })?.appliedJobsCount || 0;
  const shortlistedJobsCount = (profile as { shortlistedJobsCount?: number })?.shortlistedJobsCount || 0;
  const rejectedJobsCount = (profile as { rejectedJobsCount?: number })?.rejectedJobsCount || 0;
      
  return (
      <section className='w-full px-4 lg:px-[100px] pt-6 pb-10'>
    <div className="grid grid-cols-2 lg:flex gap-[21.33px] max-w-[1080px] mx-auto w-full lg:flex-wrap">
      <StatCard count={savedJobsCount} label="Saved Jobs" href="/jobs/saved" />
      <StatCard count={appliedJobsCount} label="Applied Jobs" href="/jobs/applied" />
      <StatCard count={shortlistedJobsCount} label="Shortlisted Jobs" href="/jobs/shortlisted" />
      <StatCard count={rejectedJobsCount} label="Rejected Jobs" href="/jobs/rejected" />
    </div>
      </section>
  );
}
