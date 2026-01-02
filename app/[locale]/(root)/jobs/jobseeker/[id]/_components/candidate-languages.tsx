"use client";

import React from "react";
import { Typography } from "@/components/typography";
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
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl mb-4"
      >
        Language Details
      </Typography>
      <div className="space-y-3">
        {languages.map((lang, index) => (
          <div key={lang._id || index} className="flex items-center gap-2">
            <Typography variant="body-small" className="text-dark-blue">
              {lang.name} - {lang.proficiency || "Not specified"}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}
