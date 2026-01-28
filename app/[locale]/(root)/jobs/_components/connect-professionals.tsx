"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import JobsSectionTitle from "./jobs-section-title";
import { useAuthStore } from "@/stores/authStore";
import { containerVariants } from "@/utils/animation-variants";
import { useSearchJobseekerProfiles } from "@/hooks/useJobseeker";
import { JobseekerProfile } from "@/interfaces/job.types";
import ProfessionalCard from "./professional-card";
import { Container1080 } from "@/components/layouts/container-1080";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { Skeleton } from "@/components/ui/skeleton";


interface ConnectProfessionalsProps {
  professionals?: JobseekerProfile[];
  isLoading?: boolean;
}

export default function ConnectProfessionals({
  professionals: professionalsProp,
  isLoading: isLoadingProp,
}: ConnectProfessionalsProps = {}) {
  // Get current user ID (still useful if needed, but ProfessionalCard handles its own)

  // Fetch jobseeker profiles from API
  const {
    data: searchResponse,
    isLoading: isSearchLoading,
  } = useSearchJobseekerProfiles({
    limit: 10,
    page: 1,
    onlyUnblocked: true,
    onlyUnbanned: true,
  });

  // Use API data if available, otherwise fallback to props
  const professionals =
    searchResponse?.data.items || [];

  const isLoading = isSearchLoading || isLoadingProp;

  if (isLoading) {
    return (
      <section className="w-full py-12">
        <Container1080 className="mx-auto px-4">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="rounded-2xl w-full max-w-[240px] h-[420px] animate-pulse"
              />
            ))}
          </div>
        </Container1080>
      </section>
    );
  }

  if (professionals.length === 0) {
    return null;
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="py-5"
    >
      <div className="max-w-[1080px] mx-auto space-y-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center gap-4">
          <JobsSectionTitle>Connect Professionals</JobsSectionTitle>
          <Link href="/jobs/jobseeker" className="group">
            <Typography
              variant="body-large"
              className="text-purple font-semibold text-base hover:underline transition-all flex items-center gap-1"
            >
              View all
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Typography>
          </Link>
        </div>

        {/* Professionals Carousel */}
        <div className="w-full">
          <CardsCarousel
            showNavigation={true}
            className="pb-5"
            breakpoints={{
              mobile: 1,
              tablet: 2,
              desktop: 3,
              wide: 4
            }}
          >
            {professionals?.map((professional, index) => {
              return (
                <div key={`${professional._id}-${index}`} className="flex justify-center p-2 min-w-[280px]">
                  <ProfessionalCard
                    professional={professional}
                  />
                </div>
              );
            })}
          </CardsCarousel>
        </div>
      </div>
    </motion.section>
  );
}
