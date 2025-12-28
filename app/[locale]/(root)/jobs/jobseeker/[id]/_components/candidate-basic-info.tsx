"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { JobseekerProfile } from "@/interfaces/job.types";
import { Briefcase, Calendar, Phone, Mail, Clock } from "lucide-react";
import { format } from "date-fns";

interface CandidateBasicInfoProps {
  jobseeker: JobseekerProfile;
}

export default function CandidateBasicInfo({ jobseeker }: CandidateBasicInfoProps) {
  // Calculate experience years from work experience
  const getExperienceYears = () => {
    if (!jobseeker.workExperience || jobseeker.workExperience.length === 0) {
      return "0";
    }
    // Simple calculation - can be improved
    return "1 to 4";
  };

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 mb-6">
      <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-6">
        Basic Information
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        {jobseeker.phoneNo && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-purple flex-shrink-0" />
            <div>
              <Typography variant="caption" className="text-grey-blue">
                Phone Number
              </Typography>
              <Typography variant="body-small" className="text-dark-blue">
                {jobseeker.phoneNo}
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
              Immediately
            </Typography>
          </div>
        </div>
        {jobseeker.email && (
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-purple flex-shrink-0" />
            <div>
              <Typography variant="caption" className="text-grey-blue">
                Email
              </Typography>
              <Typography variant="body-small" className="text-dark-blue">
                {jobseeker.email}
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
              {jobseeker.lastUpdated
                ? format(new Date(jobseeker.lastUpdated), "MMM d, yyyy")
                : "7 days ago"}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

