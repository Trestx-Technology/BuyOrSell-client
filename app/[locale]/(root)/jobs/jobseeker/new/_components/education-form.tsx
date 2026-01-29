"use client";

import React, { useEffect, useCallback, useMemo } from "react";
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
  useReplaceEducationsByUserId,
} from "@/hooks/useJobseeker";
import { educationFormSchema, type EducationFormSchemaType } from "@/schemas/jobseeker.schema";
import { DatePicker } from "@/components/global/date-picker";
import { toast } from "sonner";
import { FormField } from "@/app/[locale]/(root)/post-ad/details/_components/FormField";
import { CreateEducationPayload } from "@/interfaces/job.types";

import { JobseekerProfile } from "@/interfaces/job.types";

type EducationFormData = {
  education?: Array<{
    _id?: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    grade?: string;
    description?: string;
    courseType?: string;
    scoreType?: string;
    score?: number;
    yearOfPassing?: number;
  }>;
};

interface EducationFormProps {
  profile?: JobseekerProfile;
  isLoadingProfile: boolean;
}

export default function EducationForm({ profile, isLoadingProfile }: EducationFormProps) {
  const { mutate: replaceEducations, isPending: isSubmitting } =
    useReplaceEducationsByUserId();

  const form = useForm<EducationFormData>({
    resolver: zodResolver(educationFormSchema),
    defaultValues: {
      education: [],
    },
  });

  const { register, watch, handleSubmit, control, formState, setValue } = form;
  const { errors } = formState;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
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
  const parseDateFromISO = (dateString: string | undefined): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  // Load initial data from profile
  useEffect(() => {
    if (profile && !isLoadingProfile) {
      const educations = profile.educations || [];
      const education = educations.map((edu: any) => ({
        _id: edu._id,
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        current: edu.isCurrent,
        grade: edu.grade,
        description: edu.description,
        courseType: edu.courseType,
        scoreType: edu.scoreType,
        score: edu.score,
        yearOfPassing: edu.yearOfPassing,
      }));

      form.reset({
        education,
      });
    }
  }, [profile, isLoadingProfile, form]);

  const onSubmit = useCallback(
    (data: EducationFormData) => {
      const userId = profile?.userId;
      if (!userId) {
        toast.error("User ID not found");
        return;
      }

      const educations = (data.education || []).map((edu) => {
        const education: Record<string, unknown> = {
          ...(edu._id && { _id: edu._id }),
          institution: edu.institution || "",
          degree: edu.degree || "",
          startDate: edu.startDate || "",
          isCurrent: edu.current || false,
        };

        if (edu.fieldOfStudy) education.fieldOfStudy = edu.fieldOfStudy;
        if (edu.endDate) education.endDate = edu.endDate;
        if (edu.grade) education.grade = edu.grade;
        if (edu.description) education.description = edu.description;
        if (edu.courseType) education.courseType = edu.courseType;
        if (edu.scoreType) education.scoreType = edu.scoreType;
        if (edu.score !== undefined) education.score = edu.score;
        if (edu.yearOfPassing !== undefined)
          education.yearOfPassing = edu.yearOfPassing;

        return education as unknown as CreateEducationPayload;
      });

      replaceEducations(
        { userId, data: educations },
        {
          onSuccess: () => {
            toast.success("Education updated successfully");
          },
          onError: (error: any) => {
            if (error?.data?.errors) {
              const firstError = Object.values(error.data.errors)[0] as string;
              toast.error(firstError || "Validation failed");

              // Optionally set errors in react-hook-form
              Object.entries(error.data.errors).forEach(([key, value]) => {
                if (typeof value === 'string') {
                  form.setError(key as any, { type: 'manual', message: value });
                }
              });
            } else {
              toast.error(error?.message || "Failed to update education");
            }
          },
        }
      );
    },
    [replaceEducations, profile]
  );

  const onError = useCallback((errors: any) => {
    let firstMessage = "";
    if (errors.education && Array.isArray(errors.education)) {
      const firstIndex = errors.education.findIndex((e: any) => e);
      if (firstIndex !== -1) {
        const fieldErrors = errors.education[firstIndex];
        const firstFieldError = Object.values(fieldErrors)[0] as any;
        firstMessage = firstFieldError?.message || `Error in entry #${firstIndex + 1}`;
      }
    }

    if (!firstMessage) {
      const otherErrors = Object.values(errors);
      if (otherErrors.length > 0) {
        const firstError = otherErrors[0] as any;
        firstMessage = firstError.message || "Please fill in all required fields";
      }
    }

    if (firstMessage) {
      toast.error(firstMessage);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl"
          >
            Education
          </Typography>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
              onClick={() =>
                append({
                  institution: "",
                  degree: "",
                  startDate: "",
                  current: false,
                })
              }
            >
              Add Education
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingProfile}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => {
            const isCurrent = watch(`education.${index}.current`);
            return (
              <div
                key={field.id}
                className="border border-[#E2E2E2] rounded-lg p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Typography variant="body-large" className="text-dark-blue font-semibold">
                    Education {index + 1}
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
                    label="Institution"
                    required={true}
                    error={errors.education?.[index]?.institution?.message}
                  >
                    <Input
                      {...register(`education.${index}.institution`)}
                      placeholder="University/School Name"
                    />
                  </FormField>
                  <FormField
                    label="Degree"
                    required={true}
                    error={errors.education?.[index]?.degree?.message}
                  >
                    <Input
                      {...register(`education.${index}.degree`)}
                      placeholder="e.g., Bachelor of Science"
                    />
                  </FormField>
                  <FormField
                    label="Field of Study"
                    error={errors.education?.[index]?.fieldOfStudy?.message}
                  >
                    <Input
                      {...register(`education.${index}.fieldOfStudy`)}
                      placeholder="e.g., Computer Science"
                    />
                  </FormField>
                  <FormField
                    label="Course Type"
                    error={errors.education?.[index]?.courseType?.message}
                  >
                    <Controller
                      name={`education.${index}.courseType`}
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
                            { value: "online", label: "Online" },
                            { value: "distance", label: "Distance" },
                          ]}
                        />
                      )}
                    />
                  </FormField>
                  <FormField
                    label="Start Date"
                    required={true}
                    error={errors.education?.[index]?.startDate?.message}
                  >
                    <Controller
                      name={`education.${index}.startDate`}
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
                  <FormField label="Current" error={errors.education?.[index]?.current?.message}>
                    <Controller
                      name={`education.${index}.current`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`current-edu-${index}`}
                            checked={field.value || false}
                            onCheckedChange={(checked) => {
                              const isChecked = checked === true;
                              field.onChange(isChecked);
                              // Clear endDate when current is true
                              if (isChecked) {
                                setValue(`education.${index}.endDate`, undefined);
                              }
                            }}
                          />
                          <label
                            htmlFor={`current-edu-${index}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Currently studying here
                          </label>
                        </div>
                      )}
                    />
                  </FormField>
                  {!isCurrent && (
                    <FormField
                      label="End Date"
                      error={errors.education?.[index]?.endDate?.message}
                    >
                      <Controller
                        name={`education.${index}.endDate`}
                        control={control}
                        render={({ field }) => {
                          const dateValue = parseDateFromISO(field.value);
                          const startDateValue = parseDateFromISO(
                            watch(`education.${index}.startDate`)
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
                    label="Grade"
                    error={errors.education?.[index]?.grade?.message}
                  >
                    <Input
                      {...register(`education.${index}.grade`)}
                      placeholder="e.g., 8.7 CGPA or First Class"
                    />
                  </FormField>
                  <FormField
                    label="Score Type"
                  >
                    <Controller
                      name={`education.${index}.scoreType`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select score type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cgpa">CGPA</SelectItem>
                            <SelectItem value="gpa">GPA</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="grade">Grade</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>
                  <FormField
                    label="Score"
                    error={errors.education?.[index]?.score?.message}
                  >
                    <Input
                      {...register(`education.${index}.score`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      step="0.01"
                      placeholder="e.g., 8.7"
                    />
                  </FormField>
                  <FormField
                    label="Year of Passing"
                    error={errors.education?.[index]?.yearOfPassing?.message}
                  >
                    <Input
                      {...register(`education.${index}.yearOfPassing`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      min="1900"
                      max="2100"
                      placeholder="e.g., 2021"
                    />
                  </FormField>
                </div>

                <FormField
                  label="Description"
                  error={
                    errors.education?.[index]?.description?.message as
                      | string
                      | undefined
                  }
                >
                  <Controller
                    name={`education.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Additional details about your education..."
                        className="min-h-[100px]"
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
                No education added yet. Click &quot;Add Education&quot; to get started.
              </Typography>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
