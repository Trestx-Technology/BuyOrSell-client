"use client";

import React from "react";
import { H2, Typography } from "@/components/typography";
import { JobseekerLanguage } from "@/interfaces/job.types";

interface CandidateLanguagesProps {
  languages?: JobseekerLanguage[];
}

export default function CandidateLanguages({
  languages,
}: CandidateLanguagesProps) {
  if (!languages || languages.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-[#E2E2E2] dark:border-gray-800 rounded-2xl p-6 md:p-8 shadow-sm">
      <H2
        className="text-dark-blue dark:text-white font-bold mb-4"
      >
        Language Details
      </H2>
      <div className="space-y-3">
        {languages.map((lang, index) => (
          <div key={lang._id || index} className="flex items-center gap-2">
            <Typography variant="body-small" className="text-dark-blue dark:text-gray-200">
              {lang.name} - {lang.proficiency || "Not specified"}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
