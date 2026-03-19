import { Metadata } from 'next';
import ChatContent from "./_components/ChatContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from "@/utils/metadata-utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const route = "/chat";

  try {
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    return constructMetadata(seo, {
      title: "Chat & Messages | BuyOrSell",
      description: "Chat with buyers and sellers on BuyOrSell.",
      url: route
    });
  } catch (error) {
    return {
      title: "Chat & Messages | BuyOrSell",
      description: "Chat with buyers and sellers on BuyOrSell.",
    };
  }
}

export default function ChatPage() {
  return <ChatContent />;
}
