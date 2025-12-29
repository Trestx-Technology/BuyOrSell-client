"use client";

import React from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  Rocket,
  Briefcase,
  Clock,
  DollarSign,
} from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { JobseekerProfile } from "@/interfaces/job.types";
import { ICONS } from "@/constants/icons";
import { formatDistanceToNow } from "date-fns";

interface CandidateHeaderProps {
  jobseeker: JobseekerProfile;
  onShortlist?: () => void;
  onReject?: () => void;
}

export default function CandidateHeader({
  jobseeker,
  onShortlist,
  onReject,
}: CandidateHeaderProps) {
  const profileName = jobseeker.name || "User";
  const initials =
    profileName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "SK";
  const professionalTitle = jobseeker.headline || "";
  const currentCompany = jobseeker.experiences[0]?.company || "";

  // Get job preferences
  const jobType = jobseeker.preferredJobTypes?.[0] || "";

  // Calculate experience from work experience
  let experience = "";
  if (jobseeker.experiences && jobseeker.experiences.length > 0) {
    const firstExp = jobseeker.experiences[0];
    if (firstExp.startDate) {
      const startDate = new Date(firstExp.startDate);
      const endDate = firstExp.endDate
        ? new Date(firstExp.endDate)
        : firstExp.isCurrent
        ? new Date()
        : null;
      if (endDate) {
        const yearsDiff =
          (endDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365);
        experience = `${Math.floor(yearsDiff)} years`;
      }
    }
  }

  const salaryRange =
    jobseeker.salaryExpectationMin && jobseeker.salaryExpectationMax
      ? {
          min: jobseeker.salaryExpectationMin,
          max: jobseeker.salaryExpectationMax,
        }
      : undefined;
  const salaryMin = salaryRange?.min || 0;
  const salaryMax = salaryRange?.max || 0;
  const availability = "Immediately";

  const lastUpdated = jobseeker.updatedAt
    ? formatDistanceToNow(new Date(jobseeker.updatedAt || new Date()), {
        addSuffix: true,
      })
    : "";

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 relative flex gap-6 mb-6">
      {/*------- Profile Image Circle--------- */}
      <div className="relative size-[170px] mx-auto md:mx-0 flex-shrink-0">
        <div className="absolute inset-0 rounded-full border-[3px] border-[#37E7B6] p-2">
          <div className="w-full h-full rounded-full border-[5px] border-[#F5EBFF] flex items-center justify-center bg-gradient-to-br from-purple/10 to-purple/5 overflow-hidden">
            {jobseeker.photoUrl ? (
              <Image
                src={jobseeker.photoUrl}
                alt={profileName}
                width={170}
                height={170}
                className="rounded-full object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-purple flex items-center justify-center">
                <span className="text-white font-semibold text-2xl">
                  {initials}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-xl space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Typography
              variant="h2"
              className="text-dark-blue font-semibold text-2xl"
            >
              {profileName}
            </Typography>

            {/* TODO: Add verified icon */}
            {/* {jobseeker.verified && ( */}
            <Image
              src={ICONS.auth.verified}
              alt="verified"
              width={20}
              height={20}
            />
            {/* )} */}
          </div>
          {professionalTitle && (
            <Typography
              variant="body-large"
              className="text-dark-blue font-semibold text-xs"
            >
              {professionalTitle}
            </Typography>
          )}
          {currentCompany && (
            <Typography
              variant="body-large"
              className="text-dark-blue font-semibold text-xs"
            >
              At {currentCompany}
            </Typography>
          )}
        </div>

        {/* ------- Profile Details Grid ------- */}
        <div className="grid grid-cols-2 gap-5">
          {jobType && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-5 h-5 text-grey-blue" />
              <Typography
                variant="body-small"
                className="text-dark-blue text-xs font-medium"
              >
                {jobType}
              </Typography>
            </div>
          )}
          {jobseeker.contactPhone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-5 h-5 text-grey-blue" />
              <Typography
                variant="body-small"
                className="text-dark-blue text-sm"
              >
                {jobseeker.contactPhone}
              </Typography>
            </div>
          )}

          {experience && (
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-5 h-5 text-dark-blue" />
              <Typography
                variant="body-small"
                className="text-dark-blue text-sm font-medium"
              >
                {experience}
              </Typography>
            </div>
          )}

          {jobseeker.contactEmail && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-5 h-5 text-grey-blue" />
              <Typography
                variant="body-small"
                className="text-dark-blue text-sm"
              >
                {jobseeker.contactEmail}
              </Typography>
            </div>
          )}
          {(salaryMin > 0 || salaryMax > 0) && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-5 h-5 text-dark-blue" />
              <div className="flex items-center gap-1">
                <span className="text-[12px]">AED</span>
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-sm font-medium"
                >
                  {salaryMin.toLocaleString()}
                </Typography>
                {salaryMax > salaryMin && (
                  <>
                    <span className="text-dark-blue">-</span>
                    <span className="text-[12px]">AED</span>
                    <Typography
                      variant="body-small"
                      className="text-dark-blue text-sm font-medium"
                    >
                      {salaryMax.toLocaleString()}
                    </Typography>
                  </>
                )}
              </div>
            </div>
          )}

          {availability && (
            <div className="flex items-center gap-1.5">
              <Rocket className="w-5 h-5 text-dark-blue" />
              <Typography
                variant="body-small"
                className="text-dark-blue text-sm font-medium"
              >
                {availability}
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 absolute top-5 right-4">
        {onShortlist && (
          <Button
            onClick={onShortlist}
            className="bg-success-100 text-white hover:bg-success-60"
            size="sm"
          >
            Shortlist
          </Button>
        )}
        {onReject && (
          <Button
            onClick={onReject}
            variant="danger"
            className="bg-error-100 text-white hover:bg-error-60"
            size="sm"
          >
            Reject
          </Button>
        )}
      </div>

      {lastUpdated && (
        <Typography
          variant="body-small"
          className="text-dark-blue text-sm font-poppins absolute bottom-3 right-4 font-medium"
        >
          Profile last updated - {lastUpdated}
        </Typography>
      )}
    </div>
  );
}
