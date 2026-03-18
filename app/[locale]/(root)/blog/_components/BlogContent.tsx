"use client";

import { Blog } from "@/interfaces/blog";
import { motion } from "framer-motion";
import { Calendar, Tag, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";

interface BlogContentProps {
  blog: Blog;
  locale: string;
}

export const BlogContent = ({ blog, locale }: BlogContentProps) => {
  const { t } = useLocale();
  const isRTL = locale === "ar";
  const displayTitle = isRTL ? blog.title_ar || blog.title : blog.title;
  const displayContent = isRTL ? blog.content_ar || blog.content : blog.content;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" dir={isRTL ? "rtl" : "ltr"}>
      <Link
        href={`/${locale}/blog`}
        className="inline-flex items-center text-sm font-medium text-purple hover:underline mb-8 group"
      >
        <ChevronLeft className={cn("h-4 w-4 transition-transform", isRTL ? "ml-1 group-hover:translate-x-1 rotate-180" : "mr-1 group-hover:-translate-x-1")} />
        {t.common.back}
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <div className="mb-4 flex items-center justify-center space-x-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          <span className={cn("inline-flex items-center rounded-full bg-purple/10 px-3 py-1 text-purple", isRTL ? "space-x-reverse" : "")}>
            <Tag className={cn("h-3.5 w-3.5", isRTL ? "ml-1.5" : "mr-1.5")} />
            {blog.category}
          </span>
          <span className="flex items-center">
            <Calendar className={cn("h-3.5 w-3.5", isRTL ? "ml-1.5" : "mr-1.5")} />
            {blog.date}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          {displayTitle}
        </h1>
      </motion.header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative mb-12 aspect-[21/9] overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800 shadow-2xl"
      >
        {blog.image ? (
          <img
            src={blog.image}
            alt={displayTitle}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple/20 via-indigo-500/10 to-transparent">
            <span className="text-purple/50 font-semibold text-2xl">
              Visual Asset Reserved
            </span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="prose prose-lg prose-purple dark:prose-invert max-w-none text-start"
      >
        {/* Simplified rendering of content */}
        <div className="whitespace-pre-wrap leading-relaxed">
          {displayContent.split("\n").map((para, index) => {
            if (para.startsWith("## ")) {
              return (
                <h2 key={index} className="text-3xl font-bold mt-10 mb-4">
                  {para.replace("## ", "")}
                </h2>
              );
            }
            if (para.startsWith("### ")) {
              return (
                <h3 key={index} className="text-2xl font-bold mt-8 mb-3">
                  {para.replace("### ", "")}
                </h3>
              );
            }

            if (para.startsWith("**")) {
              return (
                <strong key={index} className="text-gray-900 dark:text-white">
                  {para.replace("**", "")}
                </strong>
              );
            }
            if (para.startsWith("* ")) {
              return (
                <li key={index} className={cn("list-disc mb-2", isRTL ? "mr-6" : "ml-6")}>
                  {para.replace("* ", "")}
                </li>
              );
            }
            return para.trim() ? (
              <p key={index} className="mb-6">
                {para}
              </p>
            ) : null;
          })}
        </div>
      </motion.div>

      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-gray-600 dark:text-gray-400">
            {isRTL ? "هل استمتعت بهذا الدليل؟ شاركه مع أصدقائك!" : "Enjoyed this guide? Share it with your friends!"}
          </div>
          <div className="flex space-x-4 space-x-reverse-rtl">
            {["Twitter", "Facebook", "LinkedIn"].map((platform) => (
              <button
                key={platform}
                className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-purple hover:text-white transition-colors"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};
