"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Banner } from "@/interfaces/banner.types";
import { slugify } from "@/utils/slug-utils";

interface BannerCTAWrapperProps {
  banner: Banner;
  children: React.ReactNode;
  className?: string;
}

export const BannerCTAWrapper = ({
  banner,
  children,
  className,
}: BannerCTAWrapperProps) => {
  const cta = banner?.callToAction;

  // Handle both string and string[] for callToAction
  const isArray = Array.isArray(cta);
  const isString = typeof cta === "string";

  let linkHref = banner.link;
  let isExternal = false;

  const isSponsoredStr = banner.sponsored || banner.isSponsored;

  // If it's explicitly a sponsored banner with a specific target, redirect to that
  if (isSponsoredStr && banner.sponsoredLink) {
    linkHref = banner.sponsoredLink;
    isExternal = true;
  } else if (cta) {
    linkHref =
      isArray && (cta as string[]).length > 0
        ? `/categories/${(cta as string[]).map((item) => slugify(item)).join("/")}`
        : isString && (cta as string).length > 0
          ? `/categories/${slugify(cta as string)}`
          : banner.link;
  }

  const hasCTA =
    cta &&
    (isArray
      ? (cta as string[]).length > 0
      : isString && (cta as string).length > 0);

  const displayCTA = hasCTA || !!(isSponsoredStr && banner.sponsoredLink);
  const buttonText =
    banner.buttonLabel || (hasCTA ? "Explore All Deals" : "Learn More");

  const content = (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden group/banner",
        className,
      )}
    >
      {children}

      {(banner.title || banner.content || displayCTA) && (
        <div className="absolute inset-0 z-20 flex flex-col items-start justify-center p-4 sm:p-6 md:p-8 text-left bg-gradient-to-r from-black/80 via-black/40 to-transparent">
          {banner.title && (
            <h3 className="text-white font-bold text-base sm:text-lg md:text-xl lg:text-3xl drop-shadow-xl mb-1 sm:mb-2 max-w-[95%] md:max-w-[75%] leading-tight">
              {banner.title}
            </h3>
          )}
          {banner.content && (
            <p className="text-white/90 text-xs sm:text-sm md:text-base drop-shadow-lg max-w-[95%] md:max-w-[65%] leading-snug line-clamp-2">
              {banner.content}
            </p>
          )}

          {displayCTA && (
            <div className="mt-2 sm:mt-4 z-[100]">
              <div className="bg-white hover:bg-gray-100 transition-all duration-300 text-black border-none px-4 py-1.5 sm:px-6 sm:py-2.5 font-semibold rounded shadow-lg hover:-translate-y-0.5 transform cursor-pointer inline-block text-xs sm:text-sm">
                {buttonText}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (linkHref) {
    if (isExternal) {
      return (
        <Link
          href={linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full group"
        >
          {content}
        </Link>
      );
    }
    return (
      <Link href={linkHref} className="block w-full h-full group">
        {content}
      </Link>
    );
  }

  return content;
};
