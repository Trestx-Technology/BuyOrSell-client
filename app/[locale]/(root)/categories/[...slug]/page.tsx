"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
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
import { AdFilters, AD } from "@/interfaces/ad";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import { Container1280 } from "@/components/layouts/container-1280";
import { Container1080 } from "@/components/layouts/container-1080";
import ListingCardSkeleton from "@/components/global/listing-card-skeleton";
import { FilterConfig } from "@/components/common/filter-control";

const ITEMS_PER_PAGE = 12;

export default function CategoryListingPage() {
  const { t, locale } = useLocale();
  const params = useParams();
  const router = useRouter();
  const { clearUrlQueries } = useUrlParams();
  const { extraFields } = useUrlFilters();
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
  // Sort options
  const sortOptions = [
    { value: "default", label: t.categories.sort.default },
    { value: "newest", label: t.categories.sort.newest },
    { value: "oldest", label: t.categories.sort.oldest },
    { value: "price-asc", label: t.categories.sort.priceLowToHigh },
    { value: "price-desc", label: t.categories.sort.priceHighToLow },
  ];

  // Static filter configuration - shown outside the dialog
  const staticFilterConfig: FilterConfig[] = [
    {
      key: "price",
      label: t.categories.filters.price,
      type: "range",
      min: 0,
      max: 1000000,
      step: 1000,
      isStatic: true,
    },
    {
      key: "deal",
      label: t.categories.filters.deal,
      type: "select",
      options: [
        { value: "true", label: t.categories.boolean.yes },
        { value: "false", label: t.categories.boolean.no },
      ],
      placeholder: t.categories.placeholders.select,
      isStatic: true,
    },
    {
      key: "fromDate",
      label: t.categories.filters.fromDate,
      type: "calendar",
      placeholder: t.categories.placeholders.selectStartDate,
      isStatic: true,
    },
    {
      key: "toDate",
      label: t.categories.filters.toDate,
      type: "calendar",
      placeholder: t.categories.placeholders.selectEndDate,
      isStatic: true,
    },
    {
      key: "isFeatured",
      label: t.categories.filters.featured,
      type: "select",
      options: [
        { value: "true", label: t.categories.boolean.yes },
        { value: "false", label: t.categories.boolean.no },
      ],
      placeholder: t.categories.placeholders.select,
      isStatic: true,
    },
    {
      key: "neighbourhood",
      label: t.categories.filters.neighbourhood,
      type: "select",
      options: [
        { value: "dubai", label: t.categories.locations.dubai },
        { value: "abu-dhabi", label: t.categories.locations.abuDhabi },
        { value: "sharjah", label: t.categories.locations.sharjah },
        { value: "ajman", label: t.categories.locations.ajman },
        { value: "ras-al-khaimah", label: t.categories.locations.rasAlKhaimah },
        { value: "fujairah", label: t.categories.locations.fujairah },
        { value: "umm-al-quwain", label: t.categories.locations.ummAlQuwain },
      ],
      placeholder: t.categories.placeholders.select,
      isStatic: true,
    },
    {
      key: "hasVideo",
      label: t.categories.filters.hasVideo,
      type: "select",
      options: [
        { value: "true", label: t.categories.boolean.yes },
        { value: "false", label: t.categories.boolean.no },
      ],
      placeholder: t.categories.placeholders.select,
      isStatic: true,
    },
  ];

  const breadcrumbItems = generateCategoryBreadcrumbs(slugSegments);

  // Build API filters from state
  const apiFilters = useMemo<AdFilters>(() => {
    const apiParams: AdFilters = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      category: categoryName,
    };

    // Add search query if present
    if (searchQuery.trim()) {
      apiParams.search = searchQuery.trim();
    }

    // Add price filter if present (from select dropdown)
    if (filters.price && typeof filters.price === "string") {
      switch (filters.price) {
        case "under-50k":
          apiParams.maxPrice = 50000;
          break;
        case "50k-100k":
          apiParams.minPrice = 50000;
          apiParams.maxPrice = 100000;
          break;
        case "100k-200k":
          apiParams.minPrice = 100000;
          apiParams.maxPrice = 200000;
          break;
        case "200k-500k":
          apiParams.minPrice = 200000;
          apiParams.maxPrice = 500000;
          break;
        case "over-500k":
          apiParams.minPrice = 500000;
          break;
      }
    }

    // Add deal filter if present
    if (filters.deal === "true") {
      apiParams.deal = true;
    } else if (filters.deal === "false") {
      apiParams.deal = false;
    }

    // Add date filters if present
    if (filters.fromDate && typeof filters.fromDate === "string") {
      apiParams.fromDate = filters.fromDate;
    }
    if (filters.toDate && typeof filters.toDate === "string") {
      apiParams.toDate = filters.toDate;
    }

    // Add isFeatured filter if present
    if (filters.isFeatured === "true") {
      apiParams.isFeatured = true;
    } else if (filters.isFeatured === "false") {
      apiParams.isFeatured = false;
    }

    // Add neighbourhood filter if present
    if (filters.neighbourhood && typeof filters.neighbourhood === "string") {
      apiParams.neighbourhood = filters.neighbourhood;
    }

    // Add hasVideo filter if present
    if (filters.hasVideo === "true") {
      apiParams.hasVideo = true;
    } else if (filters.hasVideo === "false") {
      apiParams.hasVideo = false;
    }

    // Add sort
    if (sortBy !== "default") {
      switch (sortBy) {
        case "newest":
          apiParams.sort = "createdAt:desc";
          break;
        case "oldest":
          apiParams.sort = "createdAt:asc";
          break;
        case "price-asc":
          apiParams.sort = "price:asc";
          break;
        case "price-desc":
          apiParams.sort = "price:desc";
          break;
      }
    }

    return apiParams;
  }, [currentCategory, currentPage, searchQuery, filters, sortBy]);

  // Check if only search filter is active
  const hasOnlySearchFilter = useMemo(() => {
    return !!(
      searchQuery.trim() &&
      !(
        filters.price ||
        filters.deal ||
        filters.fromDate ||
        filters.toDate ||
        filters.isFeatured ||
        filters.neighbourhood ||
        filters.hasVideo ||
        Object.keys(filters).some(
          (key) =>
            key !== "price" &&
            key !== "deal" &&
            key !== "fromDate" &&
            key !== "toDate" &&
            key !== "isFeatured" &&
            key !== "neighbourhood" &&
            key !== "hasVideo" &&
            filters[key as keyof typeof filters]
        )
      )
    );
  }, [searchQuery, filters]);

  // Static filter keys that should trigger API calls immediately
  const staticFilterKeys = [
    "price",
    "deal",
    "fromDate",
    "toDate",
    "isFeatured",
    "neighbourhood",
    "hasVideo",
  ];

  // Check if any dynamic filters are active
  const hasDynamicFilters = useMemo(() => {
    return Object.keys(extraFields).length > 0;
  }, [extraFields]);

  // Build filter payload for useFilterAds (only used if hasDynamicFilters)
  const filterPayload = useMemo(() => {
    if (!hasDynamicFilters) return {};

    const payload: any = {
      category: currentCategory,
    };

    // Add search query if present
    if (searchQuery.trim()) {
      payload.search = searchQuery.trim();
    }

    // Add price filter if present (from range slider)
    if (
      filters.price &&
      Array.isArray(filters.price) &&
      filters.price.length === 2
    ) {
      const priceArray = filters.price;
      if (
        typeof priceArray[0] === "number" &&
        typeof priceArray[1] === "number"
      ) {
        const [minPrice, maxPrice] = priceArray;
        if (minPrice > 0) {
          payload.priceFrom = minPrice;
        }
        if (maxPrice < 1000000) {
          payload.priceTo = maxPrice;
        }
      }
    }

    // Add deal filter if present
    if (filters.deal === "true") {
      payload.deal = true;
    } else if (filters.deal === "false") {
      payload.deal = false;
    }

    // Add date filters if present
    if (filters.fromDate && typeof filters.fromDate === "string") {
      payload.fromDate = new Date(filters.fromDate).toISOString();
    }
    if (filters.toDate && typeof filters.toDate === "string") {
      payload.toDate = new Date(filters.toDate).toISOString();
    }

    // Add isFeatured filter if present
    if (filters.isFeatured === "true") {
      payload.isFeatured = true;
    } else if (filters.isFeatured === "false") {
      payload.isFeatured = false;
    }

    // Add neighbourhood filter if present
    if (filters.neighbourhood && typeof filters.neighbourhood === "string") {
      payload.neighbourhood = filters.neighbourhood;
    }

    // Add hasVideo filter if present
    if (filters.hasVideo === "true") {
      payload.hasVideo = true;
    } else if (filters.hasVideo === "false") {
      payload.hasVideo = false;
    }

    // Add extraFields if any dynamic filters are set
    if (Object.keys(extraFields).length > 0) {
      payload.extraFields = extraFields;
    }

    return payload;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const dynamicFilters: FilterConfig[] = []; // Handled by GlobalMoreFilters

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
            sortOptions={sortOptions}
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
          dynamicFilters={dynamicFilters}
          onStaticFilterChange={handleFilterChange}
          onApplyDynamicFilters={() => { }}
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
          sortOptions={sortOptions}
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
          <div className="px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                `px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`,
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
          <div className="text-center py-12 ">
            <p className="text-gray-500 text-lg">{t.categories.noAdsFound}</p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              {t.categories.clearFilters}
            </Button>
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
