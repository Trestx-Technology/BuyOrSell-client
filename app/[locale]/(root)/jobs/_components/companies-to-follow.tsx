"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import JobsSectionTitle from "./jobs-section-title";
import { EmployerCard } from "./employer-card";
import {
  useOrganizations,
  useFollowOrganization,
  useUnfollowOrganization,
} from "@/hooks/useOrganizations";
import { Organization } from "@/interfaces/organization.types";
import { useQueryClient } from "@tanstack/react-query";
import { organizationQueries } from "@/app/api/organization";
import { containerVariants, itemVariants } from "@/utils/animation-variants";
import { useAuthStore } from "@/stores/authStore";
import { useLocale } from "@/hooks/useLocale";

interface CompaniesToFollowProps {
  limit?: number;
}

export default function CompaniesToFollow({
  limit = 4,
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

  const followOrganization = useFollowOrganization();
  const unfollowOrganization = useUnfollowOrganization();

  const organizations = organizationsData?.data?.items?.filter((org) => org.owner._id !== currentUserId) || [];

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
        return localePath(`/jobs/organization/${organization._id}`);
      }
      // Not the owner, use default employer page
      return localePath(`/jobs/employer/${organization._id}`);
    };
  }, [currentUserId, localePath]);

  const handleFollow = (organization: Organization) => {
    const mutation = organization.isFollowing
      ? unfollowOrganization
      : followOrganization;

    mutation.mutate(organization._id, {
      onSuccess: () => {
        // Invalidate search query to refresh the list with updated follow status
        queryClient.invalidateQueries({
          queryKey: organizationQueries.findAllOrganizations({ limit, page: 1 })
            .Key,
        });
      },
    });
  };

  if (isLoading) {
    return (
      <section className="w-full py-8">
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

  if (!isLoading && organizations.length === 0) {
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
        <div className="py-8 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center gap-[35.56px] max-w-[1080px] mx-auto w-full">
            <JobsSectionTitle>Organizations to Follow</JobsSectionTitle>
            <Link href="/jobs/organization">
              <Typography
                variant="body-large"
                className="text-purple font-semibold text-base hover:underline"
              >
                View all
              </Typography>
            </Link>
          </div>

          {/* Organizations Grid */}
          <div className="flex flex-wrap gap-5 justify-start w-full">
            {organizations.slice(0, limit).map((organization) => (
                <EmployerCard
                  logo={organization.logoUrl || ""}
                  name={organization.tradeName || organization.legalName}
                  category={organization.type || "Organization"}
                  followers={organization.followersCount || 0}
                  employerId={organization._id}
                  href={getOrganizationHref(organization)}
                onFollow={() => handleFollow(organization)}
                  isFollowing={organization.isFollowing || false}
                isWishlisted={organization.isSaved || false}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
