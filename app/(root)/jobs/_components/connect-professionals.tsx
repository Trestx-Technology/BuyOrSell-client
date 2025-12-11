"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JobsSectionTitle from "./jobs-section-title";
import { Check } from "lucide-react";
import { useMyConnections, useSendConnectionRequest, useRemoveConnection } from "@/hooks/useConnections";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      <Link 
        href={`/jobs/jobseeker/${_id}`}
        className="text-center"
      >
        <Typography
          variant="h3"
          className="text-dark-blue font-bold text-lg text-center group-hover:text-purple transition-colors cursor-pointer"
        >
          {name}
        </Typography>
      </Link>


      {/* Location */}
      <div className="flex items-center gap-1.5">
        <svg
          className="w-4 h-4 text-grey-blue"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <Typography
          variant="body-small"
          className="text-grey-blue text-sm"
        >
          {location}
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
        onClick={() => onConnect?.(_id)}
        className="w-full rounded-lg py-2.5 font-semibold transition-all"
        variant={isConnected ? "outline" : "primary"}
        width="full"
        icon={isConnected && <Check className="w-4 h-4" /> }
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
  isLoading: isLoadingProp 
}: ConnectProfessionalsProps = {}) {
  // Only use API data, no fallback
  const professionals = professionalsProp || [];
  const isLoading = isLoadingProp ?? false;

  // Get current user ID
  const { session } = useAuthStore();
  const currentUserId = session?.user?._id;

  // Fetch user's connections
  const { data: connectionsData } = useMyConnections('ACCEPTED');
  const sendRequestMutation = useSendConnectionRequest();
  const removeConnectionMutation = useRemoveConnection();

  // Create a map of connected user IDs for quick lookup
  // Only include the OTHER user in the connection (not the current user)
  const connectedUserIds = useMemo(() => {
    const connectedSet = new Set<string>();
    if (connectionsData?.data?.items && currentUserId) {
      connectionsData.data.items.forEach((connection) => {
        // If current user is the sender, the connected user is the receiver
        if (connection.fromUserId === currentUserId && connection.toUserId) {
          connectedSet.add(connection.toUserId);
        }
        // If current user is the receiver, the connected user is the sender
        if (connection.toUserId === currentUserId && connection.fromUserId) {
          connectedSet.add(connection.fromUserId);
        }
      });
    }
    return connectedSet;
  }, [connectionsData, currentUserId]);

  const handleConnect = async (userId: string) => {
    const isConnected = connectedUserIds.has(userId);
    
    if (isConnected) {
      // Find the connection ID to remove
      const connection = connectionsData?.data?.items?.find(
        (conn) => conn.fromUserId === userId || conn.toUserId === userId
      );
      
      if (connection) {
        try {
          await removeConnectionMutation.mutateAsync(connection.id);
          toast.success('Connection removed successfully');
        } catch {
          toast.error('Failed to remove connection');
        }
      }
    } else {
      // Send connection request
      try {
        await sendRequestMutation.mutateAsync({ receiverId: userId });
        toast.success('Connection request sent');
      } catch {
        toast.error('Failed to send connection request');
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
          {professionals.slice(0, 4).map((professional) => (
            <motion.div
              key={professional._id}
              variants={itemVariants}
              className="w-full"
            >
              <ProfessionalCard
                professional={professional}
                onConnect={handleConnect}
                isConnected={connectedUserIds.has(professional.userId)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

