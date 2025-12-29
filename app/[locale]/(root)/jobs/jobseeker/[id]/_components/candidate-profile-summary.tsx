"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { JobseekerProfile } from "@/interfaces/job.types";

interface CandidateProfileSummaryProps {
  jobseeker: JobseekerProfile;
}

export default function CandidateProfileSummary({ jobseeker }: CandidateProfileSummaryProps) {
  if (!jobseeker.summary) {
    return null;
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 mb-6">
      <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
        Profile Summary
      </Typography>
      <Typography variant="body-large" className="text-[#8A8A8A] text-base leading-relaxed whitespace-pre-line">
        {jobseeker.summary}
      </Typography>
    </div>
  );
}

