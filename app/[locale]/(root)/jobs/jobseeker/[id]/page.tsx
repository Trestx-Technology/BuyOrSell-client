"use client";

import { useParams, useRouter } from "next/navigation";
import { Typography } from "@/components/typography";
import { JobseekerProfile } from "@/interfaces/job.types";
import JobseekerProfileHeader from "@/components/global/jobseeker-profile-header";
import CandidateBasicInfo from "./_components/candidate-basic-info";
import CandidateResume from "./_components/candidate-resume";
import CandidateEmployment from "./_components/candidate-employment";
import CandidateEducation from "./_components/candidate-education";
import CandidateSkills from "./_components/candidate-skills";
import CandidateProfileSummary from "./_components/candidate-profile-summary";
import CandidateLanguages from "./_components/candidate-languages";
import { useGetJobseekerProfileById } from "@/hooks/useJobseeker";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function JobseekerProfilePage() {
  const params = useParams();
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
  const jobseekerProfile = profileData?.data;
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
    if (jobseekerProfile?.profile?.resumeFileUrl) {
      window.open(jobseekerProfile.profile.resumeFileUrl, "_blank");
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
              id: jobseekerProfile.profile._id,
              label: jobseekerProfile.profile.name?.split(" ")?.slice(0, 3)?.join(" "),
              href: `/jobs/jobseeker/${jobseekerProfile.profile._id}`,
            },
          ]}
          showHomeIcon={false}
          showSelectCategoryLink={false}
        />

        {/* Main Content */}
        {/* Candidate Header */}
        <JobseekerProfileHeader
          jobseeker={jobseekerProfile.profile}
          actions={{
            onChat: handleChat,
            onReport: handleReport,
            onShortlist: handleShortlist,

            onReject: handleReject,
            chatButtonText: "Chat With Jobseeker",
          }}
          containerClassName="mb-6"
          type="applicantsList"
          isConnected={jobseekerProfile.isConnected}
          connectionStatus={jobseekerProfile.connectionStatus}
          connectionDirection={jobseekerProfile.connectionDirection}
          requestId={jobseekerProfile.requestId}
        />

        {/* Basic Information */}
        {/* <CandidateBasicInfo jobseeker={jobseekerProfile.profile} /> */}

        {/* Resume */}
        <CandidateResume
          jobseeker={jobseekerProfile.profile}
          onDownload={handleDownloadResume}
        />

        {/* Employment */}
        <CandidateEmployment jobseeker={jobseekerProfile.profile} />

        {/* Education */}
        <CandidateEducation jobseeker={jobseekerProfile.profile} />

        {/* Key Skills */}
        <CandidateSkills jobseeker={jobseekerProfile.profile} />

        {/* Profile Summary */}
        <CandidateProfileSummary jobseeker={jobseekerProfile.profile} />

        {/* Language Details */}
        <CandidateLanguages languages={jobseekerProfile.profile.languages} />
      </div>
    </Container1080>
  );
}
