import { Metadata } from 'next';
import JobsHero from "./_components/jobs-hero";
import PopularIndustries from "./_components/popular-industries";
import JobsTabbedSection from "./_components/jobs-tabbed-section";
import ConnectProfessionals from "./_components/connect-professionals";
import CompaniesToFollow from "./_components/companies-to-follow";
import JobsCTASection from "./_components/jobs-cta-section";
import EmiratisSupport from "./_components/emiratis-support";
import TopEmployersSection from "./_components/top-employers-section";
import { Container1080 } from "@/components/layouts/container-1080";
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const route = "/jobs";

  try {
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      openGraph: {
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
        images: seo.ogImage ? [{ url: seo.ogImage }] : [],
      },
      twitter: {
        title: seo.twitterTitle || seo.title,
        description: seo.twitterDescription || seo.description,
        images: seo.twitterImage ? [seo.twitterImage] : [],
      },
      alternates: {
        canonical: seo.canonicalUrl,
      },
      robots: {
        index: seo.robots?.includes("noindex") ? false : true,
        follow: seo.robots?.includes("nofollow") ? false : true,
      },
    };
  } catch (error) {
    // Fallback metadata
    return {
      title: "Jobs | BuyOrSell",
      description: "Find your dream job on BuyOrSell.",
    };
  }
}

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
