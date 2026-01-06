"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { JobApplicant } from "@/interfaces/job.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Check, X } from "lucide-react";
import {
  useAcceptApplication,
  useRejectApplication,
} from "@/hooks/useJobApplications";
import { toast } from "sonner";

// Helper function to get status badge variant
const getStatusBadgeVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status?.toLowerCase()) {
    case "accepted":
    case "shortlisted":
      return "default";
    case "rejected":
      return "destructive";
    case "pending":
    case "applied":
      return "outline";
    case "reviewed":
      return "secondary";
    default:
      return "default";
  }
};

// Helper function to get status badge className for custom styling
const getStatusBadgeClassName = (status: string) => {
  switch (status?.toLowerCase()) {
    case "accepted":
    case "shortlisted":
      return "bg-success-100 text-success-800 border-success-200";
    case "pending":
    case "applied":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "reviewed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "";
  }
};

// Helper function to format status label
const getStatusLabel = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "Pending";
    case "reviewed":
      return "Reviewed";
    case "shortlisted":
      return "Shortlisted";
    case "rejected":
      return "Rejected";
    case "accepted":
      return "Accepted";
    case "applied":
      return "Applied";
    case "hired":
      return "Hired";
    default:
      return status || "Unknown";
  }
};

// Actions Cell Component
interface ActionsCellProps {
  applicant: JobApplicant;
  jobId: string;
  router: AppRouterInstance;
  locale: string;
}

const ActionsCell = ({
  applicant,
  jobId,
  router,
  locale,
}: ActionsCellProps) => {
  const acceptApplicationMutation = useAcceptApplication();
  const rejectApplicationMutation = useRejectApplication();
  const profileId = applicant.applicantProfileId?._id;

  const handleShortlist = () => {
    acceptApplicationMutation.mutate(
      {
        applicationId: applicant._id,
        payload: {},
        jobId,
      },
      {
        onSuccess: () => {
          toast.success("Application shortlisted successfully");
        },
      }
    );
  };

  const handleReject = () => {
    rejectApplicationMutation.mutate(
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

  const handleViewProfile = () => {
    const params = new URLSearchParams({
      type: "applicantsList",
      applicationId: applicant._id,
      jobId: jobId,
      status: applicant.status,
    });
    router.push(`/${locale}/jobs/jobseeker/${profileId}?${params.toString()}`);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            disabled={
              acceptApplicationMutation.isPending ||
              rejectApplicationMutation.isPending
            }
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleShortlist}
            className="text-success-100 hover:text-success-60 hover:bg-success-100"
          >
            <Check className="mr-2 h-4 w-4 text-success-100" />
            Shortlist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleReject} variant="destructive">
            <X className="mr-2 h-4 w-4" />
            Reject
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewProfile}>
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const createColumns = (
  jobId: string,
  router: AppRouterInstance,
  locale: string
): ColumnDef<JobApplicant>[] => {
  return [
    {
      accessorKey: "applicant",
      header: "Applicant",
      cell: ({ row }) => {
        const applicant = row.original;
        const profile = applicant.applicantProfileId;
        const photoUrl =
          profile && typeof profile === "object" && "photoUrl" in profile
            ? (profile as { photoUrl?: string }).photoUrl
            : undefined;
        const name = profile?.name || applicant.user?.email || "Unknown";
        const headline = profile?.headline || "";
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-3">
            <div className="relative size-10 rounded-full overflow-hidden bg-purple/10 flex items-center justify-center flex-shrink-0">
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  alt={name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <span className="text-purple font-semibold text-sm">
                  {initials}
                </span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <Typography
                variant="sm-semibold"
                className="text-dark-blue truncate max-w-[200px]"
              >
                {name}
              </Typography>
              {headline && (
                <Typography
                  variant="xs-regular"
                  className="text-grey-blue truncate"
                >
                  {headline}
                </Typography>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variant = getStatusBadgeVariant(status);
        const className = getStatusBadgeClassName(status);
        return (
          <Badge
            variant={variant}
            className={className ? `${className} capitalize` : "capitalize"}
          >
            {getStatusLabel(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => {
        const applicant = row.original;
        const profile = applicant.applicantProfileId;
        const experienceYears = profile?.experienceYears;

        if (experienceYears) {
          return (
            <Typography variant="sm-regular" className="text-dark-blue">
              {experienceYears} {experienceYears === 1 ? "year" : "years"}
            </Typography>
          );
        }

        return (
          <Typography variant="sm-regular" className="text-grey-blue">
            Not specified
          </Typography>
        );
      },
    },
    {
      accessorKey: "skills",
      header: "Skills",
      cell: ({ row }) => {
        const applicant = row.original;
        const profile = applicant.applicantProfileId;
        const skills = applicant.skills || profile?.skills || [];

        if (skills.length === 0) {
          return (
            <Typography variant="sm-regular" className="text-grey-blue">
              No skills listed
            </Typography>
          );
        }

        // Show first skill, then "+ X more" if there are more
        const firstSkill = skills[0];
        const remainingCount = skills.length - 1;

        return (
          <div
            className="flex items-center gap-1 flex-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {firstSkill}
            </Badge>
            {remainingCount > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-xs text-purple-600 hover:text-purple-700 font-medium cursor-pointer">
                    +{remainingCount} more
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64 max-h-96 overflow-y-auto"
                  align="start"
                >
                  <div className="space-y-2">
                    <Typography
                      variant="h3"
                      className="text-sm font-semibold text-dark-blue mb-3"
                    >
                      All Skills
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "appliedAt",
      header: "Applied",
      cell: ({ row }) => {
        const appliedAt = row.original.appliedAt || row.original.createdAt;
        if (!appliedAt) {
          return (
            <Typography variant="sm-regular" className="text-grey-blue">
              Unknown
            </Typography>
          );
        }
        return (
          <Typography variant="sm-regular" className="text-dark-blue">
            {formatDistanceToNow(new Date(appliedAt), { addSuffix: true })}
          </Typography>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => {
        return (
          <ActionsCell
            applicant={row.original}
            jobId={jobId}
            router={router}
            locale={locale}
          />
        );
      },
    },
  ];
};
