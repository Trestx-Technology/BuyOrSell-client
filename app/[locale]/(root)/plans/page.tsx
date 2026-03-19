import { Metadata } from 'next';
import { PlansMain } from "./_components/PlansMain";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from "@/utils/metadata-utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
): Promise<Metadata> {
  const route = "/plans";

  try {
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    return constructMetadata(seo, {
      title: "Subscription Plans | BuyOrSell",
      description: "Choose the best plan for your needs and start buying, selling, and exchanging on BuyOrSell.",
      url: route
    });
  } catch (error) {
    return {
      title: "Subscription Plans | BuyOrSell",
      description: "Choose the best plan for your needs and start buying, selling, and exchanging on BuyOrSell.",
    };
  }
}

export default function PlansPage() {
  return <PlansMain />;
}
