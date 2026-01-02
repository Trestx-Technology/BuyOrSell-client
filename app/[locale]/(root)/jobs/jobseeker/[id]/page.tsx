"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
// import { useEffect } from "react";
import { Footer } from "@/components/global/footer";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
// import { useGetJobseekerProfileById } from "@/hooks/useJobseeker";
import { JobseekerProfile } from "@/interfaces/job.types";
import { ArrowLeft } from "lucide-react";
import CandidateHeader from "./_components/candidate-header";
import CandidateBasicInfo from "./_components/candidate-basic-info";
import CandidateResume from "./_components/candidate-resume";
import CandidateEmployment from "./_components/candidate-employment";
import CandidateEducation from "./_components/candidate-education";
import CandidateSkills from "./_components/candidate-skills";
import CandidateProfileSummary from "./_components/candidate-profile-summary";
import CandidateLanguages from "./_components/candidate-languages";
import { useGetJobseekerProfileById } from "@/hooks/useJobseeker";
import { Container1080 } from "@/components/layouts/container-1080";

export default function JobseekerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // Fetch jobseeker profile by user ID
  const {
    data: profileData,
    isLoading,
    error,
  } = useGetJobseekerProfileById(userId);

  // Extract profile from response data
  // API response structure: { statusCode, timestamp, data: JobseekerProfile }
  // The profile is directly in data (not nested under data.profile)
  const jobseekerProfile = profileData?.data as JobseekerProfile | undefined;

  // useEffect(() => {
  //   if (error) {
  //     const errorMessage = error.message?.toLowerCase() || "";
  //     const statusCode = (error as { status?: number })?.status;

  //     if (
  //       statusCode === 404 ||
  //       errorMessage.includes("not found") ||
  //       errorMessage.includes("jobprofile not found") ||
  //       errorMessage.includes("job profile not found")
  //     ) {
  //       router.push("/jobs/jobseeker/new");
  //     }
  //   }

  //   if (profileData?.message) {
  //     const message = profileData.message.toLowerCase();
  //     if (
  //       message.includes("not found") ||
  //       message.includes("jobprofile not found") ||
  //       message.includes("job profile not found")
  //     ) {
  //       router.push("/jobs/jobseeker/new");
  //     }
  //   }
  // }, [error, profileData, router]);

  // Using dummy data

  const handleShortlist = () => {
    // TODO: Implement shortlist functionality
    console.log("Shortlist jobseeker:", userId);
  };

  const handleReject = () => {
    // TODO: Implement reject functionality
    console.log("Reject jobseeker:", userId);
  };

  const handleChat = () => {
    // TODO: Implement chat functionality
    console.log("Chat with jobseeker:", userId);
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log("Report jobseeker:", userId);
  };

  const handleDownloadResume = () => {
    if (jobseekerProfile?.resumeFileUrl) {
      window.open(jobseekerProfile.resumeFileUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F2F4F7]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
        </div>
      </main>
    );
  }

  if (!jobseekerProfile) {
    return (
      <main className="min-h-screen bg-[#F2F4F7]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="bg-white border border-[#E2E2E2] rounded-2xl p-8 text-center">
            <Typography
              variant="h1"
              className="text-dark-blue font-bold text-2xl mb-2"
            >
              Profile Not Found
            </Typography>
            <Typography variant="body-small" className="text-[#8A8A8A]">
              {error ? "Failed to load profile" : "Profile not found"}
            </Typography>
          </div>
        </div>
      </main>
    );
  }

  return (
    <Container1080 className="py-6 space-y-6">
      <Button
        type="button"
        variant="ghost"
        onClick={() => router.back()}
        className="text-dark-blue p-0 h-auto hover:bg-transparent"
        icon={<ArrowLeft className="w-4 h-4" />}
        iconPosition="left"
      >
        Jobseekers
      </Button>

      {/* Main Content */}
      {/* Candidate Header */}
      <CandidateHeader
        jobseeker={jobseekerProfile}
        onChat={handleChat}
        onReport={handleReport}
        // onShortlist={handleShortlist}
        // onReject={handleReject}
      />

      {/* Basic Information */}
      <CandidateBasicInfo jobseeker={jobseekerProfile} />

      {/* Resume */}
      <CandidateResume
        jobseeker={jobseekerProfile}
        onDownload={handleDownloadResume}
      />

      {/* Employment */}
      <CandidateEmployment jobseeker={jobseekerProfile} />

      {/* Education */}
      <CandidateEducation jobseeker={jobseekerProfile} />

      {/* Key Skills */}
      <CandidateSkills jobseeker={jobseekerProfile} />

      {/* Profile Summary */}
      <CandidateProfileSummary jobseeker={jobseekerProfile} />

      {/* Language Details */}
      <CandidateLanguages languages={jobseekerProfile.languages} />
    </Container1080>
  );
}
