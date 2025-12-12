"use client";

import React from "react";
import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChipsInput } from "@/components/ui/chips-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NaturalLanguageCalendar } from "@/components/ui/natural-language-calendar";
import { JobseekerProfile } from "@/interfaces/job.types";
import { Plus, Trash2 } from "lucide-react";

interface ProjectsProps {
  form: UseFormReturn<JobseekerProfile>;
}

export default function Projects({ form }: ProjectsProps) {
  const { register, watch, setValue } = form;
  
  const { fields, append, remove } = useFieldArray({
    control: form.control as Control<JobseekerProfile>,
    name: "portfolio",
  });


  return (
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
        </div>
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => {
          const techStack = watch(`portfolio.${index}.techStack`) || [];
          return (
            <div
              key={field.id}
              className="border border-[#E2E2E2] rounded-lg p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <Typography variant="body-large" className="text-dark-blue font-semibold">
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
                <Input
                  {...register(`portfolio.${index}.name`)}
                  label="Project Name"
                  placeholder="e.g., E-commerce Platform Revamp"
                />
                <Input
                  {...register(`portfolio.${index}.role`)}
                  label="Your Role"
                  placeholder="e.g., Backend Lead"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-blue">Description</label>
                <Textarea
                  {...register(`portfolio.${index}.description`)}
                  placeholder="Describe your project..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NaturalLanguageCalendar
                  label="Start Date"
                  value={watch(`portfolio.${index}.startDate`) || ""}
                  onChange={(value) =>
                    setValue(`portfolio.${index}.startDate`, value)
                  }
                  placeholder="e.g., February 2022"
                />
                <NaturalLanguageCalendar
                  label="End Date"
                  value={watch(`portfolio.${index}.endDate`) || ""}
                  onChange={(value) =>
                    setValue(`portfolio.${index}.endDate`, value)
                  }
                  placeholder="e.g., August 2023"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  {...register(`portfolio.${index}.url`)}
                  label="Project URL"
                  type="url"
                  placeholder="https://github.com/..."
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-blue">Project Type</label>
                  <Select
                    value={watch(`portfolio.${index}.projectType`) || ""}
                    onValueChange={(value) =>
                      setValue(`portfolio.${index}.projectType`, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                      <SelectItem value="open-source">Open Source</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-blue">Tech Stack</label>
                  <ChipsInput
                    value={techStack}
                    onChange={(value) =>
                      setValue(`portfolio.${index}.techStack`, value)
                    }
                    placeholder="Add technologies (press Enter or comma)"
                  />
                </div>
                <Input
                  {...register(`portfolio.${index}.teamSize`, { valueAsNumber: true })}
                  label="Team Size"
                  type="number"
                  placeholder="e.g., 6"
                  min="1"
                />
              </div>
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
  );
}

