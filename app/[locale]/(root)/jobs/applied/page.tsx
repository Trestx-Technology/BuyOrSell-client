import MyAppliedJobs from "./_components/my-applied-jobs";
import { getTranslations } from "@/translations";
import { Metadata } from "next";
import { Locale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations(locale as Locale);

  return {
    title: t.jobs.applied.title,
    description: t.jobs.applied.description,
    openGraph: {
      title: t.jobs.applied.title,
      description: t.jobs.applied.description,
    },
    twitter: {
      title: t.jobs.applied.title,
      description: t.jobs.applied.description,
    },
  };
}

export default function AppliedJobs() {
  return <MyAppliedJobs />;
}
