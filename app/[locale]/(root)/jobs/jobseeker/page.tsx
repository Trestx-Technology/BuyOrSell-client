"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { FilterConfig } from "./_components/jobs-filter";
import ApplicantCard from "./_components/applicant-card";
import { Typography } from "@/components/typography";
import { Bell, ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import JobsFilter from "./_components/jobs-filter";
import SortAndViewControls, {
  ViewMode,
} from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import { cn } from "@/lib/utils";
import { useAds, useFilterAds } from "@/hooks/useAds";
import {
  AD,
  AdFilterPayload,
  AdFilters,
  ProductExtraField,
} from "@/interfaces/ad";
import { formatDistanceToNow } from "date-fns";
import Pagination from "@/components/global/pagination";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";

const ITEMS_PER_PAGE = 12;

// Default filter configuration for jobseekers (similar to jobs)
const defaultJobseekerFilters: FilterConfig[] = [
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

export default function JobseekersPage() {
  const searchParams = useSearchParams();
  const urlQuery =
    searchParams.get("query") || searchParams.get("search") || "";
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
  const [view, setView] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [savedExtraFields, setSavedExtraFields] = useState<ProductExtraField[]>(
    []
  );

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

  const categoryName = "Jobseekers";

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: "jobs", label: "Jobs", href: "/jobs" },
    {
      id: "jobseekers",
      label: "Jobseekers",
      href: "/jobs/jobseeker",
      isActive: true,
    },
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

    const dynamicFilters: FilterConfig[] = extraFields
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
    return [...defaultJobseekerFilters, ...dynamicFilters];
  }, [savedExtraFields, firstJob]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      searchQuery || Object.values(filters).some((value) => value !== "")
    );
  }, [searchQuery, filters]);

  // Build filter payload for API
  const filterPayload = useMemo((): AdFilterPayload => {
    const payload: AdFilterPayload = {
      adType: "JOB",
    };

    if (searchQuery) payload.search = searchQuery;
    const locationFilter = getFilterString(filters.location);
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
      // Skip default filters that are already handled
      if (
        !["location", "salary", "jobType", "workMode", "experience"].includes(
          key
        ) &&
        value
      ) {
        extraFieldsFilters[key] = value;
      }
    });

    if (Object.keys(extraFieldsFilters).length > 0) {
      payload.extraFields = extraFieldsFilters;
    }

    return payload;
  }, [searchQuery, filters, currentPage]);

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

  // Fetch jobseekers using ads API with adType: "JOB"
  const { data: filterAdsData, isLoading: isFilterLoading } = useFilterAds(
    filterPayload,
    currentPage,
    ITEMS_PER_PAGE,
    hasActiveFilters
  );

  const { data: regularAdsData, isLoading: isRegularLoading } = useAds(
    hasActiveFilters ? undefined : adsParams
  );

  const adsData = hasActiveFilters ? filterAdsData : regularAdsData;
  const isLoading = hasActiveFilters ? isFilterLoading : isRegularLoading;

  const jobseekers = (adsData?.data?.adds || []) as AD[];
  const totalItems = adsData?.data?.total || jobseekers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

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
      if (
        !["location", "salary", "jobType", "workMode", "experience"].includes(
          config.key
        )
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

  // Transform AD to ApplicantCard props
  const transformAdToApplicantCardProps = (ad: AD) => {
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
    const role =
      getFieldValue("role") ||
      getFieldValue("position") ||
      ad.title ||
      "Not specified";

    // Extract salary from extraFields or use price
    const salaryMin = getSalaryFromAd(ad, "min") || ad.price || 0;
    const salaryMax = getSalaryFromAd(ad, "max") || ad.price || 0;

    // Get location
    const location =
      typeof ad.location === "string"
        ? ad.location
        : ad.location?.city || ad.address?.city || "Location not specified";

    // Get jobseeker name (from owner or title)
    const name =
      (ad.owner?.firstName && ad.owner?.lastName
        ? `${ad.owner.firstName} ${ad.owner.lastName}`
        : ad.title) || "Jobseeker";

    // Get company name
    const company =
      ad.organization?.tradeName || ad.organization?.legalName || "Company";

    return {
      id: ad._id,
      name,
      role,
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
      <div className="w-full bg-purple sm:hidden p-4 space-y-4">
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
          placeholder={"Search jobseekers..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-100 border-0"
        />
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="hidden sm:block mb-6 px-4">
          <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 px-4">
          <Typography variant="md-black-inter" className="font-semibold">
            {categoryName} in Dubai ({jobseekers.length})
          </Typography>

          <SortAndViewControls
            sortOptions={[]}
            sortValue="default"
            onSortChange={() => {}}
            viewMode={view}
            onViewChange={setView}
            showViewToggle={true}
            showFilterButton={false}
            size="fit"
            className="hidden sm:flex"
          />
        </div>

        {/* Jobseekers Filters */}
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

        <SortAndViewControls
          sortOptions={[]}
          sortValue="default"
          onSortChange={() => {}}
          viewMode={view}
          onViewChange={setView}
          showViewToggle={true}
          showFilterButton={false}
          size="fit"
          className="px-4 flex justify-end mb-4 sm:hidden"
        />

        {/* Jobseekers Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Loading jobseekers...</p>
            </div>
          ) : jobseekers.length > 0 ? (
            <div
              className={cn(
                `px-4 lg:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`,
                view === "list" && "flex flex-col"
              )}
            >
              {jobseekers.map((jobseeker) => (
                <ApplicantCard
                  key={jobseeker._id}
                  {...transformAdToApplicantCardProps(jobseeker)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No jobseekers found matching your criteria.
              </p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
