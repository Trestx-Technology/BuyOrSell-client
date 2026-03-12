"use client";

import Link from "next/link";
import blogsData from "@/data/blogs.json";
import { Blog } from "@/interfaces/blog";
import { BlogCard } from "./BlogCard";

interface BlogListProps {
  locale: string;
}

export const BlogList = ({ locale }: BlogListProps) => {
  const blogs = blogsData as Blog[];

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} locale={locale} />
      ))}
    </div>
  );
};
