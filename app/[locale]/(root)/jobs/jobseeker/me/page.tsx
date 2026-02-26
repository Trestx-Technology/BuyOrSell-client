"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import JobseekerProfileHeader from "@/components/global/jobseeker-profile-header";
import CandidateResume from "../[id]/_components/candidate-resume";
import CandidateEmployment from "../[id]/_components/candidate-employment";
import CandidateEducation from "../[id]/_components/candidate-education";
import CandidateSkills from "../[id]/_components/candidate-skills";
import CandidateProfileSummary from "../[id]/_components/candidate-profile-summary";
import CandidateLanguages from "../[id]/_components/candidate-languages";
import { useGetJobseekerProfile } from "@/hooks/useJobseeker";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { JobseekerProfile } from "@/interfaces/job.types";
import { JobseekerProfileSkeleton } from "./_components/profile-skeleton";
import { cn } from "@/lib/utils";

export default function MyJobseekerProfilePage() {
  const router = useRouter();

  // Fetch current user's jobseeker profile
  const {
    data: profileData,
    isLoading,
    error,
    isFetched,
  } = useGetJobseekerProfile();

  const jobseekerProfile = profileData?.data;
  const profile = jobseekerProfile?.profile || (jobseekerProfile as unknown as JobseekerProfile);

  useEffect(() => {
    // Only handle redirect if the query has finished at least once
    if (isFetched) {
      if (error || !profile) {
        const errorMessage = (error as any)?.message?.toLowerCase() || "";
        const statusCode = (error as { status?: number })?.status;

        if (
          statusCode === 404 ||
          !profile ||
          errorMessage.includes("not found") ||
          errorMessage.includes("jobprofile not found") ||
          errorMessage.includes("job profile not found")
        ) {
          router.push("/jobs/jobseeker/new");
        }
      }
    }
  }, [error, profile, isFetched, router]);

  const handleChat = () => {
    console.log("Chat with myself - usually disabled or redirects to messages");
  };

  const handleReport = () => {
    console.log("Report myself");
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
            {error ? "We encountered an error loading your profile. Please try again later." : "It looks like you haven't created your jobseeker profile yet. Start now to get noticed by recruiters."}
          </Typography>
          <div className="pt-4">
            <Button
              onClick={() => router.push("/jobs/jobseeker/new")}
              className="bg-purple text-white px-8 py-3 rounded-xl hover:bg-purple/90 transition-all font-semibold"
            >
              Create My Profile
            </Button>
          </div>
        </div>
      </Container1080>
    );
  }

  return (
    <Container1080>
      <MobileStickyHeader title="My Profile" />

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
              id: "me",
              label: "My Profile",
              href: "/jobs/jobseeker/me",
              isActive: true,
            },
          ]}
          showHomeIcon={false}
          showSelectCategoryLink={false}
        />

        {/* Candidate Header */}
        <JobseekerProfileHeader
          jobseeker={profile}
          actions={{
            onChat: handleChat,
            onReport: handleReport,
            editUrl: "/jobs/jobseeker/new",
          }}
          containerClassName="mb-6"
          type="applicantsList"
          isConnected={jobseekerProfile?.isConnected}
          connectionStatus={jobseekerProfile?.connectionStatus}
          connectionDirection={jobseekerProfile?.connectionDirection}
          requestId={jobseekerProfile?.requestId}
        />

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
