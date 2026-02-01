"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Typography } from "@/components/typography";
import { useMyAds, useAdById } from "@/hooks/useAds";
import { AD, AdFilters } from "@/interfaces/ad";
import { JobData } from "@/interfaces/job.types";
import { formatDistanceToNow } from "date-fns";
import JobListingCard from "../_components/job-listing-card";
import JobHeaderCard from "../_components/job-header-card";
import MobileJobHeaderCard from "../_components/mobile-job-header-card";
import JobDetailContent from "../_components/job-detail-content";
import Disclaimer from "../_components/disclaimer";
import Pagination from "@/components/global/pagination";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import router from "next/router";
import { useRouter } from "nextjs-toploader/app";
import { NoDataCard } from "@/components/global/fallback-cards";

const ITEMS_PER_PAGE = 12;

export default function MyJobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const router = useRouter();
  // Build API params for useMyAds - always use adType: "JOB"
  const myAdsParams = useMemo<AdFilters>(() => {
    return {
      adType: "JOB",
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };
  }, [currentPage]);

  // Fetch user's jobs using myAds API
  const { data: adsData, isLoading } = useMyAds(myAdsParams);

  const jobs = useMemo(
    () => (adsData?.data?.adds || []) as AD[],
    [adsData?.data?.adds]
  );
  const totalItems = adsData?.data?.total || jobs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Fetch job details by ID using API
  const {
    data: jobResponse,
    isLoading: isJobLoading,
    error: jobError,
  } = useAdById(selectedJobId || "");
  const selectedJob = jobResponse?.data;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper function to extract salary from AD extraFields
  const getSalaryFromAd = useCallback(
    (ad: AD, type: "min" | "max"): number | null => {
      if (!ad.extraFields) return null;

      const extraFields = Array.isArray(ad.extraFields)
        ? ad.extraFields
        : Object.entries(ad.extraFields).map(([name, value]) => ({
            name,
            value,
          }));

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

      return null;
    },
    []
  );

  // Transform AD to JobCard props (kept for backward compatibility with other components)
  const transformAdToJobCardProps = (ad: AD) => {
    const postedTime = formatDistanceToNow(new Date(ad.createdAt), {
      addSuffix: true,
    });

    // Extract job fields from extraFields
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
      if (field) {
        if (Array.isArray(field.value)) {
          return field.value.join(", ");
        }
        return String(field.value || "");
      }
      return "";
    };

    const jobType =
      getFieldValue("jobType") || getFieldValue("job type") || "Not specified";
    const experience = getFieldValue("experience") || "Not specified";

    // Extract salary from extraFields or use price
    const salaryMin = getSalaryFromAd(ad, "min") || ad.price || 0;
    const salaryMax = getSalaryFromAd(ad, "max") || ad.price || 0;

    // Get location
    const location =
      typeof ad.location === "string"
        ? ad.location
        : ad.location?.city || ad.address?.city || "Location not specified";

    // Get company name
    const company =
      ad.organization?.tradeName ||
      ad.organization?.legalName ||
      (ad.owner?.firstName && ad.owner?.lastName
        ? `${ad.owner.firstName} ${ad.owner.lastName}`
        : "Company");

    return {
      id: ad._id,
      title: ad.title || "",
      company,
      experience,
      salaryMin,
      salaryMax,
      location,
      jobType,
      postedTime,
      logo: ad.organization?.logoUrl,
      isFavorite: false,
      onFavorite: (id: string) => console.log("Favorited:", id),
    };
  };

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: "jobs", label: "Jobs", href: "/jobs" },
    // { id: "listing", label: "Listing", href: "/jobs/listing" },
    { id: "my", label: "My Jobs", href: "/jobs/listing/my", isActive: true },
  ];

  return (
    <Container1080>
      <MobileStickyHeader title="My Jobs" />
      <div className="w-full p-4">
        <Breadcrumbs
          className="hidden sm:flex"
          showHomeIcon={true}
          homeHref="/"
          homeLabel="Home"
          items={breadcrumbItems}
          showSelectCategoryLink={false}
        />

        {/* Page Header */}
        <div className="flex items-center justify-between mt-3 mb-6">
          <Typography variant="md-black-inter" className="font-semibold">
            My Jobs ({jobs.length})
          </Typography>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              router.push("/post-job/");
            }}
            icon={<PlusIcon />}
            iconPosition="left"
          >
            Create Job
          </Button>
        </div>

        {/* Jobs Listing Layout - Two Column View */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
              <NoDataCard title="No Jobs Found" description="You have not created any jobs yet." />
          </div>
        ) : (
              <div className="flex flex-col items-center justify-center gap-5">
            {/* Left Column - Job Listings Sidebar */}
            {/* On md: hide when job is selected, show when no selection. On lg+: always show */}
            <div
                  className={`space-y-5 w-full  gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:min-w-[256px]`}
            >
              {jobs.map((job) => (
                <JobListingCard
                  key={job._id}
                  job={job}
                  isSelected={selectedJobId === job._id}
                  onClick={() => {
                    router.push(`/jobs/listing/${job._id}/applicants`);
                  }}
                  transformAdToJobCardProps={transformAdToJobCardProps}
                />
              ))}

              {/* Pagination */}
                </div>
                {totalPages > 1 && (
                  <div className="bg-white w-full flex justify-center items-center border border-gray-200 rounded-xl p-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={false}
                  />
                </div>
                )}

            {/* Right Column - Job Detail View */}
            {/* On md: show when job is selected. On lg+: always show when selected */}
            {selectedJobId && (
              <div className="space-y-6">
                {isJobLoading ? (
                  <div className="text-center py-12">
                    <Typography variant="body" className="text-gray-500">
                      Loading job details...
                    </Typography>
                  </div>
                ) : jobError || !selectedJob ? (
                  <div className="text-center py-12">
                    <Typography variant="body" className="text-red-500">
                      {jobError
                        ? "Failed to load job details"
                        : "Job not found"}
                    </Typography>
                  </div>
                ) : selectedJob ? (
                  <>
                    {/* Mobile Header Card */}
                    <MobileJobHeaderCard
                      job={selectedJob}
                      logo={selectedJob.organization?.logoUrl}

                              isSaved={selectedJob.isSaved ?? false}
                              isApplied={selectedJob.isApplied ?? false}
                      onBack={() => setSelectedJobId(null)}
                      className="block sm:hidden"
                    />
                    {/* Desktop Header Card */}
                    <JobHeaderCard
                      className="hidden sm:block"
                      job={selectedJob}
                      logo={selectedJob.organization?.logoUrl}
                              isSaved={selectedJob.isSaved ?? false}
                              isApplied={selectedJob.isApplied ?? false}
                    />
                    <JobDetailContent job={selectedJob} />
                    <Disclaimer />
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>
    </Container1080>
  );
}
