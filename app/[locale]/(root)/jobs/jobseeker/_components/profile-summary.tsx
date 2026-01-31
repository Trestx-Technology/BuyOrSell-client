"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Typography } from "@/components/typography";
import { TextareaInput } from "@/app/[locale]/(root)/post-ad/details/_components/TextareaInput";
import { JobseekerProfile } from "@/interfaces/job.types";

interface ProfileSummaryProps {
  form: UseFormReturn<JobseekerProfile>;
}

export default function ProfileSummary({ form }: ProfileSummaryProps) {
  const { register, watch } = form;
  const summary = watch("summary") || "";
  const characterCount = summary?.length || 0;

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
      <div className="space-y-2">
        <Typography variant="h2" className="text-dark-blue font-bold text-2xl">
          Profile Summary
        </Typography>
        <Typography variant="body-small" className="text-grey-blue">
          Write a brief summary about yourself, your experience, and what makes
          you unique
        </Typography>
      </div>

      <div className="space-y-2">
        <TextareaInput
          value={form.watch("summary") || ""}
          onChange={(val) => form.setValue("summary", val, { shouldValidate: true })}
          placeholder="Type here..."
          className="min-h-[200px]"
          maxLength={2000}
          showAI={true}
          categoryPath="Jobseeker Profile Summary"
        />
      </div>
    </div>
  );
}
