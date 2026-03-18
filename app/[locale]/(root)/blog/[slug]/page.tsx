import { Metadata } from "next";
import { notFound } from "next/navigation";
import blogsData from "@/data/blogs.json";
import { Blog } from "@/interfaces/blog";
import { BlogContent } from "../_components/BlogContent";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const blogs = blogsData as Blog[];
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const blog = (blogsData as Blog[]).find((b) => b.slug === slug);

  if (!blog) return { title: "Blog Not Found" };

  const isRTL = locale === "ar";
  const displayTitle = isRTL ? blog.title_ar || blog.title : blog.title;
  const displayExcerpt = isRTL ? blog.excerpt_ar || blog.excerpt : blog.excerpt;

  return {
    title: `${displayTitle} | BuyOrSell Blog`,
    description: displayExcerpt,
    openGraph: {
      title: displayTitle,
      description: displayExcerpt,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;
  const blog = (blogsData as Blog[]).find((b) => b.slug === slug);

  if (!blog) {
    return notFound();
  }

  return (
    <article className="min-h-screen pt-4 pb-20">
      <BlogContent blog={blog} locale={locale} />
    </article>
  );
}
