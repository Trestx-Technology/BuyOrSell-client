"use client";

import React from "react";
import { Briefcase, Clock, MapPin } from "lucide-react";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import { ICONS } from "@/constants/icons";
import { FaMoneyBillWave } from "react-icons/fa";

export interface JobListingCardProps {
  job: AD;
  isSelected: boolean;
  onClick: () => void;
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
}

export default function JobListingCard({
  job,
  isSelected,
  onClick,
  transformAdToJobCardProps,
}: JobListingCardProps) {
  const jobProps = transformAdToJobCardProps(job);
  const postedTime = formatDistanceToNow(new Date(job.createdAt), {
    addSuffix: true,
  });

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white size-[256px] rounded-2xl cursor-pointer transition-all relative",
        "border shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)]",
        isSelected ? "border-purple border-[1px]" : "border-[#E2E2E2]"
      )}
    >
      {/* Main content container - matches Figma layout */}
      <div className="absolute left-4 top-4 w-[224px]">
        {/* Text+badge+ icon section with 21.33px gap */}
        <div className="flex flex-col gap-[21.33px]">
          {/* Badge section */}
          <div>
            <Badge className="bg-[#F5EBFF] text-purple px-[7.11px] py-[7.11px] rounded-[24px] text-xs font-normal leading-[1.21]">
              {postedTime}
            </Badge>
          </div>

          {/* Logo + Text section */}
          <div className="flex items-center gap-2 justify-between">
            {/* Text container - width 171px with 16px gap */}
            <div className="truncate">
              <Typography
                variant="h3"
                className="text-[#1D2939] font-semibold text-[18px] leading-[1.21] truncate"
              >
                {jobProps.title}
              </Typography>
              <Typography
                variant="body-small"
                className="text-[#1D2939] text-sm font-normal leading-[1.21]"
              >
                {jobProps.company}
              </Typography>
            </div>
            {/* Logo - 32x32 */}
            {jobProps.logo ? (
              // <Image
              //   src={"/google-logo.svg"}
              //   alt={jobProps.company}
              //   width={36}
              //   height={36}
              //   className="border rounded-full flex-shrink-0"
              // />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-purple rounded-full"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
              </svg>
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {jobProps.company.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Icon + Text sections positioned at specific y coordinates */}
        {/* Experience - y: 128 */}
       <div className="flex flex-col gap-2 mt-5">
         <div className="flex items-center gap-1.5">
          <Briefcase className="w-5 h-5 text-[#8A8A8A]" />
          <Typography
            variant="body-small"
            className="text-[#1D2939] text-xs font-medium leading-[1.21]"
          >
            {jobProps.experience}
          </Typography>
        </div>

        {/* Salary - y: 158.06 */}
        <div className="flex items-center gap-1.5">
         <FaMoneyBillWave className="w-5 h-5 text-[#8A8A8A]" />
          <div className="flex items-center gap-0">
            <Typography
              variant="body-small"
              className="text-[#1D2939] text-xs font-medium leading-[1.21]"
            >
              {jobProps.salaryMin.toLocaleString()}-
            </Typography>
            <Typography
              variant="body-small"
              className="text-[#1D2939] text-xs font-medium leading-[1.21]"
            >
              {jobProps.salaryMax.toLocaleString()}
            </Typography>
          </div>
        </div>

        {/* Location - y: 218.18 */}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-5 h-5 text-[#8A8A8A]" />
          <Typography
            variant="body-small"
            className="text-[#1D2939] text-xs font-medium leading-[1.21]"
          >
            {jobProps.location}
          </Typography>
        </div>

        {/* Job Type - y: 188.12 */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-5 h-5 text-[#8A8A8A]" />
          <Typography
            variant="body-small"
            className="text-[#1D2939] text-xs font-medium leading-[1.21]"
          >
            {jobProps.jobType}
          </Typography>
        </div>
       </div>
      </div>
    </div>
  );
}

