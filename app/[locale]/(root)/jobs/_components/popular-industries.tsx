"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import JobsSectionTitle from "./jobs-section-title";
import { useJobSubcategories } from "@/hooks/useCategories";
import { useLocale } from "@/hooks/useLocale";
import { slugify } from "@/utils/slug-utils";
import { containerVariants, itemVariants } from "@/utils/animation-variants";

export default function PopularIndustries() {
  const { localePath } = useLocale();
  const { data: jobSubcategories, isLoading } = useJobSubcategories({
    adType: "job",
  });

  // Show loading skeleton
  if (isLoading) {
    return (
      <section className="w-full bg-[#F2F4F7] py-8">
        <div className="max-w-[1080px] mx-auto px-4">
          <JobsSectionTitle>Popular Industries</JobsSectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-white w-[200px] h-[180px] rounded-2xl animate-pulse"
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
    >
      <div className="max-w-[1080px] mx-auto px-4">
        <JobsSectionTitle>Popular Industries</JobsSectionTitle>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {jobSubcategories.map((industry) => {
            const industryId = industry._id;
            const industryName = industry.name || "";
            const jobCount = industry.adCount || 0;
            const logoUrl = industry.icon || industry.mobileImage;
            const href = localePath(`/jobs/listing/${slugify(industryName)}`);

            return (
              <motion.div key={industryId} variants={itemVariants}>
                <Link
                  href={href}
                  className="bg-white w-[200px] h-fit rounded-2xl py-6 hover:shadow-lg hover:border-purple border border-[#E2E2E2] transition-all duration-300 flex flex-col items-center gap-2 group"
                >
                  {/* Logo/Icon */}
                  <div className="flex items-center justify-center size-[60px]">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={industryName}
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    ) : (
                      <div className="size-[60px] bg-purple/10 rounded-full flex items-center justify-center">
                        <span className="text-purple font-bold text-xl">
                          {industryName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Industry Name */}
                  <Typography
                    variant="body-large"
                    className="text-dark-blue font-semibold text-lg truncate max-w-[150px] text-center group-hover:text-purple transition-colors line-clamp-1"
                  >
                    {industryName}
                  </Typography>

                  {/* Job Count Badge */}
                  <Badge className="bg-purple/10 text-purple px-4 py-1 capitalize rounded-md text-sm font-medium">
                    {jobCount.toLocaleString()} jobs
                  </Badge>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
