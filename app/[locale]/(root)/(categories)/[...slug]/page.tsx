import { Metadata } from "next";
import CategoryListingContent from "./_components/CategoryListingContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { validateCategoryPathWithSeo } from "@/app/api/categories/categories.services";
import { unSlugify, slugify } from "@/utils/slug-utils";
import { constructMetadata } from "@/utils/metadata-utils";

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  // Prevent catching /jobs sub-paths - these should be handled by the /jobs directory or 404
  if (slug && slug[0] === "jobs") {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  const currentCategorySlug = slugify(slug[slug.length - 1]);
  const categoryPath = slugify(...slug);
  const route = `/${categoryPath}`;

  let seo = null;

  try {
    const validateResponse = await validateCategoryPathWithSeo(categoryPath);
    if (validateResponse?.data?.seo && validateResponse.data.seo.title) {
      seo = validateResponse.data.seo;
    }
  } catch (error) {
    console.warn(`Category SEO validation failed for: ${categoryPath}`);
  }

  if (!seo || !seo.title) {
    try {
      const seoResponse = await getSeoByRoute(route);
      if (seoResponse?.data && seoResponse.data.title) {
        seo = seoResponse.data;
      }
    } catch (error) {
      console.warn(`SEO data not found for route: ${route}`);
    }
  }

  const categoryName = unSlugify(
    decodeURIComponent(currentCategorySlug || "Category"),
  );

  if (seo && seo.title) {
    return constructMetadata(seo, {
      title: `${categoryName} | BuyOrSell`,
      description: `Browse the best deals in ${categoryName} on BuyOrSell.`,
      url: route
    });
  }

  return {
    title: `${categoryName} | BuyOrSell`,
    description: `Browse the best deals in ${categoryName} on BuyOrSell.`,
  };
}

export default function CategoryListingPage() {
  return <CategoryListingContent />;
}
