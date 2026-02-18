import { Metadata } from 'next';
import AdDetailContent from "./_components/AdDetailContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { getAdById } from "@/app/api/ad/ad.services";

type Props = {
  params: Promise<{ locale: string; adId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const { adId } = await params;
  const route = `/ad/${adId}`;

  try {
    // Try to get explicit SEO for this ad route
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
  } catch (seoError) {
    // Fallback: Fetch ad details and generate metadata
    try {
      const adResponse = await getAdById(adId);
      const ad = adResponse.data;

      if (!ad) {
        return {
          title: "Ad Not Found | BuyOrSell",
          description: "The requested ad could not be found.",
        };
      }

      const title = `${ad.title} | BuyOrSell`;
      const description = ad.description ? ad.description.substring(0, 160) : `Check out this ad on BuyOrSell: ${ad.title}`;
      const images = ad.images && ad.images.length > 0 ? ad.images : [];

      return {
        title: title,
        description: description,
        openGraph: {
          title: title,
          description: description,
          images: images.map(img => ({ url: img })),
        },
        twitter: {
          title: title,
          description: description,
          images: images,
        },
      };
    } catch (adError) {
      return {
        title: "BuyOrSell",
        description: "Buy, Sell & Exchange Everything Online",
      };
    }
  }
}

export default function AdDetailPage() {
  return <AdDetailContent />;
}
