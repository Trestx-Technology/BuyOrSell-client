import JobsHero from "./_components/jobs-hero";
import PopularIndustries from "./_components/popular-industries";
import ConnectProfessionals from "./_components/connect-professionals";
import CompaniesToFollow from "./_components/companies-to-follow";
import JobsCTASection from "./_components/jobs-cta-section";
import EmiratisSupport from "./_components/emiratis-support";
import { Container1280 } from "@/components/layouts/container-1280";
import LatestJobsSection from "./_components/latest-jobs-section";
import FeaturedJobsSection from "./_components/featured-jobs-section";

export default function JobsHomePage() {
  return (
    <Container1280 className="flex flex-col gap-12">
      {/* Hero Section */}
      <JobsHero />

      {/* Popular Industries Section */}
      <PopularIndustries />

      {/* Connect Professionals Section */}
      <ConnectProfessionals />

      {/* Companies to follow */}
      <CompaniesToFollow />

      {/* Jobs CTA Section */}
      {/* <JobsCTASection /> */}

      {/* Featured Jobs Section */}
      <FeaturedJobsSection />

      {/* Recent Jobs Section */}
      <LatestJobsSection />

      {/* Emiratis Support Section */}
      <EmiratisSupport />

      {/* Top Employers Section */}
      {/* <TopEmployersSection
        employers={homeData?.topEmployers}
        isLoading={isLoading}
      /> */}
    </Container1280>
  );
}
