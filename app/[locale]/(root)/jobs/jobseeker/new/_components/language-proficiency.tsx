"use client";

import React, { useState } from "react";
import { UseFormReturn, useFieldArray, Control } from "react-hook-form";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobseekerProfile } from "@/interfaces/job.types";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageProficiencyProps {
  form: UseFormReturn<JobseekerProfile>;
}

export default function LanguageProficiency({ form }: LanguageProficiencyProps) {
  const { watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control as Control<JobseekerProfile>,
    name: "languages",
  });

  const [currentLanguage, setCurrentLanguage] = useState<string>("");
  const [currentProficiency, setCurrentProficiency] = useState<string>("");
  const [currentSkills, setCurrentSkills] = useState({
    read: false,
    write: false,
    speak: false,
  });

  const languageOptions = [
    "English",
    "Arabic",
    "Hindi",
    "Urdu",
    "French",
    "Spanish",
    "German",
    "Chinese",
    "Japanese",
    "Portuguese",
    "Italian",
    "Russian",
  ];

  const proficiencyLevels = [
    { value: "basic", label: "Basic" },
    { value: "conversational", label: "Conversational" },
    { value: "fluent", label: "Fluent" },
    { value: "native", label: "Native" },
  ];

  const handleAddLanguage = () => {
    if (currentLanguage && currentProficiency) {
      append({
        name: currentLanguage,
        proficiency: currentProficiency,
        read: currentSkills.read,
        write: currentSkills.write,
        speak: currentSkills.speak,
      });
      setCurrentLanguage("");
      setCurrentProficiency("");
      setCurrentSkills({ read: false, write: false, speak: false });
    }
  };

  const toggleSkill = (skill: "read" | "write" | "speak") => {
    setCurrentSkills((prev) => ({
      ...prev,
      [skill]: !prev[skill],
    }));
  };

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl"
      >
        Language Proficiency
      </Typography>

      {/* Add Language Form */}
      <div className="border border-[#E2E2E2] rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-blue">Language</label>
            <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dark-blue">Proficiency Level</label>
            <Select value={currentProficiency} onValueChange={setCurrentProficiency}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select proficiency" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">Skills</label>
          <div className="flex flex-wrap gap-4">
            {(["read", "write", "speak"] as const).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                  currentSkills[skill]
                    ? "bg-purple text-white"
                    : "bg-[#F2F4F7] text-dark-blue hover:bg-grey-blue/20 border border-transparent"
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handleAddLanguage}
          icon={<Plus className="w-4 h-4" />}
          iconPosition="left"
          disabled={!currentLanguage || !currentProficiency}
        >
          Add Language
        </Button>
      </div>

      {/* Languages List */}
      <div className="space-y-4">
        {fields.map((field, index) => {
          const lang = watch(`languages.${index}`);
          return (
            <div
              key={field.id}
              className="border border-[#E2E2E2] rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <Typography variant="body-large" className="text-dark-blue font-semibold mb-1">
                  {lang?.name || ""}
                </Typography>
                <Typography variant="body-small" className="text-grey-blue mb-2">
                  {proficiencyLevels.find((l) => l.value === lang?.proficiency)?.label}
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {lang?.read && (
                    <span className="px-2 py-1 bg-purple/20 text-purple rounded text-xs">
                      Read
                    </span>
                  )}
                  {lang?.write && (
                    <span className="px-2 py-1 bg-purple/20 text-purple rounded text-xs">
                      Write
                    </span>
                  )}
                  {lang?.speak && (
                    <span className="px-2 py-1 bg-purple/20 text-purple rounded text-xs">
                      Speak
                    </span>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-error-100 hover:text-error-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          );
        })}

        {fields.length === 0 && (
          <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
            <Typography variant="body-small" className="text-grey-blue">
              No languages added yet. Add your language proficiency above.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

