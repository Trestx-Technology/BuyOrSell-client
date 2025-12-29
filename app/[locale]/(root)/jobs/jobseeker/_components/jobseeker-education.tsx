"use client";

import React from "react";
import { GraduationCap, Calendar, Plus, Trash2 } from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { JobseekerEducation } from "@/interfaces/job.types";
import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
import { JobseekerProfile } from "@/interfaces/job.types";

interface JobseekerEducationProps {
  education?: JobseekerEducation[];
  form?: UseFormReturn<JobseekerProfile>;
  isEditMode?: boolean;
}

export default function JobseekerEducation({
  education,
  form,
  isEditMode = false,
}: JobseekerEducationProps) {
  // Call hooks unconditionally at the top level
  const { fields, append, remove } = useFieldArray({
    control: (form?.control || {}) as Control<JobseekerProfile>,
    name: "educations",
  });

  if (isEditMode && form) {
    const { register } = form;

    return (
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl"
          >
            Education
          </Typography>
          <Button
            type="button"
            onClick={() =>
              append({
                institution: "",
                degree: "",
                startDate: "",
                isCurrent: false,
              })
            }
            variant="outline"
            className="border-purple text-purple"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-[#E2E2E2] rounded-lg p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <Typography variant="h3" className="text-dark-blue font-semibold">
                  Education {index + 1}
                </Typography>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="ghost"
                  size="sm"
                  className="text-error-100 hover:text-error-100"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  {...register(`educations.${index}.degree`)}
                  label="Degree"
                  placeholder="e.g., Bachelor of Science"
                  isRequired
                />
                <Input
                  {...register(`education.${index}.institution`)}
                  label="Institution"
                  placeholder="University Name"
                  isRequired
                />
                <Input
                  {...register(`education.${index}.fieldOfStudy`)}
                  label="Field of Study"
                  placeholder="e.g., Computer Science"
                />
                <Input
                  {...register(`education.${index}.startDate`)}
                  label="Start Date"
                  type="date"
                  isRequired
                />
                <Input
                  {...register(`education.${index}.endDate`)}
                  label="End Date"
                  type="date"
                />
                <Input
                  {...register(`education.${index}.grade`)}
                  label="Grade/GPA"
                  placeholder="e.g., 3.8/4.0"
                />
                <div className="flex items-center gap-2">
                  <input
                    {...register(`education.${index}.current`)}
                    type="checkbox"
                    id={`edu-current-${index}`}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`edu-current-${index}`} className="text-sm text-dark-blue">
                    Currently studying
                  </label>
                </div>
              </div>
              <Textarea
                {...register(`education.${index}.description`)}
                placeholder="Additional details about your education..."
                className="min-h-[100px]"
              />
            </div>
          ))}
          {fields.length === 0 && (
            <div className="text-center py-8 text-[#8A8A8A]">
              No education added yet. Click &quot;Add Education&quot; to get started.
            </div>
          )}
        </div>
      </div>
    );
  }

  // View Mode
  if (!education || education.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl mb-6"
      >
        Education
      </Typography>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div
            key={edu._id || index}
            className={`pb-6 ${
              index < education.length - 1
                ? "border-b border-[#E2E2E2]"
                : ""
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="size-12 bg-purple/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple" />
                </div>
              </div>
              <div className="flex-1">
                <Typography
                  variant="h3"
                  className="text-dark-blue font-semibold text-xl mb-1"
                >
                  {edu.degree}
                </Typography>
                <Typography
                  variant="body-large"
                  className="text-purple font-medium text-base mb-2"
                >
                  {edu.institution}
                </Typography>
                {edu.fieldOfStudy && (
                  <Typography
                    variant="body-small"
                    className="text-[#8A8A8A] text-sm mb-2"
                  >
                    {edu.fieldOfStudy}
                  </Typography>
                )}
                <div className="flex items-center gap-1 mb-2">
                  <Calendar className="w-4 h-4 text-[#8A8A8A]" />
                  <Typography
                    variant="body-small"
                    className="text-[#8A8A8A] text-sm"
                  >
                    {new Date(edu.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    -{" "}
                    {edu.current
                      ? "Present"
                      : edu.endDate
                      ? new Date(edu.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Present"}
                  </Typography>
                </div>
                {edu.grade && (
                  <Typography
                    variant="body-small"
                    className="text-dark-blue font-medium text-sm"
                  >
                    Grade: {edu.grade}
                  </Typography>
                )}
                {edu.description && (
                  <Typography
                    variant="body-large"
                    className="text-[#8A8A8A] text-base mt-2"
                  >
                    {edu.description}
                  </Typography>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

