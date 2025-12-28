"use client";

import React from "react";
import { Check } from "lucide-react";
import { Typography } from "@/components/typography";
import { AD } from "@/interfaces/ad";

interface JobDetailContentProps {
  job: AD;
}

export default function JobDetailContent({ job }: JobDetailContentProps) {
  // Extract job description, responsibilities, and skills from extraFields
  const extraFields = Array.isArray(job.extraFields)
    ? job.extraFields
    : Object.entries(job.extraFields || {}).map(([name, value]) => ({
        name,
        value,
      }));

  const getFieldValue = (fieldName: string): string => {
    const field = extraFields.find(
      (f) => f.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (field) {
      if (Array.isArray(field.value)) {
        return field.value.join(", ");
      }
      return String(field.value || "");
    }
    return "";
  };

  const description = job.description || getFieldValue("description") || "";
  const responsibilities = getFieldValue("responsibilities") || "";
  const skills = getFieldValue("skills") || getFieldValue("required skills") || "";

  // Parse responsibilities and skills into arrays
  const responsibilitiesList = responsibilities
    ? responsibilities.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : [];
  const skillsList = skills
    ? skills.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="bg-white rounded-2xl border border-[#E2E2E2] p-4 space-y-6">
      {/* Job Description */}
      {description && (
        <div className="space-y-4">
          <Typography
            variant="h3"
            className="text-black font-semibold text-xl"
          >
            Job Description
          </Typography>
          <Typography
            variant="body-small"
            className="text-dark-blue text-[12.22px] leading-[1.75]"
          >
            {description}
          </Typography>
        </div>
      )}

      {/* Key Responsibilities */}
      {responsibilitiesList.length > 0 && (
        <div className="space-y-4">
          <Typography
            variant="h3"
            className="text-black font-semibold text-xl"
          >
            Key Responsibilities
          </Typography>
          <div className="space-y-3">
            {responsibilitiesList.map((responsibility, index) => (
              <div key={index} className="flex items-start gap-[10.67px]">
                <Check className="w-[21.33px] h-[21.33px] text-purple flex-shrink-0 mt-0.5" strokeWidth={1.78} />
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-[14.22px] leading-[1.5]"
                >
                  {responsibility}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Skills */}
      {skillsList.length > 0 && (
        <div className="space-y-4">
          <Typography
            variant="h3"
            className="text-black font-semibold text-xl"
          >
            Professional Skills
          </Typography>
          <div className="space-y-3">
            {skillsList.map((skill, index) => (
              <div key={index} className="flex items-start gap-[10.67px]">
                <Check className="w-[21.33px] h-[21.33px] text-purple flex-shrink-0 mt-0.5" strokeWidth={1.78} />
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-[14.22px] leading-[1.5]"
                >
                  {skill}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

