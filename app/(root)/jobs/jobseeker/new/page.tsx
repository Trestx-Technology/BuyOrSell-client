"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { parseDate } from "chrono-node";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { JobseekerProfile } from "@/interfaces/job.types";
import { useCreateJobseekerProfile } from "@/hooks/useJobseeker";
import { useAuthStore } from "@/stores/authStore";
import {
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import BasicDetails from "../_components/basic-details";
import Employment from "./_components/employment";
import EducationForm from "./_components/education-form";
import Skills from "./_components/skills";
import Projects from "./_components/projects";
import ProfileSummary from "./_components/profile-summary";
import LanguageProficiency from "./_components/language-proficiency";

type FormSection =
  | "basic-details"
  | "employment"
  | "education"
  | "skills"
  | "projects"
  | "profile-summary"
  | "language-proficiency";

const formSections: Array<{
  id: FormSection;
  label: string;
}> = [
  { id: "basic-details", label: "Basic details" },
  { id: "employment", label: "Employment" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "profile-summary", label: "Profile summary" },
  { id: "language-proficiency", label: "Language Proficiency" },
];

export default function NewJobseekerProfilePage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const user = session?.user;
  const { mutate: createProfile, isPending } = useCreateJobseekerProfile();
  const [activeSection, setActiveSection] = useState<FormSection>("basic-details");

  const form = useForm<JobseekerProfile>({
    defaultValues: {
      _id: "",
      name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email : "",
      email: user?.email || "",
      phoneNo: "",
      professionalTitle: "",
      currentCompany: "",
      bio: "",
      resumeUrl: "",
      workExperience: [],
      education: [],
      skills: [],
      certifications: [],
      portfolio: [],
      languages: [],
      jobPreferences: undefined,
      profileCompletion: 0,
    },
  });

  // Helper function to convert date string to ISO 8601 format
  const convertToISO8601 = (dateString: string | undefined): string | undefined => {
    if (!dateString || !dateString.trim()) return undefined;
    
    let date: Date | null = null;
    
    // First, try parsing with chrono-node (handles natural language dates)
    try {
      const chronoDate = parseDate(dateString);
      if (chronoDate) {
        date = chronoDate;
      }
    } catch {
      // If chrono parsing fails, try regular Date parsing
    }
    
    // If chrono didn't work, try regular Date parsing
    if (!date) {
      const parsedDate = new Date(dateString);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate;
      }
    }
    
    // If we have a valid date, return ISO 8601 format (YYYY-MM-DD)
    if (date) {
      return date.toISOString().split('T')[0];
    }
    
    return undefined;
  };

  // Helper function to validate and format URL
  const formatUrl = (url: string | undefined): string | undefined => {
    if (!url || !url.trim()) return undefined;
    
    // Check if it's already a valid URL
    try {
      const urlObj = new URL(url);
      return urlObj.toString();
    } catch {
      // If not a valid URL, try adding https://
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return `https://${url}`;
      }
      return url;
    }
  };

  const onSubmit = (data: JobseekerProfile) => {
    // Transform form data to match API payload structure
    const payload: Record<string, unknown> = {
      userId: user?._id || "",
      name: data.name || (user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}`.trim() 
        : user?.email || ""),
      headline: data.professionalTitle || "",
      skills: (data.skills || []).map((skill) => {
        // Handle both string and Skill object
        if (typeof skill === "string") return skill;
        return (skill as { name?: string })?.name || "";
      }).filter(Boolean),
      experienceYears: data.workExperience?.length || 0,
      isFresher: (data.workExperience?.length || 0) === 0,
      summary: data.bio || "",
      contactEmail: data.email || user?.email || "",
      contactPhone: data.phoneNo || "",
      // Transform workExperience to experiences (remove current field)
      experiences: (data.workExperience || [])
        .filter((exp) => exp.position && exp.company) // Only include valid experiences
        .map((exp) => {
          const experience: Record<string, unknown> = {
            title: exp.position || "",
            company: exp.company || "",
            startDate: convertToISO8601(exp.startDate),
            location: exp.location,
            skills: exp.achievements || [],
          };
          
          // Only include endDate if not current
          if (!exp.current && exp.endDate) {
            experience.endDate = convertToISO8601(exp.endDate);
          }
          
          return experience;
        }),
      // Transform education (remove current field, convert dates)
      educations: (data.education || [])
        .filter((edu) => edu.institution && edu.degree) // Only include valid educations
        .map((edu) => {
          const education: Record<string, unknown> = {
            degree: edu.degree || "",
            fieldOfStudy: edu.fieldOfStudy,
            institution: edu.institution || "",
            startDate: convertToISO8601(edu.startDate),
            grade: edu.grade,
            description: edu.description,
          };
          
          // Only include endDate if not current
          if (!edu.current && edu.endDate) {
            education.endDate = convertToISO8601(edu.endDate);
          }
          
          return education;
        }),
      // Transform portfolio to projects (convert dates, validate URLs)
      projects: (data.portfolio || [])
        .filter((project) => project.name) // Only include valid projects
        .map((project) => {
          const projectPayload: Record<string, unknown> = {
            name: project.name || "",
            role: project.role,
            description: project.description,
            techStack: project.techStack || [],
            projectType: project.projectType,
            teamSize: project.teamSize,
          };
          
          // Convert dates to ISO 8601
          if (project.startDate) {
            projectPayload.startDate = convertToISO8601(project.startDate);
          }
          if (project.endDate) {
            projectPayload.endDate = convertToISO8601(project.endDate);
          }
          
          // Format and validate URL
          if (project.url) {
            const formattedUrl = formatUrl(project.url);
            if (formattedUrl) {
              projectPayload.url = formattedUrl;
            }
          }
          
          return projectPayload;
        }),
      // Transform certifications
      certifications: (data.certifications || []).map((cert) => ({
        name: cert.name || "",
        issuer: cert.issuingOrganization,
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        credentialId: cert.credentialId,
        credentialUrl: cert.credentialUrl,
      })),
      // Transform languages
      languages: (data.languages || []).map((lang) => ({
        name: lang.name || "",
        proficiency: lang.proficiency || "",
      })),
      // Add other fields that might be in basic details
      visibility: "public",
    };

    createProfile(payload, {
      onSuccess: (response) => {
        if (response?.data?._id) {
          router.push(`/jobs/jobseeker/${response.data._id}`);
        }
      },
    });
  };



  const renderSection = () => {
    switch (activeSection) {
      case "basic-details":
        return <BasicDetails form={form} />;
      case "employment":
        return <Employment form={form} />;
      case "education":
        return <EducationForm form={form} />;
      case "skills":
        return <Skills form={form} />;
      case "projects":
        return <Projects form={form} />;
      case "profile-summary":
        return <ProfileSummary form={form} />;
      case "language-proficiency":
        return <LanguageProficiency form={form} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <main className="min-h-screen bg-[#F2F4F7]">
        {/* Header */}
        <div className="bg-white border-b border-[#E2E2E2]">
          <div className="max-w-[1280px] mx-auto px-4 py-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="text-dark-blue"
            >
              ← My Profile
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <Typography
            variant="h1"
            className="text-dark-blue font-bold text-3xl mb-8"
          >
            Complete Profile
          </Typography>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="lg:w-[254px] flex-shrink-0">
              <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 sticky top-8">
                <nav className="space-y-1">
                  {formSections.map((section) => {
                    const isActive = activeSection === section.id;
                    const isCollapsible = section.id === "basic-details" || section.id === "projects" || section.id === "profile-summary" || section.id === "language-proficiency";
                    
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all",
                          isActive
                            ? "bg-purple/10 text-purple font-semibold"
                            : "text-dark-blue hover:bg-[#F2F4F7]"
                        )}
                      >
                        <span className="text-sm">{section.label}</span>
                        {isCollapsible && isActive ? (
                          <ChevronUp className="w-4 h-4 flex-shrink-0" />
                        ) : isCollapsible ? (
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={<Plus className="w-4 h-4" />}
                            iconPosition="center"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSection(section.id);
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Form Content */}
            <div className="flex-1 min-w-0">
              {renderSection()}

              {/* Submit Button */}
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating Profile..." : "Create Profile"}
                </Button>
              </div>
            </div>
          </div>
        </div>

      </main>
    </form>
  );
}
