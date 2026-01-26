"use client";

import React from "react";
import { Briefcase, Clock, MapPin, Share2 } from "lucide-react";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import { ICONS } from "@/constants/icons";
import { FaMoneyBillWave } from "react-icons/fa";
import ShareJobDialog from "./share-job-dialog";
import { useAuthStore } from "@/stores/authStore";
import { SaveJobButton } from "../../saved/_components/save-job-button";
import { formatDate } from "@/utils/format-date";

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
  const { session } = useAuthStore();
  const currentUserId = session.user?._id;
  const isJobOwner =
    job.owner?._id === currentUserId ||
    job.organization?.owner === currentUserId;

  const isSaved = job.isSaved ?? false;

  const jobProps = transformAdToJobCardProps(job);
  const postedTime = formatDate(job.createdAt)

  // Extract additional fields directly from job
  const extraFields = Array.isArray(job.extraFields)
    ? job.extraFields
    : Object.entries(job.extraFields || {}).map(([name, value]) => ({
        name,
        value,
      }));

  const getFieldValue = (fieldName: string): string => {
    const field = extraFields.find((f) =>
      f.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (field) {
      if (Array.isArray(field.value)) {
        return field.value.join(", ");
      }
      return String(field.value || "");
    }
    return "";
  };

  // Get currency from extraFields or default to AED
  const currency = getFieldValue("currency") || "AED";
  const validityValue = job.validity;
  const validityDate = validityValue ? new Date(validityValue) : null;
  const isValidityDateValid =
    validityDate instanceof Date && !Number.isNaN(validityDate.getTime());
  const isExpired = isValidityDateValid
    ? validityDate!.getTime() < Date.now()
    : false;


  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        "bg-white w-full sm:max-w-[270px] rounded-2xl cursor-pointer transition-all relative p-4",
        "border shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)] hover:shadow-[0px_2.67px_7.11px_#309689/20]",
        isSelected ? "border-purple border-[1px]" : "border-[#E2E2E2]"
      )}
    >
      {/* Main content container - matches Figma layout */}
      {/* Text+badge+ icon section with 21.33px gap */}
      <div className="flex flex-col gap-[21.33px]">
        {/* Badge section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#F5EBFF] text-purple px-[7.11px] py-[7.11px] rounded-[24px] text-xs font-normal leading-[1.21]">
              {postedTime}
            </Badge>
            {isExpired && (
              <Badge className="bg-[#FEE2E2] text-destructive px-[7.11px] py-[7.11px] rounded-[24px] text-xs font-semibold leading-[1.21]">
                Expired
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ShareJobDialog
              job={job}
              trigger={
                <button>
                  <Share2 className="size-5 text-grey-blue" />{" "}
                  <span className="sr-only">Share</span>
                </button>
              }
            />

            {!isJobOwner && (
              <SaveJobButton
                jobId={job._id}
                isSaved={isSaved}
                isJobOwner={isJobOwner}
                iconOnly={true}
              />
            )}
          </div>
        </div>

        {/* Logo + Text section */}
        <div className="flex items-center gap-2 justify-start">
          {jobProps.logo ? (
            <Image
              src={jobProps.logo}
              alt={jobProps.company}
              width={38}
              height={38}
              className="border rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {jobProps.company.charAt(0)}
              </span>
            </div>
          )}
          {/* Text container - width 171px with 16px gap */}
          <div className="space-y-1">
            <Typography
              variant="h3"
              className="text-[#1D2939] font-semibold text-[18px] leading-[1.21] line-clamp-1"
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
            {jobProps.experience || "Not specified"}
          </Typography>
        </div>

        {/* Salary - y: 158.06 */}
        <div className="flex items-center gap-1.5">
          <FaMoneyBillWave className="w-5 h-5 text-[#8A8A8A]" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#8A8A8A]">{currency}</span>
            <Typography
              variant="body-small"
              className="text-[#1D2939] text-xs font-medium leading-[1.21]"
            >
              {jobProps.salaryMin} -
              {jobProps.salaryMax || "Not specified"}
            </Typography>
          </div>
        </div>

        {/* Job Type - y: 188.12 */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-5 h-5 text-[#8A8A8A]" />
          <Typography
            variant="body-small"
            className="text-[#1D2939] text-xs font-medium leading-[1.21]"
          >
            {jobProps.jobType || "Not specified"}
          </Typography>
        </div>

        {/* Location - y: 218.18 */}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-5 h-5 text-[#8A8A8A]" />
          <Typography
            variant="body-small"
            className="text-[#1D2939] text-xs font-medium leading-[1.21] truncate"
          >
            {jobProps.location || "Location not specified"}
          </Typography>
        </div>
      </div>
    </div>
  );
}
