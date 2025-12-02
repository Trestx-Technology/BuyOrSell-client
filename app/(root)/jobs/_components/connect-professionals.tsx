"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import JobsSectionTitle from "./jobs-section-title";
import { User } from "@/interfaces/user.types";
import { Check } from "lucide-react";

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
  user: User;
  onConnect?: (userId: string) => void;
  isConnected?: boolean;
}

function ProfessionalCard({
  user,
  onConnect,
  isConnected = false,
}: ProfessionalCardProps) {
  // Extract skills from userTypeDetails - only use API data
  const skills = (user.userTypeDetails as { skills?: string[] })?.skills || [];

  // Get location from user data - only use API data
  const location = (user as { location?: string }).location || "";

  // Get professional title from userTypeLabel - only use API data
  const professionalTitle = user.userTypeLabel || user.userTypeKey || "";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 hover:shadow-xl border border-[#E2E2E2] transition-all duration-300 flex flex-col items-center gap-4 group w-full max-w-[240px]"
    >
      {/* Profile Picture */}
      <div className="relative">
        <div className="size-24 bg-gradient-to-br from-purple/20 to-purple/10 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg ring-2 ring-purple/10 group-hover:ring-purple/20 transition-all">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "Professional"}
              width={96}
              height={96}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            <span className="text-purple font-bold text-3xl">
              {(user.name || "P").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        {user.isVerified && (
          <div className="absolute -bottom-1 -right-1 bg-purple rounded-full p-1.5 border-2 border-white shadow-md">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      {/* Name */}
      <Link 
        href={`/jobs/jobseeker/${user._id}`}
        className="text-center"
      >
        <Typography
          variant="h3"
          className="text-dark-blue font-bold text-lg text-center group-hover:text-purple transition-colors cursor-pointer"
        >
          {user.name}
        </Typography>
      </Link>

      {/* Role/Title */}
      <Typography
        variant="body-large"
        className="text-grey-blue text-base text-center font-medium"
      >
        {professionalTitle}
      </Typography>

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
      <div className="flex flex-wrap justify-center gap-2 min-h-[32px]">
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
        onClick={() => onConnect?.(user._id)}
        className="w-full rounded-lg py-2.5 font-semibold transition-all"
        variant={isConnected ? "outline" : "primary"}
        width="full"
      >
        {isConnected ? (
          <>
            <Check className="w-4 h-4" />
            Connected
          </>
        ) : (
          "Connect"
        )}
      </Button>
    </motion.div>
  );
}

interface ConnectProfessionalsProps {
  professionals?: User[];
  isLoading?: boolean;
}

export default function ConnectProfessionals({ 
  professionals: professionalsProp, 
  isLoading: isLoadingProp 
}: ConnectProfessionalsProps = {}) {
  const [connectedUsers, setConnectedUsers] = React.useState<Set<string>>(
    new Set()
  );

  // Only use API data, no fallback
  const professionals = professionalsProp || [];
  const isLoading = isLoadingProp ?? false;

  const handleConnect = (userId: string) => {
    setConnectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
    // TODO: Implement API call to connect/disconnect
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
      className="w-full bg-white py-12"
    >
      <div className="max-w-[1080px] mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <JobsSectionTitle>Connect Professionals</JobsSectionTitle>
          <Link 
            href="/jobs/professionals"
            className="group"
          >
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
                user={professional}
                onConnect={handleConnect}
                isConnected={connectedUsers.has(professional._id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

