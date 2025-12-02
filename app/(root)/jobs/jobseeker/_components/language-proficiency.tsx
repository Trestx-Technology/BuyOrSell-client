"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
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

interface Language {
  id: string;
  language: string;
  proficiency: string;
  skills: {
    read: boolean;
    write: boolean;
    speak: boolean;
  };
}

interface LanguageProficiencyProps {
  form: UseFormReturn<JobseekerProfile>;
}

export default function LanguageProficiency({ form }: LanguageProficiencyProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
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
    "Russian",
    "Italian",
    "Korean",
    "Turkish",
    "Other",
  ];

  const proficiencyOptions = [
    "Native",
    "Fluent",
    "Professional",
    "Intermediate",
    "Basic",
    "Elementary",
  ];

  const handleAddLanguage = () => {
    if (currentLanguage && currentProficiency) {
      const newLanguage: Language = {
        id: Date.now().toString(),
        language: currentLanguage,
        proficiency: currentProficiency,
        skills: { ...currentSkills },
      };
      setLanguages([...languages, newLanguage]);
      // Reset form
      setCurrentLanguage("");
      setCurrentProficiency("");
      setCurrentSkills({ read: false, write: false, speak: false });
    }
  };

  const handleRemoveLanguage = (id: string) => {
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const handleSkillToggle = (skill: "read" | "write" | "speak") => {
    setCurrentSkills({
      ...currentSkills,
      [skill]: !currentSkills[skill],
    });
  };

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl mb-6"
      >
        Language proficiency
      </Typography>

      {/* Language and Proficiency Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">Language</label>
          <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang} value={lang.toLowerCase()}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Proficiency Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">Proficiency</label>
          <Select value={currentProficiency} onValueChange={setCurrentProficiency}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Proficiency" />
            </SelectTrigger>
            <SelectContent>
              {proficiencyOptions.map((prof) => (
                <SelectItem key={prof} value={prof.toLowerCase()}>
                  {prof}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Skills Checkboxes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-dark-blue">Skills</label>
        <div className="flex gap-6">
          {(["read", "write", "speak"] as const).map((skill) => (
            <div key={skill} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={skill}
                checked={currentSkills[skill]}
                onChange={() => handleSkillToggle(skill)}
                className="w-4 h-4 rounded border-grey-blue/30 text-purple focus:ring-purple focus:ring-2 focus:ring-offset-0 cursor-pointer"
              />
              <label
                htmlFor={skill}
                className="text-sm text-dark-blue cursor-pointer capitalize"
              >
                {skill}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Add Language Link */}
      <button
        type="button"
        onClick={handleAddLanguage}
        disabled={!currentLanguage || !currentProficiency}
        className={cn(
          "text-purple hover:text-purple/80 text-sm font-medium transition-colors",
          (!currentLanguage || !currentProficiency) && "opacity-50 cursor-not-allowed"
        )}
      >
        + Add Language
      </button>

      {/* Added Languages List */}
      {languages.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#E2E2E2]">
          <Typography variant="body-small" className="text-dark-blue font-medium">
            Added Languages
          </Typography>
          {languages.map((lang) => (
            <div
              key={lang.id}
              className="flex items-start justify-between p-4 bg-[#F2F4F7] rounded-lg"
            >
              <div className="flex-1">
                <Typography variant="body-small" className="text-dark-blue font-semibold mb-1">
                  {lang.language}
                </Typography>
                <Typography variant="caption" className="text-grey-blue mb-2">
                  Proficiency: {lang.proficiency}
                </Typography>
                <div className="flex gap-4 mt-2">
                  {lang.skills.read && (
                    <span className="text-xs px-2 py-1 bg-purple/10 text-purple rounded">
                      Read
                    </span>
                  )}
                  {lang.skills.write && (
                    <span className="text-xs px-2 py-1 bg-purple/10 text-purple rounded">
                      Write
                    </span>
                  )}
                  {lang.skills.speak && (
                    <span className="text-xs px-2 py-1 bg-purple/10 text-purple rounded">
                      Speak
                    </span>
                  )}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<X className="w-4 h-4" />}
                iconPosition="center"
                className="h-8 w-8 p-0 text-grey-blue hover:text-error-100"
                onClick={() => handleRemoveLanguage(lang.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

