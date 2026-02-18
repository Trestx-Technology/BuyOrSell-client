"use client";

import { useState, useMemo, useCallback } from "react";
import { useParams, useSearchParams, } from "next/navigation";
import { Breadcrumbs, } from "@/components/ui/breadcrumbs";
import { Typography } from "@/components/typography";
import { useAds, useFilterAds, useAdById } from "@/hooks/useAds";
import {
  AD,
  AdFilterPayload,
  AdFilters,
} from "@/interfaces/ad";
import JobListingCard from "../../_components/job-listing-card";
import JobHeaderCard from "../../_components/job-header-card";
import MobileJobHeaderCard from "../../_components/mobile-job-header-card";
import JobDetailContent from "../../_components/job-detail-content";
import Disclaimer from "../../_components/disclaimer";
import Pagination from "@/components/global/pagination";
import { defaultJobFilters } from "@/constants/job.constants";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { cn } from "@/lib/utils";
import { CommonFilters } from "@/components/common/common-filters";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { ActiveFilters } from "@/components/common/active-filters";
import { FilterConfig } from "@/components/common/filter-control";
import { Button } from "@/components/ui/button";
import { generateBreadcrumbs } from "@/lib/breadcrumb-utils";
import { transformAdToJobCard } from "@/utils/transform-ad-to-job-card";
import { buildAdFilterPayload } from "@/utils/ad-payload";
import { buildAdQueryParams } from "@/utils/ad-query-params";
import { unSlugify } from "@/utils/slug-utils";
import { NoDataCard } from "@/components/global/fallback-cards";

import { JobListingCardSkeleton, JobDetailContentSkeleton, JobHeaderCardSkeleton } from "../../_components/job-skeletons";

const ITEMS_PER_PAGE = 5;

export default function JobsListingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const { clearUrlQueries } = useUrlParams();
  const { extraFields, hasDynamicFilters } = useUrlFilters();

  // Get category from URL params - use the last slug segment
  const slugSegments = Array.isArray(params.slug)
    ? params.slug
    : params.slug
      ? [params.slug]
      : [];
  const currentCategory = slugSegments[slugSegments.length - 1] || "";
  const categoryName = currentCategory
    ? unSlugify(currentCategory)
    : "Jobs";

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [filters, setFilters] = useState<
    Record<string, string | string[] | number | number[] | undefined>
  >({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobId || null);

  // Define static filters config based on defaultJobFilters
  const staticFilterConfig: FilterConfig[] = useMemo(() => {
    return defaultJobFilters.map(filter => ({
      ...filter,
      isStatic: true,
      // Ensure type compatibility with FilterConfig
      type: filter.type as "select" | "multiselect" | "range" | "calendar",
    }));
  }, []);

  const breadcrumbItems = generateBreadcrumbs(slugSegments, "/jobs/listing");

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleLocationChange = (value: string) => {
    setLocationQuery(value);
    setFilters((prev) => ({ ...prev, location: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setLocationQuery("");
    setCurrentPage(1);
    clearUrlQueries();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build filter payload for useFilterAds
  const filterPayload = useMemo((): AdFilterPayload => {
    return buildAdFilterPayload({
      categoryName: categoryName ?? undefined,
      searchQuery,
      locationQuery,
      filters,
      extraFields,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
  }, [categoryName, currentCategory, searchQuery, locationQuery, filters, extraFields]);


  // API Params for simple useAds
  const simpleAdsParams = useMemo((): AdFilters => {
    return buildAdQueryParams({
      categoryName: categoryName ?? undefined,
      currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
      searchQuery,
      locationQuery,
      filters,
      adType: "JOB",
      sortBy: "newest", // Default sort matches "createdAt:desc" in util
    });
  }, [categoryName, currentCategory, currentPage, searchQuery, locationQuery, filters]);

  // Fetch Jobs
  const { data: filterAdsData, isLoading: isFilterLoading } = useFilterAds(
    filterPayload,
    currentPage,
    ITEMS_PER_PAGE,
    hasDynamicFilters
  );

  const { data: regularAdsData, isLoading: isRegularLoading } = useAds(
    !hasDynamicFilters ? simpleAdsParams : undefined
  );

  const adsData = hasDynamicFilters ? filterAdsData : regularAdsData;
  const isLoading = hasDynamicFilters ? isFilterLoading : isRegularLoading;

  const jobs = useMemo(
    () => (adsData?.data?.adds || []) as AD[],
    [adsData?.data?.adds]
  );
  const totalItems = adsData?.data?.total || jobs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Fetch selected job details
  const {
    data: jobResponse,
    isLoading: isJobLoading,
    error: jobError,
  } = useAdById(selectedJobId || "");
  const selectedJob = jobResponse?.data;



  return (
    <Container1080 className="space-y-6 min-h-dvh">
      <MobileStickyHeader title={categoryName} />
      <div className="w-full mx-auto px-4 md:py-6">
        <div className="hidden md:block mb-6">
          <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
        </div>

        {/* Page Header */}
        <div className="hidden lg:flex items-center justify-between md:mb-6">
          <Typography variant="md-black-inter" className="font-semibold">
            {categoryName} in Dubai ({totalItems})
          </Typography>
        </div>

        {/* Filters */}
        <CommonFilters
          filters={filters}
          staticFilters={staticFilterConfig}
          onStaticFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${categoryName}...`}
          locationQuery={locationQuery}
          onLocationChange={handleLocationChange}
          locationPlaceholder="Dubai"
          className="mb-4"
        />

        <ActiveFilters
          staticFiltersConfig={staticFilterConfig}
          categoryPath={`${slugSegments.join("/")}`}
          onClearAll={handleClearFilters}
          className="px-0 mb-4"
        />

        {/* Jobs Listing Layout - Two Column View */}
        <div className="flex items-start gap-5 min-h-[600px]">
          {/* Left Column - Job Listings Sidebar */}
          <div
            className={cn(
              "w-full transition-all duration-300",
              selectedJobId ? "hidden md:block md:w-[260px] flex-shrink-0" : ""
            )}
          >
            {isLoading ? (
              <div
                className={cn(
                  "grid gap-4",
                  selectedJobId
                    ? "grid-cols-1"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                )}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <JobListingCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <NoDataCard title="No jobs found." description="Try adjusting your search or filters to see more results." />
                <Button variant="outline" onClick={handleClearFilters} size={"small"} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
                  <div className="space-y-5">
                    <div
                      className={cn(
                        "grid gap-4",
                        selectedJobId
                          ? "grid-cols-1"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      )}
                    >
                      {jobs.sort((a) => jobId === a._id ? -1 : 1).map((job) => (
                        <JobListingCard
                          key={job._id}
                          job={job}
                          isSelected={selectedJobId === job._id}
                          onClick={() => setSelectedJobId(job._id)}
                          transformAdToJobCardProps={transformAdToJobCard}
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
            )}
          </div>

          {/* Right Column - Job Detail View */}
          <div className="space-y-6 flex-1 min-w-0">
            {selectedJobId && (
              <>
                {isJobLoading ? (
                  <div className="space-y-6">
                    <JobHeaderCardSkeleton />
                    <JobDetailContentSkeleton />
                  </div>
                ) : jobError ? (
                  <div className="text-center py-12">
                    <Typography variant="body" className="text-red-500">
                      Job not found
                    </Typography>
                  </div>
                ) : selectedJob && (
                  <>
                        <MobileJobHeaderCard
                          job={selectedJob}
                          logo={selectedJob.organization?.logoUrl}
                          isSaved={selectedJob.isSaved}
                          isApplied={selectedJob.isApplied ?? false}
                          onBack={() => setSelectedJobId(null)}
                          className="block sm:hidden"
                        />
                    <JobHeaderCard
                      className="hidden sm:block"
                      job={selectedJob}
                      logo={selectedJob.organization?.logoUrl}
                      isSaved={selectedJob.isSaved}
                      isApplied={selectedJob.isApplied ?? false}
                    />
                    <JobDetailContent job={selectedJob} />
                    <Disclaimer />
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Container1080>
  );
}
