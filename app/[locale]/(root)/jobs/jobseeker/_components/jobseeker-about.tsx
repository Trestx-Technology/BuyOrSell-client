"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Textarea } from "@/components/ui/textarea";
import { JobseekerProfile } from "@/interfaces/job.types";
import { UseFormReturn } from "react-hook-form";

interface JobseekerAboutProps {
  jobseeker?: JobseekerProfile;
  form?: UseFormReturn<JobseekerProfile>;
  isEditMode?: boolean;
}

export default function JobseekerAbout({
  jobseeker,
  form,
  isEditMode = false,
}: JobseekerAboutProps) {
  if (isEditMode && form) {
    const { register } = form;
    return (
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
        <Typography
          variant="h2"
          className="text-dark-blue font-bold text-2xl mb-4"
        >
          About
        </Typography>
        <Textarea
          {...register("summary")}
          placeholder="Tell us about yourself, your experience, and what makes you unique..."
          className="min-h-[150px]"
        />
      </div>
    );
  }

  // View Mode
  if (!jobseeker?.summary) {
    return null;
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl mb-4"
      >
        About
      </Typography>
      <Typography
        variant="body-large"
        className="text-[#8A8A8A] text-base leading-relaxed whitespace-pre-line"
      >
        {jobseeker.summary}
      </Typography>
    </div>
  );
}
