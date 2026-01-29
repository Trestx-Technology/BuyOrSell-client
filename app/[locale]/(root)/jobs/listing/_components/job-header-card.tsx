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
import { SaveJobButton } from "../../saved/_components/save-job-button";
import { useGetJobseekerProfile } from "@/hooks/useJobseeker";
import { useApplyToJob } from "@/hooks/useJobApplications";
import Image from "next/image";

export interface JobHeaderCardProps {
  job: AD;
  isSaved?: boolean;
  isApplied?: boolean;
  isApplying?: boolean;
  logo?: string;
  className?: string;
}

export default function JobHeaderCard({
  job,
  isSaved = false,
  isApplied = false,
  isApplying = false,
  logo,
  className,
}: JobHeaderCardProps) {
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUserId = session.user?._id;

  const isJobOwner =
    job.owner?._id === currentUserId ||
    job.organization?.owner === currentUserId;


  // Get jobseeker profile for apply logic
  const { data: jobseekerProfile } = useGetJobseekerProfile();

  // Apply mutation
  const { mutate: apply, isPending: isApplyingToJob, isSuccess } = useApplyToJob();

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
  const jobMode = job.jobMode || getFieldValue("jobMode") || getFieldValue("job mode") || "";
  const jobType = getFieldValue("jobType") || getFieldValue("job type") || "";
  const experience = getFieldValue("experience") || "";
  const salaryMin = job.minSalary ?? getSalaryFromAd("min");
  const salaryMax = job.maxSalary ?? getSalaryFromAd("max");
  const jobShift = job.jobShift || getFieldValue("jobShift") || getFieldValue("job shift") || "";
  const location =
    typeof job.location === "string"
      ? job.location
      : job.location?.city || job.address?.city || "";

  // Build map redirect URL
  const getMapUrl = (): string | null => {
    // Get location object
    const locationObj =
      typeof job.location === "object" ? job.location : job.address;

    if (!locationObj) return null;

    // Detect iOS for Apple Maps (only in browser)
    const isIOS =
      typeof window !== "undefined" &&
      (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

    // Check if coordinates are available
    const coordinates = locationObj.coordinates;
    if (
      Array.isArray(coordinates) &&
      coordinates.length === 2 &&
      typeof coordinates[0] === "number" &&
      typeof coordinates[1] === "number"
    ) {
      const [lat, lng] = coordinates;

      // Build address label for better map display
      const addressLabel =
        locationObj.address ||
        [locationObj.city, locationObj.state, locationObj.country]
          .filter(Boolean)
          .join(", ") ||
        location ||
        "";

      if (isIOS) {
        // Apple Maps URL using coordinates
        return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(
          addressLabel
        )}`;
      } else {
        // Google Maps URL using coordinates
        return `https://www.google.com/maps?q=${lat},${lng}&hl=en`;
      }
    }

    // Fallback: Build address string from all available fields
    const addressParts: string[] = [];
    if (locationObj.address) addressParts.push(locationObj.address);
    if (locationObj.city) addressParts.push(locationObj.city);
    if (locationObj.state) addressParts.push(locationObj.state);
    if (locationObj.zipCode) addressParts.push(locationObj.zipCode);
    if (locationObj.country) addressParts.push(locationObj.country);

    const fullAddress =
      addressParts.join(", ") ||
      (typeof job.location === "string" ? job.location : location);

    if (!fullAddress) return null;

    if (isIOS) {
      // Apple Maps URL using address
      return `https://maps.apple.com/?q=${encodeURIComponent(fullAddress)}`;
    } else {
      // Google Maps URL using address
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        fullAddress
      )}`;
    }
  };

  const mapUrl = React.useMemo(
    () => getMapUrl(),
    [job.location, job.address, location]
  );

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job");
      return;
    }

    const applicantProfileId = jobseekerProfile?.data?.profile?._id;
    if (!applicantProfileId) {
      toast.error("Please create a jobseeker profile first");
      return;
    }

    apply(
      {
        jobId: job._id,
        payload: { applicantProfileId },
      },
      {
        onSuccess: () => {
          toast.success("Application submitted successfully");
        },
      }
    );
  };


  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-[#E2E2E2] p-4 shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)] relative",
        className
      )}
    >
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
          <SaveJobButton
            jobId={job._id}
            isSaved={isSaved}
            isJobOwner={isJobOwner}
          />
        )}
      </div>

      <div className="flex gap-2">
        {companyLogo ? (
          <Image
            src={companyLogo}
            alt={companyName}
            width={36}
            height={36}
            className="rounded-lg object-cover size-16"
          />
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
              {jobMode && (
                <Badge className="bg-purple/20 text-purple px-[10.67px] py-[7.11px] rounded-full text-xs font-semibold">
                  {jobMode}
                </Badge>
              )}
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
          <div
            className="flex items-center
           gap-y-4 gap-8 flex-wrap"
          >
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
                {jobShift || "Not specified"}
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
            {location && mapUrl ? (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity text-purple"
              >
                <MapPin className="w-5 h-5 flex-shrink-0" />
                <Typography
                  variant="body-small"
                  className="text-xs font-medium"
                >
                  {location}
                </Typography>
              </a>
            ) : (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#8A8A8A] flex-shrink-0" />
                <Typography
                  variant="body-small"
                  className="text-[#1D2939] text-xs font-medium"
                >
                  {location || "Location not specified"}
                </Typography>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isJobOwner ? (
              <JobApplicantsModal jobId={job._id} />
            ) : (
              <>
                <Button
                  variant="outline"
                    size={"small"}
                  className="px-4 py-2"
                  onClick={() => toast.info("Work in progress")}
                >
                  Chat with employer
                </Button>
                <Button
                    variant={isApplied || isSuccess ? "outline" : "filled"}
                    size={"small"}
                    onClick={handleApply}
                    className="px-4 py-2"
                    disabled={isApplying || isApplyingToJob || isApplied || isSuccess}
                    isLoading={isApplying || isApplyingToJob}
                >
                    {isApplied || isSuccess
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
