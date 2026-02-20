"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Banner } from "@/interfaces/banner.types";
import { slugify } from "@/utils/slug-utils";

interface BannerCTAWrapperProps {
      banner: { callToAction?: string[] | string; link?: string; image?: string };
      children: React.ReactNode;
      className?: string;
}

export const BannerCTAWrapper = ({ banner, children, className }: BannerCTAWrapperProps) => {
      const cta = banner?.callToAction;

      // Handle both string and string[] for callToAction
      const isArray = Array.isArray(cta);
      const isString = typeof cta === 'string';

      const linkHref = cta
            ? (isArray && cta.length > 0
                  ? `/categories/${(cta as string[]).map((item) => slugify(item)).join("/")}`
                  : isString && cta.length > 0
                        ? `/categories/${slugify(cta as string)}`
                        : banner.link)
            : banner.link;

      const hasCTA = cta && (isArray ? (cta as string[]).length > 0 : isString && (cta as string).length > 0);

      const content = (
            <div className={cn("relative w-full h-full overflow-hidden", className)}>
                  {children}
                  {hasCTA && (
                        <div className="absolute inset-x-0 bottom-4 z-20 flex flex-col items-center pointer-events-none">
                              <div className="bg-white/90 dark:bg-white/40 hover:bg-white dark:hover:bg-black transition-all duration-300 text-black dark:text-white border-none px-6 py-2 font-medium rounded shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                                    Explore Deals
                              </div>
                        </div>
                  )}
            </div>
      );

      if (linkHref) {
            return (
                  <Link href={linkHref} className="block w-full h-full group">
                        {content}
                  </Link>
            );
      }

      return content;
};
