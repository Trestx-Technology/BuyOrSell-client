"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/components/global/footer";
import { useGetJobseekerProfile } from "@/hooks/useJobseeker";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import JobsHero from "./jobs-hero";
import JobseekerProfileHeader from "@/components/global/jobseeker-profile-header";
import FeaturedJobs from "./featured-jobs";
import StatsSection from "./stats-section";
import SimilarJobs from "./similar-jobs";

export default function JobsContent() {
  const router = useRouter();
  const { data: profileData, isLoading, error } = useGetJobseekerProfile();
  const profile = profileData?.data?.profile;
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  useEffect(() => {
    // Don't check while loading
    if (isLoading) return;

    // Check for 404 or "JobProfile not found" message
    if (error) {
      const errorMessage = error.message?.toLowerCase() || "";
      const statusCode = (error as { status?: number })?.status;

      if (
        statusCode === 404 ||
        errorMessage.includes("not found") ||
        errorMessage.includes("jobprofile not found") ||
        errorMessage.includes("job profile not found")
      ) {
        setShowWarningDialog(true);
        return;
      }
    }

    // Also check response message
    if (profileData?.message) {
      const message = profileData.message.toLowerCase();
      if (
        message.includes("not found") ||
        message.includes("jobprofile not found") ||
        message.includes("job profile not found")
      ) {
        setShowWarningDialog(true);
        return;
      }
    }

    // If no error but also no profile data, show warning dialog
    if (!isLoading && !error && !profile) {
      setShowWarningDialog(true);
    }
  }, [error, profileData, profile, isLoading]);

  const handleCreateProfile = () => {
    setShowWarningDialog(false);
    router.push("/jobs/jobseeker/new");
  };

  return (
    <>
      <main className="min-h-screen bg-[#F2F4F7]">
        {/* Hero Section */}
        <JobsHero />

        {/* Profile/Category Section */}
        <section className="w-full bg-[#F2F4F7] pt-10 px-4 lg:px-[100px]">
          {isLoading ? (
            <div className="max-w-[1080px] mx-auto bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-[170px] w-[170px] rounded-full bg-gray-200" />
            </div>
          ) : profile ? (
            <div className="max-w-[1080px] mx-auto">
              <JobseekerProfileHeader
                jobseeker={profile}
                actions={{
                  editUrl: "/jobs/jobseeker/new",
                }}
                profileCompletionPercentage={
                  profileData?.data?.profileCompletionPercentage
                }
                showCompletionIndicator={true}
              />
            </div>
          ) : null}
        </section>

        {/*Stats Section  */}
        <StatsSection
          isLoading={isLoading}
          savedJobsCount={profileData?.data?.savedJobsCount}
          appliedJobsCount={profileData?.data?.appliedJobsCount}
        />

        {/* Featured Jobs Section */}
        <FeaturedJobs />

        {/* Similar Jobs Section */}
        {/* <SimilarJobs /> */}

        <Footer />
      </main>

      <WarningConfirmationDialog
        open={showWarningDialog}
        // NOTE: not let the user close the dialog by clicking outside or cancel button
        onOpenChange={() => setShowWarningDialog(true)}
        title="Job Profile Not Found"
        description="You don't have a job profile. Please create one to continue."
        confirmText="Create Profile"
        cancelText="Cancel"
        onConfirm={handleCreateProfile}
        confirmVariant="primary"
      />
    </>
  );
}
