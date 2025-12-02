"use client";

import React from "react";
import {
  Briefcase,
  Clock,
  MapPin,
  Share2,
  Heart,
  DollarSign,
} from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import { FaMoneyBillWave } from "react-icons/fa";
import { toast } from "sonner";

export interface JobHeaderCardProps {
  job: AD;
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
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
  isFavorite?: boolean;
}

export default function JobHeaderCard({
  job,
  transformAdToJobCardProps,
  onFavorite,
  onShare,
  isFavorite = false,
}: JobHeaderCardProps) {
  const jobProps = transformAdToJobCardProps(job);
  const postedTime = formatDistanceToNow(new Date(job.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E2E2E2] p-4 shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)] relative">
      {/* Share and Save Buttons - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {onShare && (
          <button
            onClick={() => onShare(job._id)}
            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Share2 className="w-5 h-5 text-grey-blue" />
            <span className="text-xs text-grey-blue font-medium">Share</span>
          </button>
        )}
        {onFavorite && (
          <button
            onClick={() => onFavorite(job._id)}
            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Heart
              className={cn(
                "w-5 h-5",
                isFavorite ? "fill-red-500 text-red-500" : "text-grey-blue"
              )}
              strokeWidth={1.5}
            />
            <span className="text-xs text-grey-blue font-medium">Save</span>
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {jobProps.logo ? (
          // <Image
          //   src={jobProps.logo}
          //   alt={jobProps.company}
          //   width={48}
          //   height={48}
          //   className="rounded-lg flex-shrink-0"
          // />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple rounded-full"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
          </svg>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-purple flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg font-semibold">
              {jobProps.company.charAt(0)}
            </span>
          </div>
        )}
        <div className="space-y-4">
          {/* Job Title and Company Section */}
          <div className="flex items-start gap-4">
            {/* Company Logo */}

            {/* Job Title and Company Info */}
            <div className="flex-1">
              <Typography
                variant="h1"
                className="text-black font-semibold text-[28.56px] leading-tight mb-2"
              >
                {jobProps.title}
              </Typography>
              <div className="flex items-center gap-2 flex-wrap">
                <Typography
                  variant="body-small"
                  className="text-purple text-sm underline"
                >
                  {jobProps.company}
                </Typography>
                {/* Job Type Badges */}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple/20 text-purple px-[10.67px] py-[7.11px] rounded-full text-xs font-semibold">
                Full Time
              </Badge>
              <Badge className="bg-[#FDF3E5] text-[#FB9002] px-[10.67px] py-[7.11px] rounded-full text-xs font-semibold">
                Urgent
              </Badge>
              <Badge className="bg-[#E4FFF9] text-[#00732F] px-[10.67px] py-[7.11px] rounded-full text-xs font-semibold">
                Part time
              </Badge>
            </div>
          </div>

          {/* Job Metadata Grid - Two Column Layout */}
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
              <Typography
                variant="body-small"
                className="text-[#1D2939] text-xs font-medium"
              >
                {jobProps.experience}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
              <Typography
                variant="body-small"
                className="text-[#1D2939] text-xs font-medium"
              >
                {jobProps.jobType}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
              <div className="flex items-center gap-1">
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-sm font-medium"
                >
                  {jobProps.salaryMin.toLocaleString()}-
                </Typography>
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-sm font-medium"
                >
                  {jobProps.salaryMax.toLocaleString()}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
              <Typography
                variant="body-small"
                className="text-[#1D2939] text-xs font-medium"
              >
                {jobProps.location}
              </Typography>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" size={"lg"} className="px-4 py-2" onClick={()=> toast.info("Work in progress")}>
              Chat with employer
            </Button>
            <Button variant={"filled"} size={"lg"} onClick={()=> toast.info("Work in progress")}>
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
