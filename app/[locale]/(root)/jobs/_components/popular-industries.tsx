"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { H4, Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import JobsSectionTitle from "./jobs-section-title";
import { useJobSubcategories } from "@/hooks/useCategories";
import { useLocale } from "@/hooks/useLocale";
import { slugify } from "@/utils/slug-utils";
import { containerVariants, itemVariants } from "@/utils/animation-variants";
import { Container1080 } from "@/components/layouts/container-1080";

export default function PopularIndustries() {
  const { localePath, t } = useLocale();
  const { data: jobSubcategories, isLoading } = useJobSubcategories({
    adType: "job",
  });

  // Show loading skeleton
  if (isLoading) {
    return (
      <section className="w-full bg-[#F2F4F7] dark:bg-black py-16">
        <div className="max-w-[1080px] mx-auto px-4">
          <JobsSectionTitle>{t.jobs.industries.title}</JobsSectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-zinc-900 w-full aspect-[4/3] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Only use API data, no fallback
  if (!jobSubcategories || jobSubcategories.length === 0) {
    return null;
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full bg-[#F2F4F7] dark:bg-black py-16"
    >
      <Container1080 className="px-4 space-y-10">
        <JobsSectionTitle>{t.jobs.industries.title}</JobsSectionTitle>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {jobSubcategories.filter((industry) => industry.adCount > 0).map((industry) => {
            const industryId = industry._id;
            const industryName = industry.name || "";
            const jobCount = industry.adCount || 0;
            const logoUrl = industry.icon || industry.mobileImage;
            const href = localePath(`/jobs/listing/${slugify(industryName)}`);

            return (
              <motion.div key={industryId} variants={itemVariants}>
                <Link
                  href={href}
                  className="bg-white dark:bg-zinc-900 w-full rounded-2xl p-6 hover:shadow-2xl hover:shadow-purple/10 hover:border-purple border border-[#E2E2E2] dark:border-zinc-800 transition-all duration-500 flex flex-col items-center justify-center gap-5 group min-h-[220px]"
                >
                  {/* Logo/Icon container */}
                  <div className="flex items-center justify-center size-[72px] bg-gray-50/50 dark:bg-zinc-800/50 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={industryName}
                        width={144}
                        height={144}
                        quality={100}
                        unoptimized={true}
                        className="object-contain size-full p-3 filter drop-shadow-sm"
                      />
                    ) : (
                      <div className="size-full bg-purple/10 rounded-2xl flex items-center justify-center">
                        <span className="text-purple font-bold text-xl uppercase">
                          {industryName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content container */}
                  <div className="flex flex-col items-center gap-3 w-full">
                    <Typography
                      className="text-dark-blue dark:text-zinc-100 font-bold text-center group-hover:text-purple transition-colors text-sm lg:text-base leading-snug px-1 h-10 flex items-center justify-center overflow-visible"
                    >
                      {industryName}
                    </Typography>

                    <Badge variant="secondary" className="bg-purple/5 text-purple hover:bg-purple/10 border-transparent px-3 py-1 rounded-lg text-xs font-semibold transition-colors">
                      {t.jobs.industries.jobsCount.replace("{count}", jobCount.toLocaleString())}
                    </Badge>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container1080>
    </motion.section>
  );
}
