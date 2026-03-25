import { Metadata } from 'next';
import { ReportIssueContent } from "./_components/ReportIssueContent";
import { getSeoByRoute } from "@/app/api/seo/seo.services";
import { constructMetadata } from "@/utils/metadata-utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props
): Promise<Metadata> {
  const route = "/report-issue";

  try {
    const seoResponse = await getSeoByRoute(route);
    const seo = seoResponse.data;

    return constructMetadata(seo, {
      title: "Report an Issue | BuyOrSell",
      description: "Report a bug, suggestion, or other issue on the platform.",
      url: route
    });
  } catch (error) {
    return {
      title: "Report an Issue | BuyOrSell",
      description: "Report a bug, suggestion, or other issue on the platform.",
    };
  }
}

export default function ReportIssuePage() {
  return <ReportIssueContent />;
}
