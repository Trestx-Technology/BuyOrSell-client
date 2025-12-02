"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import JobsSectionTitle from "./jobs-section-title";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
    },
  },
};

interface PopularIndustriesProps {
  industries?: Array<{
    id?: string;
    name?: string;
    jobCount?: number;
    logoUrl?: string;
    [key: string]: unknown;
  }>;
}

export default function PopularIndustries({ industries }: PopularIndustriesProps = {}) {
  // Only use API data, no fallback
  if (!industries || industries.length === 0) {
    return null;
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full bg-[#F2F4F7] py-8"
    >
      <div className="max-w-[1080px] mx-auto px-4">
        <JobsSectionTitle>Popular Industries</JobsSectionTitle>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {industries.map((industry, index) => {
            const industryId = industry.id || String(index);
            const industryName = industry.name || "";
            const jobCount = industry.jobCount || 0;
            const logoUrl = industry.logoUrl;
            const href = `/jobs/listing?industry=${industryId}`;

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
                    className="text-dark-blue font-semibold text-xl text-center group-hover:text-purple transition-colors line-clamp-1"
                  >
                    {industryName}
                  </Typography>

                  {/* Job Count Badge */}
                  <Badge className="bg-purple/20 text-purple px-4 py-1.5 rounded-full text-sm font-medium">
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

