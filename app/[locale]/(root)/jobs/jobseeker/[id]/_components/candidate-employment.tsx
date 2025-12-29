"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { JobseekerExperience, JobseekerProfile } from "@/interfaces/job.types";
import { MapPin } from "lucide-react";
import { format } from "date-fns";

interface CandidateEmploymentProps {
  jobseeker: JobseekerProfile;
}

export default function CandidateEmployment({ jobseeker }: CandidateEmploymentProps) {
  if (!jobseeker.experiences || jobseeker.experiences.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 mb-6">
      <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
        Employment
      </Typography>
      <div className="space-y-6">
        {jobseeker.experiences.map((exp: JobseekerExperience, index: number) => (
          <div key={exp._id || index} className="border-b border-[#E2E2E2] last:border-0 pb-6 last:pb-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <Typography variant="h3" className="text-dark-blue font-semibold text-lg mb-1">
                  {exp.title}
                </Typography>
                <Typography variant="body-small" className="text-purple mb-1">
                  {exp.company}
                </Typography>
                <Typography variant="caption" className="text-grey-blue">
                  {format(new Date(exp.startDate), "MMMM yyyy")} -{" "}
                  {exp.isCurrent
                    ? "Present"
                    : exp.endDate
                      ? format(new Date(exp.endDate), "MMMM yyyy")
                      : "Present"}
                </Typography>
              </div>
            </div>
            {exp.description && (
              <Typography variant="body-small" className="text-[#8A8A8A] mt-3 leading-relaxed">
                {exp.description}
              </Typography>
            )}
            {exp.location && (
              <div className="flex items-center gap-2 mt-3">
                <MapPin className="w-4 h-4 text-grey-blue" />
                <Typography variant="caption" className="text-grey-blue">
                  {exp.location}
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

