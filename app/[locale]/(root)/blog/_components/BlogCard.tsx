"use client";

import Link from "next/link";
import { Blog } from "@/interfaces/blog";
import { motion } from "framer-motion";
import { ChevronRight, Calendar } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
  locale: string;
}

export const BlogCard = ({ blog, locale }: BlogCardProps) => {
  const { t } = useLocale();

  const isRTL = locale === "ar";
  const displayTitle = isRTL ? blog.title_ar || blog.title : blog.title;
  const displayExcerpt = isRTL ? blog.excerpt_ar || blog.excerpt : blog.excerpt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      dir={isRTL ? "rtl" : "ltr"}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-xl border border-gray-100 dark:border-gray-700 text-start"
    >
      <Link href={`/${locale}/blog/${blog.slug}`} className="absolute inset-0 z-10">
        <span className="sr-only">View {displayTitle}</span>
      </Link>
      
      {/* Placeholder Image Space */}
      <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-700">
        {blog.image ? (
          <img
            src={blog.image}
            alt={displayTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple/10 to-indigo-600/10">
            <span className="text-purple/40 font-medium">Image Placeholder</span>
          </div>
        )}
        <div className={cn("absolute top-4", isRTL ? "right-4" : "left-4")}>
          <span className="inline-flex items-center rounded-full bg-purple/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {blog.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className={cn("h-4 w-4", isRTL ? "ml-1.5" : "mr-1.5")} />
          {t.blog.postedOn} {blog.date}
        </div>
        
        <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple transition-colors">
          {displayTitle}
        </h3>
        
        <p className="mb-6 line-clamp-3 text-gray-600 dark:text-gray-400">
          {displayExcerpt}
        </p>
        
        <div className="mt-auto flex items-center font-semibold text-purple">
          {t.blog.readMore}
          <ChevronRight className={cn("h-4 w-4 transition-transform", isRTL ? "mr-1 group-hover:-translate-x-1 rotate-180" : "ml-1 group-hover:translate-x-1")} />
        </div>
      </div>
    </motion.div>
  );
};
