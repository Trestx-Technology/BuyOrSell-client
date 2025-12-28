import { Metadata } from "next";
import JobHomeComponent from "./_components/job-home-component";
import { getTranslations } from "@/translations";
import { type Locale, locales, defaultLocale } from "@/lib/i18n/config";

interface JobsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: JobsPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (
    locales.includes(localeParam as Locale)
      ? (localeParam as Locale)
      : defaultLocale
  ) as Locale;
  const t = getTranslations(locale);

  return {
    title: t.jobs.title,
    description: t.jobs.description,
    keywords: [
      "jobs UAE",
      "career opportunities",
      "job search",
      "employment UAE",
      "job listings",
      "career success",
    ],
  };
}

export default function JobsHomePage() {
  return (
    <main className="bg-white">
      <JobHomeComponent />
    </main>
  );
}
