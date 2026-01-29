"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { H2, H3, Typography } from "@/components/typography";
import JobsSectionTitle from "./jobs-section-title";
import { EmployerCard } from "./organisation-card";
import {
  useOrganizations,
} from "@/hooks/useOrganizations";
import { Organization } from "@/interfaces/organization.types";
import { useQueryClient } from "@tanstack/react-query";
import { containerVariants } from "@/utils/animation-variants";
import { useAuthStore } from "@/stores/authStore";
import { useLocale } from "@/hooks/useLocale";
import { CardsCarousel } from "@/components/global/cards-carousel";
import { Container1080 } from "@/components/layouts/container-1080";

interface CompaniesToFollowProps {
  limit?: number;
}

export default function CompaniesToFollow({
  limit = 10, // Increased default limit for carousel
}: CompaniesToFollowProps = {}) {
  const queryClient = useQueryClient();
  const { localePath } = useLocale();
  const { session } = useAuthStore((state) => state);
  const currentUserId = session.user?._id;

  // Fetch organizations using search API
  const { data: organizationsData, isLoading } = useOrganizations({
    limit: limit,
    page: 1,
  });


  const organizations = organizationsData?.data?.items?.filter((org) => org?.owner?._id !== currentUserId) || [];

  // Check if user is owner and get navigation href
  const getOrganizationHref = useMemo(() => {
    return (organization: Organization): string => {
      // Check if current user is the owner
      const ownerId =
        typeof organization.owner === "string"
          ? organization.owner
          : organization.owner?._id;

      if (currentUserId && ownerId === currentUserId) {
        // User is the owner, redirect to organization page
        return localePath(`/organizations/${organization._id}`);
      }
      // Not the owner, use default employer page
      return localePath(`/organizations/${organization._id}`);
    };
  }, [currentUserId, localePath]);


  if (isLoading) {
    return (
      <section className="w-full py-8">
        <div className="max-w-[1080px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-3xl h-[200px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!isLoading && organizations.length === 0) {
    return null;
  }

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="w-full overflow-hidden"
    >
      <Container1080 className="px-4">
          {/* Header */}
        <div className="flex justify-between items-center max-w-[1080px] mx-auto w-full">
            <JobsSectionTitle>Organizations to Follow</JobsSectionTitle>
          <Link href="/organizations" className="text-purple font-semibold hover:underline flex items-center gap-1">
                View all
            <svg
              className="w-4 h-4"
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
            </Link>
          </div>

        {/* Organizations Carousel */}
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
          {organizations.map((organization, index) => (
            <div key={`${organization._id}-${index}`} className="flex justify-center p-2">
                <EmployerCard
                  logo={organization.logoUrl || ""}
                  name={organization.tradeName || organization.legalName}
                  category={organization.type || "Organization"}
                  followers={organization.followersCount || 0}
                  employerId={organization._id}
                href={getOrganizationHref(organization)}
                  isFollowing={organization.isFollowing || false}
                isWishlisted={organization.isSaved || false}
              />
            </div>
          ))}
        </CardsCarousel>
      </Container1080>
    </motion.section>
  );
}
