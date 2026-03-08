import { Metadata } from "next";
import { DownloadContent } from "./_components/DownloadContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const route = "/download";

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
    // Fallback metadata for Download App page
    return {
      title: "Download BuyOrSell Mobile App | #1 Marketplace in UAE",
      description:
        "Get the BuyOrSell app for faster browsing, real-time notifications, and exclusive deals. Available on App Store and Google Play.",
      keywords: [
        "buyorsell app",
        "download buyorsell",
        "uae marketplace app",
        "buy and sell uae app",
      ],
    };
  }
}

export default function DownloadAppPage() {
  return <DownloadContent />;
}
