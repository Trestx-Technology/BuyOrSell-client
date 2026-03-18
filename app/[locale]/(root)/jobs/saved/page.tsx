import MySavedJobs from "./_components/my-saved-jobs";
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
    title: t.jobs.saved.title,
    description: t.jobs.saved.description,
    openGraph: {
      title: t.jobs.saved.title,
      description: t.jobs.saved.description,
    },
    twitter: {
      title: t.jobs.saved.title,
      description: t.jobs.saved.description,
    },
  };
}

export default function SavedJobs() {
  return <MySavedJobs />;
}
