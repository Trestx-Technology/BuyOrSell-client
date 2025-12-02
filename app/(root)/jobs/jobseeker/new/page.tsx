"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/global/footer";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobseekerProfile } from "@/interfaces/job.types";
import { useCreateJobseekerProfile } from "@/hooks/useJobseeker";
import { useAuthStore } from "@/stores/authStore";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
  Plus,
  Edit,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [workStatus, setWorkStatus] = useState<string>("active");
  const [availability, setAvailability] = useState<string>("");
  const [jobAlert, setJobAlert] = useState<boolean>(false);
  const [socialMediaLinks, setSocialMediaLinks] = useState({
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
  });
  const [websites, setWebsites] = useState<string[]>([""]);
  const [emails, setEmails] = useState<string[]>([""]);

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
      jobPreferences: undefined,
      profileCompletion: 0,
    },
  });

  const onSubmit = (data: JobseekerProfile) => {
    const payload = {
      professionalTitle: data.professionalTitle,
      currentCompany: data.currentCompany,
      bio: data.bio,
    };

    createProfile(payload, {
      onSuccess: (response) => {
        if (response?.data?._id) {
          router.push(`/jobs/jobseeker/${response.data._id}`);
        }
      },
    });
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      // TODO: Upload file to server and get URL
    }
  };

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleAddWebsite = () => {
    setWebsites([...websites, ""]);
  };

  const renderBasicDetails = () => {
    const { register } = form;

    return (
      <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8 space-y-6">
        <Typography
          variant="h2"
          className="text-dark-blue font-bold text-2xl mb-6"
        >
          Basic details
        </Typography>

        {/* Resume Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">
            Resume
          </label>
          <div className="border-2 border-dashed border-grey-blue/30 rounded-lg p-8 text-center hover:border-purple/50 transition-colors cursor-pointer">
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg"
              onChange={handleResumeUpload}
            />
            <label htmlFor="resume-upload" className="cursor-pointer">
              <FileText className="w-12 h-12 text-grey-blue mx-auto mb-4" />
              <Typography variant="body-small" className="text-dark-blue mb-2">
                Drag & drop file or browse from your device.
              </Typography>
              <Typography variant="caption" className="text-grey-blue mb-4">
                Support PDF, WORD, JPEG max 2MB
              </Typography>
              <Button
                type="button"
                variant="outline"
                icon={<Upload className="w-4 h-4" />}
                iconPosition="left"
                onClick={() => document.getElementById("resume-upload")?.click()}
              >
                Upload resume
              </Button>
              {resumeFile && (
                <Typography variant="caption" className="text-success-100 mt-2 block">
                  {resumeFile.name}
                </Typography>
              )}
            </label>
          </div>
        </div>

        {/* Name */}
        <Input
          {...register("name")}
          label="Name"
          placeholder="Your Full Name"
        />

        {/* Email */}
        <div className="space-y-2">
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2">
              <Input
                {...(index === 0 ? register("email") : {})}
                label={index === 0 ? "Email" : ""}
                placeholder="your.email@example.com"
                type="email"
                className="flex-1"
                value={email}
                onChange={(e) => {
                  const newEmails = [...emails];
                  newEmails[index] = e.target.value;
                  setEmails(newEmails);
                }}
              />
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  className="mt-6"
                  onClick={() => setEmails(emails.filter((_, i) => i !== index))}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
            onClick={handleAddEmail}
          >
            Add Email
          </Button>
        </div>

        {/* Work Status */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-dark-blue">Work Status</label>
          <RadioGroup
            value={workStatus}
            onValueChange={setWorkStatus}
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="active" id="active" />
              <label htmlFor="active" className="text-sm text-dark-blue cursor-pointer">
                I&apos;m active
              </label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="looking" id="looking" />
              <label htmlFor="looking" className="text-sm text-dark-blue cursor-pointer">
                I&apos;m looking
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">Availability</label>
          <Select value={availability} onValueChange={setAvailability}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="I&apos;m available in" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediately">Immediately</SelectItem>
              <SelectItem value="1-week">1 week</SelectItem>
              <SelectItem value="2-weeks">2 weeks</SelectItem>
              <SelectItem value="1-month">1 month</SelectItem>
              <SelectItem value="2-months">2 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Salary */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">Current Salary</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="0"
                type="number"
                leftIcon={<span className="text-grey-blue">AED</span>}
              />
            </div>
            <Select defaultValue="per-month">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per-month">Per month</SelectItem>
                <SelectItem value="per-year">Per year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expected Salary */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">Expected Salary</label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="0"
                type="number"
                leftIcon={<span className="text-grey-blue">AED</span>}
              />
            </div>
            <Select defaultValue="per-month">
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per-month">Per month</SelectItem>
                <SelectItem value="per-year">Per year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-dark-blue">Location</label>
          <div className="flex gap-2">
            <Input
              placeholder="AJ (Fwy)"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              className="mt-0"
              onClick={() => {
                // TODO: Get location from profile
              }}
            >
              Add - From Profile
            </Button>
          </div>
        </div>

        {/* Job Alert */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-dark-blue">Job Alert</label>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={jobAlert}
                onChange={(e) => setJobAlert(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-grey-blue/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-grey-blue after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple"></div>
            </label>
            <Typography variant="body-small" className="text-dark-blue">
              Receive job alerts for new jobs
            </Typography>
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-dark-blue">Mobile Number</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<Edit className="w-4 h-4" />}
              iconPosition="left"
            >
              Edit
            </Button>
          </div>
          <Input
            {...register("phoneNo")}
            placeholder="+971 50 123 4567"
            type="tel"
          />
        </div>

        {/* Social Media */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-dark-blue">Social Media</label>
          <div className="space-y-3">
            <Input
              value={socialMediaLinks.linkedin}
              onChange={(e) =>
                setSocialMediaLinks({ ...socialMediaLinks, linkedin: e.target.value })
              }
              placeholder="LinkedIn"
              leftIcon={<LinkIcon className="w-4 h-4" />}
            />
            <Input
              value={socialMediaLinks.twitter}
              onChange={(e) =>
                setSocialMediaLinks({ ...socialMediaLinks, twitter: e.target.value })
              }
              placeholder="Twitter"
              leftIcon={<LinkIcon className="w-4 h-4" />}
            />
            <Input
              value={socialMediaLinks.facebook}
              onChange={(e) =>
                setSocialMediaLinks({ ...socialMediaLinks, facebook: e.target.value })
              }
              placeholder="Facebook"
              leftIcon={<LinkIcon className="w-4 h-4" />}
            />
            <Input
              value={socialMediaLinks.instagram}
              onChange={(e) =>
                setSocialMediaLinks({ ...socialMediaLinks, instagram: e.target.value })
              }
              placeholder="Instagram"
              leftIcon={<LinkIcon className="w-4 h-4" />}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
            onClick={() => {
              // TODO: Add more social media fields
            }}
          >
            Add more
          </Button>
        </div>

        {/* Website */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-dark-blue">Website</label>
          <div className="space-y-2">
            {websites.map((website, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={website}
                  onChange={(e) => {
                    const newWebsites = [...websites];
                    newWebsites[index] = e.target.value;
                    setWebsites(newWebsites);
                  }}
                  placeholder="https://example.com"
                  className="flex-1"
                  leftIcon={<LinkIcon className="w-4 h-4" />}
                />
                {index > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setWebsites(websites.filter((_, i) => i !== index))}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            icon={<Plus className="w-4 h-4" />}
            iconPosition="left"
            onClick={handleAddWebsite}
          >
            Add more
          </Button>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "basic-details":
        return renderBasicDetails();
      case "employment":
        return (
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
            <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
              Employment
            </Typography>
            <Button
              type="button"
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
            >
              Add Employment
            </Button>
          </div>
        );
      case "education":
        return (
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
            <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
              Education
            </Typography>
            <Button
              type="button"
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
            >
              Add Education
            </Button>
          </div>
        );
      case "skills":
        return (
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
            <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
              Skills
            </Typography>
            <Button
              type="button"
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
            >
              Add Skills
            </Button>
          </div>
        );
      case "projects":
        return (
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
            <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
              Projects
            </Typography>
            <Button
              type="button"
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
            >
              Add Project
            </Button>
          </div>
        );
      case "profile-summary":
        return (
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
            <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
              Profile Summary
            </Typography>
            <Textarea
              {...form.register("bio")}
              placeholder="Tell us about yourself..."
              className="min-h-[150px]"
            />
          </div>
        );
      case "language-proficiency":
        return (
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-6 md:p-8">
            <Typography variant="h2" className="text-dark-blue font-bold text-2xl mb-4">
              Language Proficiency
            </Typography>
            <Button
              type="button"
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              iconPosition="left"
            >
              Add Language
            </Button>
          </div>
        );
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

        <Footer />
      </main>
    </form>
  );
}
