import { Metadata } from 'next';
import OrganizationDetailContent from "./_components/OrganizationDetailContent";
import { getOrganizationById } from "@/app/api/organization/organization.services";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from "@/utils/metadata-utils";

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
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    if (seo && seo.title) {
        return constructMetadata(seo, {
            title: "Organization Profile | BuyOrSell",
            description: "View organization profile on BuyOrSell.",
            url: route
        });
    }
  } catch (seoError) {
    console.warn(`SEO data not found for route: ${route}`);
  }

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
    const ogImage = organization.logoUrl || "";

    return constructMetadata({
        title,
        description,
        ogImage,
        canonicalUrl: route,
    }, {
        title,
        description,
        url: route
    });
  } catch (orgError) {
    return {
      title: "Organization Profile | BuyOrSell",
      description: "View organization profile on BuyOrSell.",
    };
  }
}

export default function OrganizationDetailPage() {
  return <OrganizationDetailContent />;
}
