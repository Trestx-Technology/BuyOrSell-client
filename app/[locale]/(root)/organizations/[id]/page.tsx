import { Metadata } from 'next';
import OrganizationDetailContent from "./_components/OrganizationDetailContent";
import { getOrganizationById } from "@/app/api/organization/organization.services";
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const { id } = await params;
  const route = `/organizations/${id}`;

  try {
    // Try to get explicit SEO for this organization route
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
  } catch (seoError) {
    // Fallback: Fetch organization details and generate metadata
    try {
      const orgResponse = await getOrganizationById(id);
      const organization = orgResponse.data;

      if (!organization) {
        return {
          title: "Organization Not Found | BuyOrSell",
          description: "The requested organization could not be found.",
        };
      }

      const title = `${organization.tradeName} | BuyOrSell`;
      const description = organization.description || `View ${organization.tradeName}'s profile and listings on BuyOrSell.`;
      const images = organization.logoUrl ? [{ url: organization.logoUrl }] : [];

      return {
        title: title,
        description: description,
        openGraph: {
          title: title,
          description: description,
          images: images,
        },
        twitter: {
          title: title,
          description: description,
          images: images,
        },
      };
    } catch (orgError) {
      return {
        title: "Organization Profile | BuyOrSell",
        description: "View organization profile on BuyOrSell.",
      };
    }
  }
}

export default function OrganizationDetailPage() {
  return <OrganizationDetailContent />;
}
