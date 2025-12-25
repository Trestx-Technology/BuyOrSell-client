"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { FilterConfig } from "@/app/(root)/categories/_components/ads-filter";
import { Typography } from "@/components/typography";
import { Bell, ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import JobsFilter from "./_components/jobs-filter";
import { useAds, useFilterAds, useAdById } from "@/hooks/useAds";
import { AD, AdFilterPayload, AdFilters, ProductExtraField } from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import JobListingCard from "./_components/job-listing-card";
import JobHeaderCard from "./_components/job-header-card";
import JobDetailContent from "./_components/job-detail-content";
import Disclaimer from "./_components/disclaimer";
import Pagination from "@/components/global/pagination";

const ITEMS_PER_PAGE = 12;

// Default filter configuration for jobs
const defaultJobFilters: FilterConfig[] = [
  {
    key: "location",
    label: "Location",
    type: "select",
    options: [
      { value: "dubai", label: "Dubai" },
      { value: "abu-dhabi", label: "Abu Dhabi" },
      { value: "sharjah", label: "Sharjah" },
      { value: "ajman", label: "Ajman" },
      { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
      { value: "fujairah", label: "Fujairah" },
      { value: "umm-al-quwain", label: "Umm Al Quwain" },
    ],
    placeholder: "Dubai",
  },
  {
    key: "salary",
    label: "Salary Range",
    type: "select",
    options: [
      { value: "under-10k", label: "Under 10,000" },
      { value: "10k-20k", label: "10,000 - 20,000" },
      { value: "20k-30k", label: "20,000 - 30,000" },
      { value: "30k-50k", label: "30,000 - 50,000" },
      { value: "50k-100k", label: "50,000 - 100,000" },
      { value: "over-100k", label: "Over 100,000" },
    ],
    placeholder: "Select Salary Range",
  },
  {
    key: "jobType",
    label: "Job Type",
    type: "select",
    options: [
      { value: "full-time", label: "Full Time" },
      { value: "part-time", label: "Part Time" },
      { value: "contract", label: "Contract" },
      { value: "temporary", label: "Temporary" },
      { value: "internship", label: "Internship" },
    ],
    placeholder: "Any Type",
  },
  {
    key: "workMode",
    label: "Work Mode",
    type: "select",
    options: [
      { value: "remote", label: "Remote" },
      { value: "on-site", label: "On-Site" },
      { value: "hybrid", label: "Hybrid" },
    ],
    placeholder: "Any Mode",
  },
  {
    key: "experience",
    label: "Experience",
    type: "select",
    options: [
      { value: "entry", label: "Entry Level" },
      { value: "mid", label: "Mid Level" },
      { value: "senior", label: "Senior Level" },
      { value: "executive", label: "Executive" },
    ],
    placeholder: "Any Experience",
  },
];

// Helper function to safely get string value from filter
const getFilterString = (value: string | string[] | undefined): string => {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
};

export default function JobsListingPage() {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("query") || searchParams.get("search") || "";
  const urlLocation = searchParams.get("location") || "";
  
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [locationQuery, setLocationQuery] = useState(urlLocation);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    location: urlLocation,
    salary: "",
    jobType: "",
    workMode: "",
    experience: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [savedExtraFields, setSavedExtraFields] = useState<ProductExtraField[]>([]);
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

  // Initial fetch to get extraFields structure
  const { data: initialAdsData } = useAds({
    adType: "JOB",
    limit: 1,
    page: 1,
  });

  const firstJob = initialAdsData?.data?.adds?.[0] as AD | undefined;

  const categoryName = "Jobs";

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: "jobs", label: "Jobs", href: "/jobs" },
    { id: "listing", label: "Listing", href: "/jobs/listing", isActive: true },
  ];

  // Get extraFields from first job and save them
  useEffect(() => {
    if (firstJob?.extraFields) {
      const normalized = normalizeExtraFieldsToArray(firstJob.extraFields);
      if (normalized.length > 0) {
        setSavedExtraFields(normalized);
        // Initialize filter state for dynamic extraFields (preserve existing default filters)
        setFilters((prevFilters) => {
          const newFilters: Record<string, string | string[]> = {
            location: getFilterString(prevFilters.location),
            salary: getFilterString(prevFilters.salary),
            jobType: getFilterString(prevFilters.jobType),
            workMode: getFilterString(prevFilters.workMode),
            experience: getFilterString(prevFilters.experience),
          };
          normalized.forEach((field) => {
            if (field.optionalArray && Array.isArray(field.optionalArray) && field.optionalArray.length > 0) {
              // Only add if not already in default filters
              if (!newFilters[field.name]) {
                newFilters[field.name] = getFilterString(prevFilters[field.name]);
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
    const extraFields = savedExtraFields.length > 0 
      ? savedExtraFields 
      : (firstJob?.extraFields ? normalizeExtraFieldsToArray(firstJob.extraFields) : []);

    const dynamicFilters: FilterConfig[] = extraFields
      .filter((field) => {
        // Only include fields that have optionalArray and are not boolean type
        return (
          field.optionalArray &&
          Array.isArray(field.optionalArray) &&
          field.optionalArray.length > 0 &&
          field.type !== 'bool'
        );
      })
      .map((field) => {
        const options = field.optionalArray!.map((value) => ({
          value: String(value),
          label: String(value).charAt(0).toUpperCase() + String(value).slice(1).replace(/-/g, " "),
        }));

        return {
          key: field.name,
          label: field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, " $1"),
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
      searchQuery ||
      Object.values(filters).some((value) => value !== "")
    );
  }, [searchQuery, filters]);

  // Build API params for useAds - always use adType: "JOB"
  const adsParams = useMemo(() => {
    const params: AdFilters = {
      adType: "JOB",
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };

    // Add search query if present
    if (searchQuery) {
      params.search = searchQuery;
    }

    // Add location if present
    const locationFilter = getFilterString(filters.location) || locationQuery;
    if (locationFilter) {
      params.location = locationFilter;
    }

    return params;
  }, [searchQuery, locationQuery, filters, currentPage]);

  // Build filter payload for useFilterAds when there are extra filters
  const filterPayload = useMemo((): AdFilterPayload => {
    const payload: AdFilterPayload = {
      adType: "JOB",
    };

    if (searchQuery) payload.search = searchQuery;
    const locationFilter = getFilterString(filters.location) || locationQuery;
    if (locationFilter) payload.city = locationFilter;
    
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
    const extraFieldsFilters: Record<string, string | string[] | number | boolean> = {};
    const jobTypeFilter = getFilterString(filters.jobType);
    if (jobTypeFilter) extraFieldsFilters.jobType = jobTypeFilter;
    const workModeFilter = getFilterString(filters.workMode);
    if (workModeFilter) extraFieldsFilters.workMode = workModeFilter;
    const experienceFilter = getFilterString(filters.experience);
    if (experienceFilter) extraFieldsFilters.experience = experienceFilter;

    // Add dynamic extraFields filters (from first job's extraFields)
    Object.entries(filters).forEach(([key, value]) => {
      // Skip default filters that are already handled
      if (!["location", "salary", "jobType", "workMode", "experience"].includes(key) && value) {
        extraFieldsFilters[key] = value;
      }
    });

    if (Object.keys(extraFieldsFilters).length > 0) {
      payload.extraFields = extraFieldsFilters;
    }

    return payload;
  }, [searchQuery, locationQuery, filters, currentPage]);

  // Use useAds when only search/location filters (simple case)
  // Use useFilterAds when there are complex filters (salary, jobType, etc.)
  const hasComplexFilters = useMemo(() => {
    return !!(
      getFilterString(filters.salary) ||
      getFilterString(filters.jobType) ||
      getFilterString(filters.workMode) ||
      getFilterString(filters.experience) ||
      Object.entries(filters).some(([key, value]) => 
        !["location", "salary", "jobType", "workMode", "experience"].includes(key) && value
      )
    );
  }, [filters]);

  // Fetch jobs using ads API
  const { data: filterAdsData, isLoading: isFilterLoading } = useFilterAds(
    filterPayload,
    currentPage,
    ITEMS_PER_PAGE,
    hasComplexFilters || hasActiveFilters
  );

  const { data: regularAdsData, isLoading: isRegularLoading } = useAds(
    !hasComplexFilters && !hasActiveFilters
      ? adsParams
      : undefined
  );

  const adsData = (hasComplexFilters || hasActiveFilters) ? filterAdsData : regularAdsData;
  const isLoading = (hasComplexFilters || hasActiveFilters) ? isFilterLoading : isRegularLoading;

  const jobs = useMemo(() => (adsData?.data?.adds || []) as AD[], [adsData?.data?.adds]);
  const totalItems = adsData?.data?.total || jobs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Set selected job when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0]._id);
    }
  }, [jobs.length, selectedJobId, jobs]);

  // Fetch job details by ID using API
  const { data: jobResponse, isLoading: isJobLoading, error: jobError } = useAdById(
    selectedJobId || ""
  );
  const selectedJob = jobResponse?.data;

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (value: string) => {
    setLocationQuery(value);
    setFilters((prev) => ({ ...prev, location: value }));
  };

  const clearFilters = () => {
    const clearedFilters: Record<string, string | string[]> = {
      location: "",
      salary: "",
      jobType: "",
      workMode: "",
      experience: "",
    };
    // Clear all dynamic filters from extraFields
    dynamicFilterConfig.forEach((config) => {
      // Skip default filters
      if (!["location", "salary", "jobType", "workMode", "experience"].includes(config.key)) {
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
  const getSalaryFromAd = useCallback((ad: AD, type: "min" | "max"): number | null => {
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
  }, []);

  // Transform AD to JobCard props
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
      const field = extraFields.find(
        (f) => f.name?.toLowerCase().includes(fieldName.toLowerCase())
      );
      if (field) {
        if (Array.isArray(field.value)) {
          return field.value.join(", ");
        }
        return String(field.value || "");
      }
      return "";
    };

    const jobType = getFieldValue("jobType") || getFieldValue("job type") || "Not specified";
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="w-full max-w-[1080px] mx-auto bg-purple sm:hidden p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            icon={<ChevronLeft />}
            iconPosition="left"
            className="bg-white text-purple w-8 rounded-full"
            size={"icon-sm"}
          />
          <Button
            icon={<Bell />}
            iconPosition="left"
            className="w-8 rounded-full"
            size={"icon-sm"}
          />
        </div>

        {/* Search Bar */}
        <Input
          leftIcon={<Search className="h-4 w-4" />}
          placeholder={"Search jobs..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-100 border-0"
        />
      </div>

      <div className="w-full mx-auto py-6">
        <div className="hidden sm:block mb-6 "  >
          <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
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
                            {jobError ? "Failed to load job details" : "Job not found"}
                          </Typography>
                        </div>
                      ) : selectedJob ? (
                        <>
                          <JobHeaderCard
                            job={selectedJob}
                            transformAdToJobCardProps={transformAdToJobCardProps}
                            onFavorite={(id: string) => console.log("Favorited:", id)}
                            onShare={(id: string) => console.log("Shared:", id)}
                            isFavorite={false}
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

