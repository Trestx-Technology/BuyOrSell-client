"use client";

import React from "react";
import { Briefcase, Clock, MapPin, Share2, Heart } from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FaMoneyBillWave } from "react-icons/fa";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import JobApplicantsModal from "./job-applicants-modal";
import ShareJobDialog from "./share-job-dialog";
import { AD } from "@/interfaces/ad";
import {
  useSaveJob,
  useDeleteSavedJobByJobAndSeeker,
} from "@/hooks/useSavedJobs";
import { useGetJobseekerProfile } from "@/hooks/useJobseeker";

export interface JobHeaderCardProps {
  job: AD;
  onFavorite?: (id: string) => void;
  onApply?: (jobId: string) => void;
  isFavorite?: boolean;
  isApplied?: boolean;
  isApplying?: boolean;
  logo?: string;
}

export default function JobHeaderCard({
  job,
  onFavorite,
  onApply,
  isFavorite = false,
  isApplied = false,
  isApplying = false,
  logo,
}: JobHeaderCardProps) {
  const { session } = useAuthStore();
  const currentUserId = session.user?._id;
  const isJobOwner =
    job.owner?._id === currentUserId ||
    job.organization?.owner === currentUserId;

  // Get jobseeker profile to get jobSeekerId
  const { data: jobseekerProfile } = useGetJobseekerProfile();
  const jobSeekerId = jobseekerProfile?.data?.profile?.userId;

  const isSaved = job.isSaved ?? false;
  const savedJobId = job.savedJobId;

  // Save/Unsave mutations
  const { mutate: saveJob, isPending: isSaving } = useSaveJob();
  const { mutate: deleteSavedJob, isPending: isDeleting } =
    useDeleteSavedJobByJobAndSeeker();

  // Extract extraFields
  const extraFields = Array.isArray(job.extraFields)
    ? job.extraFields
    : Object.entries(job.extraFields || {}).map(([name, value]) => ({
        name,
        value,
      }));

  const getFieldValue = (fieldName: string): string => {
    const field = extraFields.find((f) =>
      f.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (field) {
      if (Array.isArray(field.value)) {
        return field.value.join(", ");
      }
      return String(field.value || "");
    }
    return "";
  };

  const getSalaryFromAd = (type: "min" | "max"): number | undefined => {
    const salaryField = extraFields.find(
      (field) =>
        field.name?.toLowerCase().includes("salary") &&
        (type === "min"
          ? field.name?.toLowerCase().includes("min")
          : field.name?.toLowerCase().includes("max"))
    );
    if (salaryField && typeof salaryField.value === "number") {
      return salaryField.value;
    }
    return type === "min" ? job.price : job.price;
  };

  const companyName =
    job.organization?.tradeName || job.organization?.legalName || "Company";
  const companyLogo = logo || job.organization?.logoUrl;
  const jobType = getFieldValue("jobType") || getFieldValue("job type") || "";
  const experience = getFieldValue("experience") || "";
  const salaryMin = getSalaryFromAd("min");
  const salaryMax = getSalaryFromAd("max");
  const location =
    typeof job.location === "string"
      ? job.location
      : job.location?.city || job.address?.city || "";

  const handleApply = () => {
    if (onApply) {
      onApply(job._id);
    } else {
      toast.info("Apply functionality not available");
    }
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!jobSeekerId) {
      toast.error("Please create a jobseeker profile first");
      return;
    }

    if (isSaved && savedJobId) {
      // Unsave the job
      deleteSavedJob(
        {
          jobSeekerId,
          jobId: job._id,
        },
        {
          onSuccess: () => {
            toast.success("Job removed from saved jobs");
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to unsave job"
            );
          },
        }
      );
    } else {
      // Save the job
      saveJob(
        {
          jobSeekerId,
          jobId: job._id,
        },
        {
          onSuccess: () => {
            toast.success("Job saved successfully");
          },
          onError: (error) => {
            toast.error(
              error instanceof Error ? error.message : "Failed to save job"
            );
          },
        }
      );
    }

    // Call onFavorite if provided (for backward compatibility)
    if (onFavorite) {
      onFavorite(job._id);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E2E2] p-4 shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)] relative">
      {/* Share and Save Buttons - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <ShareJobDialog
          job={job}
          trigger={
            <button className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity">
              <Share2 className="w-5 h-5 text-grey-blue" />
              <span className="text-xs text-grey-blue font-medium">Share</span>
            </button>
          }
        />
        {!isJobOwner && (
          <button
            onClick={handleSaveToggle}
            disabled={isSaving || isDeleting || !jobSeekerId}
            className="flex flex-col items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Heart
              className={cn(
                "w-5 h-5",
                isSaved || isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-grey-blue"
              )}
              strokeWidth={1.5}
            />
            <span className="text-xs text-grey-blue font-medium">Save</span>
          </button>
        )}
      </div>

      <div className="flex gap-2">
        {companyLogo ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-purple rounded-full"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
          </svg>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-purple flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg font-semibold">
              {companyName.charAt(0)}
            </span>
          </div>
        )}
        <div className="space-y-4">
          {/* Job Title and Company Section */}
          <div className="flex items-center gap-4">
            {/* Job Title and Company Info */}
            <div className="">
              <Typography
                variant="h1"
                className="text-black font-semibold text-[28.56px] leading-tight mb-2"
              >
                {job.title}
              </Typography>
              <div className="flex items-center gap-2 flex-wrap">
                <Typography
                  variant="body-small"
                  className="text-purple text-sm underline"
                >
                  {companyName}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {jobType && (
                <Badge className="bg-purple/20 text-purple px-[10.67px] py-[7.11px] rounded-full text-xs font-semibold">
                  {jobType}
                </Badge>
              )}
              {job.isFeatured && (
                <Badge className="bg-[#FDF3E5] text-[#FB9002] px-[10.67px] py-[7.11px] rounded-full text-xs font-semibold">
                  Featured
                </Badge>
              )}
            </div>
          </div>

          {/* Job Metadata Grid - Two Column Layout */}
          <div className="flex gap-8">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
              <Typography
                variant="body-small"
                className="text-[#1D2939] text-xs font-medium"
              >
                {experience || "Not specified"}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
              <Typography
                variant="body-small"
                className="text-[#1D2939] text-xs font-medium"
              >
                {jobType || "Not specified"}
              </Typography>
            </div>
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
              <div className="flex items-center gap-1">
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-sm font-medium"
                >
                  {salaryMin?.toLocaleString() || "0"}-
                </Typography>
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-sm font-medium"
                >
                  {salaryMax?.toLocaleString() || "Not specified"}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
              <Typography
                variant="body-small"
                className="text-[#1D2939] text-xs font-medium"
              >
                {location || "Location not specified"}
              </Typography>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isJobOwner ? (
              <JobApplicantsModal jobId={job._id} />
            ) : (
              <>
                <Button
                  variant="outline"
                  size={"lg"}
                  className="px-4 py-2"
                  onClick={() => toast.info("Work in progress")}
                >
                  Chat with employer
                </Button>
                <Button
                  variant={isApplied ? "outline" : "filled"}
                  size={"lg"}
                  onClick={handleApply}
                  disabled={isApplying || isApplied}
                >
                  {isApplying
                    ? "Applying..."
                    : isApplied
                    ? "Applied"
                    : "Apply Now"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
