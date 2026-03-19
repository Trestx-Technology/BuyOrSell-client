import { Metadata } from 'next';
import { ContactUsContent } from "./_components/ContactUsContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from "@/utils/metadata-utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const route = "/contact-us";

  try {
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    return constructMetadata(seo, {
      title: "Contact Us | BuyOrSell",
      description: "Get in touch with the BuyOrSell team for any queries or support.",
      url: route
    });
  } catch (error) {
    return {
      title: "Contact Us | BuyOrSell",
      description: "Get in touch with the BuyOrSell team for any queries or support.",
    };
  }
}

export default function ContactUsPage() {
  return <ContactUsContent />;
}
