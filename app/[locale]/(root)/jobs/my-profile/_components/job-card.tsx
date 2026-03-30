"use client";

import { Briefcase, MapPin, Clock, Share2 } from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ICONS } from "@/constants/icons";
import { SaveJobButton } from "../../saved/_components/save-job-button";
import { formatDate } from "@/utils/format-date";
import { AD } from "@/interfaces/ad";
import ShareJobDialog from "../../listing/_components/share-job-dialog";
import { slugify } from "@/utils/slug-utils";
import { useLocale } from "@/hooks/useLocale";
import { formatPrice } from "@/utils/price-formatter";

export default function JobCard({ 
  job, 
  onClick, 
  buttonHref,
  buttonLabel = "Job details",
  showSaveButton = true,
  isButtonDisabled = false
}: { 
  job: Partial<AD>; 
  onClick?: () => void;
  buttonHref?: string;
  buttonLabel?: string;
  showSaveButton?: boolean;
  isButtonDisabled?: boolean;
}) {
  const { localePath } = useLocale();
  const organization = job?.organization;
  const address = job?.address;
  const owner = job?.owner;
  const isSaved = job?.isSaved;
  const title = job?.title;
  const logo = organization?.logoUrl;
  const company = organization?.tradeName || organization?.legalName;
  const location = address?.city || address?.state || address?.country;
  const createdAt = job?.createdAt;

  const finalButtonHref = buttonHref || localePath(
    `/jobs/listing/${job?.relatedCategories?.map((category) => slugify(category))?.join("/")}?jobId=${job?._id}`
  );

  return (
    <div 
      onClick={onClick}
      className={`relative sm:w-[250px] bg-white dark:bg-zinc-900 border border-[#E2E2E2] dark:border-zinc-800 rounded-2xl p-4 shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)] w-full flex flex-col h-full hover:shadow-lg transition-shadow duration-300 ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Header with Badge and Actions */}
      <div className="space-y-2 flex-1 gap-[21.33px] mb-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <Badge className="bg-[#F5EBFF] dark:bg-purple/20 text-purple dark:text-purple px-2 py-1.5 rounded-[24px] text-xs font-normal border-none">
            {formatDate?.(createdAt)}
          </Badge>
          <div className="flex items-center gap-2">
            <ShareJobDialog
              job={job}
              trigger={
                <button>
                  <Share2 className="w-5 h-5 text-grey-blue dark:text-zinc-400 hover:text-purple dark:hover:text-purple transition-colors" />
                </button>
              }
            />
            {showSaveButton && (
              <SaveJobButton
                jobId={job?._id as string}
                isSaved={isSaved}
                iconOnly={true}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex flex-row"
              />
            )}
          </div>
        </div>

        {/* Company Logo and Info */}
        <div className="flex flex-1 items-start gap-4" onClick={(e) => isButtonDisabled && e.stopPropagation()}>
          <div className="space-y-2 flex-1">
            <Typography
              variant="h3"
              className="text-black dark:text-white font-bold text-lg leading-tight line-clamp-1"
            >
              {title || "Not specified"}
            </Typography>
            <Typography
              variant="body-small"
              className="text-black dark:text-zinc-300 text-sm"
            >
              {company || "Not specified"}
            </Typography>
          </div>
          {logo ? (
            <Image
              src={logo}
              alt={company || "Organization"}
              width={32}
              height={32}
              className="object-cover w-10 h-10 rounded-full bg-white dark:bg-zinc-800"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-semibold">
                {company ? company?.charAt(0) : "NA"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="flex flex-col gap-3 mb-4 flex-1">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-5 h-5 text-purple" />
          <Typography
            variant="body-small"
            className="text-dark-blue dark:text-zinc-300 text-xs font-medium"
          >
            {job?.experience || 
             (Array.isArray(job?.extraFields) ? 
               job?.extraFields.find(f => f.name?.toLowerCase().includes("experience"))?.value : 
               (job?.extraFields as any)?.experience) || 
             "Not specified"}
          </Typography>
        </div>

        <div className="flex items-center gap-1.5">
          <Image
            src={ICONS.currency.aed}
            alt="AED"
            width={16}
            height={16}
            className="flex-shrink-0"
          />
          <div className="flex items-center gap-1">
            <Typography
              variant="body-small"
              className="text-dark-blue dark:text-zinc-300 text-xs font-medium"
            >
              {`${formatPrice(job?.minSalary || 0)} - ${formatPrice(job?.maxSalary || 0)} AED` ||
                "Not specified"}
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple flex-shrink-0" />
          <Typography
            variant="body-small"
            className="text-grey-blue dark:text-zinc-400"
          >
            {job.jobShift || "Day-shift"}
          </Typography>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Image
            src={ICONS.ui.Map}
            alt="location"
            width={16}
            height={16}
            className="flex-shrink-0"
          />
          <Typography
            variant="body-small"
            className="text-grey-blue dark:text-zinc-400 truncate"
          >
            {job.address?.address || "Dubai, UAE"}
          </Typography>
        </div>
      </div>

      {/* Action Button */}
      <div onClick={(e) => e.stopPropagation()}>
        {isButtonDisabled ? (
          <Button
            size={"sm"}
            disabled={true}
            className="w-full uppercase font-medium text-xs dark:bg-purple/50 dark:text-gray-300"
          >
            {buttonLabel}
          </Button>
        ) : (
          <Link href={finalButtonHref}>
            <Button
              size={"sm"}
              className="w-full uppercase font-medium text-xs dark:bg-purple dark:text-white dark:hover:bg-purple/90"
            >
              {buttonLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
