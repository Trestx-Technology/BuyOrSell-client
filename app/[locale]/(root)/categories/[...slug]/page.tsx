import { Metadata } from 'next';
import CategoryListingContent from "./_components/CategoryListingContent";
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
  const currentCategorySlug = slug[slug.length - 1];
  const route = `/categories/${currentCategorySlug}`;

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
    // Fallback metadata if SEO data is missing or API fails
    const categoryName = unSlugify(decodeURIComponent(currentCategorySlug || "Category"));
    return {
      title: `${categoryName} | BuyOrSell`,
      description: `Browse the best deals in ${categoryName} on BuyOrSell.`,
    };
  }
}

export default function CategoryListingPage() {
  return <CategoryListingContent />;
}
