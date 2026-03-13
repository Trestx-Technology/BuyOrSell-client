import { Metadata } from "next";
import { Suspense } from "react";
import { BlogList } from "./_components/BlogList";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: "Blog | BuyOrSell",
    description: "Explore the latest guides and insights on motors and real estate in the UAE.",
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Our <span className="text-purple">Blog</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Stay updated with the latest trends in the UAE market.
          </p>
        </header>

        <Suspense fallback={<div className="text-center py-20">Loading blogs...</div>}>
          <BlogList locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
