import { Metadata } from 'next';
import DealsContent from "./_components/DealsContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from "@/utils/metadata-utils";

type Props = {
      params: Promise<{ locale: string }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
      { params, searchParams }: Props
): Promise<Metadata> {
      const route = "/deals";

      try {
            const seoResponse = await getSeoByRoute(route);
            const seo = seoResponse.data;

        return constructMetadata(seo, {
          title: "Hot Deals & Offers | BuyOrSell",
          description: "Find limited-time offers and hot deals on BuyOrSell.",
          url: route
        });
  } catch (error) {
        return {
              title: "Hot Deals & Offers | BuyOrSell",
              description: "Find limited-time offers and hot deals on BuyOrSell.",
        };
      }
}

export default function HotDealsPage() {
      return <DealsContent />;
}
