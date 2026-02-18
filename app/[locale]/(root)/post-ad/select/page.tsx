import { Metadata } from 'next';
import SelectCategoryContent from "./_components/SelectCategoryContent";

// Since this is an interactive category selection step, we might not need dynamic SEO from API,
// or we can use a generic "Post Ad" SEO entry.
// For now, I'll use a hardcoded fallback or try to fetch "/post-ad" SEO data if it exists.
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const route = "/post-ad";

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
      title: "Post an Ad | BuyOrSell",
      description: "Select a category to start posting your ad on BuyOrSell.",
    };
  }
}

export default function SelectCategoryPage() {
  return <SelectCategoryContent />;
}
