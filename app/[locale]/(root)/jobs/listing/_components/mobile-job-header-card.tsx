"use client";

import React from "react";
import {
  Briefcase,
  Clock,
  MapPin,
  Share2,
  ChevronLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FaMoneyBillWave } from "react-icons/fa";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import JobApplicantsModal from "./job-applicants-modal";
import ShareJobDialog from "./share-job-dialog";
import { AD } from "@/interfaces/ad";
import { SaveJobButton } from "../../saved/_components/save-job-button";
import { useDeleteAd } from "@/hooks/useAds";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import Image from "next/image";
import { useApplyToJob } from "@/hooks/useJobApplications";
import { useGetJobseekerProfile } from "@/hooks/useJobseeker";
import { useLocale } from "@/hooks/useLocale";
import Link from "next/link";

export interface MobileJobHeaderCardProps {
  job: AD;
  isSaved?: boolean;
  isApplied?: boolean;
  isApplying?: boolean;
  logo?: string;
  onBack?: () => void;
  className?: string;
}

export default function MobileJobHeaderCard({
  job,
  isSaved = false,
  isApplied = false,
  isApplying = false,
  logo,
  onBack,
  className,
}: MobileJobHeaderCardProps) {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentUserId = session.user?._id;
  const isJobOwner =
    job.owner?._id === currentUserId ||
    job.organization?.owner === currentUserId;
  const { locale } = useLocale();
  const isArabic = locale === "ar";

  // Get jobseeker profile for apply logic
  const { data: jobseekerProfile } = useGetJobseekerProfile();

  // Apply mutation
  const { mutate: apply, isPending: isApplyingToJob, isSuccess } = useApplyToJob();

  // Delete ad mutation
  const { mutate: deleteAd, isPending: isDeletingAd } = useDeleteAd();

  // Delete confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

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
    isArabic && job.organization?.tradeNameAr ? job.organization.tradeNameAr :
      (isArabic && job.organization?.legalNameAr ? job.organization.legalNameAr :
        (job.organization?.tradeName || job.organization?.legalName || "Company"));
  const companyLogo = logo || job.organization?.logoUrl;
  const jobMode = isArabic && job.jobModeAr ? job.jobModeAr : (job.jobMode || getFieldValue("jobMode") || getFieldValue("job mode") || "");
  const jobShift = isArabic && job.jobShiftAr ? job.jobShiftAr : (job.jobShift || getFieldValue("jobShift") || getFieldValue("job shift") || "");
  const jobType = getFieldValue("jobType") || getFieldValue("job type") || "";
  const experience = getFieldValue("experience") || "";
  const salaryMin = job.minSalary ?? getSalaryFromAd("min");
  const salaryMax = job.maxSalary ?? getSalaryFromAd("max");
  const jobTitle = isArabic && job.titleAr ? job.titleAr : job.title;
  const location =
    typeof job.location === "string"
      ? job.location
      : (isArabic && job.location?.cityAr ? job.location.cityAr :
        (isArabic && job.address?.cityAr ? job.address.cityAr :
          (job.location?.city || job.address?.city || "")));

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


  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteAd(job._id, {
      onSuccess: () => {
        toast.success("Job deleted successfully");
        setShowDeleteConfirm(false);
        if (onBack) {
          onBack();
        } else {
          router.back();
        }
      },
    });
  };

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job");
      return;
    }

    const applicantProfileId = jobseekerProfile?.data?.profile?._id;
    const resumeUrl = jobseekerProfile?.data?.profile?.resumeFileUrl;
    if (!applicantProfileId) {
      toast.error("Please create a jobseeker profile first");
      return;
    }

    apply(
      {
        jobId: job._id,
        payload: { applicantProfileId, resumeUrl },
      },
      {
        onSuccess: () => {
          toast.success("Application submitted successfully");
        },
        }
      );
  };


  return (
    <div className={cn("bg-white rounded-2xl shadow", className)}>
      {/* Header with Back Button and Actions */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button onClick={handleBack}>
            <ChevronLeft className="size-6 text-grey-blue" />
          </button>
          {/* <Badge className="text-xs font-medium bg-success-10 text-success-100">
            Part time
          </Badge> */}
          {jobMode && (
            <Badge className="text-xs font-medium bg-purple/10 text-purple">
              {jobMode}
            </Badge>
          )}
          <Badge className="text-xs font-medium bg-warning-10 text-warning-100">
            Urgent
          </Badge>
        </div>

        {/* To do: Add edit and delete buttons */}
        <div className="flex gap-4">
          {isJobOwner && (
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement edit functionality
                  toast.info("Edit functionality coming soon");
                }}
                className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <Edit className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={handleDeleteClick}
                disabled={isDeletingAd}
                className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </div>
          )}

          {!isJobOwner && (
            <div className="flex items-center gap-2">
              <ShareJobDialog
                job={job}
                trigger={
                  <button className="flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                }
              />
              <SaveJobButton
                jobId={job._id}
                isSaved={isSaved}
                isJobOwner={isJobOwner}
                iconOnly
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
              />
            </div>
          )}
        </div>
      </div>

      {/* Job Content */}
      <div className="p-4 space-y-4">
        {/* Company Logo and Info */}
        <div className="flex items-start gap-3">
          {companyLogo ? (
            <Image
              src={companyLogo}
              alt={companyName}
              className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              width={56}
              height={56}
            />
          ) : (
            <div className="size-12 rounded-full bg-purple flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-semibold">
                {companyName.charAt(0)}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <Typography
              variant="h2"
              className="text-black font-semibold text-xl leading-tight mb-1 line-clamp-2"
            >
              {jobTitle}
            </Typography>
            <Link
              href={`/organizations/${job.organization?._id}`}
              className="text-purple text-sm font-medium"
            >
              {companyName}
            </Link>
          </div>
        </div>

        {/* Badges */}
        {(jobType || job.isFeatured) && (
          <div className="flex items-center gap-2 flex-wrap">
            {jobType && (
              <Badge className="bg-purple/20 text-purple px-3 py-1.5 rounded-full text-xs font-semibold">
                {jobType}
              </Badge>
            )}
            {job.isFeatured && (
              <Badge className="bg-[#FDF3E5] text-[#FB9002] px-3 py-1.5 rounded-full text-xs font-semibold">
                Featured
              </Badge>
            )}
          </div>
        )}

        {/* Job Metadata - Vertical Stack */}
        <div className="pt-2 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 w-fit">
            <Briefcase className="w-4 h-4 text-[#8A8A8A] flex-shrink-0" />
            <Typography
              variant="body-small"
              className="text-[#1D2939] text-sm font-medium"
            >
              {experience || "Not specified"}
            </Typography>
          </div>

          <div className="flex items-center gap-2 w-fit">
            <Clock className="w-4 h-4 text-[#8A8A8A] flex-shrink-0" />
            <Typography
              variant="body-small"
              className="text-[#1D2939] text-sm font-medium"
            >
              {jobShift || jobType || "Not specified"}
            </Typography>
          </div>

          <div className="flex items-center gap-2 w-fit">
            <FaMoneyBillWave className="w-4 h-4 text-[#8A8A8A] flex-shrink-0" />
            <Typography
              variant="body-small"
              className="text-dark-blue text-sm font-medium"
            >
              {salaryMin?.toLocaleString() || "0"} -{" "}
              {salaryMax?.toLocaleString() || "Not specified"}
            </Typography>
          </div>

          {location && mapUrl ? (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 w-fit hover:underline transition-opacity text-purple"
            >
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <Typography variant="body-small" className="text-sm font-medium">
                {location}
              </Typography>
            </a>
          ) : (
            <div className="flex items-center gap-2 w-fit">
              <MapPin className="w-4 h-4 text-[#8A8A8A] flex-shrink-0" />
              <Typography
                variant="body-small"
                className="text-[#1D2939] text-sm font-medium"
              >
                {location || "Not specified"}
              </Typography>
            </div>
          )}
        </div>

        {/* Action Buttons - Full Width */}
        <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
          {isJobOwner ? (
            <JobApplicantsModal jobId={job._id} />
          ) : (
            <>
              <Button
                variant="outline"
                  size={"sm"}
                className="w-full"
                onClick={() => toast.info("Work in progress")}
              >
                Chat with employer
              </Button>
              <Button
                variant={isApplied ? "outline" : "filled"}
                  size={"sm"}
                className="w-full"
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

      {/* Delete Confirmation Dialog */}
      <WarningConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Job Posting"
        description="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingAd}
        confirmVariant="danger"
      />
    </div>
  );
}
