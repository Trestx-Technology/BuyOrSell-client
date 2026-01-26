"use client";

import { Typography } from "@/components/typography";
import JobCard from "./job-card";
import Link from "next/link";
import JobsSectionTitle from "../../_components/jobs-section-title";
import { AD } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import { useAds } from "@/hooks/useAds";
import { useMemo } from "react";

const getSalaryFromAd = (ad: AD, type: "min" | "max"): number | undefined => {
  if (!ad.extraFields) return undefined;

  const extraFields = Array.isArray(ad.extraFields)
    ? ad.extraFields
    : Object.entries(ad.extraFields).map(([name, value]) => ({
        name,
        value,
      }));

  const match = extraFields.find((field) =>
    field.name?.toLowerCase().includes(`${type}salary`)
  );

  if (match) {
    const value = match.value;
    if (typeof value === "number") return value;
    if (typeof value === "string") return Number(value) || undefined;
  }

  return undefined;
};

const transformAdToJobCard = (ad: AD) => {
  const postedTime = formatDistanceToNow(new Date(ad.createdAt), {
    addSuffix: true,
  });

  const extraFields = Array.isArray(ad.extraFields)
    ? ad.extraFields
    : Object.entries(ad.extraFields || {}).map(([name, value]) => ({
        name,
        value,
      }));

  const getFieldValue = (fieldName: string): string => {
    const field = extraFields.find((f) =>
      f.name?.toLowerCase().includes(fieldName.toLowerCase())
    );
    if (!field) return "";
    if (Array.isArray(field.value)) {
      return field.value.join(", ");
    }
    return String(field.value || "");
  };

  const jobType =
    getFieldValue("jobType") || getFieldValue("job type") || "Not specified";
  const experience = getFieldValue("experience") || "Not specified";

  const salaryMin = getSalaryFromAd(ad, "min") || ad.price || 0;
  const salaryMax = getSalaryFromAd(ad, "max") || ad.price || 0;

  const location =
    typeof ad.location === "string"
      ? ad.location
      : ad.location?.city || ad.address?.city || "Location not specified";

  const company =
    ad.organization?.tradeName ||
    ad.organization?.legalName ||
    (ad.owner?.firstName && ad.owner?.lastName
      ? `${ad.owner.firstName} ${ad.owner.lastName}`
      : "Company");

  return {
    id: ad._id,
    title: ad.title,
    company,
    experience,
    salaryMin,
    salaryMax,
    location,
    jobType,
    postedTime,
    logo: ad.organization?.logoUrl,
  };
};

export default function SimilarJobs() {
  const { data, isLoading } = useAds({ adType: "JOB", limit: 4 });

  const jobs = data?.adds || data?.ads || data?.data?.ads || data?.data?.adds || []

  if (isLoading) {
    return (
      <section className="w-full bg-white py-8 px-4 lg:px-[100px]">
        <div className="max-w-[1080px] mx-auto">
          <div className="flex flex-wrap gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-lg w-[256px] h-[300px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (jobs.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-8 px-4 lg:px-[100px]">
      <div className="max-w-[1080px] mx-auto">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center w-full">
            <JobsSectionTitle>Similar Jobs</JobsSectionTitle>
            {/* <Link href="/jobs/similar">
              <Typography
                variant="body-large"
                className="text-purple font-semibold text-base hover:underline"
              >
                View all
              </Typography>
            </Link> */}
          </div>

          {/* Jobs Grid */}
          <div className="flex flex-wrap gap-5">
            {jobs.map((job) => (
              <JobCard job={job} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
