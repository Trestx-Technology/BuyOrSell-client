import { Metadata } from "next";
import { Suspense } from "react";
import { TermsContent } from "./_components/TermsContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from "@/utils/metadata-utils";

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

    return constructMetadata(seo, {
      title: "Terms and Conditions | BuyOrSell",
      description: "Read the terms and conditions for using the BuyOrSell platform.",
      url: route
    });
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
