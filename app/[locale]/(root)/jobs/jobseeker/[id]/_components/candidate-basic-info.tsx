"use client";

import React from "react";
import { H2, Typography } from "@/components/typography";
import { JobseekerProfile } from "@/interfaces/job.types";
import { Briefcase, Calendar, Phone, Mail, Clock } from "lucide-react";
import { format } from "date-fns";

interface CandidateBasicInfoProps {
  jobseeker: JobseekerProfile;
}

export default function CandidateBasicInfo({
  jobseeker,
}: CandidateBasicInfoProps) {
  // Get experience years from profile
  const getExperienceYears = () => {
    if (jobseeker.experienceYears) {
      return jobseeker.experienceYears.toString();
    }
    return "0";
  };

  // Get availability from profile
  const availability =
    jobseeker.availability ||
    (jobseeker.noticePeriodDays
      ? `${jobseeker.noticePeriodDays} days notice`
      : "Immediately");

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 mb-6">
      <H2
        className="text-dark-blue font-bold mb-6"
      >
        Basic Information
      </H2>
      <div className="grid grid-cols-1 max-[450px]:grid-cols-1 grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-purple flex-shrink-0" />
          <div>
            <Typography variant="caption" className="text-grey-blue">
              Employment Type
            </Typography>
            <Typography variant="body-small" className="text-dark-blue">
              Full-time
            </Typography>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-purple flex-shrink-0" />
          <div>
            <Typography variant="caption" className="text-grey-blue">
              Experience
            </Typography>
            <Typography variant="body-small" className="text-dark-blue">
              {getExperienceYears()} years
            </Typography>
          </div>
        </div>
        {jobseeker.contactPhone && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-purple flex-shrink-0" />
            <div>
              <Typography variant="caption" className="text-grey-blue">
                Phone Number
              </Typography>
              <Typography variant="body-small" className="text-dark-blue">
                {jobseeker.contactPhone}
              </Typography>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-purple flex-shrink-0" />
          <div>
            <Typography variant="caption" className="text-grey-blue">
              Availability
            </Typography>
            <Typography variant="body-small" className="text-dark-blue">
              {availability}
            </Typography>
          </div>
        </div>
        {jobseeker.contactEmail && (
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-purple flex-shrink-0" />
            <div>
              <Typography variant="caption" className="text-grey-blue">
                Email
              </Typography>
              <Typography variant="body-small" className="text-dark-blue">
                {jobseeker.contactEmail}
              </Typography>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-purple flex-shrink-0" />
          <div>
            <Typography variant="caption" className="text-grey-blue">
              Profile last updated
            </Typography>
            <Typography variant="body-small" className="text-dark-blue">
              {jobseeker.updatedAt
                ? format(new Date(jobseeker.updatedAt), "MMM d, yyyy")
                : "7 days ago"}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
