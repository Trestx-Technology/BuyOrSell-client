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
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "nextjs-toploader/app";
import {
  useCancelConnectionRequest,
  useSendConnectionRequest,
} from "@/hooks/useConnections";
import { toast } from "sonner";
import { ConnectionStatus } from "@/interfaces/connection.types";

interface ProfessionalCardProps {
  professional: JobseekerProfile;
  onConnect?: (userId: string) => void;
  isConnected?: boolean;
  connectionStatus?: "PENDING" | "ACCEPTED" | "REJECTED" | "APPROVED";
  isLoading?: boolean;
}

export default function ProfessionalCard({
  professional,
  onConnect,
  isConnected = false,
  connectionStatus,
  isLoading = false,
}: ProfessionalCardProps) {
  const userId = useAuthStore((state) => state.session.user?._id);
  const isCurrentUser = userId === professional.userId;
  const router = useRouter();
  const {
    skills,
    preferredLocations,
    name,
    _id,
    photoUrl,
    headline,
    experienceYears,
  } = professional;

  const cancelConnectReq = useCancelConnectionRequest();
  const sendConnectionReq = useSendConnectionRequest();
  // Get location from preferredLocations or use default
  const location =
    preferredLocations && preferredLocations.length > 0
      ? preferredLocations[0]
      : professional.location || "Not Specified";

  const HandleConnection = async (
    status: ConnectionStatus,
    requestId: string | null
  ) => {
    if (status === "PENDING") {
      if (!requestId) return toast.error("Request ID not found");
      await cancelConnectReq.mutateAsync(requestId);
    } else {
      if (!userId)
        return toast.error("Please log in to send a connection request");
      await sendConnectionReq.mutateAsync({
        receiverId: professional.userId,
      });
    }
  };

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
      className="bg-white w-full flex flex-col items-center gap-4 rounded-2xl p-6 hover:shadow-xl border border-[#E2E2E2] transition-all duration-300"
    >
      <div className=" flex-1 flex flex-col items-center gap-4 group rounded-2xl relative">

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
      <Link
        href={`/jobs/jobseeker/${_id}?type=profileVisit`}
        className="text-center absolute inset-0 z-10"
        ></Link>
        <Typography
          variant="h3"
          className="line-clamp-2 max-w-[220px] text-dark-blue font-bold text-lg text-center group-hover:text-purple transition-colors cursor-pointer"
        >
          {name}
        </Typography>

      {/* Headline */}
      {headline && (
        <Typography
          variant="body-small"
            className="text-grey-blue line-clamp-2 max-w-[220px] text-sm text-center line-clamp-1"
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
      </div>

      {/* Connect Button */}
      <Button
        isLoading={
          cancelConnectReq.isPending || sendConnectionReq.isPending || isLoading
        }
        disabled={
          cancelConnectReq.isPending || sendConnectionReq.isPending || isLoading
        }
        onClick={() => {
          if (isCurrentUser) {
            router.push(`/jobs/jobseeker/${professional._id}`);
          } else {
            HandleConnection(
              connectionStatus as any,
              professional.requestId || null
            );
          }
        }}
        className="w-full rounded-lg py-2.5 font-semibold transition-all z-20 relative"
        variant={
          connectionStatus === "PENDING" || connectionStatus === "ACCEPTED"
            ? "outline"
            : "primary"
        }
        width="full"
      >
        {isCurrentUser
          ? "View Profile"
          : connectionStatus === "ACCEPTED"
          ? "Connected"
          : connectionStatus === "PENDING"
          ? "Cancel Request"
          : connectionStatus === "REJECTED"
          ? "Send Request"
          : "Connect"}
      </Button>

    </motion.div>
  );
}
