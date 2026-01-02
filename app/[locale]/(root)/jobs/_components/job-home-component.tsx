"use client";

import React from "react";
import JobsHero from "./jobs-hero";
import PopularIndustries from "./popular-industries";
import ConnectProfessionals from "./connect-professionals";
import CompaniesToFollow from "./companies-to-follow";
import JobsCTASection from "./jobs-cta-section";
import EmiratisSupport from "./emiratis-support";

export default function JobHomeComponent() {
  return (
    <>
      {/* Hero Section */}
      <JobsHero />

      {/* Popular Industries Section */}
      <PopularIndustries />

      {/* Connect Professionals Section */}
      <ConnectProfessionals />

      {/* Companies to follow */}
      <CompaniesToFollow />

      {/* Jobs CTA Section */}
      <JobsCTASection />

      {/* Featured Jobs Section */}
      {/* <FeaturedJobsSection
        jobs={homeData?.featuredJobs?.jobs}
        isLoading={isLoading}
      /> */}

      {/* Recent Jobs Section */}
      {/* <LatestJobsSection
        jobs={homeData?.latestJobs?.jobs}
        isLoading={isLoading}
      /> */}

      {/* Emiratis Support Section */}
      <EmiratisSupport />

      {/* Top Employers Section */}
      {/* <TopEmployersSection
        employers={homeData?.topEmployers}
        isLoading={isLoading}
      /> */}
    </>
  );
}
