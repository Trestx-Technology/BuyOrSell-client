"use client";

import React from "react";
import { Typography } from "@/components/typography";
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
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 mb-6">
      <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
        Key Skills
      </Typography>
      <div className="flex flex-wrap gap-3">
        {jobseeker.skills.map((skill, index) => (
          <Badge
            key={skill._id || index}
            className="bg-purple text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            {skill.name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

