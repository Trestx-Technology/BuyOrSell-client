"use client";

import React from "react";
import { H2, Typography } from "@/components/typography";
import { JobseekerEducation, JobseekerProfile } from "@/interfaces/job.types";
import { format } from "date-fns";

interface CandidateEducationProps {
  jobseeker: JobseekerProfile;
}

export default function CandidateEducation({ jobseeker }: CandidateEducationProps) {
  if (!jobseeker.educations || jobseeker.educations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 mb-6">
      <H2
        className="text-dark-blue font-bold mb-4">
        Education
      </H2>
      <div className="space-y-6">
        {jobseeker.educations?.map((edu: JobseekerEducation, index: number  ) => (
          <div key={edu._id || index}>
            <Typography variant="h3" className="text-dark-blue font-semibold text-lg mb-1">
              {edu.degree}
              {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
            </Typography>
            <Typography variant="body-small" className="text-purple mb-1">
              {edu.institution}
            </Typography>
            <div className="flex items-center gap-4 text-sm text-grey-blue">
              <span>
                {format(new Date(edu.startDate), "yyyy")} -{" "}
                {edu.isCurrent
                  ? "Present"
                  : edu.endDate
                    ? format(new Date(edu.endDate), "yyyy")
                    : "Present"}
              </span>
              {edu.grade && <span>{edu.grade}</span>}
            </div>
            {edu.description && (
              <Typography variant="body-small" className="text-[#8A8A8A] mt-3 leading-relaxed">
                {edu.description}
              </Typography>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

