import { Metadata } from 'next';
import { PlansMain } from "./_components/PlansMain";
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
): Promise<Metadata> {
  const route = "/plans";

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
    // Fallback
    return {
      title: "Subscription Plans | BuyOrSell",
      description: "Choose the best plan for your needs and start buying, selling, and exchanging on BuyOrSell.",
    };
  }
}

export default function PlansPage() {
  return <PlansMain />;
}
