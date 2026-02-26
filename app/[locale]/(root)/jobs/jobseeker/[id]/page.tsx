"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import JobseekerProfileHeader from "@/components/global/jobseeker-profile-header";
import CandidateResume from "./_components/candidate-resume";
import CandidateEmployment from "./_components/candidate-employment";
import CandidateEducation from "./_components/candidate-education";
import CandidateSkills from "./_components/candidate-skills";
import CandidateProfileSummary from "./_components/candidate-profile-summary";
import CandidateLanguages from "./_components/candidate-languages";
import { useGetJobseekerProfile, useGetJobseekerProfileById } from "@/hooks/useJobseeker";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JobseekerProfile } from "@/interfaces/job.types";
import { JobseekerProfileSkeleton } from "../me/_components/profile-skeleton";
import { cn } from "@/lib/utils";

export default function JobseekerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  // Fetch jobseeker profile by user ID
  const {
    data: profileData,
    isLoading,
    error,
    isFetched,
  } = useGetJobseekerProfileById(userId);

  // Extract profile from response data
  // Handle two possible structures: { data: { profile: ... } } or { data: JobseekerProfile }
  const jobseekerProfile = profileData?.data;
  const profile = jobseekerProfile?.profile || (jobseekerProfile as unknown as JobseekerProfile);

  useEffect(() => {
    if (error || (!isLoading && !profile)) {
      const errorMessage = (error as any)?.message?.toLowerCase() || "";
      const statusCode = (error as { status?: number })?.status;

      if (
        statusCode === 404 ||
        !profile ||
        errorMessage.includes("not found") ||
        errorMessage.includes("jobprofile not found") ||
        errorMessage.includes("job profile not found")
      ) {
        // Redirect to search if profile not found
        // router.push("/jobs/jobseeker");
      }
    }
  }, [error, profile, isLoading, router]);

  // Using dummy data

  const handleChat = () => {
    // TODO: Implement chat functionality
    console.log("Chat with jobseeker:", userId);
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    console.log("Report jobseeker:", userId);
  };

  const handleDownloadResume = () => {
    if (profile?.resumeFileUrl) {
      window.open(profile.resumeFileUrl, "_blank");
    }
  };

  if (isLoading || !isFetched) {
    return (
      <Container1080 className="py-6">
        <JobseekerProfileSkeleton />
      </Container1080>
    );
  }

  if (!profile && !isLoading) {
    return (
      <Container1080 className="py-12">
        <div className="max-w-[600px] mx-auto text-center space-y-6 bg-white dark:bg-gray-900 border border-[#E2E2E2] dark:border-gray-800 rounded-3xl p-12 shadow-sm">
          <div className="bg-purple/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Typography variant="h1" className="text-purple text-4xl">?</Typography>
          </div>
          <Typography
            variant="h2"
            className="text-dark-blue dark:text-white font-bold text-3xl"
          >
            Profile Not Found
          </Typography>
          <Typography variant="body-large" className="text-grey-blue dark:text-gray-400 max-w-md mx-auto">
            {error ? "We encountered an error loading this profile. Please try again later." : "This jobseeker profile could not be found or is no longer available."}
          </Typography>
          <div className="pt-4">
            <Button
              onClick={() => router.push("/jobs/jobseeker")}
              className="bg-purple text-white px-8 py-3 rounded-xl hover:bg-purple/90 transition-all font-semibold"
            >
              Back to Jobseekers
            </Button>
          </div>
        </div>
      </Container1080>
    );
  }

  return (
    <Container1080>
      <MobileStickyHeader title="Jobseeker Profile" />

      <div className="p-6 space-y-6">
        <Breadcrumbs
          items={[
            {
              id: "home",
              label: "Home",
              href: "/jobs",
            },
            {
              id: "jobseekers",
              label: "Jobseekers",
              href: "/jobs/jobseeker",
            },
            {
              id: profile?._id || "",
              label: profile?.name?.split(" ")?.slice(0, 3)?.join(" ") || "Profile",
              href: `/jobs/jobseeker/${profile?._id || ""}`,
            },
          ]}
          showHomeIcon={false}
          showSelectCategoryLink={false}
        />

        {/* Main Content */}
        {/* Candidate Header */}
        <JobseekerProfileHeader
          jobseeker={profile}
          actions={{
            onChat: handleChat,
            onReport: handleReport,
            chatButtonText: "Chat With Jobseeker",
          }}
          containerClassName="mb-6"
          type="applicantsList"
          isConnected={jobseekerProfile?.isConnected}
          connectionStatus={jobseekerProfile?.connectionStatus}
          connectionDirection={jobseekerProfile?.connectionDirection}
          requestId={jobseekerProfile?.requestId}
        />

        {/* Basic Information */}
        {/* <CandidateBasicInfo jobseeker={jobseekerProfile.profile} /> */}

        {/* Resume */}
        <CandidateResume
          jobseeker={profile}
          onDownload={handleDownloadResume}
        />

        {/* Employment */}
        <CandidateEmployment jobseeker={profile} />

        {/* Education */}
        <CandidateEducation jobseeker={profile} />

        {/* Key Skills */}
        <CandidateSkills jobseeker={profile} />

        {/* Profile Summary */}
        <CandidateProfileSummary jobseeker={profile} />

        {/* Language Details */}
        <CandidateLanguages languages={profile.languages} />
      </div>
    </Container1080>
  );
}
