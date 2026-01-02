"use client";

import React, { useEffect, useCallback } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { SelectableTabsInput } from "@/app/[locale]/(root)/post-ad/details/_components/SelectableTabsInput";
import {
  useGetJobseekerProfile,
  useReplaceExperiencesByUserId,
} from "@/hooks/useJobseeker";
import { employmentFormSchema } from "@/schemas/jobseeker.schema";
import { DatePicker } from "@/components/global/date-picker";
import { toast } from "sonner";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { SkillsChips } from "./skills-chips";
import { CreateWorkExperiencePayload } from "@/interfaces/job.types";

type EmploymentFormData = {
  workExperience?: Array<{
    _id?: string;
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    location?: string;
    description?: string;
    descriptionAr?: string;
    url?: string;
    employmentType?: string;
    employmentTypeAr?: string;
    department?: string;
    departmentAr?: string;
    jobType?: string;
    noticePeriodDays?: number;
    currentCtc?: number;
    ctcCurrency?: string;
    servingNotice?: boolean;
    lastWorkingDay?: string | null;
    skills?: string[];
  }>;
};

export default function Employment() {
  const { data: profileData, isLoading: isLoadingProfile } =
    useGetJobseekerProfile();
  const { mutate: replaceExperiences, isPending: isSubmitting } =
    useReplaceExperiencesByUserId();

  const form = useForm<EmploymentFormData>({
    resolver: zodResolver(employmentFormSchema),
    defaultValues: {
      workExperience: [],
    },
  });

  const { register, watch, handleSubmit, control, formState } = form;
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

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

  // Helper function to normalize location value
  const normalizeLocation = (
    location: string | undefined
  ): string | undefined => {
    if (!location) return undefined;
    const normalized = location.toLowerCase().trim();
    if (["onsite", "remote", "hybrid"].includes(normalized)) {
      return normalized;
    }
    // Try to match common variations
    if (normalized.includes("remote")) return "remote";
    if (normalized.includes("hybrid")) return "hybrid";
    if (
      normalized.includes("onsite") ||
      normalized.includes("on-site") ||
      normalized.includes("on site")
    ) {
      return "onsite";
    }
    return undefined;
  };

  // Load initial data from profile
  useEffect(() => {
    if (profileData?.data?.profile && !isLoadingProfile) {
      const profile = profileData.data.profile;
      const experiences = profile.experiences || [];
      const workExperience = experiences.map((exp) => ({
        _id: exp._id,
        position: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        current: exp.isCurrent,
        location: normalizeLocation(exp.jobType || exp.location),
        description: exp.description,
        url: exp.url,
        employmentType: exp.employmentType,
        department: exp.department,
        jobType: exp.jobType,
        noticePeriodDays: exp.noticePeriodDays,
        currentCtc: exp.currentCtc,
        ctcCurrency: exp.ctcCurrency,
        servingNotice: exp.servingNotice,
        lastWorkingDay: exp.lastWorkingDay,
        skills: exp.skills || [],
      }));

      form.reset({
        workExperience,
      });
    }
  }, [profileData, isLoadingProfile, form]);

  const onSubmit = useCallback(
    (data: EmploymentFormData) => {
      const userId = profileData?.data?.profile?.userId;
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const experiences = (data.workExperience || []).map((exp) => {
        const experience: Record<string, unknown> = {
          ...(exp._id && { _id: exp._id }),
          title: exp.position || "",
          company: exp.company || "",
          startDate: exp.startDate || "",
          isCurrent: exp.current || false,
        };

        if (exp.endDate) experience.endDate = exp.endDate;
        if (exp.location) experience.location = exp.location;
        if (exp.description) experience.description = exp.description;
        if (exp.url) experience.url = exp.url;
        if (exp.employmentType) experience.employmentType = exp.employmentType;
        if (exp.department) experience.department = exp.department;
        if (exp.jobType) experience.jobType = exp.jobType;
        if (exp.noticePeriodDays !== undefined)
          experience.noticePeriodDays = exp.noticePeriodDays;
        if (exp.currentCtc !== undefined)
          experience.currentCtc = exp.currentCtc;
        if (exp.ctcCurrency) experience.ctcCurrency = exp.ctcCurrency;
        if (exp.servingNotice !== undefined)
          experience.servingNotice = exp.servingNotice;
        if (exp.lastWorkingDay) experience.lastWorkingDay = exp.lastWorkingDay;
        if (exp.skills && exp.skills.length > 0) experience.skills = exp.skills;

        return experience as unknown as CreateWorkExperiencePayload;
      });

      replaceExperiences(
        { userId, data: experiences },
        {
          onSuccess: () => {
            toast.success("Employment history updated successfully");
          },
          onError: (error: unknown) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Failed to update employment history";
            toast.error(errorMessage);
          },
        }
      );
    },
    [replaceExperiences, profileData]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl"
          >
            Employment
          </Typography>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
              onClick={() =>
                append({
                  company: "",
                  position: "",
                  startDate: "",
                  current: false,
                  location: "",
                  description: "",
                  url: "",
                  employmentType: "",
                  department: "",
                  jobType: "",
                  servingNotice: false,
                  skills: [],
                })
              }
            >
              Add Employment
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingProfile}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => {
            const isCurrent = watch(`workExperience.${index}.current`);
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
                    Employment {index + 1}
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
                    label="Position"
                    error={
                      errors.workExperience?.[index]?.position?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`workExperience.${index}.position`)}
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </FormField>
                  <FormField
                    label="Company"
                    error={
                      errors.workExperience?.[index]?.company?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`workExperience.${index}.company`)}
                      placeholder="Company Name"
                    />
                  </FormField>
                  <FormField
                    label="Job Type"
                    error={
                      errors.workExperience?.[index]?.jobType?.message as
                        | string
                        | undefined
                    }
                  >
                    <Controller
                      name={`workExperience.${index}.jobType`}
                      control={control}
                      render={({ field }) => (
                        <SelectableTabsInput
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          onChange={(val) => field.onChange(val || undefined)}
                          options={[
                            { value: "onsite", label: "Onsite" },
                            { value: "remote", label: "Remote" },
                            { value: "hybrid", label: "Hybrid" },
                          ]}
                        />
                      )}
                    />
                  </FormField>
                  <FormField
                    label="Location"
                    error={
                      errors.workExperience?.[index]?.location?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`workExperience.${index}.location`)}
                      placeholder="e.g., Bengaluru, IN"
                    />
                  </FormField>
                  <FormField
                    label="Start Date"
                    error={
                      errors.workExperience?.[index]?.startDate?.message as
                        | string
                        | undefined
                    }
                  >
                    <Controller
                      name={`workExperience.${index}.startDate`}
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
                  <FormField label="Current">
                    <Controller
                      name={`workExperience.${index}.current`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`current-${index}`}
                            checked={field.value || false}
                            onCheckedChange={(checked) => {
                              const isChecked = checked === true;
                              field.onChange(isChecked);
                              // Clear endDate and noticePeriodDays when current is true
                              if (isChecked) {
                                form.setValue(
                                  `workExperience.${index}.endDate`,
                                  undefined
                                );
                                form.setValue(
                                  `workExperience.${index}.noticePeriodDays`,
                                  undefined
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`current-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Currently working here
                          </label>
                        </div>
                      )}
                    />
                  </FormField>
                  {!isCurrent && (
                    <FormField
                      label="End Date"
                      error={
                        errors.workExperience?.[index]?.endDate?.message as
                          | string
                          | undefined
                      }
                    >
                      <Controller
                        name={`workExperience.${index}.endDate`}
                        control={control}
                        render={({ field }) => {
                          const dateValue = parseDateFromISO(field.value);
                          const startDateValue = parseDateFromISO(
                            watch(`workExperience.${index}.startDate`)
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
                  )}
                  <FormField
                    label="Employment Type"
                    error={
                      errors.workExperience?.[index]?.employmentType
                        ?.message as string | undefined
                    }
                  >
                    <Controller
                      name={`workExperience.${index}.employmentType`}
                      control={control}
                      render={({ field }) => (
                        <SelectableTabsInput
                          value={
                            typeof field.value === "string" ? field.value : ""
                          }
                          onChange={(val) => field.onChange(val || undefined)}
                          options={[
                            { value: "full-time", label: "Full-time" },
                            { value: "part-time", label: "Part-time" },
                            { value: "contract", label: "Contract" },
                            { value: "internship", label: "Internship" },
                            { value: "freelance", label: "Freelance" },
                          ]}
                        />
                      )}
                    />
                  </FormField>
                  <FormField
                    label="Department"
                    error={
                      errors.workExperience?.[index]?.department?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`workExperience.${index}.department`)}
                      placeholder="e.g., Engineering"
                    />
                  </FormField>
                  <FormField
                    label="URL"
                    error={
                      errors.workExperience?.[index]?.url?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`workExperience.${index}.url`)}
                      type="url"
                      placeholder="https://company.example.com"
                    />
                  </FormField>
                  {isCurrent && (
                    <FormField
                      label="Notice Period (Days)"
                      error={
                        errors.workExperience?.[index]?.noticePeriodDays
                          ?.message as string | undefined
                      }
                    >
                      <Input
                        {...register(
                          `workExperience.${index}.noticePeriodDays`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                        type="number"
                        placeholder="30"
                      />
                    </FormField>
                  )}
                  <FormField
                    label="Current CTC"
                    error={
                      errors.workExperience?.[index]?.currentCtc?.message as
                        | string
                        | undefined
                    }
                  >
                    <Input
                      {...register(`workExperience.${index}.currentCtc`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      placeholder="1800000"
                    />
                  </FormField>
                  <FormField
                    label="CTC Currency"
                    error={
                      errors.workExperience?.[index]?.ctcCurrency?.message as
                        | string
                        | undefined
                    }
                  >
                    <Controller
                      name={`workExperience.${index}.ctcCurrency`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">
                              INR - Indian Rupee
                            </SelectItem>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">
                              GBP - British Pound
                            </SelectItem>
                            <SelectItem value="AED">
                              AED - UAE Dirham
                            </SelectItem>
                            <SelectItem value="SAR">
                              SAR - Saudi Riyal
                            </SelectItem>
                            <SelectItem value="CAD">
                              CAD - Canadian Dollar
                            </SelectItem>
                            <SelectItem value="AUD">
                              AUD - Australian Dollar
                            </SelectItem>
                            <SelectItem value="SGD">
                              SGD - Singapore Dollar
                            </SelectItem>
                            <SelectItem value="JPY">
                              JPY - Japanese Yen
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                  {isCurrent && (
                    <>
                      <FormField label="Serving Notice">
                        <Controller
                          name={`workExperience.${index}.servingNotice`}
                          control={control}
                          render={({ field }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`serving-notice-${index}`}
                                checked={field.value || false}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked === true)
                                }
                              />
                              <label
                                htmlFor={`serving-notice-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Currently serving notice period
                              </label>
                            </div>
                          )}
                        />
                      </FormField>
                      <FormField label="Last Working Day">
                        <Controller
                          name={`workExperience.${index}.lastWorkingDay`}
                          control={control}
                          render={({ field }) => {
                            const dateValue = parseDateFromISO(
                              field.value || undefined
                            );
                            return (
                              <DatePicker
                                value={dateValue}
                                onChange={(date) => {
                                  field.onChange(
                                    date ? formatDateToISO(date) : null
                                  );
                                }}
                                placeholder="Select last working day"
                              />
                            );
                          }}
                        />
                      </FormField>
                    </>
                  )}
                </div>

                <FormField
                  label="Description"
                  error={
                    errors.workExperience?.[index]?.description?.message as
                      | string
                      | undefined
                  }
                >
                  <Controller
                    name={`workExperience.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Describe your role and achievements..."
                        className="min-h-[100px]"
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Skills"
                  error={
                    errors.workExperience?.[index]?.skills?.message as
                      | string
                      | undefined
                  }
                >
                  <Controller
                    name={`workExperience.${index}.skills`}
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
              </div>
            );
          })}

          {fields.length === 0 && (
            <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
              <Typography variant="body-small" className="text-grey-blue">
                No employment history added yet. Click &quot;Add
                Employment&quot; to get started.
              </Typography>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
