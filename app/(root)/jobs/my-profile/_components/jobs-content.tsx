"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Footer } from "@/components/global/footer";
import { useGetJobseekerProfile } from "@/hooks/useJobseeker";
import JobsHero from "./jobs-hero";
import JobsProfileSection from "./jobs-profile-section";
import FeaturedJobs from "./featured-jobs";
import SimilarJobs from "./similar-jobs";
import StatsSection from "./stats-section";

export default function JobsContent() {
  const router = useRouter();
  const { data: profileData, isLoading, error } = useGetJobseekerProfile();
  const profile = profileData?.data;

  useEffect(() => {
    // Don't redirect while loading
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
        router.push("/jobs/jobseeker/new");
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
        router.push("/jobs/jobseeker/new");
        return;
      }
    }

    // If no error but also no profile data, redirect to create profile
    if (!isLoading && !error && !profile) {
      router.push("/jobs/jobseeker/new");
    }
  }, [error, profileData, profile, isLoading, router]);

  return (
    <main className="min-h-screen bg-[#F2F4F7]">
      {/* Hero Section */}
      <JobsHero />

      {/* Profile/Category Section */}
      <JobsProfileSection 
        profile={profile}
        isLoading={isLoading}
      />
      
      {/*Stats Section  */}
      <StatsSection 
        profile={profile}
        isLoading={isLoading}
      />

      {/* Featured Jobs Section */}
      <FeaturedJobs />
      
      {/* Similar Jobs Section */}
      <SimilarJobs />
      
      <Footer />
    </main>
  );
}

