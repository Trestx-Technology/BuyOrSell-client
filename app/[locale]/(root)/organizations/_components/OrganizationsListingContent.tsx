"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Bell, ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Organization } from "@/interfaces/organization.types";
import OrganizationCard from "./organization-card";
import Pagination from "@/components/global/pagination";
import { Container1080 } from "@/components/layouts/container-1080";
import SortAndViewControls, {
  ViewMode,
} from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import { cn } from "@/lib/utils";
import JobsFilter, { FilterConfig } from "./jobs-filter";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { NoDataCard } from "@/components/global/fallback-cards";

const ITEMS_PER_PAGE = 12;

// Helper function to safely get string value from filter
const getFilterString = (value: string | string[] | undefined): string => {
  if (!value) return "";
  return Array.isArray(value) ? value[0] || "" : value;
};

export default function OrganizationsListingContent() {
  const searchParams = useSearchParams();
  const urlQuery =
    searchParams.get("query") || searchParams.get("search") || "";
  const urlLocation = searchParams.get("location") || "";
  const urlType = searchParams.get("type") || "";
  const urlVerified = searchParams.get("verified") || "";

  const [locationQuery, setLocationQuery] = useState(urlLocation);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({
    location: urlLocation,
    type: urlType,
    verified: urlVerified,
  });
  const [view, setView] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounced search query
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [localSearchQuery, setLocalSearchQuery] = useDebouncedValue(
    searchQuery,
    (value) => setSearchQuery(value),
    500
  );

  // Initialize search query and location from URL params
  useEffect(() => {
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
      setLocalSearchQuery(urlQuery);
    }
    if (urlLocation && urlLocation !== locationQuery) {
      setLocationQuery(urlLocation);
      setFilters((prev) => ({ ...prev, location: urlLocation }));
    }
    if (urlType && urlType !== filters.type) {
      setFilters((prev) => ({ ...prev, type: urlType }));
    }
    if (urlVerified && urlVerified !== filters.verified) {
      setFilters((prev) => ({ ...prev, verified: urlVerified }));
    }
  }, [urlQuery, urlLocation, urlType, urlVerified, searchQuery, locationQuery, filters.type, filters.verified, setLocalSearchQuery]);

  const categoryName = "Organizations";

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: "jobs", label: "Jobs", href: "/jobs" },
    {
      id: "organizations",
      label: "Organizations",
      href: "/organizations",
      isActive: true,
    },
  ];

  // Build filter config
  const filterConfig = useMemo((): FilterConfig[] => {
    return [
      {
        key: "location",
        label: "Location",
        type: "search",
        placeholder: "Dubai",
        isStatic: true,
      },
      {
        key: "type",
        label: "Type",
        type: "select",
        options: [
          { value: "Company", label: "Company" },
          { value: "Agency", label: "Agency" },
          { value: "Individual", label: "Individual" },
        ],
        placeholder: "Select Type",
        isStatic: true,
      },
      {
        key: "verified",
        label: "Verified",
        type: "select",
        options: [
          { value: "true", label: "Verified Only" },
          { value: "false", label: "Not Verified" },
        ],
        placeholder: "All",
        isStatic: true,
      },
    ];
  }, []);

  // Build API params for useOrganizations
  const orgParams = useMemo(() => {
    const params: {
      search?: string;
      emirate?: string;
      type?: string;
      verified?: boolean;
      page?: number;
      limit?: number;
    } = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    };

    if (searchQuery) {
      params.search = searchQuery;
    }

    const locationFilter = getFilterString(filters.location) || locationQuery;
    if (locationFilter) {
      params.emirate = locationFilter;
    }

    const typeFilter = getFilterString(filters.type);
    if (typeFilter) {
      params.type = typeFilter;
    }

    const verifiedFilter = getFilterString(filters.verified);
    if (verifiedFilter === "true") {
      params.verified = true;
    } else if (verifiedFilter === "false") {
      params.verified = false;
    }

    return params;
  }, [searchQuery, locationQuery, filters, currentPage]);

  // Fetch organizations
  const { data: orgsData, isLoading } = useOrganizations(orgParams);

  const organizations = useMemo(
    () => (orgsData?.data?.items || []) as Organization[],
    [orgsData?.data?.items]
  );
  const totalItems = orgsData?.data?.total || organizations.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleLocationChange = (value: string) => {
    setLocationQuery(value);
    setFilters((prev) => ({ ...prev, location: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      type: "",
      verified: "",
      search: "",
    });
    setSearchQuery("");
    setLocalSearchQuery("");
    setLocationQuery("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      searchQuery || Object.values(filters).some((value) => value !== "")
    );
  }, [searchQuery, filters]);

  return (
    <Container1080>
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
          placeholder={"Search organizations..."}
          value={localSearchQuery}
          onChange={(e) => setLocalSearchQuery(e.target.value)}
          className="pl-10 bg-gray-100 dark:bg-gray-800 dark:text-gray-100 border-0"
        />
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="hidden sm:block mb-6 px-4">
          <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 px-4">
          <Typography variant="md-black-inter" className="font-semibold dark:text-white">
            {categoryName} ({organizations.length})
          </Typography>

          <SortAndViewControls
            sortOptions={[]}
            sortValue="default"
            onSortChange={() => { }}
            viewMode={view}
            onViewChange={setView}
            showViewToggle={true}
            showFilterButton={false}
            size="fit"
            className="hidden sm:flex"
          />
        </div>

        {/* Organizations Filters */}
        <JobsFilter
          searchQuery={localSearchQuery}
          onSearchChange={setLocalSearchQuery}
          searchPlaceholder={`Search ${categoryName}...`}
          locationQuery={locationQuery}
          onLocationChange={handleLocationChange}
          locationPlaceholder="Dubai"
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          config={filterConfig}
          className="mb-4"
        />

        <SortAndViewControls
          sortOptions={[]}
          sortValue="default"
          onSortChange={() => { }}
          viewMode={view}
          onViewChange={setView}
          showViewToggle={true}
          showFilterButton={false}
          size="fit"
          className="px-4 flex justify-end mb-4 sm:hidden"
        />

        {/* Organizations Grid */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">Loading organizations...</p>
            </div>
          ) : organizations.length > 0 ? (
            <div
              className={cn(
                `px-4 lg:px-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`,
                view === "list" && "flex flex-col"
              )}
            >
              {organizations.map((organization) => (
                <OrganizationCard
                  key={organization._id}
                  organization={organization}
                  isFavorite={organization.isSaved ?? false}
                  onFavorite={(id: string) => console.log("Favorited:", id)}
                  onShare={(id: string) => console.log("Shared:", id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
                  <NoDataCard title="No organizations found matching your criteria." description="Please try again with different filters." />
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                      Clear Filters
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
