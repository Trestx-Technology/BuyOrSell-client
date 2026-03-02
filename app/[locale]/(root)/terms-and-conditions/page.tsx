import { Metadata } from "next";
import { Suspense } from "react";
import { TermsContent } from "./_components/TermsContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const route = "/terms-and-conditions";

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
    return {
      title: "Terms and Conditions | BuyOrSell",
      description:
        "Read the terms and conditions for using the BuyOrSell platform.",
    };
  }
}

export default function TermsAndConditionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center font-inter text-purple animate-pulse">
          Loading Terms...
        </div>
      }
    >
      <TermsContent />
    </Suspense>
  );
}
