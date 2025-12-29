"use client";

import Image from "next/image";
import {
  Mail,
  Phone,
  Rocket,
  Briefcase,
  Clock,
  DollarSign,
  EditIcon,
} from "lucide-react";
import { Typography } from "@/components/typography";
import { ICONS } from "@/constants/icons";
import Link from "next/link";
import { JobseekerProfile } from "@/interfaces/job.types";
import { formatDistanceToNow } from "date-fns";

interface JobsProfileSectionProps {
  profile?: JobseekerProfile;
  isLoading?: boolean;
}

export default function JobsProfileSection({
  profile,
  isLoading,
}: JobsProfileSectionProps) {
  if (isLoading) {
    return (
      <section className="w-full bg-[#F2F4F7] pt-10 px-4 lg:px-[100px]">
        <div className="max-w-[1080px] mx-auto bg-white rounded-2xl p-6 animate-pulse">
          <div className="h-[170px] w-[170px] rounded-full bg-gray-200" />
        </div>
      </section>
    );
  }

  if (!profile) {
    return null;
  }

  const profileName = profile.name || "User";
  const initials =
    profileName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "SK";
  const professionalTitle = profile.headline || "";
  const currentCompany = profile.experiences?.[0]?.company || "";
  const phoneNo = profile.contactPhone || "";
  const email = profile.contactEmail || "";

  // Get job preferences
  const jobType = profile.preferredJobTypes?.[0] || "";

  // Use experienceYears directly from profile, or calculate from experiences
  let experience = "";
  if (profile.experienceYears) {
    experience = `${profile.experienceYears} ${
      profile.experienceYears === 1 ? "year" : "years"
    }`;
  } else if (profile.experiences && profile.experiences.length > 0) {
    const firstExp = profile.experiences[0];
    if (firstExp.startDate) {
      const startDate = new Date(firstExp.startDate);
      const endDate = firstExp.endDate
        ? new Date(firstExp.endDate)
        : firstExp.isCurrent
        ? new Date()
        : null;
      if (endDate) {
        const yearsDiff =
          (endDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24 * 365);
        experience = `${Math.floor(yearsDiff)} ${
          Math.floor(yearsDiff) === 1 ? "year" : "years"
        }`;
      }
    }
  }

  const salaryMin = profile.salaryExpectationMin || 0;
  const salaryMax = profile.salaryExpectationMax || 0;
  const ctcCurrency = profile.ctcCurrency || "AED";
  const availability =
    profile.availability ||
    (profile.noticePeriodDays
      ? `${profile.noticePeriodDays} days notice`
      : "Immediately");

  const lastUpdated = profile.updatedAt
    ? formatDistanceToNow(new Date(profile.updatedAt), { addSuffix: true })
    : "";

  return (
    <section className="w-full bg-[#F2F4F7] pt-10 px-4 lg:px-[100px]">
      <div className="max-w-[1080px] mx-auto bg-white rounded-2xl p-6 relative flex gap-6">
        {/*------- Profile Image Circle--------- */}
        <div className="relative size-[170px] mx-auto md:mx-0">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#37E7B6] p-2">
            <div className="w-full h-full rounded-full border-[5px] border-[#F5EBFF] flex items-center justify-center bg-gradient-to-br from-purple/10 to-purple/5 overflow-hidden">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profileName}
                  width={170}
                  height={170}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <div className="w-[32px] h-[32px] rounded-full bg-purple flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xl space-y-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Typography
                variant="h2"
                className="text-dark-blue font-semibold text-2xl"
              >
                {profileName}
              </Typography>

              {/* TODO: Add verified status if available in profile */}
            </div>
            {professionalTitle && (
              <Typography
                variant="body-large"
                className="text-dark-blue font-semibold text-xs"
              >
                {professionalTitle}
              </Typography>
            )}
            {currentCompany && (
              <Typography
                variant="body-large"
                className="text-dark-blue font-semibold text-xs"
              >
                At {currentCompany}
              </Typography>
            )}
          </div>

          {/* ------- Profile Details Grid ------- */}
          <div className="grid grid-cols-2 gap-5">
            {jobType && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-grey-blue" />
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-xs font-medium"
                >
                  {jobType}
                </Typography>
              </div>
            )}
            {phoneNo && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-5 h-5 text-grey-blue" />
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-sm"
                >
                  {phoneNo}
                </Typography>
              </div>
            )}

            {experience && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-5 h-5 text-dark-blue" />
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-sm font-medium"
                >
                  {experience}
                </Typography>
              </div>
            )}

            {email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-5 h-5 text-grey-blue" />
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-sm"
                >
                  {email}
                </Typography>
              </div>
            )}
            {(salaryMin > 0 || salaryMax > 0) && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-5 h-5 text-dark-blue" />
                <div className="flex items-center gap-1">
                  <span className="text-[12px]">{ctcCurrency}</span>
                  <Typography
                    variant="body-small"
                    className="text-dark-blue text-sm font-medium"
                  >
                    {salaryMin.toLocaleString()}
                  </Typography>
                  {salaryMax > salaryMin && (
                    <>
                      <span className="text-dark-blue">-</span>
                      <span className="text-[12px]">{ctcCurrency}</span>
                      <Typography
                        variant="body-small"
                        className="text-dark-blue text-sm font-medium"
                      >
                        {salaryMax.toLocaleString()}
                      </Typography>
                    </>
                  )}
                </div>
              </div>
            )}

            {availability && (
              <div className="flex items-center gap-1.5">
                <Rocket className="w-5 h-5 text-dark-blue" />
                <Typography
                  variant="body-small"
                  className="text-dark-blue text-sm font-medium"
                >
                  {availability}
                </Typography>
              </div>
            )}
          </div>
        </div>

        {lastUpdated && (
          <Typography
            variant="body-small"
            className="text-dark-blue text-sm font-poppins absolute bottom-3 right-4 font-medium"
          >
            Profile last updated - {lastUpdated}
          </Typography>
        )}

        <Link
          href="/jobs/jobseeker/new"
          className="text-purple font-semibold text-sm hover:underline flex items-center gap-2 absolute top-5 right-4"
        >
          <EditIcon className="w-4 h-4" /> Edit
        </Link>
      </div>
    </section>
  );
}
