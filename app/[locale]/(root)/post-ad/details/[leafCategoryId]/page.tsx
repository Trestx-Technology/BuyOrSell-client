import { Metadata } from 'next';
import LeafCategoryContent from "../_components/LeafCategoryContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { useCategoryById } from "@/hooks/useCategories"; // Assuming I can import this but hooks are client side mostly.
// Actually I cannot use hooks in server component. I need to fetch category directly or just ignore category data for metadata or use API directly.
// But I don't have direct access to API function in this file easily without strict types or duplicating service logic.
// However, I can try to fetch category title via API if needed, or just use generic title.
// For now, let's use dynamic route metadata with fallback.

type Props = {
  params: Promise<{ leafCategoryId: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const { leafCategoryId } = await params;
  const route = `/post-ad/details/${leafCategoryId}`;

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
        title: "Post Ad Details | BuyOrSell",
        description: "Post your ad on BuyOrSell and reach thousands of buyers.",
      };
    }
  }

export default function LeafCategoryPage() {
  return <LeafCategoryContent />;
}
