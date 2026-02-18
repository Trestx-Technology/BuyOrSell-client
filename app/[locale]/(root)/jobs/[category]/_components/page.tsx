"use client"
import React, { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Typography } from "@/components/typography";
import { useAds, useFilterAds, useAdById } from "@/hooks/useAds";
import {
      AD,
      AdFilterPayload,
      AdFilters,
} from "@/interfaces/ad";
import JobListingCard from "../../listing/_components/job-listing-card";
import JobHeaderCard from "../../listing/_components/job-header-card";
import MobileJobHeaderCard from "../../listing/_components/mobile-job-header-card";
import JobDetailContent from "../../listing/_components/job-detail-content";
import Disclaimer from "../../listing/_components/disclaimer";
import Pagination from "@/components/global/pagination";
import { defaultJobFilters } from "@/constants/job.constants";
import { cn } from "@/lib/utils";
import { CommonFilters } from "@/components/common/common-filters";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { ActiveFilters } from "@/components/common/active-filters";
import { FilterConfig } from "@/components/common/filter-control";
import { Button } from "@/components/ui/button";
import { transformAdToJobCard } from "@/utils/transform-ad-to-job-card";
import { buildAdFilterPayload } from "@/utils/ad-payload";
import { buildAdQueryParams } from "@/utils/ad-query-params";
import { NoDataCard } from "@/components/global/fallback-cards";

const ITEMS_PER_PAGE = 12;

export default function ViewJobPage() {
      const params = useParams();
      const searchParams = useSearchParams();
      const { clearUrlQueries } = useUrlParams();
      const { extraFields, hasDynamicFilters, } = useUrlFilters();
      const currentCategory = params.category as string;
      const categoryName = decodeURIComponent(currentCategory);
      const jobIdFromQuery = searchParams.get("jobId");

      const [searchQuery, setSearchQuery] = useState("");
      const [locationQuery, setLocationQuery] = useState("");
      const [filters, setFilters] = useState<
            Record<string, string | string[] | number | number[] | undefined>
      >({});
      const [currentPage, setCurrentPage] = useState(1);
      const [selectedJobId, setSelectedJobId] = useState<string | null>(jobIdFromQuery);

      // Update selectedJobId if jobIdFromQuery changes
      useEffect(() => {
            if (jobIdFromQuery) {
                  setSelectedJobId(jobIdFromQuery);
            }
      }, [jobIdFromQuery]);

      // Define static filters config
      const staticFilterConfig: FilterConfig[] = useMemo(() => {
            return defaultJobFilters.map(filter => ({
                  ...filter,
                  isStatic: true,
                  type: filter.type as "select" | "multiselect" | "range" | "calendar",
            }));
      }, []);

      const breadcrumbItems = [
            { id: "1", label: "Jobs", href: "/jobs" },
            { id: "2", label: categoryName, href: `/jobs/${currentCategory}` },
      ];

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

      // Build filter payload
      const filterPayload = useMemo((): AdFilterPayload => {
            return buildAdFilterPayload({
                  categoryName,
                  searchQuery,
                  locationQuery,
                  filters,
                  extraFields,
            }) as any;
      }, [categoryName, searchQuery, locationQuery, filters, extraFields]);

      // API Params
      const simpleAdsParams = useMemo((): AdFilters => {
            return buildAdQueryParams({
                  categoryName: categoryName,
                  currentPage,
                  itemsPerPage: ITEMS_PER_PAGE,
                  searchQuery,
                  locationQuery,
                  filters,
                  adType: "JOB",
                  sortBy: "newest",
            });
      }, [categoryName, currentPage, searchQuery, locationQuery, filters]);

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

      const isApplied = jobs.find((job) => job._id === selectedJobId)?.isApplied;

      return (
            <Container1080 className="space-y-6 min-h-dvh">
                  <MobileStickyHeader title={categoryName} />
                  <div className="w-full mx-auto px-4 md:py-6">
                        <div className="hidden md:block mb-6">
                              <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
                        </div>

                        {/* Page Header */}
                        <div className="hidden lg:flex items-center justify-between md:mb-6">
                              <Typography variant="h2" className="text-dark-blue font-bold">
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
                              categoryPath={`jobs/${currentCategory}`}
                              onClearAll={handleClearFilters}
                              className="px-0 mb-4"
                        />

                        {/* Jobs Listing Layout - Two Column View */}
                        {isLoading ? (
                              <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">Loading jobs...</p>
                              </div>
                        ) : jobs.length === 0 ? (
                              <div className="text-center py-12">
                                    <NoDataCard title="No jobs found" description="Try adjusting your search or filters to see more results." />
                                    <Button variant="outline" onClick={handleClearFilters} className="mt-4">
                                          Clear Filters
                                    </Button>
                              </div>
                        ) : (
                              <div className="flex items-start gap-5">
                                    {/* Left Column - Job Listings Sidebar */}
                                    <div
                                          className={`space-y-5 w-full sm:w-auto ${selectedJobId ? "hidden md:block" : "flex"
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

                                    {/* Right Column - Job Detail View */}
                                    <div className="space-y-6 flex-1 min-w-0">
                                          {selectedJobId && (
                                                <>
                                                      {isJobLoading ? (
                                                            <div className="text-center py-12">
                                                                  <Typography variant="body" className="text-gray-500">
                                                                        Loading job details...
                                                                  </Typography>
                                                            </div>
                                                      ) : jobError ? (
                                                            <div className="text-center py-12">
                                                                  <Typography variant="body" className="text-red-500">
                                                                        Job not found
                                                                  </Typography>
                                                            </div>
                                                      ) : selectedJob && (
                                                            <>
                                                                  {/* Mobile Header Card */}
                                                                  <MobileJobHeaderCard
                                                                        job={selectedJob}
                                                                        logo={selectedJob.organization?.logoUrl}
                                                                        isSaved={selectedJob.isSaved}
                                                                        isApplied={isApplied ?? false}
                                                                        onBack={() => setSelectedJobId(null)}
                                                                        className="block sm:hidden"
                                                                  />
                                                                  {/* Desktop Header Card */}
                                                                  <JobHeaderCard
                                                                        className="hidden sm:block"
                                                                        job={selectedJob}
                                                                        logo={selectedJob.organization?.logoUrl}
                                                                        isSaved={selectedJob.isSaved}
                                                                        isApplied={isApplied ?? false}
                                                                  />
                                                                  <JobDetailContent job={selectedJob} />
                                                                  <Disclaimer />
                                                            </>
                                                      )}
                                                </>
                                          )}
                                    </div>
                              </div>
                        )}
                  </div>
            </Container1080>
      );
}