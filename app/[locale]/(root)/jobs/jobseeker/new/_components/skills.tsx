"use client";

import React, { useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  useGetJobseekerProfile,
  useCrateOrUpdateJobseekerProfilePartialMe,
} from "@/hooks/useJobseeker";
import {
  skillsSchema,
  type SkillsSchemaType,
} from "@/schemas/jobseeker.schema";
import { toast } from "sonner";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { SkillsChips } from "./skills-chips";

export default function Skills() {
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetJobseekerProfile();
  const { mutate: createOrUpdateProfile, isPending: isSubmitting } =
    useCrateOrUpdateJobseekerProfilePartialMe();

  const form = useForm<SkillsSchemaType>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [],
    },
  });

  const { watch, handleSubmit, control, formState } = form;
  const { errors } = formState;

  // Load initial data from profile
  useEffect(() => {
    if (profileData?.data?.profile && !isLoadingProfile) {
      const profile = profileData.data.profile;
      const skills = (profile.skills || []) as Array<
        string | { name?: string }
      >;
      const skillNames = skills
        .map((skill) => {
          if (typeof skill === "string") return skill;
          return (skill as { name?: string })?.name || "";
        })
        .filter(Boolean) as string[];

      form.reset({
        skills: skillNames,
      });
    }
  }, [profileData, isLoadingProfile, form]);

  const watchedSkills = watch("skills");
  const skillsAsStrings = (watchedSkills || []) as string[];

  const onSubmit = useCallback(
    (data: SkillsSchemaType) => {
      const payload: Record<string, unknown> = {
        skills: data.skills || [],
      };

      createOrUpdateProfile(payload, {
        onSuccess: () => {
          toast.success("Skills updated successfully");
        },
        onError: (error: unknown) => {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to update skills";
          toast.error(errorMessage);
        },
      });
    },
    [createOrUpdateProfile]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl"
          >
            Skills
          </Typography>
          <Button type="submit" disabled={isSubmitting || isLoadingProfile}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>

        <FormField
          label="Skills"
          error={errors.skills?.message as string | undefined}
        >
          <Controller
            name="skills"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <SkillsChips
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add skills (e.g., Node.js, AWS)"
              />
            )}
          />
        </FormField>

        {skillsAsStrings.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <Typography variant="body-small" className="text-grey-blue">
              No skills added yet. Type to search and add skills above.
            </Typography>
          </div>
        )}
      </div>
    </form>
  );
}
