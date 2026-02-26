"use client";

import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { TextareaInput } from "@/app/[locale]/(root)/post-ad/details/_components/TextareaInput";
import {
  useCrateOrUpdateJobseekerProfilePartialMe,
} from "@/hooks/useJobseeker";
import { profileSummarySchema, type ProfileSummarySchemaType } from "@/schemas/jobseeker.schema";
import { toast } from "sonner";
import { jobseekerQueries } from "@/app/api/jobseeker/index";

import { JobseekerProfile } from "@/interfaces/job.types";

interface ProfileSummaryProps {
  profile?: JobseekerProfile;
  isLoadingProfile: boolean;
}

export default function ProfileSummary({ profile, isLoadingProfile }: ProfileSummaryProps) {
  const queryClient = useQueryClient();
  const { mutate: createOrUpdateProfile, isPending: isSubmitting } =
    useCrateOrUpdateJobseekerProfilePartialMe();

  const form = useForm<ProfileSummarySchemaType>({
    resolver: zodResolver(profileSummarySchema),
    defaultValues: {
      summary: "",
    },
  });

  const { register, watch, handleSubmit } = form;

  // Load initial data from profile
  useEffect(() => {
    if (profile && !isLoadingProfile) {
      form.reset({
        summary: profile.summary || "",
      });
    }
  }, [profile, isLoadingProfile, form]);

  const summary = watch("summary") || "";
  const characterCount = summary.length;

  const onSubmit = useCallback(
    (data: ProfileSummarySchemaType) => {
      const payload: Record<string, unknown> = {
        summary: data.summary || "",
      };

      createOrUpdateProfile(payload, {
        onSuccess: () => {
          // Invalidate the /jobseeker-profiles/me/ query to update data in other components
          queryClient.invalidateQueries({
            queryKey: jobseekerQueries.getJobseekerProfile.Key,
          });
          toast.success("Profile summary updated successfully");
        },
        onError: (error: any) => {
          if (error?.data?.errors) {
            const firstError = Object.values(error.data.errors)[0] as string;
            toast.error(firstError || "Validation failed");

            Object.entries(error.data.errors).forEach(([key, value]) => {
              if (typeof value === "string") {
                form.setError(key as any, { type: "manual", message: value });
              }
            });
          } else {
            toast.error(error?.message || "Failed to update profile summary");
          }
        },
      });
    },
    [createOrUpdateProfile, queryClient]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white dark:bg-gray-900 border border-[#E2E2E2] dark:border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Typography
              variant="h2"
              className="text-dark-blue dark:text-white font-bold text-2xl"
            >
              Profile Summary
            </Typography>
            <Typography
              variant="body-small"
              className="text-grey-blue dark:text-gray-400"
            >
              Write a brief summary about yourself, your experience, and what makes you unique
            </Typography>
          </div>
          <Button type="submit" disabled={isSubmitting || isLoadingProfile}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
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
    </form>
  );
}
