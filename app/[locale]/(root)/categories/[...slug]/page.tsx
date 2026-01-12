"use client";

import React, { useState, useMemo, useEffect } from "react";
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
} from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import { cn } from "@/lib/utils";
import HorizontalListingCard from "../_components/desktop-horizontal-list-card";
import MobileHorizontalListViewCard from "../_components/MobileHorizontalListViewCard";
import Pagination from "@/components/global/pagination";
import { useAds, useFilterAds } from "@/hooks/useAds";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { AdFilters, AD } from "@/interfaces/ad";
import { FilterConfig } from "../_components/ads-filter";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import { Container1280 } from "@/components/layouts/container-1280";
import { Container1080 } from "@/components/layouts/container-1080";

const ITEMS_PER_PAGE = 12;
const DYNAMIC_FILTERS_STORAGE_KEY = "category_dynamic_filters";
const DYNAMIC_FILTER_CONFIGS_STORAGE_KEY = "category_dynamic_filter_configs";

export default function CategoryListingPage() {
  const { t, locale } = useLocale();
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Get category from URL params - use the last slug segment
  const slugSegments = Array.isArray(params.slug)
    ? params.slug
    : params.slug
    ? [params.slug]
    : [];
  const currentCategory = slugSegments[slugSegments.length - 1] || "";
  const categoryName = decodeURIComponent(currentCategory) || "Category";

  // Load saved dynamic filters from localStorage
  const getSavedDynamicFilters = (): Record<
    string,
    string | number | string[] | number[] | undefined
  > => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem(
        `${DYNAMIC_FILTERS_STORAGE_KEY}_${currentCategory}`
      );
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  // Load saved dynamic filter configs from localStorage
  const getSavedDynamicFilterConfigs = (): FilterConfig[] => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(
        `${DYNAMIC_FILTER_CONFIGS_STORAGE_KEY}_${currentCategory}`
      );
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Save dynamic filter configs to localStorage
  const saveDynamicFilterConfigs = (configs: FilterConfig[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        `${DYNAMIC_FILTER_CONFIGS_STORAGE_KEY}_${currentCategory}`,
        JSON.stringify(configs)
      );
    } catch (error) {
      console.error("Failed to save dynamic filter configs:", error);
    }
  };

  // Initialize filters - start empty, load saved dynamic filters after mount
  const [filters, setFilters] = useState<
    Record<string, string | number | string[] | number[] | undefined>
  >({});

  // Pending filters - updated immediately but don't trigger API calls
  const [pendingFilters, setPendingFilters] = useState<
    Record<string, string | number | string[] | number[] | undefined>
  >({});

  // Store dynamic filter configs in state so they persist even when data is empty
  const [savedDynamicFilterConfigs, setSavedDynamicFilterConfigs] = useState<
    FilterConfig[]
  >(() => getSavedDynamicFilterConfigs());

  // Load saved dynamic filters on mount and when slug changes
  useEffect(() => {
    const saved = getSavedDynamicFilters();
    setFilters(saved);
    setPendingFilters(saved);
    const savedConfigs = getSavedDynamicFilterConfigs();
    setSavedDynamicFilterConfigs(savedConfigs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory]);

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

  const formatLabel = (segment: string) =>
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const breadcrumbItems: BreadcrumbItem[] = [
    ...slugSegments.map((segment, index) => {
      const path = slugSegments.slice(0, index + 1).join("/");
      const href = `/categories/${path}`;

      return {
        id: path || `segment-${index}`,
        label: formatLabel(decodeURIComponent(segment)),
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
          // For number arrays (like price range), convert to string array or handle separately
          if (value.length > 0 && typeof value[0] === "number") {
            extraFieldsFilters[fieldName] = value.map(String);
          } else {
            extraFieldsFilters[fieldName] = value as string[];
          }
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

  // Check if any filters besides search are active
  const hasOtherFilters = useMemo(() => {
    return !!(
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

    // Collect extraFields filters (dynamic filters)
    const extraFieldsFilters: Record<
      string,
      string | string[] | number | boolean
    > = {};
    Object.entries(filters).forEach(([key, value]) => {
      // Skip static filters, only include dynamic ones
      if (
        !staticFilterKeys.includes(key) &&
        value !== undefined &&
        value !== ""
      ) {
        // Convert value to appropriate type
        if (Array.isArray(value)) {
          // For number arrays (like price range), convert to string array
          if (value.length > 0 && typeof value[0] === "number") {
            extraFieldsFilters[key] = (value as number[]).map(String);
          } else {
            extraFieldsFilters[key] = value as string[];
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasOtherFilters, currentCategory, filters, searchQuery]);

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

  // Handle filter changes - static filters apply immediately, dynamic filters wait for "Apply Filters"
  const handleFilterChange = (
    key: string,
    value: string | string[] | number[]
  ) => {
    if (staticFilterKeys.includes(key)) {
      // Static filters: update both pending and actual filters immediately (triggers API call)
      setPendingFilters((prev) => ({ ...prev, [key]: value }));
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1); // Reset to first page when filter changes
    } else {
      // Dynamic filters: only update pending filters (wait for "Apply Filters" button)
      setPendingFilters((prev) => ({ ...prev, [key]: value }));
    }
  };

  // Apply pending filters - called when "Apply Filters" is clicked (only for dynamic filters)
  const handleApplyFilters = () => {
    // Only apply dynamic filters (static filters are already applied)
    const dynamicFilters: Record<
      string,
      string | number | string[] | number[] | undefined
    > = {};

    Object.entries(pendingFilters).forEach(([key, value]) => {
      if (!staticFilterKeys.includes(key)) {
        dynamicFilters[key] = value;
      }
    });

    // Get current static filters from filters state (already applied)
    const currentStaticFilters: Record<
      string,
      string | number | string[] | number[] | undefined
    > = {};
    staticFilterKeys.forEach((key) => {
      if (filters[key] !== undefined) {
        currentStaticFilters[key] = filters[key];
      }
    });

    // Apply all filters (static + dynamic)
    setFilters({ ...currentStaticFilters, ...dynamicFilters });
    setCurrentPage(1);

    // Save dynamic filters to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          `${DYNAMIC_FILTERS_STORAGE_KEY}_${currentCategory}`,
          JSON.stringify(dynamicFilters)
        );
      } catch (error) {
        console.error("Failed to save dynamic filters:", error);
      }
    }
  };

  const clearFilters = () => {
    setPendingFilters({});
    setFilters({});
    setSearchQuery("");
    setCurrentPage(1);

    // Clear saved dynamic filters
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(
          `${DYNAMIC_FILTERS_STORAGE_KEY}_${currentCategory}`
        );
      } catch (error) {
        console.error("Failed to clear dynamic filters:", error);
      }
    }
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

  // Get first ad to extract extraFields for dynamic filters
  const firstAd: AD | undefined = adsResponse?.data?.adds?.[0];

  // Create dynamic filters from extraFields - shown inside the dialog
  const dynamicFiltersFromAds = useMemo<FilterConfig[]>(() => {
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

  // Update saved configs when new filters are discovered from ads
  useEffect(() => {
    if (dynamicFiltersFromAds.length > 0) {
      // Merge: use saved configs if they exist for a key, otherwise use new ones
      const merged: FilterConfig[] = [];
      const savedKeys = new Set(savedDynamicFilterConfigs.map((c) => c.key));

      // Add saved configs first (they take precedence)
      savedDynamicFilterConfigs.forEach((savedConfig) => {
        merged.push(savedConfig);
      });

      // Add new configs that don't exist in saved
      dynamicFiltersFromAds.forEach((newConfig) => {
        if (!savedKeys.has(newConfig.key)) {
          merged.push(newConfig);
        }
      });

      // Update saved configs if we have new ones (only if length changed to prevent infinite loops)
      if (merged.length > savedDynamicFilterConfigs.length) {
        setSavedDynamicFilterConfigs(merged);
        saveDynamicFilterConfigs(merged);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicFiltersFromAds]);

  // Always use saved configs (they persist even when data is empty)
  const dynamicFilters = useMemo<FilterConfig[]>(() => {
    return savedDynamicFilterConfigs;
  }, [savedDynamicFilterConfigs]);

  const totalAds = adsResponse?.data?.total || 0;
  const totalPages = Math.ceil(totalAds / ITEMS_PER_PAGE);

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
          filters={{
            // Merge: static filters from filters state (applied), dynamic filters from pendingFilters (pending)
            ...Object.fromEntries(
              staticFilterKeys.map((key) => [key, filters[key]])
            ),
            ...Object.fromEntries(
              Object.entries(pendingFilters).filter(
                ([key]) => !staticFilterKeys.includes(key)
              )
            ),
          }}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
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
                        className="flex-[0_0_auto] w-full"
                        {...ad}
                        extraFields={extraFields}
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
    </Container1080>
  );
}
