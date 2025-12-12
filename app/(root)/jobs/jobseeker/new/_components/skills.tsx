"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Typography } from "@/components/typography";
import { ChipsInput } from "@/components/ui/chips-input";
import { JobseekerProfile } from "@/interfaces/job.types";
import { useSearchSkills } from "@/hooks/useSkills";

interface SkillsProps {
  form: UseFormReturn<JobseekerProfile>;
}

export default function Skills({ form }: SkillsProps) {
  const { watch, setValue } = form;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search input for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search skills from API
  const { data: skillsResponse, isLoading: isSearching } = useSearchSkills({
    q: debouncedSearch.trim() || undefined,
    limit: 20,
  });

  // Get current skills as array of strings
  const watchedSkills = watch("skills");
  const currentSkills = useMemo(() => (watchedSkills || []) as Array<string | { name?: string }>, [watchedSkills]);
  const currentSkillNames = useMemo(() => {
    // Handle both string array and Skill object array
    const names: string[] = [];
    currentSkills.forEach((skill) => {
      if (typeof skill === "string") {
        names.push(skill.toLowerCase());
      } else {
        const skillName = skill?.name;
        if (skillName && typeof skillName === "string") {
          names.push(skillName.toLowerCase());
        }
      }
    });
    return names;
  }, [currentSkills]);

  // Get available skills from API (filter out already added)
  const availableSkills = useMemo(() => {
    if (!skillsResponse?.data?.items) return [];
    return skillsResponse.data.items
      .map((skill: { name: string }) => skill.name)
      .filter((name: string) => !currentSkillNames.includes(name.toLowerCase()));
  }, [skillsResponse, currentSkillNames]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle skill change from ChipsInput
  const handleSkillsChange = (skills: string[]) => {
    // JobseekerProfile.skills can be string[] or Skill[], we'll use string[]
    setValue("skills", skills as unknown as JobseekerProfile["skills"]);
  };

  // Get skills as string array
  const skillsAsStrings = useMemo(() => {
    return currentSkills.map((skill) => {
      if (typeof skill === "string") return skill;
      return (skill as { name?: string })?.name || "";
    }).filter(Boolean);
  }, [currentSkills]);

  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
      <Typography
        variant="h2"
        className="text-dark-blue font-bold text-2xl"
      >
        Skills
      </Typography>

      {/* Skills Chips Input with API Search Suggestions */}
      <div className="relative space-y-2">
        {/* Search Input for API Suggestions */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(e.target.value.length > 0);
            }}
            placeholder="Search skills from API..."
            className="w-full px-3 py-2 border border-[#E2E2E2] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent"
          />
          
          {/* Dropdown with API search results */}
          {isDropdownOpen && searchQuery.trim() && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-[#E2E2E2] rounded-lg shadow-lg max-h-[300px] overflow-y-auto"
            >
              {isSearching && (
                <div className="p-4 text-sm text-grey-blue text-center">
                  Searching...
                </div>
              )}
              {!isSearching && availableSkills.length > 0 && (
                <div className="py-2">
                  {availableSkills.map((skillName: string) => (
                    <button
                      key={skillName}
                      type="button"
                      onClick={() => {
                        const newSkills = [...skillsAsStrings, skillName];
                        handleSkillsChange(newSkills);
                        setSearchQuery("");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple/10 transition-colors"
                    >
                      <span className="text-sm text-dark-blue">{skillName}</span>
                    </button>
                  ))}
                </div>
              )}
              {!isSearching &&
                availableSkills.length === 0 &&
                debouncedSearch.trim() && (
                  <div className="p-4 text-sm text-grey-blue text-center">
                    No skills found. Add it manually below.
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Chips Input for managing skills */}
        <ChipsInput
          value={skillsAsStrings}
          onChange={handleSkillsChange}
          placeholder="Type to add custom skills (press Enter or comma)"
        />
      </div>

      {skillsAsStrings.length === 0 && (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
          <Typography variant="body-small" className="text-grey-blue">
            No skills added yet. Type to search and add skills above.
          </Typography>
        </div>
      )}
    </div>
  );
}

