"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs, } from "@/components/ui/breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { Button } from "@/components/ui/button";
import { CommonFilters } from "@/components/common/common-filters";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { generateCategoryBreadcrumbs } from "@/lib/breadcrumb-utils";
import { useUrlParams } from "@/hooks/useUrlParams";
import { ActiveFilters } from "@/components/common/active-filters";
import ListingCard from "@/components/features/listing-card/listing-card";
import { Typography } from "@/components/typography";
import { Bell, ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SortAndViewControls, {
  ViewMode,
} from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import { cn } from "@/lib/utils";
import HorizontalListingCard from "../_components/horizontal-listing-card";
import Pagination from "@/components/global/pagination";
import { useAds, useFilterAds } from "@/hooks/useAds";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { AdFilters, } from "@/interfaces/ad";
import { Container1080 } from "@/components/layouts/container-1080";
import { buildAdFilterPayload } from "@/utils/ad-payload";
import { buildAdQueryParams } from "@/utils/ad-query-params";
import ListingCardSkeleton from "@/components/global/listing-card-skeleton";
import { getStaticFilterConfig } from "@/constants/filters.constants";
import { NoDataCard } from "@/components/global/fallback-cards";

const ITEMS_PER_PAGE = 12;

export default function CategoryListingPage() {
  const { t, locale } = useLocale();
  const params = useParams();
  const router = useRouter();
  const { clearUrlQueries } = useUrlParams();
  const { extraFields, hasDynamicFilters } = useUrlFilters();
  const [searchQuery, setSearchQuery] = useState("");

  // Get category from URL params - use the last slug segment
  const slugSegments = Array.isArray(params.slug)
    ? params.slug
    : params.slug
    ? [params.slug]
    : [];
  const currentCategory = slugSegments[slugSegments.length - 1] || "";
  const categoryName = decodeURIComponent(currentCategory) || "Category";

  // Initialize filters
  const [filters, setFilters] = useState<
    Record<string, string | number | string[] | number[] | undefined>
  >({});


  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);


  // Static filter configuration - shown outside the dialog
  // Static filter configuration - shown outside the dialog
  const staticFilterConfig = getStaticFilterConfig(t);

  const breadcrumbItems = generateCategoryBreadcrumbs(slugSegments);

  // Build API filters from state
  const apiFilters = useMemo<AdFilters>(() => {
    return buildAdQueryParams({
      categoryName,
      currentPage,
      itemsPerPage: ITEMS_PER_PAGE,
      searchQuery,
      filters,
      sortBy,
    });
  }, [categoryName, currentPage, searchQuery, filters, sortBy]);


  // Build filter payload for useFilterAds (only used if hasDynamicFilters)
  const filterPayload = useMemo(() => {
    if (!hasDynamicFilters) return {};

    return buildAdFilterPayload({
      currentCategory,
      searchQuery,
      filters,
      extraFields,
    });
  }, [hasDynamicFilters, currentCategory, filters, searchQuery, extraFields]);

  // Use filter API if dynamic filters are active, otherwise use regular ads API
  const { data: filterAdsResponse, isLoading: isFilterLoading } = useFilterAds(
    filterPayload as any,
    currentPage,
    ITEMS_PER_PAGE,
    hasDynamicFilters
  );

  const { data: regularAdsResponse, isLoading: isRegularLoading } = useAds(
    hasDynamicFilters ? undefined : apiFilters
  );

  // Use filter results if dynamic filters are active, otherwise use regular ads
  const adsResponse = hasDynamicFilters
    ? filterAdsResponse
    : regularAdsResponse;
  const isLoading = hasDynamicFilters ? isFilterLoading : isRegularLoading;

  // Handle filter changes - static filters apply immediately
  const handleFilterChange = (
    key: string,
    value: string | string[] | number[]
  ) => {
    // Static filters: update immediately
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setCurrentPage(1);
    clearUrlQueries();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Transform API ads to listing card format
  const ads = useMemo(() => {
    if (!adsResponse?.data?.adds) return [];
    return adsResponse.data.adds.map((ad) =>
      transformAdToListingCard(ad, locale)
    );
  }, [adsResponse, locale]);


  const totalAds = adsResponse?.data?.total || 0;
  const totalPages = Math.ceil(totalAds / ITEMS_PER_PAGE);

  return (
    <Container1080 className="min-h-[calc(100dvh)]">
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
          placeholder={t.categories.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-100 border-0"
        />
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="hidden px-4 sm:block mb-6">
          <Breadcrumbs items={breadcrumbItems} showSelectCategoryLink={false} />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between px-4 mb-6">
          <Typography variant="md-black-inter" className="font-semibold">
            {t.categories.forSaleIn
              .replace(
                "{{category}}",
                categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
              )
              .replace("{{count}}", totalAds.toString())}
          </Typography>

          <SortAndViewControls
            sortValue={sortBy}
            onSortChange={setSortBy}
            viewMode={view}
            onViewChange={setView}
            showViewToggle={true}
            showFilterButton={false}
            size="fit"
            className="hidden sm:flex"
          />
        </div>
        {/* Filters */}
        <CommonFilters
          filters={filters}
          staticFilters={staticFilterConfig}
          onStaticFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`${t.categories.search} ${categoryName}...`}
          className="mb-4"
        />

        <ActiveFilters
          staticFiltersConfig={staticFilterConfig}
          categoryPath={slugSegments.join("/")}
          onClearAll={clearFilters}
          className="px-4 mb-4"
        />

        <SortAndViewControls
          sortValue={sortBy}
          onSortChange={setSortBy}
          viewMode={view}
          onViewChange={setView}
          showViewToggle={true}
          showFilterButton={false}
          size="fit"
          className="px-4 flex justify-end mb-4 sm:hidden"
        />

        {/* Loading State */}
        {isLoading && (
          <div className="px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <ListingCardSkeleton className="w-full" key={i} />
            ))}
          </div>
        )}

        {/* Ads Grid/List */}
        {!isLoading && (
          <div className="space-y-6 ">
            <div
              className={cn(
                `px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3`,
                view === "list" && "flex flex-col"
              )}
            >
              {ads.map((ad) => {
                // Handle navigation to ad detail page
                const handleCardClick = (id: string) => {
                  router.push(`/ad/${id}`);
                };

                // Use extraFields as-is from transformed ad (already in correct format)
                // The transformAdToListingCard already converts it to a flat object
                const extraFields = ad.extraFields || {};

                // Prepare seller info for MobileHorizontalListViewCard
                const sellerInfo = ad.seller
                  ? {
                      name: ad.seller.name || "Unknown",
                      isVerified: ad.seller.isVerified || false,
                      type: ad.seller.type || "Individual",
                    }
                  : undefined;

                return (
                  <React.Fragment key={ad.id}>
                    {view === "grid" ? (
                      <ListingCard
                        className="flex-[0_0_auto] w-full"
                        {...ad}
                        extraFields={extraFields}
                      />
                    ) : (
                        <HorizontalListingCard
                          {...ad}
                          extraFields={extraFields}
                          seller={sellerInfo}
                          onFavorite={(id) => console.log("Favorited:", id)}
                          onShare={(id) => console.log("Shared:", id)}
                          onClick={handleCardClick}
                        />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Curated Cars Collection - Only show on first page */}
            {/* {currentPage === 1 && <CuratedCarsCollection />} */}
          </div>
        )}

        {/* No Results */}
        {!isLoading && ads.length === 0 && (
          <div className="py-12">
            <NoDataCard
              title={t.categories.noAdsFound}
              description="Try adjusting your filters or search query to find what you're looking for."
              action={
                <Button variant="outline" onClick={clearFilters}>
                  {t.categories.clearFilters}
                </Button>
              }
            />
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Container1080>
  );
}
