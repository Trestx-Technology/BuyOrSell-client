"use client";

import { useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Employment from "./_components/employment";
import EducationForm from "./_components/education-form";
import Skills from "./_components/skills";
import Projects from "./_components/projects";
import ProfileSummary from "./_components/profile-summary";
import LanguageProficiency from "./_components/language-proficiency";
import BasicDetails from "./_components/basic-details";
import { Container1080 } from "@/components/layouts/container-1080";
import { useGetJobseekerProfile } from "@/hooks/useJobseeker";

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
  const [activeSection, setActiveSection] =
    useState<FormSection>("basic-details");

  const { data: profileData, isLoading: isLoadingProfile } = useGetJobseekerProfile();
  const profile = profileData?.data?.profile;
  console.log(profile)
  const renderSection = () => {
    switch (activeSection) {
      case "basic-details":
        return <BasicDetails profile={profile} isLoadingProfile={isLoadingProfile} />;
      case "employment":
        return <Employment profile={profile} isLoadingProfile={isLoadingProfile} />;
      case "education":
        return <EducationForm profile={profile} isLoadingProfile={isLoadingProfile} />;
      case "skills":
        return <Skills profile={profile} isLoadingProfile={isLoadingProfile} />;
      case "projects":
        return <Projects profile={profile} isLoadingProfile={isLoadingProfile} />;
      case "profile-summary":
        return <ProfileSummary profile={profile} isLoadingProfile={isLoadingProfile} />;
      case "language-proficiency":
        return <LanguageProficiency profile={profile} isLoadingProfile={isLoadingProfile} />;
      default:
        return null;
    }
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: "jobs Dashboard", label: "Jobs Dashboard", href: "/jobs" },
    {
      id: "my profile",
      label: "My Profile",
      href: "/jobs/jobseeker/me",
      isActive: true,
    },
  ];

  return (
    <Container1080 className="py-6 space-y-6">
      {/* Header */}
      <Breadcrumbs
        className="hidden sm:flex"
        showHomeIcon={false}
        items={breadcrumbItems}
        showSelectCategoryLink={false}
      />
      {/* Main Content */}
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-[254px] bg-white h-fit rounded-lg px-6 py-2 shadow-sm flex-shrink-0 sticky top-30">
            {formSections.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex cursor-pointer font-semibold hover:text-purple items-center justify-between py-3 rounded-lg text-left transition-all",
                    isActive ? "text-purple" : "text-dark-blue"
                  )}
                >
                  <span className="text-sm">{section.label}</span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    label="Add"
                    className="font-semibold h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSection(section.id);
                    }}
                  />
                </button>
              );
            })}
          </aside>

          {/* Main Form Content */}
          <div className="flex-1 min-w-0">{renderSection()}</div>
        </div>
      </div>
    </Container1080>
  );
}
