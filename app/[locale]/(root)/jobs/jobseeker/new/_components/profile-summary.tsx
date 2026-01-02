"use client";

import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetJobseekerProfile,
  useCrateOrUpdateJobseekerProfilePartialMe,
} from "@/hooks/useJobseeker";
import { profileSummarySchema, type ProfileSummarySchemaType } from "@/schemas/jobseeker.schema";
import { toast } from "sonner";
import { jobseekerQueries } from "@/app/api/jobseeker/index";

export default function ProfileSummary() {
  const queryClient = useQueryClient();
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetJobseekerProfile();
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
    if (profileData?.data?.profile && !isLoadingProfile) {
      const profile = profileData.data.profile;
      form.reset({
        summary: profile.summary || "",
      });
    }
  }, [profileData, isLoadingProfile, form]);

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
        onError: (error: unknown) => {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to update profile summary";
          toast.error(errorMessage);
        },
      });
    },
    [createOrUpdateProfile, queryClient]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
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
          <Button type="submit" disabled={isSubmitting || isLoadingProfile}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>

        <div className="space-y-2">
          <Textarea
            {...register("summary")}
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
    </form>
  );
}
