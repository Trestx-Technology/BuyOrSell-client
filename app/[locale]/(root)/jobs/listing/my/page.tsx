"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Typography } from "@/components/typography";
import { useMyAds, useAdById } from "@/hooks/useAds";
import { AD, AdFilters } from "@/interfaces/ad";
import { JobData } from "@/interfaces/job.types";
import { formatDistanceToNow } from "date-fns";
import JobListingCard from "../_components/job-listing-card";
import JobHeaderCard from "../_components/job-header-card";
import JobDetailContent from "../_components/job-detail-content";
import Disclaimer from "../_components/disclaimer";
import Pagination from "@/components/global/pagination";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const ITEMS_PER_PAGE = 12;

// Helper function to safely get string value from filter
const getFilterString = (value: string | string[] | undefined): string => {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
};

export default function MyJobsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

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

  // Set selected job when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0]._id);
    }
  }, [jobs.length, selectedJobId, jobs]);

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

  // Transform AD to JobData
  const transformAdToJobData = (ad: AD): JobData => {
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
      return type === "min" ? ad.price : ad.price;
    };

    return {
      _id: ad._id,
      title: ad.title || "",
      description: ad.description || "",
      company: ad.organization?.tradeName || ad.organization?.legalName || "",
      organization: ad.organization as JobData["organization"],
      location:
        typeof ad.location === "string"
          ? ad.location
          : ad.location?.city || ad.address?.city || "",
      jobType: getFieldValue("jobType") || getFieldValue("job type") || "",
      workMode: getFieldValue("workMode") || getFieldValue("work mode") || "",
      experience: getFieldValue("experience") || "",
      salaryMin: getSalaryFromAd("min"),
      salaryMax: getSalaryFromAd("max"),
      skills: getFieldValue("skills")
        ? getFieldValue("skills")
            .split(/[,;]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      benefits: getFieldValue("benefits")
        ? getFieldValue("benefits")
            .split(/[,;]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      postedAt: ad.createdAt,
      expiresAt: (ad as { expiresAt?: string }).expiresAt,
      isFeatured: ad.isFeatured,
      views: ad.views,
      applicationsCount: undefined,
      status: ad.status || "active",
      extraFields: ad.extraFields as Record<string, unknown>,
    };
  };

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
    { id: "listing", label: "Listing", href: "/jobs/listing" },
    { id: "my", label: "My Jobs", href: "/jobs/listing/my", isActive: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto py-6">
        <div className="hidden sm:block mb-6">
          <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <Typography variant="md-black-inter" className="font-semibold">
            My Jobs ({jobs.length})
          </Typography>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              console.log("");
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
            <p className="text-gray-500 text-lg">No jobs found.</p>
          </div>
        ) : (
          <div className="bg-[#F9FAFC] min-h-screen">
            <div className="max-w-[1080px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[256px_1fr] gap-[19px]">
                {/* Left Column - Job Listings Sidebar */}
                <div className="space-y-[19px]">
                  {jobs.map((job) => (
                    <JobListingCard
                      key={job._id}
                      job={job}
                      isSelected={selectedJobId === job._id}
                      onClick={() => setSelectedJobId(job._id)}
                      transformAdToJobCardProps={transformAdToJobCardProps}
                    />
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-white rounded-xl p-4">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        isLoading={false}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column - Job Detail View */}
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
                        <JobHeaderCard
                          job={selectedJob}
                          logo={selectedJob?.organization?.logoUrl}
                          onFavorite={(id: string) =>
                            console.log("Favorited:", id)
                          }
                          onApply={(jobId: string) => {
                            console.log("Apply to job:", jobId);
                            // Handle apply logic in parent component
                          }}
                          isFavorite={false}
                          isApplied={false}
                          isApplying={false}
                        />
                        <JobDetailContent job={selectedJob} />
                        <Disclaimer />
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
