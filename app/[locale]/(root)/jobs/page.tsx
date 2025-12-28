import { Metadata } from "next";
import JobHomeComponent from "./_components/job-home-component";
import { getTranslations } from "@/translations";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
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

export default function JobsHomePage() {
  return (
    <main className="bg-white">
      <JobHomeComponent />
    </main>
  );
}
