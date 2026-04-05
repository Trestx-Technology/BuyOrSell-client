"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import ApplicantCard from "./_components/applicant-card";
import { Typography } from "@/components/typography";
import { Bell, ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import JobsFilter from "./_components/jobs-filter";
import SortAndViewControls, {
  ViewMode,
} from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import { cn } from "@/lib/utils";
import { useSearchJobseekerProfiles } from "@/hooks/useJobseeker";
import { JobseekerProfile } from "@/interfaces/job.types";
import { formatDistanceToNow } from "date-fns";
import Pagination from "@/components/global/pagination";
import { defaultJobseekerFilters } from "@/constants/job.constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useJobSubcategories } from "@/hooks/useCategories";
import { useGetAllSkills } from "@/hooks/useSkills";
import { useEmirates } from "@/hooks/useLocations";
import { Container1080 } from "@/components/layouts/container-1080";
import { useUrlParams } from "@/hooks/useUrlParams";
import { NoDataCard } from "@/components/global/fallback-cards";
import { ActiveFilters } from "@/components/common/active-filters";
import { useLocale } from "@/hooks/useLocale";

const ITEMS_PER_PAGE = 12;

// Helper function to safely get string value from filter
const getFilterString = (value: string | string[] | undefined): string => {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
};

// Helper to get array from params (supporting both repeated keys and comma-separated)
const getArrayParam = (params: URLSearchParams, key: string): string[] => {
  const all = params.getAll(key);
  if (all.length > 1) return all;
  if (all.length === 1) return all[0].split(",");
  return [];
};

export default function JobseekersPage() {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { updateUrlParam, updateUrlParams, clearUrlQueries } = useUrlParams();
  const urlQuery =
    searchParams.get("query") || searchParams.get("search") || "";
  const urlLocation = (searchParams.get("location") || searchParams.get("emirate") || "").toLowerCase();

  const [locationQuery, setLocationQuery] = useState(urlLocation);

  // Initialize filters from URL
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    location: urlLocation,
    skills: getArrayParam(new URLSearchParams(searchParams.toString()), "skills"),
    desiredRoles: getArrayParam(new URLSearchParams(searchParams.toString()), "desiredRoles"),
    minExp: searchParams.get("minExp") || "",
    maxExp: searchParams.get("maxExp") || "",
    industryId: searchParams.get("industryId") || "",
  });

  const [view, setView] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  // Debounced search query - searchQuery is the debounced value used for API calls
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [localSearchQuery, setLocalSearchQuery] = useDebouncedValue(
    searchQuery,
    (value) => setSearchQuery(value),
    500
  );

  // Sync state when URL params change (e.g. back navigation)
  useEffect(() => {
    const newQuery = searchParams.get("query") || searchParams.get("search") || "";
    if (newQuery !== searchQuery) {
      setSearchQuery(newQuery);
      setLocalSearchQuery(newQuery);
    }

    const newLocation = searchParams.get("location") || searchParams.get("emirate") || "";
    if (newLocation !== locationQuery) {
      setLocationQuery(newLocation);
    }

    const newPage = Number(searchParams.get("page")) || 1;
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }

    // Sync filters - Only update if values actually changed to avoid loops
    const skills = getArrayParam(new URLSearchParams(searchParams.toString()), "skills");
    const desiredRoles = getArrayParam(new URLSearchParams(searchParams.toString()), "desiredRoles");
    const minExp = searchParams.get("minExp") || "";
    const maxExp = searchParams.get("maxExp") || "";
    const industryId = searchParams.get("industryId") || "";

    const hasSkillsChanged = JSON.stringify(skills) !== JSON.stringify(filters.skills);
    const hasRolesChanged = JSON.stringify(desiredRoles) !== JSON.stringify(filters.desiredRoles);

    if (
      hasSkillsChanged ||
      hasRolesChanged ||
      minExp !== filters.minExp ||
      maxExp !== filters.maxExp ||
      industryId !== filters.industryId ||
      newLocation !== filters.location
    ) {
      setFilters({
        location: newLocation,
        skills,
        desiredRoles,
        minExp,
        maxExp,
        industryId,
      });
    }
  }, [searchParams]);



  const categoryName = "Jobseekers";

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: "jobs", label: t.jobs.title, href: "/jobs" },
    {
      id: "jobseekers",
      label: t.jobs.jobseekers.title,
      href: "/jobs/jobseeker",
      isActive: true,
    },
  ];

  // Fetch industries for filter
  const { data: industriesData } = useJobSubcategories({
    adType: "job",
  });

  // Fetch skills for filter
  const { data: skillsData } = useGetAllSkills({
    limit: 1000, // Get a large number of skills
  });

  // Fetch Emirates for Location filter
  const { data: emiratesData } = useEmirates();

  // Build filter config with additional filters for jobseeker search
  const filterConfig = useMemo(() => {
    const industryOptions =
      industriesData?.map((industry) => ({
        value: industry._id,
        label: industry.name || "",
      })) || [];

    const skillOptions =
      skillsData?.data?.items?.map((skill) => ({
        value: skill.name, // Use skill name as value for API
        label: skill.name,
      })) || [];

    const locationOptions =
      emiratesData?.map((emirate) => ({
        value: emirate.emirate.toLowerCase(),
        label: emirate.emirate,
      })) || defaultJobseekerFilters[0].options;

    // Mark first 5 filters as static (visible outside), rest go in dialog
    return [
      {
        key: "minExp",
        label: t.jobs.jobseekers.minExp,
        type: "select" as const,
        options: Array.from({ length: 21 }, (_, i) => ({
          value: String(i),
          label: `${i} ${i === 1 ? t.jobs.jobseekers.year : t.jobs.jobseekers.years}`,
        })),
        placeholder: t.jobs.jobseekers.minYears,
        isStatic: true,
      },
      {
        key: "maxExp",
        label: t.jobs.jobseekers.maxExp,
        type: "select" as const,
        options: Array.from({ length: 21 }, (_, i) => ({
          value: String(i),
          label: `${i} ${i === 1 ? t.jobs.jobseekers.year : t.jobs.jobseekers.years}`,
        })),
        placeholder: t.jobs.jobseekers.maxYears,
        isStatic: true,
      },
      {
        key: "industryId",
        label: t.jobs.jobseekers.industry,
        type: "select" as const,
        options: industryOptions,
        placeholder: t.jobs.jobseekers.selectIndustry,
        isStatic: true,
      },
      {
        key: "skills",
        label: t.jobs.jobseekers.skills,
        type: "multiselect" as const,
        options: skillOptions,
        placeholder: t.jobs.jobseekers.selectSkills,
        isStatic: true,
      },
      // Rest of filters - go in dialog
      {
        key: "desiredRoles",
        label: t.jobs.jobseekers.desiredRoles,
        type: "multiselect" as const,
        options: [], // Will be populated dynamically or from API
        placeholder: t.jobs.jobseekers.selectRoles,
        isStatic: false,
      },
      ...defaultJobseekerFilters.slice(1).map((filter) => ({
        ...filter,
        isStatic: false,
      })),
    ];
  }, [industriesData, skillsData, emiratesData]);

  // Build API params for jobseeker search
  const searchParams_api = useMemo(() => {
    const params: Record<string, unknown> = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      onlyUnblocked: true,
      onlyUnbanned: true,
    };

    // Add search query if present (use debounced value)
    if (searchQuery) {
      params.q = searchQuery;
    }

    // Add location filter
    const locationFilter = getFilterString(filters.location) || locationQuery;
    if (locationFilter) {
      params.location = locationFilter;
    }

    // Add skills filter (array)
    if (
      filters.skills &&
      Array.isArray(filters.skills) &&
      filters.skills.length > 0
    ) {
      params.skills = filters.skills.filter(
        (s): s is string => typeof s === "string"
      );
    }

    // Add desiredRoles filter (array)
    if (
      filters.desiredRoles &&
      Array.isArray(filters.desiredRoles) &&
      filters.desiredRoles.length > 0
    ) {
      params.desiredRoles = filters.desiredRoles.filter(
        (r): r is string => typeof r === "string"
      );
    }

    // Add minExp filter
    const minExp = getFilterString(filters.minExp);
    if (minExp) {
      params.minExp = Number.parseInt(minExp, 10);
    }

    // Add maxExp filter
    const maxExp = getFilterString(filters.maxExp);
    if (maxExp) {
      params.maxExp = Number.parseInt(maxExp, 10);
    }

    // Add industryId filter
    const industryId = getFilterString(filters.industryId);
    if (industryId) {
      params.industryId = industryId;
    }

    return params;
  }, [searchQuery, locationQuery, filters, currentPage]);

  // Fetch jobseekers using jobseeker search API
  const { data: jobseekersData, isLoading } =
    useSearchJobseekerProfiles(searchParams_api);

  const jobseekers = (jobseekersData?.data?.items || []) as JobseekerProfile[];
  const totalItems = jobseekersData?.data?.total || jobseekers.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const hasActiveFilters = useMemo(() => {
    return searchQuery.length > 0 || locationQuery.length > 0 || Object.values(filters).some((value) =>
      Array.isArray(value) ? value.length > 0 : value !== ""
    );
  }, [searchQuery, locationQuery, filters]);

  const handleFilterChange = (key: string, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateUrlParams({ [key]: value, page: "1" });
    setCurrentPage(1);
  };

  const handleLocationChange = (value: string) => {
    setLocationQuery(value);
    const newFilters = { ...filters, location: value };
    setFilters(newFilters);
    updateUrlParams({ location: value, page: "1" });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const clearedFilters: Record<string, string | string[]> = {
      location: "",
      skills: [],
      desiredRoles: [],
      minExp: "",
      maxExp: "",
      industryId: "",
    };
    setFilters(clearedFilters);
    setSearchQuery("");
    setLocalSearchQuery("");
    setLocationQuery("");
    setCurrentPage(1);
    clearUrlQueries();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParam("page", page.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Search and URL state are synchronized via CommonFilters and the main useEffect on searchParams


  // Transform JobseekerProfile to ApplicantCard props
  const transformJobseekerToApplicantCardProps = (
    profile: JobseekerProfile
  ) => {
    const postedTime = formatDistanceToNow(new Date(profile.createdAt), {
      addSuffix: true,
    });

    // Get location from preferredLocations or location field
    const location =
      profile.preferredLocations && profile.preferredLocations.length > 0
        ? profile.preferredLocations[0]
        : profile.location || t.jobs.jobseekers.notSpecified;

    // Get job type from preferredJobTypes
    const jobType =
      profile.preferredJobTypes && profile.preferredJobTypes.length > 0
        ? profile.preferredJobTypes[0]
        : t.jobs.jobseekers.notSpecified;

    // Get experience years
    const experience = profile.experienceYears
      ? `${profile.experienceYears} ${
          profile.experienceYears === 1 ? t.jobs.jobseekers.year : t.jobs.jobseekers.years
        }`
      : profile.isFresher
      ? t.jobs.jobseekers.fresher
      : t.jobs.jobseekers.notSpecified;

    // Get role/headline
    const role =
      profile.headline || profile.desiredRoles?.[0] || t.jobs.jobseekers.professional;

    // Get company from current experience if available
    const company =
      profile.experiences && profile.experiences.length > 0
        ? profile.experiences[0].company
        : t.jobs.jobseekers.notSpecified;

    // Get salary expectations
    const salaryMin = profile.salaryExpectationMin || 0;
    const salaryMax =
      profile.salaryExpectationMax || profile.salaryExpectationMin || 0;

    return {
      id: profile._id,
      name: profile.name,
      role,
      company,
      experience,
      salaryMin,
      salaryMax,
      location,
      jobType,
      postedTime,
      logo: profile.photoUrl,
      isFavorite: false,
      onFavorite: (id: string) => console.log("Favorited:", id),
      onShare: (id: string) => console.log("Shared:", id),
    };
  };

  return (
    <Container1080>
      {/* Mobile Header */}
      <div className="w-full bg-purple sm:hidden p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            icon={<ChevronLeft />}
            iconPosition="left"
            className="bg-white dark:bg-zinc-800 text-purple w-8 rounded-full"
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
          placeholder={t.jobs.jobseekers.searchPlaceholder}
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="pl-10 bg-gray-100 dark:bg-zinc-800 dark:text-zinc-100 border-0"
        />
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="hidden sm:block mb-6 px-4">
          <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 px-4">
          <Typography variant="md-black-inter" className="font-semibold text-black dark:text-zinc-100">
            {t.jobs.jobseekers.title} {t.jobs.jobseekers.in} {locationQuery || t.jobs.jobseekers.allCities} ({jobseekers.length})
          </Typography>

          {/* <SortAndViewControls
            viewMode={view}
            onViewChange={setView}
            showViewToggle={false}
            showFilterButton={false}
            size="fit"
            className="hidden sm:flex"
            sortValue="newest"
          /> */}
        </div>

        {/* Jobseekers Filters */}
        <JobsFilter
          searchQuery={localSearchQuery}
          onSearchChange={setLocalSearchQuery}
          searchPlaceholder={t.jobs.jobseekers.searchPlaceholder}
          locationQuery={locationQuery}
          onLocationChange={handleLocationChange}
          locationPlaceholder={t.jobs.jobseekers.allCities}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          config={filterConfig}
          className="mb-4"
        />

        {/* Active Filters Section */}
        <ActiveFilters
          staticFiltersConfig={filterConfig}
          categoryPath=""
          onClearAll={clearFilters}
          className="mb-6 px-4"
        />

        <SortAndViewControls
          sortOptions={[]}
          sortValue="newest"
          onSortChange={() => {}}
          viewMode={view}
          onViewChange={setView}
          showViewToggle={false}
          showFilterButton={false}
          size="fit"
          className="px-4 flex justify-end mb-4 sm:hidden"
        />

        {/* Jobseekers Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-zinc-400 text-lg">{t.jobs.jobseekers.loading}</p>
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
                  {...transformJobseekerToApplicantCardProps(jobseeker)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
                  <NoDataCard title={t.jobs.jobseekers.noResults} description={t.jobs.jobseekers.tryAgain} />
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      {t.jobs.jobseekers.clearFilters}
                    </Button>
                  )}
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
    </Container1080>
  );
}
