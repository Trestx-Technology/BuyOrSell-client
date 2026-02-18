import { Metadata } from 'next';
import JobsListingContent from "./_components/JobsListingContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { unSlugify } from "@/utils/slug-utils";

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const currentCategorySlug = slug && slug.length > 0 ? slug[slug.length - 1] : "";
  const route = currentCategorySlug ? `/jobs/listing/${currentCategorySlug}` : "/jobs/listing";

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
    const categoryName = currentCategorySlug ? unSlugify(currentCategorySlug) : "Jobs";
    return {
      title: `${categoryName} Listings | BuyOrSell`,
      description: `Browse ${categoryName} job listings on BuyOrSell. Find your next career opportunity.`,
    };
  }
}

export default function JobsListingPage() {
  return <JobsListingContent />;
}
