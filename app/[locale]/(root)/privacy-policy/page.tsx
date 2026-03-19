import { Metadata } from "next";
import { Suspense } from "react";
import { PrivacyPolicyContent } from "./_components/PrivacyPolicyContent";
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
  const route = "/privacy-policy";

  try {
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    return constructMetadata(seo, {
      title: "Privacy Policy | BuyOrSell",
      description: "Learn how BuyOrSell collects, uses, and protects your personal data.",
      url: route
    });
  } catch (error) {
    return {
      title: "Privacy Policy | BuyOrSell",
      description:
        "Learn how BuyOrSell collects, uses, and protects your personal data.",
    };
  }
}

export default function PrivacyPolicyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center font-inter text-purple animate-pulse">
          Loading Privacy Policy...
        </div>
      }
    >
      <PrivacyPolicyContent />
    </Suspense>
  );
}
