"use client";

import React from "react";
import { H2, Typography } from "@/components/typography";
import { JobseekerProfile } from "@/interfaces/job.types";

interface CandidateProfileSummaryProps {
  jobseeker: JobseekerProfile;
}

export default function CandidateProfileSummary({ jobseeker }: CandidateProfileSummaryProps) {
  if (!jobseeker.summary) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-[#E2E2E2] dark:border-gray-800 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
      <H2
        className="text-dark-blue dark:text-white font-bold mb-4">
        Profile Summary
      </H2>
      <Typography variant="body-large" className="text-[#8A8A8A] dark:text-gray-400 text-base leading-relaxed whitespace-pre-line">
        {jobseeker.summary}
      </Typography>
    </div>
  );
}

