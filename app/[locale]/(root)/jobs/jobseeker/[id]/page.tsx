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

export default function JobseekerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const jobseekerId = params.id as string;

  // API call commented out - using dummy data for now
  const {
    data: profileData,
    isLoading,
    error,
  } = useGetJobseekerProfileById(jobseekerId);
  const jobseeker = profileData?.data;

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
    console.log("Shortlist jobseeker:", jobseekerId);
  };

  const handleReject = () => {
    // TODO: Implement reject functionality
    console.log("Reject jobseeker:", jobseekerId);
  };

  const handleDownloadResume = () => {
    if (jobseeker?.profile.resumeFileUrl) {
      window.open(jobseeker.profile.resumeFileUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F2F4F7]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="bg-gray-200 rounded-2xl h-96 animate-pulse" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!jobseeker) {
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
              Redirecting to create profile...
            </Typography>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F2F4F7]">
      {/* Header */}
      <div className="bg-white border-b border-[#E2E2E2]">
        <div className="max-w-[1280px] mx-auto px-4 py-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            className="text-dark-blue p-0 h-auto hover:bg-transparent"
            icon={<ArrowLeft className="w-4 h-4" />}
            iconPosition="left"
          >
            Jobseeker Profile
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Candidate Header */}
        <CandidateHeader
          jobseeker={jobseeker.profile}
          onShortlist={handleShortlist}
          onReject={handleReject}
        />

        {/* Basic Information */}
        <CandidateBasicInfo jobseeker={jobseeker.profile} />

        {/* Resume */}
        <CandidateResume
          jobseeker={jobseeker.profile}
          onDownload={handleDownloadResume}
        />

        {/* Employment */}
        <CandidateEmployment jobseeker={jobseeker.profile} />

        {/* Education */}
        <CandidateEducation jobseeker={jobseeker.profile} />

        {/* Key Skills */}
        <CandidateSkills jobseeker={jobseeker.profile} />

        {/* Profile Summary */}
        <CandidateProfileSummary jobseeker={jobseeker.profile} />

        {/* Language Details */}
        <CandidateLanguages />
      </div>

      <Footer />
    </main>
  );
}
