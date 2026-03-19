import { Metadata } from 'next';
import ConnectionsContent from "./_components/ConnectionsContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from "@/utils/metadata-utils";

type Props = {
      params: Promise<{ locale: string }>;
      searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
      { params, searchParams }: Props
): Promise<Metadata> {
      const route = "/connections";

      try {
        const seoResponse = await getSeoByRoute(route);
        const seo = seoResponse.data;

        return constructMetadata(seo, {
          title: "My Network | BuyOrSell",
          description: "Manage your professional connections and network requests on BuyOrSell.",
          url: route
        });
      } catch (error) {
            return {
                  title: "My Network | BuyOrSell",
                  description: "Manage your professional connections and network requests on BuyOrSell.",
            };
      }
}

export default function ConnectionsPage() {
      return <ConnectionsContent />;
}
