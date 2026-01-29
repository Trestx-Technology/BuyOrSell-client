"use client";

import {
  Briefcase,
  MapPin,
  Clock,
  Share2,
} from "lucide-react";
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


export default function JobCard({
  job
}: { job: Partial<AD> }) {
  const organization = job?.organization;
  const address = job?.address;
  const owner = job?.owner;
  const isSaved = job?.isSaved;
  const title = job?.title;
  const logo = organization?.logoUrl;
  const company = organization?.tradeName || organization?.legalName;
  const location = address?.city || address?.state || address?.country;
  const createdAt = job?.createdAt;


  return (
    <div className="relative sm:w-[250px]  bg-white border border-[#E2E2E2] rounded-2xl p-4 shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)] w-full flex flex-col h-full">
      {/* Header with Badge and Actions */}
      <div className="space-y-2 flex-1  gap-[21.33px] mb-4">
        <div className="flex justify-between items-center">
          <Badge className="bg-[#F5EBFF] text-purple px-2 py-1.5 rounded-[24px] text-xs font-normal">
            {formatDate?.(createdAt)}
          </Badge>
          <div className="flex items-center gap-2">
            <ShareJobDialog job={job} trigger={
              <button>
                <Share2 className="w-5 h-5 text-grey-blue" />
              </button>
            }
            />
            <SaveJobButton
              jobId={job?._id as string}
              isSaved={isSaved}
              iconOnly={true}
              className="p-1 hover:bg-gray-100 rounded flex flex-row"
            />
          </div>
        </div>

        {/* Company Logo and Info */}
        <div className="flex flex-1 items-start gap-4">
          <div className="space-y-2 flex-1">
            <Typography
              variant="h3"
              className="text-black font-bold text-lg leading-tight line-clamp-1"
            >
              {title || "Not specified"}
            </Typography>
            <Typography variant="body-small" className="text-black text-sm">
              {company || "Not specified"}
            </Typography>
          </div>
          {logo ? (
            <Image
              src={logo}
              alt={company || "Organization"}
              width={32}
              height={32}
              className="object-cover w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center">
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
          <Briefcase className="w-5 h-5 text-grey-blue" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            {job?.category?.name || "Not specified"}
          </Typography>
        </div>

        <div className="flex items-center gap-1.5">
          <Image
            src={ICONS.currency.aed}
            alt="dollar sign"
            width={16}
            height={16}
          />
          <div className="flex items-center gap-1">
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium"
            >
              {`${job?.minSalary} - ${job?.maxSalary}` || "Not specified"}
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-5 h-5 text-grey-blue" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            Not specified
          </Typography>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-5 h-5 text-grey-blue" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            {location || "Not specified"}
          </Typography>
        </div>
      </div>

      {/* Action Button */}
      <Link href={(`jobs/listing/${job?.relatedCategories?.map((category) => slugify(category))?.join("/")}?jobId=${job?._id}`)}>
        <Button size={"sm"} className="w-full uppercase font-medium text-xs">
          Job details
        </Button>
      </Link>
    </div>
  );
}
