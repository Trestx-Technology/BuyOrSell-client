"use client";

import React from "react";
import { Briefcase, Calendar, MapPin, Plus, Trash2 } from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WorkExperience } from "@/interfaces/job.types";
import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
import { JobseekerProfile } from "@/interfaces/job.types";

interface JobseekerExperienceProps {
  experiences?: WorkExperience[];
  form?: UseFormReturn<JobseekerProfile>;
  isEditMode?: boolean;
}

export default function JobseekerExperience({
  experiences,
  form,
  isEditMode = false,
}: JobseekerExperienceProps) {
  // Call hooks unconditionally at the top level
  const { fields, append, remove } = useFieldArray({
    control: (form?.control || {}) as Control<JobseekerProfile>,
    name: "workExperience",
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
            Work Experience
          </Typography>
          <Button
            type="button"
            onClick={() =>
              append({
                company: "",
                position: "",
                startDate: "",
                current: false,
              })
            }
            variant="outline"
            className="border-purple text-purple"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
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
                  Experience {index + 1}
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
                  {...register(`workExperience.${index}.position`)}
                  label="Position"
                  placeholder="e.g., Software Engineer"
                  isRequired
                />
                <Input
                  {...register(`workExperience.${index}.company`)}
                  label="Company"
                  placeholder="Company Name"
                  isRequired
                />
                <Input
                  {...register(`workExperience.${index}.location`)}
                  label="Location"
                  placeholder="City, Country"
                />
                <Input
                  {...register(`workExperience.${index}.startDate`)}
                  label="Start Date"
                  type="date"
                  isRequired
                />
                <Input
                  {...register(`workExperience.${index}.endDate`)}
                  label="End Date"
                  type="date"
                />
                <div className="flex items-center gap-2">
                  <input
                    {...register(`workExperience.${index}.current`)}
                    type="checkbox"
                    id={`current-${index}`}
                    className="w-4 h-4"
                  />
                  <label htmlFor={`current-${index}`} className="text-sm text-dark-blue">
                    Currently working here
                  </label>
                </div>
              </div>
              <Textarea
                {...register(`workExperience.${index}.description`)}
                placeholder="Describe your role and responsibilities..."
                className="min-h-[100px]"
              />
            </div>
          ))}
          {fields.length === 0 && (
            <div className="text-center py-8 text-[#8A8A8A]">
              No work experience added yet. Click &quot;Add Experience&quot; to get started.
            </div>
          )}
        </div>
      </div>
    );
  }

  // View Mode
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl mb-6"
      >
        Work Experience
      </Typography>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div
            key={exp._id || index}
            className={`pb-6 ${
              index < experiences.length - 1
                ? "border-b border-[#E2E2E2]"
                : ""
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="size-12 bg-purple/20 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-purple" />
                </div>
              </div>
              <div className="flex-1">
                <Typography
                  variant="h3"
                  className="text-dark-blue font-semibold text-xl mb-1"
                >
                  {exp.position}
                </Typography>
                <Typography
                  variant="body-large"
                  className="text-purple font-medium text-base mb-2"
                >
                  {exp.company}
                </Typography>
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  {exp.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#8A8A8A]" />
                      <Typography
                        variant="body-small"
                        className="text-[#8A8A8A] text-sm"
                      >
                        {exp.location}
                      </Typography>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#8A8A8A]" />
                    <Typography
                      variant="body-small"
                      className="text-[#8A8A8A] text-sm"
                    >
                      {new Date(exp.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      -{" "}
                      {exp.current
                        ? "Present"
                        : exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "Present"}
                    </Typography>
                  </div>
                </div>
                {exp.description && (
                  <Typography
                    variant="body-large"
                    className="text-[#8A8A8A] text-base mb-3"
                  >
                    {exp.description}
                  </Typography>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div>
                    <Typography
                      variant="body-small"
                      className="text-dark-blue font-medium text-sm mb-2"
                    >
                      Key Achievements:
                    </Typography>
                    <ul className="list-disc list-inside space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="text-[#8A8A8A] text-sm"
                        >
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

