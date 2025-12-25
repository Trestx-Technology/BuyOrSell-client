"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { useLocale } from "@/hooks/useLocale";
import { Button } from "@/components/ui/button";
import AdsFilter from "../_components/ads-filter";
import ListingCard from "@/components/global/listing-card";
import { Typography } from "@/components/typography";
import { Bell, ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SortAndViewControls, {
  ViewMode,
} from "@/app/(root)/post-ad/_components/SortAndViewControls";
import { cn } from "@/lib/utils";
import HorizontalListingCard from "../_components/desktop-horizontal-list-card";
import MobileHorizontalListViewCard from "../_components/MobileHorizontalListViewCard";
import Pagination from "@/components/global/pagination";
import { useAds, useFilterAds } from "@/hooks/useAds";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { AdFilters, AD } from "@/interfaces/ad";
import { FilterConfig } from "../_components/ads-filter";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";

const ITEMS_PER_PAGE = 12;

export default function CategoryListingPage() {
  const { t, locale } = useLocale();
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<
    Record<string, string | number | string[] | undefined>
  >({});
  console.log("filters: ", filters);
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
      type: "select",
      options: [
        { value: "under-50k", label: t.categories.priceRanges.under50k },
        { value: "50k-100k", label: t.categories.priceRanges.between50k100k },
        { value: "100k-200k", label: t.categories.priceRanges.between100k200k },
        { value: "200k-500k", label: t.categories.priceRanges.between200k500k },
        { value: "over-500k", label: t.categories.priceRanges.over500k },
      ],
      placeholder: t.categories.placeholders.selectPrice,
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
      key: "currentDate",
      label: t.categories.filters.currentDate,
      type: "calendar",
      placeholder: t.categories.placeholders.selectStartDate,
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

  // Get category from URL params - use the last slug segment
  const slugSegments = Array.isArray(params.slug)
    ? params.slug
    : params.slug
    ? [params.slug]
    : [];

  const currentCategory = slugSegments[slugSegments.length - 1] || "";
  const categoryName = currentCategory.replace(/-/g, " ") || "Category";

  const formatLabel = (segment: string) =>
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: "categories", label: t.categories.categories, href: "/categories" },
    ...slugSegments.map((segment, index) => {
      const path = slugSegments.slice(0, index + 1).join("/");
      const href = `/categories/${path}`;

      return {
        id: path || `segment-${index}`,
        label: formatLabel(segment),
        href,
        isActive: index === slugSegments.length - 1,
      };
    }),
  ];

  // Build API filters from state
  const apiFilters = useMemo<AdFilters>(() => {
    const apiParams: AdFilters = {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      category: currentCategory,
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
    if (filters.currentDate && typeof filters.currentDate === "string") {
      apiParams.currentDate = filters.currentDate;
    }
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

    // Collect extraFields filters (prefixed with "extraField_")
    const extraFieldsFilters: Record<
      string,
      string | string[] | number | boolean
    > = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (key.startsWith("extraField_") && value) {
        const fieldName = key.replace("extraField_", "");
        // Convert value to appropriate type
        if (Array.isArray(value)) {
          extraFieldsFilters[fieldName] = value;
        } else if (typeof value === "number") {
          extraFieldsFilters[fieldName] = value;
        } else if (typeof value === "boolean") {
          extraFieldsFilters[fieldName] = value;
        } else {
          extraFieldsFilters[fieldName] = String(value);
        }
      }
    });

    // Note: extraFields filters would need to use the filter API endpoint
    // For now, we're collecting them but not sending to the regular /ad endpoint
    // If extraFields filtering is needed, switch to useFilterAds hook with AdFilterPayload

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
        filters.currentDate ||
        filters.fromDate ||
        filters.toDate ||
        filters.isFeatured ||
        filters.neighbourhood ||
        filters.hasVideo ||
        Object.keys(filters).some(
          (key) =>
            key !== "price" &&
            key !== "deal" &&
            key !== "currentDate" &&
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

  // Check if any filters besides search are active
  const hasOtherFilters = useMemo(() => {
    return !!(
      filters.price ||
      filters.deal ||
      filters.currentDate ||
      filters.fromDate ||
      filters.toDate ||
      filters.isFeatured ||
      filters.neighbourhood ||
      filters.hasVideo ||
      Object.keys(filters).some(
        (key) =>
          key !== "price" &&
          key !== "deal" &&
          key !== "currentDate" &&
          key !== "fromDate" &&
          key !== "toDate" &&
          key !== "isFeatured" &&
          key !== "neighbourhood" &&
          key !== "hasVideo" &&
          filters[key as keyof typeof filters]
      )
    );
  }, [filters]);

  // Build filter payload for useFilterAds
  const filterPayload = useMemo(() => {
    if (!hasOtherFilters) return {};

    const payload: any = {
      category: currentCategory,
    };

    // Add search query if present
    if (searchQuery.trim()) {
      payload.search = searchQuery.trim();
    }

    // Add price filter if present (from select dropdown)
    if (filters.price && typeof filters.price === "string") {
      switch (filters.price) {
        case "under-50k":
          payload.priceTo = 50000;
          break;
        case "50k-100k":
          payload.priceFrom = 50000;
          payload.priceTo = 100000;
          break;
        case "100k-200k":
          payload.priceFrom = 100000;
          payload.priceTo = 200000;
          break;
        case "200k-500k":
          payload.priceFrom = 200000;
          payload.priceTo = 500000;
          break;
        case "over-500k":
          payload.priceFrom = 500000;
          break;
      }
    }

    // Add deal filter if present
    if (filters.deal === "true") {
      payload.deal = true;
    } else if (filters.deal === "false") {
      payload.deal = false;
    }

    // Add date filters if present
    if (filters.currentDate && typeof filters.currentDate === "string") {
      payload.currentDate = new Date(filters.currentDate).toISOString();
    }
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

    // Collect extraFields filters (dynamic filters)
    const extraFieldsFilters: Record<
      string,
      string | string[] | number | boolean
    > = {};
    Object.entries(filters).forEach(([key, value]) => {
      // Skip static filters, only include dynamic ones
      const staticKeys = [
        "price",
        "deal",
        "currentDate",
        "fromDate",
        "toDate",
        "isFeatured",
        "neighbourhood",
        "hasVideo",
      ];
      if (!staticKeys.includes(key) && value !== undefined && value !== "") {
        // Convert value to appropriate type
        if (Array.isArray(value)) {
          extraFieldsFilters[key] = value;
        } else if (typeof value === "number") {
          extraFieldsFilters[key] = value;
        } else if (typeof value === "boolean") {
          extraFieldsFilters[key] = value;
        } else {
          extraFieldsFilters[key] = String(value);
        }
      }
    });

    // Add extraFields if any dynamic filters are set
    if (Object.keys(extraFieldsFilters).length > 0) {
      payload.extraFields = extraFieldsFilters;
    }

    return payload;
  }, [hasOtherFilters, currentCategory, filters]);

  // Use filter API if other filters are active, otherwise use regular ads API
  const { data: filterAdsResponse, isLoading: isFilterLoading } = useFilterAds(
    filterPayload as any,
    currentPage,
    ITEMS_PER_PAGE,
    hasOtherFilters
  );

  const { data: regularAdsResponse, isLoading: isRegularLoading } = useAds(
    hasOtherFilters ? undefined : apiFilters
  );

  // Use filter results if other filters are active, otherwise use regular ads
  const adsResponse = hasOtherFilters ? filterAdsResponse : regularAdsResponse;
  const isLoading = hasOtherFilters ? isFilterLoading : isRegularLoading;

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setCurrentPage(1);
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
  }, [adsResponse]);

  // Get first ad to extract extraFields for dynamic filters
  const firstAd: AD | undefined = adsResponse?.data?.adds?.[0];

  // Create dynamic filters from extraFields - shown inside the dialog
  const dynamicFilters = useMemo<FilterConfig[]>(() => {
    if (!firstAd?.extraFields) return [];

    const normalizedFields = normalizeExtraFieldsToArray(firstAd.extraFields);

    return normalizedFields
      .filter((field) => {
        // Only include fields that have optionalArray (dropdown options) or are filterable
        // Exclude fields that are already in static filters
        const staticFilterKeys = staticFilterConfig.map((f) => f.key);
        const hasOptions =
          field.optionalArray && field.optionalArray.length > 0;
        return (
          !staticFilterKeys.includes(field.name.toLowerCase()) &&
          (hasOptions || field.type === "select" || field.type === "checkboxes")
        );
      })
      .map((field) => {
        const filterKey = field.name; // Use field name directly for extrafields

        // Create options from optionalArray if available
        const options =
          field.optionalArray?.map((value) => ({
            value: value.toLowerCase().replace(/\s+/g, "-"),
            label: value,
          })) || [];

        // If no optionalArray but it's a select/checkbox type, create options from unique values
        if (
          options.length === 0 &&
          (field.type === "select" || field.type === "checkboxes")
        ) {
          // We could collect unique values from all ads, but for now just use the field value
          if (Array.isArray(field.value)) {
            options.push(
              ...field.value.map((v) => ({
                value: String(v).toLowerCase().replace(/\s+/g, "-"),
                label: String(v),
              }))
            );
          }
        }

        return {
          key: filterKey,
          label:
            field.name.charAt(0).toUpperCase() +
            field.name.slice(1).replace(/([A-Z])/g, " $1"),
          type:
            field.type === "checkboxes" ? "multiselect" : ("select" as const),
          options: options.length > 0 ? options : undefined,
          placeholder: `Select ${field.name}`,
          isStatic: false, // Dynamic filters go inside dialog
        } as FilterConfig;
      });
  }, [firstAd]);

  const totalAds = adsResponse?.data?.total || 0;
  const totalPages = Math.ceil(totalAds / ITEMS_PER_PAGE);

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
          placeholder={t.categories.search}
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
        <AdsFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          config={[]}
          staticFilters={staticFilterConfig}
          dynamicFilters={dynamicFilters}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`${t.categories.search} ${categoryName}...`}
          className="mb-4"
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
          <div className="px-4 lg:px-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-2xl h-[284px] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Ads Grid/List */}
        {!isLoading && (
          <div className="space-y-6">
            <div
              className={cn(
                `px-4 lg:px-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`,
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
                        {...ad}
                        extraFields={extraFields}
                        onFavorite={(id) => console.log("Favorited:", id)}
                        onShare={(id) => console.log("Shared:", id)}
                        onClick={handleCardClick}
                        className="min-h-[284px]"
                      />
                    ) : (
                      <>
                        <HorizontalListingCard
                          {...ad}
                          extraFields={extraFields}
                          seller={sellerInfo}
                          onFavorite={(id) => console.log("Favorited:", id)}
                          onShare={(id) => console.log("Shared:", id)}
                          onClick={handleCardClick}
                          className="hidden sm:block"
                        />
                        <MobileHorizontalListViewCard
                          {...ad}
                          extraFields={extraFields}
                          seller={sellerInfo}
                          onClick={handleCardClick}
                          className="block sm:hidden"
                        />
                      </>
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
          <div className="text-center py-12">
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
    </div>
  );
}
