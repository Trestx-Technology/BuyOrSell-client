import { Metadata } from 'next';
import { VideoViewer } from "../_components/video-viewer";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from '@/utils/metadata-utils';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const route = "/watch";

  try {
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    return constructMetadata(seo, {
      title: "Watch Videos | BuyOrSell",
      description: "Watch video ads and discover amazing products on BuyOrSell.",
      url: route
    });
  } catch (error) {
    return {
      title: "Watch Videos | BuyOrSell",
      description: "Watch video ads and discover amazing products on BuyOrSell.",
    };
  }
}

export default function WatchPage() {
  return <VideoViewer />;
}
