"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import JobsSectionTitle from "./jobs-section-title";
import { Organization } from "@/interfaces/organization.types";
import { EmployerCard } from "./employer-card";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 22,
    },
  },
};

interface TopEmployersSectionProps {
  employers?: Organization[];
  isLoading?: boolean;
}

export default function TopEmployersSection({ 
  employers: employersProp, 
  isLoading: isLoadingProp 
}: TopEmployersSectionProps = {}) {
  // Only use API data, no fallback
  const employers = employersProp || [];
  const isLoading = isLoadingProp ?? false;


  if (isLoading) {
    return (
      <section className="w-full bg-white py-8">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl h-48 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (employers.length === 0) {
    return null;
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full bg-white py-8"
    >
      <div className="max-w-[1080px] mx-auto px-4">
        <div className="py-8 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center gap-[35.56px] max-w-[1080px] mx-auto w-full">
            <JobsSectionTitle>Top Employers</JobsSectionTitle>
            <Link href="/jobs/employers">
              <Typography
                variant="body-large"
                className="text-purple font-semibold text-base hover:underline"
              >
                View all
              </Typography>
            </Link>
          </div>

          {/* Employers Grid */}
          <div className="flex gap-5 justify-start w-full">
            {employers.slice(0, 4).map((employer) => (
              <motion.div key={employer._id} variants={itemVariants} className="w-full max-w-[256px]">
                <EmployerCard
                  logo={employer.logoUrl || ""}
                  name={employer.tradeName || employer.legalName}
                  category={employer.type || "Company"}
                  followers={employer.followersCount || 0}
                  employerId={employer._id}
                  isFollowing={employer.isFollowing}
                  isWishlisted={employer.isSaved}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
