"use client";
import React, { useMemo } from "react";

import { Briefcase, Clock, MapPin, Share2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Typography } from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AD } from "@/interfaces/ad";
import ShareJobDialog from "./share-job-dialog";
import { useAuthStore } from "@/stores/authStore";
import { SaveJobButton } from "../../saved/_components/save-job-button";
import { formatDate } from "@/utils/format-date";
import { useLocale } from "@/hooks/useLocale";
import { ICONS } from "@/constants/icons";

import { formatCompactPrice } from "@/utils/price-formatter";

export interface JobListingCardProps {
  job: AD;
  isSelected: boolean;
  onClick: () => void;
  transformAdToJobCardProps: (ad: AD) => {
    id: string;
    title: string;
    company: string;
    experience: string;
    salaryMin: number;
    salaryMax: number;
    location: string;
    jobType: string;
    postedTime: string;
    logo?: string;
  };
}

export default function JobListingCard({
  job,
  isSelected,
  onClick,
  transformAdToJobCardProps,
}: JobListingCardProps) {
  const session = useAuthStore((state) => state.session);
  const router = useRouter();
  const { locale, localePath } = useLocale();
  const isArabic = locale === "ar";
  const currentUserId = session.user?._id;
  const isJobOwner =
    job.owner?._id === currentUserId ||
    job.organization?.owner === currentUserId;

  const isSaved = job.isSaved ?? false;

  const jobProps = transformAdToJobCardProps(job);
  const postedTime = formatDate(job.createdAt)

  // Extract additional fields directly from job
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

  const jobTitle = isArabic && job.titleAr ? job.titleAr : job.title;
  const companyName = isArabic && job.organization?.tradeNameAr ? job.organization.tradeNameAr :
    (isArabic && job.organization?.legalNameAr ? job.organization.legalNameAr : jobProps.company);

  const jobShift = isArabic && job.jobShiftAr ? job.jobShiftAr : (job.jobShift || getFieldValue("jobShift") || getFieldValue("job shift") || "");
  const locationDisplay = useMemo(() => {
    // Check both job.address and job.location structure
    const locObj = (typeof job.address === "object" ? job.address : (typeof job.location === "object" ? job.location : null)) as any;

    if (locObj) {
      if (isArabic) {
        const city = locObj.cityAr || locObj.city;
        const state = locObj.stateAr || locObj.state;
        if (city && state && city !== state) return `${city}, ${state}`;
        return city || state || jobProps.location;
      } else {
        const city = locObj.city;
        const state = locObj.state;
        if (city && state && city !== state) return `${city}, ${state}`;
        return city || state || jobProps.location;
      }
    }
    return jobProps.location || "Location not specified";
  }, [job.address, job.location, isArabic, jobProps.location]);

  const validityValue = job.validity;
  const validityDate = validityValue ? new Date(validityValue) : null;
  const isValidityDateValid =
    validityDate instanceof Date && !Number.isNaN(validityDate.getTime());
  const isExpired = isValidityDateValid
    ? validityDate!.getTime() < Date.now()
    : false;


  return (
    <div
      onClick={onClick}
      role="button"
      className={cn(
        "group h-full flex flex-col bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden",
        isSelected && "ring-2 ring-purple border-transparent"
      )}
    >
      {/* Main content container - matches Figma layout */}
      {/* Text+badge+ icon section with 21.33px gap */}
      <div className="flex flex-col gap-[21.33px]">
        {/* Badge section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge className="bg-purple/10 text-purple border-none px-[7.11px] py-[7.11px] rounded-[24px] text-xs font-normal leading-[1.21]">
              {postedTime}
            </Badge>
            {isExpired && (
              <Badge className="bg-destructive/10 text-destructive border-none px-[7.11px] py-[7.11px] rounded-[24px] text-xs font-semibold leading-[1.21]">
                Expired
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ShareJobDialog
              job={job}
              trigger={
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <Share2 className="size-5 text-grey-blue" />
                  <span className="sr-only">Share</span>
                </button>
              }
            />

            {isJobOwner ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(localePath(`/post-job/edit/${job._id}`));
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Edit Job"
              >
                <Pencil className="size-5 text-grey-blue" />
                <span className="sr-only">Edit</span>
              </button>
            ) : (
              <SaveJobButton
                jobId={job._id}
                isSaved={isSaved}
                isJobOwner={isJobOwner}
                iconOnly={true}
              />
            )}
          </div>
        </div>

        {/* Logo + Text section */}
        <div className="flex items-center gap-2 justify-start">
          {jobProps.logo ? (
            <Image
              src={jobProps.logo}
              alt={jobProps.company}
              width={38}
              height={38}
              className="border rounded-full flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-purple flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {jobProps.company.charAt(0)}
              </span>
            </div>
          )}
          {/* Text container - width 171px with 16px gap */}
          <div className="space-y-1">
            <Typography
            variant="body"
            className="text-foreground dark:text-white font-bold text-base leading-[1.2] line-clamp-2"
          >
            {jobProps.title}
          </Typography>
            <Typography
              variant="body-small"
              className="text-muted-foreground text-sm font-normal leading-[1.21]"
            >
              {companyName}
            </Typography>
          </div>
          {/* Logo - 32x32 */}
        </div>
      </div>

      {/* Icon + Text sections positioned at specific y coordinates */}
      {/* Experience - y: 128 */}
      <div className="flex flex-col gap-2 mt-5">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-5 h-5 text-purple" />
          <Typography
            variant="body-small"
            className="text-foreground dark:text-white text-xs font-medium leading-[1.21]"
          >
            {jobProps.experience || "Not specified"}
          </Typography>
        </div>

        {/* Salary - y: 158.06 */}
        <div className="flex items-center gap-1.5">
          <Image src={ICONS.currency.aed} alt="AED" width={16} height={16} />
          <div className="flex items-center gap-1">
            <Typography
              variant="body-small"
              className="text-foreground dark:text-gray-300 text-xs font-medium leading-[1.21]"
            >
              {jobProps.salaryMin > 0 ? formatCompactPrice(jobProps.salaryMin) : "Not specified"} 
              {jobProps.salaryMax > 0 ? ` - ${formatCompactPrice(jobProps.salaryMax)}` : ""}
            </Typography>
          </div>
        </div>

        {/* Job Shift/Type - y: 188.12 */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-5 h-5 text-purple" />
          <Typography
            variant="body-small"
            className="text-foreground dark:text-white text-xs font-medium leading-[1.21]"
          >
            {jobShift || jobProps.jobType || "Not specified"}
          </Typography>
        </div>

        {/* Location - y: 218.18 */}
        <div className="flex items-center gap-2">
          <Image src={ICONS.ui.Map} alt="Location" width={18} height={18} />
          <Typography
            variant="body-small"
            className="text-foreground dark:text-white text-xs font-medium leading-[1.21] truncate"
          >
            {locationDisplay}
          </Typography>
        </div>
      </div>
    </div>
  );
}
