import { Metadata } from 'next';
import AdDetailContent from "./_components/AdDetailContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { getAdById } from "@/app/api/ad/ad.services";
import { constructMetadata } from '@/utils/metadata-utils';

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
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    if (seo && seo.title) {
        return constructMetadata(seo, {
            title: "BuyOrSell",
            description: "Check out this ad on BuyOrSell",
            url: route
        });
    }
  } catch (seoError) {
    console.warn(`SEO data not found for route: ${route}`);
  }

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
    const ogImage = ad.images && ad.images.length > 0 ? ad.images[0] : "";

    return constructMetadata({
        title,
        description,
        ogImage,
        canonicalUrl: route,
    }, {
        title,
        description,
        url: route
    });
  } catch (adError) {
    return {
      title: "BuyOrSell",
      description: "Buy, Sell & Exchange Everything Online",
    };
  }
}

export default function AdDetailPage() {
  return <AdDetailContent />;
}
