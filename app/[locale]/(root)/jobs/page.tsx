import JobsHero from "./_components/jobs-hero";
import PopularIndustries from "./_components/popular-industries";
import JobsTabbedSection from "./_components/jobs-tabbed-section";
import ConnectProfessionals from "./_components/connect-professionals";
import CompaniesToFollow from "./_components/companies-to-follow";
import JobsCTASection from "./_components/jobs-cta-section";
import EmiratisSupport from "./_components/emiratis-support";
import { Container1280 } from "@/components/layouts/container-1280";
import LatestJobsSection from "./_components/latest-jobs-section";
import FeaturedJobsSection from "./_components/featured-jobs-section";
import TopEmployersSection from "./_components/top-employers-section";
import { Container1080 } from "@/components/layouts/container-1080";

export default function JobsHomePage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <JobsHero zoom={30} />

      {/* Popular Industries Section */}
      <PopularIndustries />

      <section className="bg-white">

        {/* Connect Professionals Section */}
        <ConnectProfessionals />

        {/* Companies to follow */}
        <CompaniesToFollow />

        {/* Jobs CTA Section */}
        <Container1080>
        <JobsCTASection />
        </Container1080>

        {/* Featured Jobs Section */}
        {/* <FeaturedJobsSection /> */}

        {/* Recent Jobs Section */}
        {/* <LatestJobsSection /> */}



        {/* Tabbed Jobs Section */}
        <JobsTabbedSection title="Latest Jobs" titleClassName="font-bold" />



        {/* Emiratis Support Section */}
        <EmiratisSupport />



        {/* Top Employers Section */}
        <TopEmployersSection
        />
      </section>
    </div>
  );
}
