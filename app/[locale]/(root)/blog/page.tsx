import { Metadata } from "next";
import { Suspense } from "react";
import { BlogList } from "./_components/BlogList";
import { getTranslations } from "@/translations";
import { Locale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  return {
    title: t.blog.title,
    description: t.blog.blogDescription,
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = getTranslations(locale as Locale);
  
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            {t.blog.ourBlog.split(" ")[0]}{" "}
            <span className="text-purple">
              {t.blog.ourBlog.split(" ").slice(1).join(" ")}
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            {t.blog.blogDescription}
          </p>
        </header>

        <Suspense fallback={<div className="text-center py-20">{t.blog.loadingBlogs}</div>}>
          <BlogList locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
