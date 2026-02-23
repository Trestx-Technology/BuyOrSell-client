import { Metadata } from 'next';
import CategoryListingContent from "./_components/CategoryListingContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { validateCategoryPathWithSeo } from "@/app/api/categories/categories.services";
import { unSlugify, slugify } from "@/utils/slug-utils";

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const currentCategorySlug = slugify(slug[slug.length - 1]);
  const categoryPath = slugify(...slug);
  const route = `/categories/${currentCategorySlug}`;

  let seo = null;

  try {
    // 1. Try to get SEO from category validation API first
    const validateResponse = await validateCategoryPathWithSeo(categoryPath);
    console.log(validateResponse);
    if (validateResponse?.data?.seo) {
      seo = validateResponse.data.seo;
    }
  } catch (error) {
    console.warn(`Category SEO validation failed for: ${categoryPath}`);
  }

  if (!seo) {
    try {
  // 2. Fallback to general SEO by route API
      const seoResponse = await getSeoByRoute(route);
      seo = seoResponse.data;
    } catch (error) {
      console.warn(`SEO data not found for route: ${route}`);
    }
  }

  if (seo) {
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
  }

  // Fallback metadata if both API calls fail or return no data
  const categoryName = unSlugify(decodeURIComponent(currentCategorySlug || "Category"));
  return {
    title: `${categoryName} | BuyOrSell`,
    description: `Browse the best deals in ${categoryName} on BuyOrSell.`,
  };
}

export default function CategoryListingPage() {
  return <CategoryListingContent />;
}
