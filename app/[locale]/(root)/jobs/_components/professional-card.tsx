"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, MapPin } from "lucide-react";
import { JobseekerProfile } from "@/interfaces/job.types";

interface ProfessionalCardProps {
  professional: JobseekerProfile;
  onConnect?: (userId: string) => void;
  isConnected?: boolean;
  connectionStatus?: "PENDING" | "ACCEPTED" | "REJECTED" | "APPROVED";
}

export default function ProfessionalCard({
  professional,
  onConnect,
  isConnected = false,
  connectionStatus,
}: ProfessionalCardProps) {
  const {
    skills,
    preferredLocations,
    name,
    _id,
    photoUrl,
    headline,
    experienceYears,
  } = professional;

  // Get location from preferredLocations or use default
  const location =
    preferredLocations && preferredLocations.length > 0
      ? preferredLocations[0]
      : professional.location || "Not Specified";

  // Get initials for fallback avatar
  const initials =
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "P";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 hover:shadow-xl border border-[#E2E2E2] transition-all duration-300 flex flex-col items-center gap-4 group w-full max-w-[240px]"
    >
      {/* Profile Picture */}
      <div className="relative">
        <div className="size-24 bg-gradient-to-br from-purple/20 to-purple/10 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg ring-2 ring-purple/10 group-hover:ring-purple/20 transition-all">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name || "Professional"}
              width={96}
              height={96}
              className="rounded-full object-cover w-full h-full"
            />
          ) : (
            <span className="text-purple font-bold text-3xl">{initials}</span>
          )}
        </div>
        {/* Note: isVerified is not in JobseekerProfile interface, 
            but can be added if available in the future */}
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

      {/* Headline */}
      {headline && (
        <Typography
          variant="body-small"
          className="text-grey-blue text-sm text-center line-clamp-1"
        >
          {headline}
        </Typography>
      )}

      {/* Location */}
      <div className="flex items-center gap-1.5">
        <MapPin
          size={16}
          stroke="currentColor"
          className="w-4 h-4 text-grey-blue"
        />
        <Typography variant="body-small" className="text-grey-blue text-sm">
          {location}
        </Typography>
      </div>

      {/* Skills/Tools */}
      {skills && skills.length > 0 && (
        <div className="flex justify-center gap-2">
          {skills.slice(0, 2).map((skill, index) => (
            <Badge
              key={index}
              className="bg-purple/10 text-purple px-3 py-1 rounded-full text-xs font-medium border border-purple/20 hover:bg-purple/20 transition-colors max-w-1/2 truncate"
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}

      {/* Experience Years */}
      {experienceYears > 0 && (
        <Typography variant="body-small" className="text-grey-blue text-xs">
          {experienceYears} {experienceYears === 1 ? "year" : "years"}{" "}
          experience
        </Typography>
      )}

      {/* Connect Button */}
      <Button
        disabled={
          connectionStatus === "PENDING" || connectionStatus === "ACCEPTED"
        }
        onClick={() => onConnect?.(professional.userId)}
        className="w-full rounded-lg py-2.5 font-semibold transition-all"
        variant={
          connectionStatus === "PENDING" || connectionStatus === "ACCEPTED"
            ? "outline"
            : "primary"
        }
        width="full"
      >
        {connectionStatus === "ACCEPTED"
          ? "Connected"
          : connectionStatus === "PENDING"
          ? "Pending"
          : connectionStatus === "REJECTED"
          ? "Rejected"
          : "Connect"}
      </Button>
    </motion.div>
  );
}
