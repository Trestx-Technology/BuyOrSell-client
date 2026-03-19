import { Metadata } from 'next';
import { HelpCenterContent } from "./_components/HelpCenterContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from "@/utils/metadata-utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const route = "/help-centre";

  try {
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    return constructMetadata(seo, {
      title: "Help Center | BuyOrSell",
      description: "Get support, manage your tickets, and find answers to common questions.",
      url: route
    });
  } catch (error) {
    return {
      title: "Help Center | BuyOrSell",
      description: "Get support, manage your tickets, and find answers to common questions.",
    };
  }
}

export default function HelpCenterPage() {
  return <HelpCenterContent />;
}
