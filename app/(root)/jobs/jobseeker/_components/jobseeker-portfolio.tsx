"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink, Calendar, Plus, Trash2 } from "lucide-react";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChipsInput } from "@/components/ui/chips-input";
import { PortfolioItem } from "@/interfaces/job.types";
import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
import { JobseekerProfile } from "@/interfaces/job.types";

interface JobseekerPortfolioProps {
  portfolio?: PortfolioItem[];
  form?: UseFormReturn<JobseekerProfile>;
  isEditMode?: boolean;
}

export default function JobseekerPortfolio({
  portfolio,
  form,
  isEditMode = false,
}: JobseekerPortfolioProps) {
  // Call hooks unconditionally at the top level
  const { fields, append, remove } = useFieldArray({
    control: (form?.control || {}) as Control<JobseekerProfile>,
    name: "portfolio",
  });

  if (isEditMode && form) {
    const { register, watch, setValue } = form;

    return (
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl"
          >
            Portfolio
          </Typography>
          <Button
            type="button"
            onClick={() =>
              append({
                title: "",
                description: "",
                technologies: [],
              })
            }
            variant="outline"
            className="border-purple text-purple"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Portfolio Item
          </Button>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => {
            const technologies = watch(`portfolio.${index}.technologies`) || [];
            return (
              <div
                key={field.id}
                className="border border-[#E2E2E2] rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Typography variant="h3" className="text-dark-blue font-semibold">
                    Portfolio Item {index + 1}
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

                <Input
                  {...register(`portfolio.${index}.title`)}
                  label="Project Title"
                  placeholder="e.g., E-commerce Website"
                  isRequired
                />
                <div>
                  <label className="text-sm font-medium text-dark-blue mb-2 block">
                    Description
                  </label>
                  <Textarea
                    {...register(`portfolio.${index}.description`)}
                    placeholder="Describe your project..."
                    className="min-h-[100px]"
                  />
                </div>
                <Input
                  {...register(`portfolio.${index}.imageUrl`)}
                  label="Image URL"
                  type="url"
                  placeholder="https://..."
                />
                <div>
                  <label className="text-sm font-medium text-dark-blue mb-2 block">
                    Technologies
                  </label>
                  <ChipsInput
                    value={technologies}
                    onChange={(value) =>
                      setValue(`portfolio.${index}.technologies`, value)
                    }
                    placeholder="Add technologies (press Enter or comma)"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    {...register(`portfolio.${index}.startDate`)}
                    label="Start Date"
                    type="date"
                  />
                  <Input
                    {...register(`portfolio.${index}.endDate`)}
                    label="End Date"
                    type="date"
                  />
                </div>
                <Input
                  {...register(`portfolio.${index}.projectUrl`)}
                  label="Project URL"
                  type="url"
                  placeholder="https://..."
                />
              </div>
            );
          })}
          {fields.length === 0 && (
            <div className="text-center py-8 text-[#8A8A8A]">
              No portfolio items added yet. Click &quot;Add Portfolio Item&quot; to get started.
            </div>
          )}
        </div>
      </div>
    );
  }

  // View Mode
  if (!portfolio || portfolio.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl mb-6"
      >
        Portfolio
      </Typography>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolio.map((item, index) => (
          <div
            key={item._id || index}
            className="border border-[#E2E2E2] rounded-lg overflow-hidden hover:shadow-lg transition-all"
          >
            {item.imageUrl && (
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <Typography
                variant="h3"
                className="text-dark-blue font-semibold text-lg mb-2"
              >
                {item.title}
              </Typography>
              {item.description && (
                <Typography
                  variant="body-large"
                  className="text-[#8A8A8A] text-sm mb-3 line-clamp-2"
                >
                  {item.description}
                </Typography>
              )}
              {item.technologies && item.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.technologies.map((tech, i) => (
                    <Badge
                      key={i}
                      className="bg-purple/20 text-purple px-2 py-1 rounded-full text-xs"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                {(item.startDate || item.endDate) && (
                  <div className="flex items-center gap-1 text-sm text-[#8A8A8A]">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {item.startDate &&
                        new Date(item.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      {item.endDate &&
                        ` - ${new Date(item.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}`}
                    </span>
                  </div>
                )}
                {item.projectUrl && (
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple hover:underline text-sm flex items-center gap-1"
                  >
                    View Project
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

