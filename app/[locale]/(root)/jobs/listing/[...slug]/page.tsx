"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import JobsFilter from "../_components/jobs-filter";
import { useAds, useFilterAds, useAdById } from "@/hooks/useAds";
import {
  AD,
  AdFilterPayload,
  AdFilters,
  ProductExtraField,
} from "@/interfaces/ad";
import { JobData } from "@/interfaces/job.types";
import { formatDistanceToNow } from "date-fns";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import JobListingCard from "../_components/job-listing-card";
import JobHeaderCard from "../_components/job-header-card";
import MobileJobHeaderCard from "../_components/mobile-job-header-card";
import JobDetailContent from "../_components/job-detail-content";
import Disclaimer from "../_components/disclaimer";
import Pagination from "@/components/global/pagination";
import { defaultJobFilters } from "@/constants/job.constants";
import { Container1080 } from "@/components/layouts/container-1080";
import { useLocale } from "@/hooks/useLocale";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 12;

// Helper function to safely get string value from filter
const getFilterString = (
  value: string | string[] | Date | undefined
): string => {
  if (!value) return "";
  if (value instanceof Date) return "";
  return Array.isArray(value) ? value[0] || "" : value;
};

// Helper function to format label from slug segment
const formatLabel = (segment: string) =>
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function JobsListingPage() {
  const { t, locale } = useLocale();
  const params = useParams();
  const searchParams = useSearchParams();
  const urlQuery =
    searchParams.get("query") || searchParams.get("search") || "";
  const urlLocation = searchParams.get("location") || "";

  // Get category from URL params - use the last slug segment
  const slugSegments = Array.isArray(params.slug)
    ? params.slug
    : params.slug
    ? [params.slug]
    : [];
  const currentCategory = slugSegments[slugSegments.length - 1] || "";
  const categoryName = currentCategory
    ? formatLabel(decodeURIComponent(currentCategory))
    : "Jobs";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [locationQuery, setLocationQuery] = useState(urlLocation);
  const [filters, setFilters] = useState<
    Record<string, string | string[] | Date>
  >({
    location: urlLocation,
    salary: "",
    jobType: "",
    workMode: "",
    experience: "",
    fromDate: undefined as any,
    toDate: undefined as any,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [savedExtraFields, setSavedExtraFields] = useState<ProductExtraField[]>(
    []
  );
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Initialize search query and location from URL params
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
    if (urlLocation) {
      setLocationQuery(urlLocation);
      setFilters((prev) => ({ ...prev, location: urlLocation }));
    }
  }, [urlQuery, urlLocation]);

  // Build API filters - include category if present
  const adsParamsForExtraFields = useMemo(() => {
    const params: AdFilters = {
      adType: "JOB",
      limit: 1,
      page: 1,
    };
    if (currentCategory) {
      params.category = decodeURIComponent(currentCategory);
    }
    return params;
  }, [currentCategory]);

  // Initial fetch to get extraFields structure (filtered by category if present)
  const { data: initialAdsData } = useAds(adsParamsForExtraFields);

  const firstJob = initialAdsData?.data?.adds?.[0] as AD | undefined;

  // Build breadcrumbs
  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [
      { id: "jobs", label: "Jobs", href: "/jobs" },
    ];

    if (slugSegments.length > 0) {
      items.push(
        ...slugSegments.map((segment, index) => {
          const path = slugSegments.slice(0, index + 1).join("/");
          const href = `/jobs/listing/${path}`;

          return {
            id: path || `segment-${index}`,
            label: formatLabel(decodeURIComponent(segment)),
            href,
            isActive: index === slugSegments.length - 1,
          };
        })
      );
    } else {
      // Mark listing as active if no slug
      items[items.length - 1].isActive = true;
    }

    return items;
  }, [slugSegments]);

  // Get extraFields from first job and save them
  useEffect(() => {
    if (firstJob?.extraFields) {
      const normalized = normalizeExtraFieldsToArray(firstJob.extraFields);
      if (normalized.length > 0) {
        setSavedExtraFields(normalized);
        // Initialize filter state for dynamic extraFields (preserve existing default filters)
        setFilters((prevFilters) => {
          const newFilters: Record<string, string | string[] | Date> = {
            location: getFilterString(prevFilters.location),
            salary: getFilterString(prevFilters.salary),
            jobType: getFilterString(prevFilters.jobType),
            workMode: getFilterString(prevFilters.workMode),
            experience: getFilterString(prevFilters.experience),
            fromDate:
              prevFilters.fromDate instanceof Date
                ? prevFilters.fromDate
                : (undefined as any),
            toDate:
              prevFilters.toDate instanceof Date
                ? prevFilters.toDate
                : (undefined as any),
          };
          normalized.forEach((field) => {
            if (
              field.optionalArray &&
              Array.isArray(field.optionalArray) &&
              field.optionalArray.length > 0
            ) {
              // Only add if not already in default filters
              if (!newFilters[field.name]) {
                newFilters[field.name] = getFilterString(
                  prevFilters[field.name]
                );
              }
            }
          });
          return newFilters;
        });
      }
    }
  }, [firstJob]);

  // Generate dynamic filter config from extraFields
  const dynamicFilterConfig = useMemo(() => {
    const extraFields =
      savedExtraFields.length > 0
        ? savedExtraFields
        : firstJob?.extraFields
        ? normalizeExtraFieldsToArray(firstJob.extraFields)
        : [];

    const dynamicFilters = extraFields
      .filter((field) => {
        // Only include fields that have optionalArray and are not boolean type
        return (
          field.optionalArray &&
          Array.isArray(field.optionalArray) &&
          field.optionalArray.length > 0 &&
          field.type !== "bool"
        );
      })
      .map((field) => {
        const options = field.optionalArray!.map((value) => ({
          value: String(value),
          label:
            String(value).charAt(0).toUpperCase() +
            String(value).slice(1).replace(/-/g, " "),
        }));

        return {
          key: field.name,
          label:
            field.name.charAt(0).toUpperCase() +
            field.name.slice(1).replace(/([A-Z])/g, " $1"),
          type: "select" as const,
          options,
          placeholder: `Select ${field.name}`,
        };
      });

    // Combine default filters with dynamic filters from extraFields
    return [...defaultJobFilters, ...dynamicFilters];
  }, [savedExtraFields, firstJob]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      searchQuery || Object.values(filters).some((value) => value !== "")
    );
  }, [searchQuery, filters]);

  // Build API params for useAds - always use adType: "JOB"
  const adsParams = useMemo(() => {
    const params: AdFilters = {
      adType: "JOB",
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };

    // Add category if present
    if (currentCategory) {
      params.category = decodeURIComponent(currentCategory);
    }

    // Add search query if present
    if (searchQuery) {
      params.search = searchQuery;
    }

    // Add location if present
    const locationFilter = getFilterString(filters.location) || locationQuery;
    if (locationFilter) {
      params.location = locationFilter;
    }

    // Add date filters
    if (filters.fromDate instanceof Date) {
      params.fromDate = filters.fromDate.toISOString();
    }
    if (filters.toDate instanceof Date) {
      params.toDate = filters.toDate.toISOString();
    }

    return params;
  }, [currentCategory, searchQuery, locationQuery, filters, currentPage]);

  // Build filter payload for useFilterAds when there are extra filters
  const filterPayload = useMemo((): AdFilterPayload => {
    const payload: AdFilterPayload = {
      adType: "JOB",
    };

    // Add category if present
    if (currentCategory) {
      payload.category = decodeURIComponent(currentCategory);
    }

    if (searchQuery) payload.search = searchQuery;
    const locationFilter = getFilterString(filters.location) || locationQuery;
    if (locationFilter) payload.city = locationFilter;

    // Add date filters
    if (filters.fromDate instanceof Date) {
      payload.fromDate = filters.fromDate.toISOString();
    }
    if (filters.toDate instanceof Date) {
      payload.toDate = filters.toDate.toISOString();
    }

    // Parse salary range
    const salaryFilter = getFilterString(filters.salary);
    if (salaryFilter) {
      if (salaryFilter === "under-10k") {
        payload.priceTo = 10000;
      } else if (salaryFilter === "10k-20k") {
        payload.priceFrom = 10000;
        payload.priceTo = 20000;
      } else if (salaryFilter === "20k-30k") {
        payload.priceFrom = 20000;
        payload.priceTo = 30000;
      } else if (salaryFilter === "30k-50k") {
        payload.priceFrom = 30000;
        payload.priceTo = 50000;
      } else if (salaryFilter === "50k-100k") {
        payload.priceFrom = 50000;
        payload.priceTo = 100000;
      } else if (salaryFilter === "over-100k") {
        payload.priceFrom = 100000;
      }
    }

    // Add default job filters to extraFields
    const extraFieldsFilters: Record<
      string,
      string | string[] | number | boolean
    > = {};
    const jobTypeFilter = getFilterString(filters.jobType);
    if (jobTypeFilter) extraFieldsFilters.jobType = jobTypeFilter;
    const workModeFilter = getFilterString(filters.workMode);
    if (workModeFilter) extraFieldsFilters.workMode = workModeFilter;
    const experienceFilter = getFilterString(filters.experience);
    if (experienceFilter) extraFieldsFilters.experience = experienceFilter;

    // Add dynamic extraFields filters (from first job's extraFields)
    Object.entries(filters).forEach(([key, value]) => {
      // Skip default filters that are already handled (including date filters)
      if (
        ![
          "location",
          "salary",
          "jobType",
          "workMode",
          "experience",
          "fromDate",
          "toDate",
        ].includes(key) &&
        value &&
        !(value instanceof Date)
      ) {
        extraFieldsFilters[key] = value;
      }
    });

    if (Object.keys(extraFieldsFilters).length > 0) {
      payload.extraFields = extraFieldsFilters;
    }

    return payload;
  }, [currentCategory, searchQuery, locationQuery, filters, currentPage]);

  // Use useAds when only search/location filters (simple case)
  // Use useFilterAds when there are complex filters (salary, jobType, etc.)
  const hasComplexFilters = useMemo(() => {
    return !!(
      getFilterString(filters.salary) ||
      getFilterString(filters.jobType) ||
      getFilterString(filters.workMode) ||
      getFilterString(filters.experience) ||
      filters.fromDate instanceof Date ||
      filters.toDate instanceof Date ||
      Object.entries(filters).some(
        ([key, value]) =>
          ![
            "location",
            "salary",
            "jobType",
            "workMode",
            "experience",
            "fromDate",
            "toDate",
          ].includes(key) &&
          value &&
          !(value instanceof Date)
      )
    );
  }, [filters]);

  // Fetch jobs using ads API
  const { data: filterAdsData, isLoading: isFilterLoading } = useFilterAds(
    filterPayload,
    currentPage,
    ITEMS_PER_PAGE,
    hasComplexFilters || hasActiveFilters || !!currentCategory
  );

  const { data: regularAdsData, isLoading: isRegularLoading } = useAds(
    !hasComplexFilters && !hasActiveFilters && !currentCategory
      ? adsParams
      : undefined
  );

  const adsData =
    hasComplexFilters || hasActiveFilters || currentCategory
      ? filterAdsData
      : regularAdsData;
  const isLoading =
    hasComplexFilters || hasActiveFilters || currentCategory
      ? isFilterLoading
      : isRegularLoading;

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

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleLocationChange = (value: string) => {
    setLocationQuery(value);
    setFilters((prev) => ({ ...prev, location: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters: Record<string, string | string[] | Date> = {
      location: "",
      salary: "",
      jobType: "",
      workMode: "",
      experience: "",
      fromDate: undefined as any,
      toDate: undefined as any,
    };
    // Clear all dynamic filters from extraFields
    dynamicFilterConfig.forEach((config) => {
      // Skip default filters (including date filters)
      if (
        ![
          "location",
          "salary",
          "jobType",
          "workMode",
          "experience",
          "fromDate",
          "toDate",
        ].includes(config.key)
      ) {
        clearedFilters[config.key] = "";
      }
    });
    setFilters(clearedFilters);
    setSearchQuery("");
    setLocationQuery("");
    setCurrentPage(1);
  };

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
      onShare: (id: string) => console.log("Shared:", id),
    };
  };

  return (
    <Container1080 className="space-y-6 min-h-dvh">
      <MobileStickyHeader title={categoryName} />
      <div className="w-full mx-auto px-4 md:py-6">
        <div className="hidden md:block mb-6">
          <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between md:mb-6">
          <Typography variant="md-black-inter" className="font-semibold">
            {categoryName} in Dubai ({jobs.length})
          </Typography>
        </div>

        {/* Jobs Filters */}
        <JobsFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${categoryName}...`}
          locationQuery={locationQuery}
          onLocationChange={handleLocationChange}
          locationPlaceholder="Dubai"
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          config={dynamicFilterConfig}
          className="mb-4"
        />

        {/* Jobs Listing Layout - Two Column View */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found.</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="flex items-start gap-5">
            {/* Left Column - Job Listings Sidebar */}
            {/* On md: hide when job is selected, show when no selection. On lg+: always show */}
            <div
              className={`space-y-5 w-full sm:w-auto ${
                selectedJobId ? "hidden md:block" : "flex"
              }`}
            >
              <div
                className={cn("flex gap-5 flex-wrap", selectedJobId && "block")}
              >
                {jobs.map((job) => (
                  <JobListingCard
                    key={job._id}
                    job={job}
                    isSelected={selectedJobId === job._id}
                    onClick={() => setSelectedJobId(job._id)}
                    transformAdToJobCardProps={transformAdToJobCardProps}
                  />
                ))}
              </div>

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
            {/* On md: show when job is selected. On lg+: always show when selected */}
            <div className="space-y-6">
              {isJobLoading ? (
                <div className="text-center py-12">
                  <Typography variant="body" className="text-gray-500">
                    Loading job details...
                  </Typography>
                </div>
              ) : jobError ? (
                <div className="text-center py-12">
                  <Typography variant="body" className="text-red-500">
                    {jobError ? "Failed to load job details" : "Job not found"}
                  </Typography>
                </div>
              ) : selectedJob ? (
                <>
                  {/* Mobile Header Card */}
                  <MobileJobHeaderCard
                    job={selectedJob}
                    logo={selectedJob.organization?.logoUrl}
                    onFavorite={(id: string) => console.log("Favorited:", id)}
                    onApply={(jobId: string) => {
                      console.log("Apply to job:", jobId);
                      // Handle apply logic in parent component
                    }}
                    isFavorite={false}
                    isApplied={selectedJob.isApplied ?? false}
                    isApplying={false}
                    onBack={() => setSelectedJobId(null)}
                    className="block sm:hidden"
                  />
                  {/* Desktop Header Card */}
                  <JobHeaderCard
                    className="hidden sm:block"
                    job={selectedJob}
                    logo={selectedJob.organization?.logoUrl}
                    onFavorite={(id: string) => console.log("Favorited:", id)}
                    onApply={(jobId: string) => {
                      console.log("Apply to job:", jobId);
                      // Handle apply logic in parent component
                    }}
                    isFavorite={false}
                    isApplied={selectedJob.isApplied ?? false}
                    isApplying={false}
                  />
                  <JobDetailContent job={selectedJob} />
                  <Disclaimer />
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </Container1080>
  );
}
