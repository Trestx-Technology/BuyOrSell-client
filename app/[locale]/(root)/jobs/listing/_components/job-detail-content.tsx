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
    const field = extraFields.find((f) =>
      f.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (field) {
      if (Array.isArray(field.value)) {
        return field.value.join(", ");
      }
      return String(field.value || "");
    }
    return "";
  };

  const getFieldValueArray = (fieldName: string): string[] => {
    const field = extraFields.find((f) =>
      f.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (field) {
      if (Array.isArray(field.value)) {
        return field.value.map((v: unknown) => String(v)).filter(Boolean);
      }
      const strValue = String(field.value || "");
      if (strValue) {
        return strValue
          .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    return [];
  };

  // Get description (from job.description or extraFields)
  const description = job.description || getFieldValue("description") || "";

  // Get responsibilities (can be string or array)
  const responsibilitiesList =
    getFieldValueArray("responsibilities").length > 0
      ? getFieldValueArray("responsibilities")
      : getFieldValue("responsibilities")
      ? getFieldValue("responsibilities")
          .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  // Get skills/requirements
  const skillsList =
    getFieldValueArray("skills").length > 0
      ? getFieldValueArray("skills")
      : getFieldValueArray("required skills").length > 0
      ? getFieldValueArray("required skills")
      : getFieldValue("skills")
      ? getFieldValue("skills")
            .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : getFieldValue("required skills")
      ? getFieldValue("required skills")
              .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  // Get qualifications/requirements
  const qualificationsList =
    getFieldValueArray("qualifications").length > 0
      ? getFieldValueArray("qualifications")
      : getFieldValueArray("requirements").length > 0
      ? getFieldValueArray("requirements")
      : getFieldValue("qualifications")
      ? getFieldValue("qualifications")
            .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : getFieldValue("requirements")
      ? getFieldValue("requirements")
              .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  // Get benefits
  const benefitsList =
    getFieldValueArray("benefits").length > 0
      ? getFieldValueArray("benefits")
      : getFieldValue("benefits")
      ? getFieldValue("benefits")
          .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  // Get additional information
  const additionalInfo =
    getFieldValue("additional information") ||
    getFieldValue("additional info") ||
    getFieldValue("notes") ||
    "";

  const hasOverview = job.noticePeriod || job.careerLevel || job.experience || job.qualification || job.gender || job.nationality || job.jobMode || job.jobShift;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6 w-full shadow-sm">
      {/* Job Overview */}
      {hasOverview && (
        <div className="space-y-4">
          <Typography variant="h3" className="text-foreground dark:text-white font-semibold text-xl">
            Job Overview
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
            {job.experience && (
              <div className="flex flex-col gap-1">
                <Typography variant="body-small" className="text-[#8A8A8A] text-xs uppercase font-bold tracking-wider">
                  Experience
                </Typography>
                <Typography variant="body-small" className="text-foreground dark:text-gray-300 text-sm font-medium">
                  {job.experience}
                </Typography>
              </div>
            )}
            {job.careerLevel && (
              <div className="flex flex-col gap-1">
                <Typography variant="body-small" className="text-[#8A8A8A] text-xs uppercase font-bold tracking-wider">
                  Career Level
                </Typography>
                <Typography variant="body-small" className="text-foreground dark:text-gray-300 text-sm font-medium">
                  {job.careerLevel}
                </Typography>
              </div>
            )}
            {job.qualification && (
              <div className="flex flex-col gap-1">
                <Typography variant="body-small" className="text-[#8A8A8A] text-xs uppercase font-bold tracking-wider">
                  Qualification
                </Typography>
                <Typography variant="body-small" className="text-foreground dark:text-gray-300 text-sm font-medium">
                  {job.qualification}
                </Typography>
              </div>
            )}
            {job.noticePeriod && (
              <div className="flex flex-col gap-1">
                <Typography variant="body-small" className="text-[#8A8A8A] text-xs uppercase font-bold tracking-wider">
                  Notice Period
                </Typography>
                <Typography variant="body-small" className="text-foreground dark:text-gray-300 text-sm font-medium">
                  {job.noticePeriod}
                </Typography>
              </div>
            )}
            {job.gender && (
              <div className="flex flex-col gap-1">
                <Typography variant="body-small" className="text-[#8A8A8A] text-xs uppercase font-bold tracking-wider">
                  Gender
                </Typography>
                <Typography variant="body-small" className="text-foreground dark:text-gray-300 text-sm font-medium">
                  {job.gender.charAt(0).toUpperCase() + job.gender.slice(1)}
                </Typography>
              </div>
            )}
            {job.nationality && (
              <div className="flex flex-col gap-1">
                <Typography variant="body-small" className="text-[#8A8A8A] text-xs uppercase font-bold tracking-wider">
                  Nationality
                </Typography>
                <Typography variant="body-small" className="text-foreground dark:text-gray-300 text-sm font-medium">
                  {job.nationality}
                </Typography>
              </div>
            )}
            {job.jobMode && (
              <div className="flex flex-col gap-1">
                <Typography variant="body-small" className="text-[#8A8A8A] text-xs uppercase font-bold tracking-wider">
                  Job Mode
                </Typography>
                <Typography variant="body-small" className="text-foreground dark:text-gray-300 text-sm font-medium">
                  {job.jobMode}
                </Typography>
              </div>
            )}
            {job.jobShift && (
              <div className="flex flex-col gap-1">
                <Typography variant="body-small" className="text-[#8A8A8A] text-xs uppercase font-bold tracking-wider">
                  Job Shift
                </Typography>
                <Typography variant="body-small" className="text-foreground dark:text-gray-300 text-sm font-medium">
                  {job.jobShift}
                </Typography>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Job Description */}
      {description && (
        <div className="space-y-4">
          <Typography variant="h3" className="text-foreground dark:text-white font-semibold text-xl">
            Job Description
          </Typography>
          <Typography
            variant="sm-regular-inter"
            className="text-muted-foreground dark:text-gray-400 text-sm leading-[1.75] whitespace-pre-line"
          >
            {description}
          </Typography>
        </div>
      )}

      {/* Key Responsibilities */}
      {responsibilitiesList.length > 0 && (
        <div className="space-y-4">
          <Typography variant="h3" className="text-foreground font-semibold text-xl">
            Key Responsibilities
          </Typography>
          <div className="space-y-3">
            {responsibilitiesList.map((responsibility, index) => (
              <div key={index} className="flex items-start gap-[10.67px]">
                <Check
                  className="w-[21.33px] h-[21.33px] text-purple flex-shrink-0 mt-0.5"
                  strokeWidth={1.78}
                />
                <Typography
                  variant="body-small"
                  className="text-muted-foreground dark:text-gray-400 text-sm leading-[1.5]"
                >
                  {responsibility}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Qualifications/Requirements */}
      {qualificationsList.length > 0 && (
        <div className="space-y-4">
          <Typography variant="h3" className="text-foreground font-semibold text-xl">
            Qualifications & Requirements
          </Typography>
          <div className="space-y-3">
            {qualificationsList.map((qualification, index) => (
              <div key={index} className="flex items-start gap-[10.67px]">
                <Check
                  className="w-[21.33px] h-[21.33px] text-purple flex-shrink-0 mt-0.5"
                  strokeWidth={1.78}
                />
                <Typography
                  variant="body-small"
                  className="text-muted-foreground text-sm leading-[1.5]"
                >
                  {qualification}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Skills */}
      {skillsList.length > 0 && (
        <div className="space-y-4">
          <Typography variant="h3" className="text-foreground font-semibold text-xl">
            Professional Skills
          </Typography>
          <div className="space-y-3">
            {skillsList.map((skill, index) => (
              <div key={index} className="flex items-start gap-[10.67px]">
                <Check
                  className="w-[21.33px] h-[21.33px] text-purple flex-shrink-0 mt-0.5"
                  strokeWidth={1.78}
                />
                <Typography
                  variant="body-small"
                  className="text-muted-foreground text-sm leading-[1.5]"
                >
                  {skill}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {benefitsList.length > 0 && (
        <div className="space-y-4">
          <Typography variant="h3" className="text-foreground font-semibold text-xl">
            Benefits
          </Typography>
          <div className="space-y-3">
            {benefitsList.map((benefit, index) => (
              <div key={index} className="flex items-start gap-[10.67px]">
                <Check
                  className="w-[21.33px] h-[21.33px] text-purple flex-shrink-0 mt-0.5"
                  strokeWidth={1.78}
                />
                <Typography
                  variant="body-small"
                  className="text-muted-foreground text-sm leading-[1.5]"
                >
                  {benefit}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      {additionalInfo && (
        <div className="space-y-4">
          <Typography variant="h3" className="text-foreground font-semibold text-xl">
            Additional Information
          </Typography>
          <Typography
            variant="body-small"
            className="text-muted-foreground text-sm leading-[1.75] whitespace-pre-line"
          >
            {additionalInfo}
          </Typography>
        </div>
      )}
    </div>
  );
}
