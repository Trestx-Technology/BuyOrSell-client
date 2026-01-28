"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import JobsSectionTitle from "./jobs-section-title";
import { useSendConnectionRequest } from "@/hooks/useConnections";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { containerVariants, itemVariants } from "@/utils/animation-variants";
import { useSearchJobseekerProfiles } from "@/hooks/useJobseeker";
import { JobseekerProfile } from "@/interfaces/job.types";
import ProfessionalCard from "./professional-card";
import { Container1080 } from "@/components/layouts/container-1080";

interface ConnectProfessionalsProps {
  professionals?: JobseekerProfile[];
  isLoading?: boolean;
}

export default function ConnectProfessionals({
  professionals: professionalsProp,
  isLoading: isLoadingProp,
}: ConnectProfessionalsProps = {}) {
  // Get current user ID
  const session = useAuthStore((state) => state.session);
  const currentUserId = session?.user?._id;

  // Fetch jobseeker profiles from API
  const {
    data: searchResponse,
    isLoading: isSearchLoading,
  } = useSearchJobseekerProfiles({
    limit: 4,
    page: 1,
    onlyUnblocked: true,
    onlyUnbanned: true,
  });

  // Transform API response to JobseekerProfile array
  const professionalsFromApi = useMemo(() => {
    if (
      !searchResponse?.data?.items ||
      !Array.isArray(searchResponse.data.items)
    ) {
      return [];
    }

    return searchResponse.data.items.filter(
      (item): item is JobseekerProfile =>
        item != null &&
        typeof item === "object" &&
        typeof (item as JobseekerProfile)._id === "string" &&
        typeof (item as JobseekerProfile).userId === "string"
    );
  }, [searchResponse]);

  // Use API data if available, otherwise fallback to props
  const professionals =
    professionalsFromApi.length > 0
      ? professionalsFromApi
      : professionalsProp || [];
  const isLoading = isSearchLoading || isLoadingProp;

  // Mutation hooks - only call APIs when user clicks connect
  const sendRequestMutation = useSendConnectionRequest();

  const handleConnect = async (userId: string) => {
    if (!currentUserId) {
      toast.error("Please log in to connect with professionals");
      return;
    }

    // Find the professional to check current connection status
    const professional = professionals.find((p) => p.userId === userId);
    const isConnected = professional?.userId === currentUserId;

    if (isConnected) {
      // TODO: Need connection ID to remove - will need to fetch when needed
      // For now, show error that this needs to be implemented
      toast.error("Remove connection functionality needs connection ID");
    } else {
      // Send new connection request
      try {
        await sendRequestMutation.mutateAsync({ receiverId: userId });
        toast.success("Connection request sent");
      } catch (error) {
        toast.error("Failed to send connection request");
      }
    }
  };

  if (isLoading) {
    return (
      <section className="w-full py-12">
        <Container1080 className="mx-auto px-4">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl w-full max-w-[240px] h-[420px] animate-pulse"
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
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
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

        {/* Professionals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {professionals.slice(0, 4).map((professional) => {
            // Get connection status from API response if available
            const profileItem = searchResponse?.data?.items?.find(
              (item: unknown) =>
                typeof item === "object" &&
                item !== null &&
                (item as JobseekerProfile)._id === professional._id
            ) as
              | {
                  isConnected?: boolean;
                  connectionStatus?: string;
                  connectionDirection?: string;
                  requestId?: string;
                }
              | undefined;

            // Determine if connected based on API response or fallback to userId check
            const isConnected =
              profileItem?.isConnected ||
              profileItem?.connectionStatus === "ACCEPTED" ||
              professional.userId === currentUserId;

            return (
                <ProfessionalCard
                  professional={professional}
                  onConnect={handleConnect}
                  isConnected={isConnected}
                  connectionStatus={
                    profileItem?.connectionStatus as
                      | "PENDING"
                      | "ACCEPTED"
                      | "REJECTED"
                      | "APPROVED"
                  }
              />
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
