"use client";

import {
  Briefcase,
  DollarSign,
  MapPin,
  Clock,
  Share2,
  Heart,
} from "lucide-react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ICONS } from "@/constants/icons";

export interface ApplicantCardProps {
  id: string;
  name: string;
  role: string;
  company: string;
  experience: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  jobType: string;
  postedTime: string;
  logo?: string;
  isFavorite?: boolean;
  onFavorite?: (id: string) => void;
  onShare?: (id: string) => void;
}

export default function ApplicantCard({
  id,
  name,
  role,
  company,
  experience,
  salaryMin,
  salaryMax,
  location,
  jobType,
  postedTime,
  logo,
  isFavorite = false,
  onFavorite,
  onShare,
}: ApplicantCardProps) {
  return (
    <div className="bg-white border border-[#E2E2E2] rounded-2xl p-4 shadow-[0px_2.67px_7.11px_rgba(48,150,137,0.08)] w-full lg:max-w-[256px] space-y-4 relative">
      {/* Header with Badge and Actions */}
      <div className="flex flex-col gap-[21.33px]">
        <div className="flex justify-between items-start">
          <Badge className="bg-[#F5EBFF] text-purple px-2 py-1.5 rounded-[24px] text-xs font-normal">
            {postedTime}
          </Badge>
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={() => onShare(id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Share2 className="w-5 h-5 text-dark-blue" />
              </button>
            )}
            {onFavorite && (
              <button
                onClick={() => onFavorite(id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-dark-blue"
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Applicant Info */}
        <div className="flex items-start gap-[17.78px]">
          <div className="space-y-2 flex-1">
            <Typography
              variant="h3"
              className="text-black font-bold text-lg leading-tight line-clamp-2 "
            >
              {name}
            </Typography>
            <Typography
              variant="body-small"
              className="text-black text-sm line-clamp-2"
            >
              {role}
            </Typography>
            <Typography
              variant="body-small"
              className="text-[#8A8A8A] text-xs line-clamp-1"
            >
              working in {company}
            </Typography>
          </div>
          {logo ? (
            <Image
              src={logo}
              alt={name}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Applicant Details */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <Briefcase className="w-5 h-5 text-grey-blue" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            Exp {experience}
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
            <span className="text-[9.19px]">AED</span>
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium"
            >
              {salaryMin.toLocaleString()}
            </Typography>
            <span className="text-[#8A8A8A] text-[10.83px]">-</span>
            <span className="text-[9.19px]">AED</span>
            <Typography
              variant="body-small"
              className="text-dark-blue text-xs font-medium"
            >
              {salaryMax.toLocaleString()}
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-5 h-5 text-grey-blue" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            {jobType}
          </Typography>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-5 h-5 text-grey-blue" />
          <Typography
            variant="body-small"
            className="text-dark-blue text-xs font-medium"
          >
            {location}
          </Typography>
        </div>
      </div>

      {/* Action Button */}
      <Link
        className="w-full block uppercase font-medium text-xs bg-purple text-white rounded-lg py-2 px-4 text-center hover:scale-105 transition-all duration-300"
        href={`/jobs/jobseeker/${id}?type=profileVisit`}
      >
        View profile
      </Link>
    </div>
  );
}
