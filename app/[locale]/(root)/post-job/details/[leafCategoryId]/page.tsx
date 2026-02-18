import { Metadata } from 'next';
import JobLeafCategoryContent from "../_components/JobLeafCategoryContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
      params: Promise<{ leafCategoryId: string; locale: string }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
      { params, searchParams }: Props
): Promise<Metadata> {
      const { leafCategoryId } = await params;
      const route = `/post-job/details/${leafCategoryId}`;

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
                title: "Post Job | BuyOrSell",
                description: "Post your job vacancy on BuyOrSell and find the right talent.",
      };
    }
}

export default function JobLeafCategoryPage() {
      return <JobLeafCategoryContent />;
}
