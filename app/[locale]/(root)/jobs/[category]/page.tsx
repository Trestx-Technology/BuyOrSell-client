import { Metadata } from 'next';
import ViewJobPage from "./_components/page";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { unSlugify } from "@/utils/slug-utils";

type Props = {
      params: Promise<{ locale: string; category: string }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
      { params, searchParams }: Props
): Promise<Metadata> {
      const { category } = await params;
      const route = `/jobs/${category}`;

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
        const categoryName = category ? unSlugify(category) : "Job Category";
        return {
              title: `${categoryName} Jobs | BuyOrSell`,
              description: `View ${categoryName} jobs on BuyOrSell.`,
        };
  }
}

export default function JobCategoryPage() {
      return <ViewJobPage />
}