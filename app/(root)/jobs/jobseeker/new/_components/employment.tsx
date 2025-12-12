"use client";

import React from "react";
import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { JobseekerProfile, WorkExperience } from "@/interfaces/job.types";
import { Plus, Trash2 } from "lucide-react";

interface EmploymentProps {
  form: UseFormReturn<JobseekerProfile>;
}

export default function Employment({ form }: EmploymentProps) {
  const { register, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control as Control<JobseekerProfile>,
    name: "workExperience",
  });

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <Typography
          variant="h2"
          className="text-dark-blue font-bold text-2xl"
        >
          Employment
        </Typography>
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
            })
          }
        >
          Add Employment
        </Button>
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
                <Typography variant="body-large" className="text-dark-blue font-semibold">
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
                <Input
                  {...register(`workExperience.${index}.position`)}
                  label="Position"
                  placeholder="e.g., Software Engineer"
                />
                <Input
                  {...register(`workExperience.${index}.company`)}
                  label="Company"
                  placeholder="Company Name"
                />
                <Input
                  {...register(`workExperience.${index}.location`)}
                  label="Location"
                  placeholder="City, Country"
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-blue">Start Date</label>
                  <Input
                    {...register(`workExperience.${index}.startDate`)}
                    type="date"
                  />
                </div>
                {!isCurrent && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-dark-blue">End Date</label>
                    <Input
                      {...register(`workExperience.${index}.endDate`)}
                      type="date"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  {...register(`workExperience.${index}.current`)}
                  type="checkbox"
                  id={`current-${index}`}
                  className="w-4 h-4 rounded border-gray-300 text-purple focus:ring-purple"
                />
                <label htmlFor={`current-${index}`} className="text-sm text-dark-blue cursor-pointer">
                  Currently working here
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-blue">Description</label>
                <Textarea
                  {...register(`workExperience.${index}.description`)}
                  placeholder="Describe your role and responsibilities..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          );
        })}

        {fields.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <Typography variant="body-small" className="text-grey-blue">
              No employment history added yet. Click &quot;Add Employment&quot; to get started.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

