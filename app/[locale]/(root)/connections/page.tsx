import { Metadata } from 'next';
import ConnectionsContent from "./_components/ConnectionsContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
      params: Promise<{ locale: string }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
      { params, searchParams }: Props
): Promise<Metadata> {
      const route = "/connections";

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
                  title: "My Network | BuyOrSell",
                  description: "Manage your professional connections and network requests on BuyOrSell.",
            };
      }
}

export default function ConnectionsPage() {
      return <ConnectionsContent />;
}
