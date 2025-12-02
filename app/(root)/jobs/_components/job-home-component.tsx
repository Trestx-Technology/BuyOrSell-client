"use client";

import React from "react";
import { useAuthStore } from "@/stores/authStore";
import { useGetJobHome } from "@/hooks/useJobs";
import JobsHero from "./jobs-hero";
import PopularIndustries from "./popular-industries";
import ConnectProfessionals from "./connect-professionals";
import FeaturedJobsSection from "./featured-jobs-section";
import TopEmployersSection from "./top-employers-section";
import CompaniesToFollow from "./companies-to-follow";
import JobsCTASection from "./jobs-cta-section";
import LatestJobsSection from "./latest-jobs-section";
import EmiratisSupport from "./emiratis-support";

export default function JobHomeComponent() {
  const { session, isAuthenticated } = useAuthStore();
  const userId = isAuthenticated && session.user ? session.user._id : undefined;

  const { data: jobHomeData, isLoading } = useGetJobHome(
    userId ? { userId } : {}
  );

  const homeData = jobHomeData?.data;

  return (
    <>
      {/* Hero Section */}
      <JobsHero />

      {/* Popular Industries Section */}
      <PopularIndustries 
        industries={homeData?.popularIndustries}
      />

      {/* Connect Professionals Section */}
      <ConnectProfessionals 
        professionals={homeData?.professionals}
        isLoading={isLoading}
      />

      {/* Companies to follow */}
      <CompaniesToFollow 
        companies={homeData?.companiesToFollow}
        isLoading={isLoading}
      />

      {/* Jobs CTA Section */}
      <JobsCTASection />

      {/* Featured Jobs Section */}
      <FeaturedJobsSection 
        jobs={homeData?.featuredJobs?.jobs}
        isLoading={isLoading}
      />

      {/* Recent Jobs Section */}
      <LatestJobsSection 
        jobs={homeData?.latestJobs?.jobs}
        isLoading={isLoading}
      />

      {/* Emiratis Support Section */}
      <EmiratisSupport/>

      {/* Top Employers Section */}
      <TopEmployersSection 
        employers={homeData?.topEmployers}
        isLoading={isLoading}
      />
    </>
  );
}

