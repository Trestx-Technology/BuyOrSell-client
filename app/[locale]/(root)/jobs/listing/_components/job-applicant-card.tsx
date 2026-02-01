"use client";

import React from "react";
import { Mail, Phone, Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { JobApplicant } from "@/interfaces/job.types";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useAcceptApplication,
  useRejectApplication,
} from "@/hooks/useJobApplications";
import { toast } from "sonner";
import { useLocale } from "@/hooks/useLocale";

const getStatusLabel = (status: JobApplicant["status"]) => {
  switch (status) {
    case "accepted":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "hired":
      return "Hired";
    case "shortlisted":
      return "Shortlisted";
    case "reviewed":
      return "Reviewed";
    case "applied":
    case "pending":
      return "Pending";
    default:
      return "Pending";
  }
};

const getStatusBadgeVariant = (status: JobApplicant["status"]) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "hired":
      return "bg-green-100 text-green-800 border-green-200";
    case "shortlisted":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "reviewed":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const shouldDisableActions = (status: string) => {
  return status === "accepted" || status === "rejected" || status === "hired";
};

interface JobApplicantCardProps {
  applicant: JobApplicant;
  jobId: string;
  className?: string;
  onViewProfile?: () => void;
}

export default function JobApplicantCard({
  applicant,
  jobId,
  // className,
  onViewProfile,
}: JobApplicantCardProps) {
  const { locale } = useLocale();
  const isArabic = locale === "ar";
  const { mutate: acceptApplication, isPending: isAccepting } =
    useAcceptApplication();
  const { mutate: rejectApplication, isPending: isRejecting } =
    useRejectApplication();

  const handleAccept = () => {
    acceptApplication(
      {
        applicationId: applicant._id,
        payload: {},
        jobId,
      },
      {
        onSuccess: () => {
          toast.success("Application accepted successfully");
        },
      }
    );
  };

  const handleReject = () => {
    rejectApplication(
      {
        applicationId: applicant._id,
        payload: {},
        jobId,
      },
      {
        onSuccess: () => {
          toast.success("Application rejected successfully");
        },
      }
    );
  };

  const handleShortlist = () => {
    // Shortlist is typically the same as accept or can use updateApplicationStatus
    // For now, we'll use accept as shortlist
    handleAccept();
  };
  const profile = applicant.applicantProfileId;
  const userName =
    isArabic && profile?.nameAr
      ? profile.nameAr
      : profile?.name || profile?.headline || applicant.user?.name || "Unknown User";

  // Try to get a real image from the profile or user object
  const realImageUrl = (profile as any)?.photoUrl || applicant.user?.image;

  const avatarUrl = realImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=random`;

  // Extract email and phone from user object if available
  const email = applicant.user?.email || "";
  const phone = applicant.user?.phoneNo
    ? `${applicant.user.countryCode || ""}${applicant.user.phoneNo}`.trim()
    : "";

  // Experience
  const experience = profile?.experienceYears
    ? `${profile.experienceYears} years`
    : applicant.experience || "Not specified";

  // Education - extract from educations array if available
  const educations = (profile as any)?.educations;
  const education =
    educations && Array.isArray(educations) && educations.length > 0
      ? `${educations[0].degree || ""}${
          educations[0].fieldOfStudy ? ` - ${educations[0].fieldOfStudy}` : ""
        }`.trim() || "Not specified"
      : "Not specified";

  // Applied date
  const appliedDate =
    applicant.appliedAt || applicant.createdAt
      ? formatDistanceToNow(
          new Date(applicant.appliedAt || applicant.createdAt),
          { addSuffix: true }
        )
      : "Unknown";

  // Skills
  const skills = applicant.skills || profile?.skills || [];

  // Website/LinkedIn
  const website = profile?.linkedinUrl || "";

  const status = getStatusLabel(applicant.status);
  const statusBadgeClass = getStatusBadgeVariant(applicant.status);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full sm:max-w-5xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4 md:p-6 w-full">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-14 w-14 flex-shrink-0">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback className="bg-muted text-muted-foreground text-lg">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Name and Status */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground truncate max-w-lg">
                {userName}
              </h3>
              <Badge
                variant="outline"
                className={cn("font-medium px-2.5 py-1", statusBadgeClass)}
              >
                {status}
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-6 text-sm">
              <Link
                href={`mailto:${email}`}
                className="flex items-center gap-1.5 "
              >
                <Mail className="h-4 w-4" />
                <span className="text-purple">{email || "No email found"}</span>
              </Link>
              <Link
                href={`tel:${phone}`}
                className="flex items-center gap-1.5 "
              >
                <Phone className="h-4 w-4" />
                <span className="text-purple">
                  {phone || "No phone number found"}
                </span>
              </Link>
            </div>

            {/* Experience, Education, Applied */}
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Experience: </span>
                <span className="font-medium text-primary">{experience}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Education: </span>
                <span className="font-medium text-foreground">{education}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Applied: </span>
                <span className="font-medium text-foreground">
                  {appliedDate}
                </span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Skills:</span>
              {skills.map((skill: string) => (
                <Badge
                  key={skill}
                  className="font-normal text-xs text-purple bg-purple/10"
                >
                  {skill}
                </Badge>
              ))}
            </div>

            {/* Website */}
            <Link
              href={website || "No website found"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <LinkIcon className="h-4 w-4" />
              <span className="text-purple">
                {website || "No website found"}
              </span>
            </Link>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {!shouldDisableActions(applicant.status) && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={handleShortlist}
                  className="min-w-[100px]"
                  disabled={isAccepting || isRejecting}
                >
                  {isAccepting ? "Processing..." : "Shortlist"}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleReject}
                  className="min-w-[100px]"
                  disabled={isAccepting || isRejecting}
                >
                  {isRejecting ? "Processing..." : "Reject"}
                </Button>
              </>
            )}
            {onViewProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewProfile}
                className="min-w-[100px] border boder"
              >
                View Profile
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Header: Avatar, Name, Status */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-foreground">
                  {userName}
                </h3>
                <Badge
                  variant="outline"
                  className="border-warning bg-warning/10 text-warning-foreground font-medium px-2 py-0.5 text-xs"
                >
                  {status}
                </Badge>
              </div>
              {/* Contact Info */}
              <div className="mt-2 space-y-1">
                <Link
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 text-sm "
                >
                  <Mail className="h-4 w-4" />
                  <span className="text-purple">
                    {email || "No email found"}
                  </span>
                </Link>
                <Link
                  href={`tel:${phone}`}
                  className="flex items-center gap-1.5 text-sm "
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-purple">
                    {phone || "No phone number found"}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-muted-foreground">Experience: </span>
              <span className="font-medium text-primary">{experience}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Education: </span>
              <span className="font-medium text-foreground">{education}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Applied: </span>
              <span className="font-medium text-foreground">{appliedDate}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex items-start gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Skills:</span>
            {skills.map((skill: string) => (
              <Badge
                key={skill}
                variant="secondary"
                className="font-normal text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* Website */}
          <Link
            href={website.startsWith("http") ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <LinkIcon className="h-4 w-4" />
            {website}
          </Link>

          {/* Action Buttons - Mobile */}
          {!shouldDisableActions(applicant.status) && (
            <div className="space-y-2 pt-2">
              <div className="flex gap-2">
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleShortlist}
                  disabled={isAccepting || isRejecting}
                >
                  {isAccepting ? "Processing..." : "Shortlist"}
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  onClick={handleReject}
                  disabled={isAccepting || isRejecting}
                >
                  {isRejecting ? "Processing..." : "Reject"}
                </Button>
              </div>
              {onViewProfile && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onViewProfile}
                >
                  View Profile
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
