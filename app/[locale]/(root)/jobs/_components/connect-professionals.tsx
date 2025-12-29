"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JobsSectionTitle from "./jobs-section-title";
import { Check, MapPin } from "lucide-react";
import {
  useSendConnectionRequest,
  useRemoveConnection,
  useAcceptConnectionRequest,
  useCancelConnectionRequest,
} from "@/hooks/useConnections";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { containerVariants, itemVariants } from "@/utils/animation-variants";

// Professional/Jobseeker interface matching API response
export interface Professional {
  _id: string;
  userId: string;
  name: string;
  headline: string;
  location: string;
  skills: string[];
  experienceYears: number;
  image?: string;
  isVerified?: boolean;
}

interface ProfessionalCardProps {
  professional: Professional;
  onConnect?: (userId: string) => void;
  isConnected?: boolean;
}

function ProfessionalCard({
  professional,
  onConnect,
  isConnected = false,
}: ProfessionalCardProps) {
  const { skills, location, name, _id, image, isVerified } = professional;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 hover:shadow-xl border border-[#E2E2E2] transition-all duration-300 flex flex-col items-center gap-4 group w-full max-w-[240px]"
    >
      {/* Profile Picture */}
      <div className="relative">
        <div className="size-24 bg-gradient-to-br from-purple/20 to-purple/10 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg ring-2 ring-purple/10 group-hover:ring-purple/20 transition-all">
          {image ? (
            <Image
              src={image}
              alt={name || "Professional"}
              width={96}
              height={96}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            <span className="text-purple font-bold text-3xl">
              {(name || "P").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        {isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-purple rounded-full p-1.5 border-2 border-white shadow-md">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Name */}
      <Link href={`/jobs/jobseeker/${_id}`} className="text-center">
        <Typography
          variant="h3"
          className="line-clamp-1 text-dark-blue font-bold text-lg text-center group-hover:text-purple transition-colors cursor-pointer"
        >
          {name}
        </Typography>
      </Link>

      {/* Location */}
      <div className="flex items-center gap-1.5">
        <MapPin
          size={16}
          stroke="currentColor"
          className="w-4 h-4 text-grey-blue"
        />
        <Typography variant="body-small" className="text-grey-blue text-sm">
          {location || "Not Specified"}
        </Typography>
      </div>

      {/* Skills/Tools */}
      <div className="flex justify-center gap-2">
        {skills.slice(0, 2).map((skill, index) => (
          <Badge
            key={index}
            className="bg-purple/10 text-purple px-3 py-1 rounded-full text-xs font-medium border border-purple/20 hover:bg-purple/20 transition-colors"
          >
            {skill}
          </Badge>
        ))}
      </div>

      {/* Connect Button */}
      <Button
        onClick={() => onConnect?.(professional.userId)}
        className="w-full rounded-lg py-2.5 font-semibold transition-all"
        variant={isConnected ? "outline" : "primary"}
        width="full"
        icon={isConnected && <Check className="w-4 h-4" />}
        iconPosition="left"
      >
        {isConnected ? "Connected" : "Connect"}
      </Button>
    </motion.div>
  );
}

interface ConnectProfessionalsProps {
  professionals?: Professional[];
  isLoading?: boolean;
}

export default function ConnectProfessionals({
  professionals: professionalsProp,
  isLoading: isLoadingProp,
}: ConnectProfessionalsProps = {}) {
  // Only use API data, no fallback
  const professionals = professionalsProp || [];
  const isLoading = isLoadingProp ?? false;

  // Get current user ID
  const { session } = useAuthStore();
  const currentUserId = session?.user?._id;

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
      <section className="w-full bg-white py-12">
        <div className="max-w-[1080px] mx-auto px-4">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl w-full max-w-[240px] h-[420px] animate-pulse"
              />
            ))}
          </div>
        </div>
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
      className="w-full max-w-[1080px] mx-auto bg-white py-12"
    >
      <div className="max-w-[1080px] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <JobsSectionTitle>Connect Professionals</JobsSectionTitle>
          <Link href="/jobs/professionals" className="group">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {professionals.slice(0, 4).map((professional) => {
            const isConnected = professional.userId === currentUserId;
            return (
              <motion.div
                key={professional._id}
                variants={itemVariants}
                className="w-full"
              >
                <ProfessionalCard
                  professional={professional}
                  onConnect={handleConnect}
                  isConnected={isConnected}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
