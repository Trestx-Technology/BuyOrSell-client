"use client";

import { useMemo } from "react";
import { ChipsInput, type ChipOption } from "@/components/ui/chips-input";
import { useGetAllSkills } from "@/hooks/useSkills";
import type { Skill } from "@/interfaces/skills.types";

interface SkillsChipsProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  limit?: number;
}

export function SkillsChips({
  value,
  onChange,
  placeholder = "Add skills (e.g., Node.js, AWS)",
  className,
  limit = 1000,
}: SkillsChipsProps) {
  const { data: skillsData } = useGetAllSkills({ limit });

  const options: ChipOption[] = useMemo(() => {
    if (!skillsData?.data?.items) return [];
    
    return skillsData.data.items.map((skill: Skill) => ({
      value: skill.name,
      label: skill.name,
    }));
  }, [skillsData]);

  return (
    <ChipsInput
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
}
