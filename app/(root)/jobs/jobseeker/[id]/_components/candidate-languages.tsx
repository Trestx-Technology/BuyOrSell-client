"use client";

import React from "react";
import { Typography } from "@/components/typography";

interface Language {
  language: string;
  proficiency: string;
}

interface CandidateLanguagesProps {
  languages?: Language[];
}

export default function CandidateLanguages({ languages }: CandidateLanguagesProps) {
  // Default languages if not provided
  const defaultLanguages: Language[] = [
    { language: "English", proficiency: "Fluent" },
    { language: "Hindi", proficiency: "Native" },
  ];

  const displayLanguages = languages || defaultLanguages;

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
        Language Details
      </Typography>
      <div className="space-y-3">
        {displayLanguages.map((lang, index) => (
          <div key={index} className="flex items-center gap-2">
            <Typography variant="body-small" className="text-dark-blue">
              {lang.language} - {lang.proficiency}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

