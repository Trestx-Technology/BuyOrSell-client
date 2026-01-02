"use client";

import React, { useEffect, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import {
  useGetJobseekerProfile,
  useReplaceProjectsByUserId,
} from "@/hooks/useJobseeker";
import { projectsFormSchema, type ProjectsFormSchemaType } from "@/schemas/jobseeker.schema";
import { DatePicker } from "@/components/global/date-picker";
import { toast } from "sonner";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { SkillsChips } from "./skills-chips";
import { CreatePortfolioItemPayload } from "@/interfaces/job.types";

type ProjectsFormData = {
  portfolio?: Array<{
    _id?: string;
    name?: string;
    role?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    url?: string;
    techStack?: string[];
    projectType?: string;
    teamSize?: number;
  }>;
};

export default function Projects() {
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetJobseekerProfile();
  const { mutate: replaceProjects, isPending: isSubmitting } =
    useReplaceProjectsByUserId();

  const form = useForm<ProjectsFormData>({
    resolver: zodResolver(projectsFormSchema),
    defaultValues: {
      portfolio: [],
    },
  });

  const { register, watch, handleSubmit, control, formState } = form;
  const { errors } = formState;

  // Helper function to convert Date to ISO string (YYYY-MM-DD)
  const formatDateToISO = (date: Date | undefined): string => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to parse ISO string to Date
  const parseDateFromISO = (
    dateString: string | undefined
  ): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };
  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolio",
  });

  // Load initial data from profile
  useEffect(() => {
    if (profileData?.data?.profile && !isLoadingProfile) {
      const profile = profileData.data.profile;
      const projects = profile.projects || [];
      const portfolio = projects.map((proj) => ({
        _id: proj._id,
        name: proj.name,
        role: proj.role,
        description: proj.description,
        startDate: proj.startDate,
        endDate: proj.endDate,
        url: proj.url,
        techStack: proj.techStack || [],
        projectType: proj.projectType,
        teamSize: proj.teamSize,
      }));

      form.reset({
        portfolio,
      });
    }
  }, [profileData, isLoadingProfile, form]);

  const onSubmit = useCallback(
    (data: ProjectsFormData) => {
      const userId = profileData?.data?.profile?.userId;
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const projects = (data.portfolio || []).map((proj) => {
        const project: Record<string, unknown> = {
          ...(proj._id && { _id: proj._id }),
          name: proj.name || "",
        };

        if (proj.role) project.role = proj.role;
        if (proj.description) project.description = proj.description;
        if (proj.startDate) project.startDate = proj.startDate;
        if (proj.endDate) project.endDate = proj.endDate;
        if (proj.url) project.url = proj.url;
        if (proj.techStack && proj.techStack.length > 0)
          project.techStack = proj.techStack;
        if (proj.projectType) project.projectType = proj.projectType;
        if (proj.teamSize !== undefined) project.teamSize = proj.teamSize;

        return project as unknown as CreatePortfolioItemPayload;
      });

      replaceProjects(
        { userId, data: projects },
        {
          onSuccess: () => {
            toast.success("Projects updated successfully");
          },
          onError: (error: unknown) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to update projects";
            toast.error(errorMessage);
          },
        }
      );
    },
    [replaceProjects, profileData]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl"
          >
            Projects
          </Typography>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
              onClick={() =>
                append({
                  name: "",
                  role: "",
                  description: "",
                  techStack: [],
                  url: "",
                  projectType: "",
                  teamSize: undefined,
                })
              }
            >
              Add Project
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingProfile}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => {
            return (
              <div
                key={field.id}
                className="border border-[#E2E2E2] rounded-lg p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Typography
                    variant="body-large"
                    className="text-dark-blue font-semibold"
                  >
                    Project {index + 1}
                  </Typography>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-error-100 hover:text-error-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Project Name"
                    error={
                      errors.portfolio?.[index]?.name?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`portfolio.${index}.name`)}
                      placeholder="e.g., E-commerce Platform Revamp"
                    />
                  </FormField>
                  <FormField
                    label="Your Role"
                    error={
                      errors.portfolio?.[index]?.role?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`portfolio.${index}.role`)}
                      placeholder="e.g., Backend Lead"
                    />
                  </FormField>
                  <FormField
                    label="Start Date"
                    error={
                      errors.portfolio?.[index]?.startDate?.message as
                        | string
                        | undefined
                    }
                  >
                    <Controller
                      name={`portfolio.${index}.startDate`}
                      control={control}
                      render={({ field }) => {
                        const dateValue = parseDateFromISO(field.value);
                        return (
                          <DatePicker
                            value={dateValue}
                            onChange={(date) => {
                              field.onChange(formatDateToISO(date));
                            }}
                            placeholder="Select start date"
                          />
                        );
                      }}
                    />
                  </FormField>
                  <FormField
                    label="End Date"
                    error={
                      errors.portfolio?.[index]?.endDate?.message as
                        | string
                        | undefined
                    }
                  >
                    <Controller
                      name={`portfolio.${index}.endDate`}
                      control={control}
                      render={({ field }) => {
                        const dateValue = parseDateFromISO(field.value);
                        const startDateValue = parseDateFromISO(
                          watch(`portfolio.${index}.startDate`)
                        );
                        return (
                          <DatePicker
                            value={dateValue}
                            onChange={(date) => {
                              field.onChange(formatDateToISO(date));
                            }}
                            placeholder="Select end date"
                            minDate={startDateValue}
                          />
                        );
                      }}
                    />
                  </FormField>
                  <FormField
                    label="Project URL"
                    error={
                      errors.portfolio?.[index]?.url?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`portfolio.${index}.url`)}
                      type="url"
                      placeholder="https://github.com/..."
                    />
                  </FormField>
                  <FormField
                    label="Project Type"
                    error={
                      errors.portfolio?.[index]?.projectType?.message as
                        | string
                        | undefined
                    }
                  >
                    <Controller
                      name={`portfolio.${index}.projectType`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                            <SelectItem value="open-source">
                              Open Source
                            </SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                  <FormField
                    label="Team Size"
                    error={
                      errors.portfolio?.[index]?.teamSize?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`portfolio.${index}.teamSize`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      placeholder="e.g., 6"
                      min="1"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Description"
                  error={
                    errors.portfolio?.[index]?.description?.message as
                      | string
                      | undefined
                  }
                >
                  <Controller
                    name={`portfolio.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Describe your project..."
                        className="min-h-[100px]"
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Tech Stack"
                  error={
                    errors.portfolio?.[index]?.techStack?.message as
                      | string
                      | undefined
                  }
                >
                  <Controller
                    name={`portfolio.${index}.techStack`}
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                      <SkillsChips
                        value={field.value || []}
                        onChange={field.onChange}
                        placeholder="Add technologies (e.g., NestJS, PostgreSQL)"
                      />
                    )}
                  />
                </FormField>
              </div>
            );
          })}

          {fields.length === 0 && (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <Typography variant="body-small" className="text-grey-blue">
                No projects added yet. Click &quot;Add Project&quot; to get started.
              </Typography>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
