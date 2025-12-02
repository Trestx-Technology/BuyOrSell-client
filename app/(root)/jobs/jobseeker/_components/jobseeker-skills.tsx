"use client";

import React from "react";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChipsInput } from "@/components/ui/chips-input";
import { Skill, Certification } from "@/interfaces/job.types";
import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
import { JobseekerProfile } from "@/interfaces/job.types";
import { Plus, Trash2 } from "lucide-react";

interface JobseekerSkillsProps {
  skills?: Skill[];
  certifications?: Certification[];
  form?: UseFormReturn<JobseekerProfile>;
  isEditMode?: boolean;
}

export default function JobseekerSkills({
  skills,
  certifications,
  form,
  isEditMode = false,
}: JobseekerSkillsProps) {
  // Call hooks unconditionally at the top level
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control: (form?.control || {}) as Control<JobseekerProfile>,
    name: "skills",
  });
  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({
    control: (form?.control || {}) as Control<JobseekerProfile>,
    name: "certifications",
  });

  if (isEditMode && form) {
    const { register, watch, setValue } = form;

    return (
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
        {/* Skills Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Typography
              variant="h2"
              className="text-dark-blue font-bold text-2xl"
            >
              Skills
            </Typography>
            <Button
              type="button"
              onClick={() =>
                appendSkill({
                  name: "",
                  level: "intermediate",
                })
              }
              variant="outline"
              className="border-purple text-purple"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </div>

          <div className="space-y-4">
            {skillFields.map((field, index) => (
              <div
                key={field.id}
                className="border border-[#E2E2E2] rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Typography variant="h3" className="text-dark-blue font-semibold">
                    Skill {index + 1}
                  </Typography>
                  <Button
                    type="button"
                    onClick={() => removeSkill(index)}
                    variant="ghost"
                    size="sm"
                    className="text-error-100 hover:text-error-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    {...register(`skills.${index}.name`)}
                    label="Skill Name"
                    placeholder="e.g., JavaScript"
                    isRequired
                  />
                  <div>
                    <label className="text-sm font-medium text-dark-blue mb-2 block">
                      Level
                    </label>
                    <select
                      {...register(`skills.${index}.level`)}
                      className="w-full rounded-lg border border-grey-blue/30 px-3 py-2 text-sm"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <Input
                    {...register(`skills.${index}.yearsOfExperience`, {
                      valueAsNumber: true,
                    })}
                    label="Years of Experience"
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
            {skillFields.length === 0 && (
              <div className="text-center py-4 text-[#8A8A8A]">
                No skills added yet. Click &quot;Add Skill&quot; to get started.
              </div>
            )}
          </div>
        </div>

        {/* Certifications Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Typography
              variant="h2"
              className="text-dark-blue font-bold text-2xl"
            >
              Certifications
            </Typography>
            <Button
              type="button"
              onClick={() =>
                appendCert({
                  name: "",
                  issuingOrganization: "",
                  issueDate: "",
                })
              }
              variant="outline"
              className="border-purple text-purple"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Certification
            </Button>
          </div>

          <div className="space-y-4">
            {certFields.map((field, index) => (
              <div
                key={field.id}
                className="border border-[#E2E2E2] rounded-lg p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <Typography variant="h3" className="text-dark-blue font-semibold">
                    Certification {index + 1}
                  </Typography>
                  <Button
                    type="button"
                    onClick={() => removeCert(index)}
                    variant="ghost"
                    size="sm"
                    className="text-error-100 hover:text-error-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    {...register(`certifications.${index}.name`)}
                    label="Certification Name"
                    placeholder="e.g., AWS Certified Solutions Architect"
                    isRequired
                  />
                  <Input
                    {...register(`certifications.${index}.issuingOrganization`)}
                    label="Issuing Organization"
                    placeholder="e.g., Amazon Web Services"
                    isRequired
                  />
                  <Input
                    {...register(`certifications.${index}.issueDate`)}
                    label="Issue Date"
                    type="date"
                    isRequired
                  />
                  <Input
                    {...register(`certifications.${index}.expiryDate`)}
                    label="Expiry Date"
                    type="date"
                  />
                  <Input
                    {...register(`certifications.${index}.credentialId`)}
                    label="Credential ID"
                    placeholder="Optional"
                  />
                  <Input
                    {...register(`certifications.${index}.credentialUrl`)}
                    label="Credential URL"
                    type="url"
                    placeholder="https://..."
                  />
                </div>
              </div>
            ))}
            {certFields.length === 0 && (
              <div className="text-center py-4 text-[#8A8A8A]">
                No certifications added yet. Click &quot;Add Certification&quot; to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // View Mode
  const hasSkills = skills && skills.length > 0;
  const hasCertifications = certifications && certifications.length > 0;

  if (!hasSkills && !hasCertifications) {
    return null;
  }

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
      {/* Skills Section */}
      {hasSkills && (
        <div className="mb-8">
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl mb-4"
          >
            Skills
          </Typography>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <Badge
                key={skill._id || index}
                className="bg-[#F5EBFF] text-purple px-4 py-2 rounded-full text-sm font-medium"
              >
                {skill.name}
                {skill.level && (
                  <span className="ml-2 text-xs text-purple/70">
                    ({skill.level})
                  </span>
                )}
                {skill.yearsOfExperience && (
                  <span className="ml-2 text-xs text-purple/70">
                    {skill.yearsOfExperience}yr
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {hasCertifications && (
        <div>
          <Typography
            variant="h2"
            className="text-dark-blue font-bold text-2xl mb-4"
          >
            Certifications
          </Typography>
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div
                key={cert._id || index}
                className="border border-[#E2E2E2] rounded-lg p-4"
              >
                <Typography
                  variant="h3"
                  className="text-dark-blue font-semibold text-lg mb-1"
                >
                  {cert.name}
                </Typography>
                <Typography
                  variant="body-small"
                  className="text-purple text-sm mb-2"
                >
                  {cert.issuingOrganization}
                </Typography>
                <div className="flex flex-wrap items-center gap-4 text-sm text-[#8A8A8A]">
                  <span>
                    Issued:{" "}
                    {new Date(cert.issueDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {cert.expiryDate && (
                    <span>
                      Expires:{" "}
                      {new Date(cert.expiryDate).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {cert.credentialId && <span>ID: {cert.credentialId}</span>}
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple hover:underline text-sm mt-2 inline-block"
                  >
                    View Credential
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

