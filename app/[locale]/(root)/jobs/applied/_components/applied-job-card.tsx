"use client";

import { MyAppliedJob } from "@/interfaces/job.types";
import {
  Briefcase,
  MapPin,
  Clock,
} from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/utils/format-date";
import { cn } from "@/lib/utils";

export default function AppliedJobCard({ application, className }: { application: MyAppliedJob, className?: string }) {
  const { job } = application;

  if (!job) return null;

  const companyName =
    job.organization?.tradeName ||
    job.organization?.legalName ||
    job.company ||
    "Company Name";

  const logo = job.organization?.logoUrl;



  return (
    <div className={cn("relative sm:max-w-[300px] bg-white border border-slate-200 rounded-2xl p-4 shadow-sm w-full flex flex-col h-full", className)}>
      {/* Header with Status and Applied Time */}
      <div className="space-y-2 flex-1 gap-[21.33px] mb-4">
        <div className="flex justify-between items-center">
          <Badge className="bg-[#F5EBFF] text-purple px-2 py-1.5 rounded-[24px] text-xs font-normal capitalize">
            {application.status}
          </Badge>
          <Typography variant="body-small" className="text-grey-blue text-[10px]">
            Applied {formatDate(application.createdAt)}
          </Typography>
        </div>

        {/* Company Logo and Info */}
        <div className="flex flex-1 items-start gap-4">
          <div className="space-y-2 flex-1">
            <Typography
              variant="h3"
              className="text-black font-bold text-lg leading-tight line-clamp-1"
            >
              {job.title}
            </Typography>
            <Typography variant="body-small" className="text-black text-sm">
              {companyName}
            </Typography>
          </div>
          {logo ? (
            <Image
              src={logo}
              alt={companyName}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {companyName.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="flex flex-col gap-3 mb-4 flex-1">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-5 h-5 text-grey-blue" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            {job.experience || "Not specified"}
          </Typography>
        </div>

        <div className="flex items-center gap-1.5">
          {/* <Image
            src={ICONS.currency.aed}
            alt="currency icon"
            width={16}
            height={16}
          /> */}
          <div className="flex items-center gap-1">
            <span className="text-[9.19px]">AED</span>
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium"
            >
              {job.salaryMin || "Not specified"}
            </Typography>

            <span className="text-[#8A8A8A] text-[10.83px]">-</span>
            <span className="text-[9.19px]">AED</span>
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium"
            >
              {job.salaryMax || "Not specified"}
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-5 h-5 text-grey-blue" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            {job.jobType || "Not specified"}
          </Typography>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-5 h-5 text-grey-blue" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            {job.location ?? "Not specified"}
          </Typography>
        </div>
      </div>

      {/* Action Button */}
      <Link href={`/jobs/${job.category?.name}?jobId=${job._id}`}>
        <Button size={"sm"} className="w-full uppercase font-medium text-xs">
          Job details
        </Button>
      </Link>
    </div>
  );
}
