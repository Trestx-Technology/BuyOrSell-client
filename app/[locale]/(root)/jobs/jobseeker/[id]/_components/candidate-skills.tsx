"use client";

import React from "react";
import { H2, Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { JobseekerProfile } from "@/interfaces/job.types";

interface CandidateSkillsProps {
  jobseeker: JobseekerProfile;
}

export default function CandidateSkills({ jobseeker }: CandidateSkillsProps) {
  if (!jobseeker.skills || jobseeker.skills.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-[#E2E2E2] dark:border-gray-800 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
      <H2
        className="text-dark-blue dark:text-white font-bold mb-4"
      >
        Key Skills
      </H2>
      <div className="flex flex-wrap gap-3">
        {jobseeker.skills.map((skill, index) => (
          <Badge
            key={skill || index}
            className="bg-purple/10 dark:bg-purple/20 text-purple dark:text-purple-300 px-4 py-1 rounded-full text-xs font-medium border-transparent"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
