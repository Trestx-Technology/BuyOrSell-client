"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Typography } from "@/components/typography";
import { Textarea } from "@/components/ui/textarea";
import { JobseekerProfile } from "@/interfaces/job.types";

interface ProfileSummaryProps {
  form: UseFormReturn<JobseekerProfile>;
}

export default function ProfileSummary({ form }: ProfileSummaryProps) {
  const { register, watch } = form;
  const bio = watch("bio") || "";
  const characterCount = bio.length;

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
      <div className="space-y-2">
        <Typography
          variant="h2"
          className="text-dark-blue font-bold text-2xl"
        >
          Profile Summary
        </Typography>
        <Typography
          variant="body-small"
          className="text-grey-blue"
        >
          Write a brief summary about yourself, your experience, and what makes you unique
        </Typography>
      </div>

      <div className="space-y-2">
        <Textarea
          {...register("bio")}
          placeholder="Type here..."
          className="min-h-[200px] w-full resize-none"
          maxLength={2000}
        />
        <div className="flex justify-end">
          <Typography variant="caption" className="text-grey-blue">
            {characterCount} / 2000 characters
          </Typography>
        </div>
      </div>
    </div>
  );
}

