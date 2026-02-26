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
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { JobseekerProfile } from "@/interfaces/job.types";

export default function JobsContent() {
  const router = useRouter();
  const { t, localePath } = useLocale();
  const { data: profileData, isLoading, error } = useGetJobseekerProfile();
  const jobseekerData = profileData?.data;
  const profile = jobseekerData?.profile || (jobseekerData as unknown as JobseekerProfile);
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
        // Don't show warning dialog, let user create profile
        return;
      }
    }
  }, [error, profileData, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Typography variant="body" className="animate-pulse">
          {t?.common?.loading || "Loading..."}
        </Typography>
      </div>
    );
  }

  // If no profile found, show a creative "Create Profile" section
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-6">
        <div className="bg-purple/10 p-6 rounded-full">
          <User className="size-12 text-purple" />
        </div>
        <div className="space-y-2 max-w-md">
          <Typography variant="h2" className="text-2xl font-bold text-dark-blue dark:text-white">
            {(t?.user?.profile as any)?.noProfileTitle || "Create Your Job Profile"}
          </Typography>
          <Typography variant="body" className="text-gray-500 dark:text-gray-400">
            {(t?.user?.profile as any)?.noProfileDesc || "Showcase your skills and experience to employers. It only takes a few minutes to get started."}
          </Typography>
        </div>
        <Button
          onClick={() => router.push(localePath("/jobs/jobseeker/new"))}
          size="lg"
          className="bg-purple hover:bg-purple/90 text-white px-8 h-12 rounded-xl font-semibold shadow-lg shadow-purple/20 transition-all hover:scale-105"
        >
          {(t?.user?.profile as any)?.createProfile || "Create Profile Now"}
        </Button>
      </div>
    );
  }

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
