"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import AdsFilter from "@/app/(root)/categories/_components/ads-filter";
import ListingCard from "@/components/global/listing-card";
import CuratedCarsCollection from "@/app/(root)/categories/_components/CuratedCarsCollection";
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
import { useAds } from "@/hooks/useAds";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { AdFilters, AD } from "@/interfaces/ad";
import { FilterConfig } from "@/app/(root)/categories/_components/ads-filter";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";

const ITEMS_PER_PAGE = 12;

// Sort options
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

// Static filter configuration - shown outside the dialog
const staticFilterConfig: FilterConfig[] = [
  {
    key: "price",
    label: "Price",
    type: "select",
    options: [
      { value: "under-50k", label: "Under 50,000" },
      { value: "50k-100k", label: "50,000 - 100,000" },
      { value: "100k-200k", label: "100,000 - 200,000" },
      { value: "200k-500k", label: "200,000 - 500,000" },
      { value: "over-500k", label: "Over 500,000" },
    ],
    placeholder: "Select Price",
    isStatic: true,
  },
  {
    key: "deal",
    label: "Deal",
    type: "select",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    placeholder: "Select",
    isStatic: true,
  },
  {
    key: "currentDate",
    label: "Current Date",
    type: "calendar",
    placeholder: "Tomorrow or next week",
    isStatic: true,
  },
  {
    key: "fromDate",
    label: "From Date",
    type: "calendar",
    placeholder: "Select start date",
    isStatic: true,
  },
  {
    key: "toDate",
    label: "To Date",
    type: "calendar",
    placeholder: "Select end date",
    isStatic: true,
  },
  {
    key: "isFeatured",
    label: "Featured",
    type: "select",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    placeholder: "Select",
    isStatic: true,
  },
  {
    key: "neighbourhood",
    label: "Neighbourhood",
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
    placeholder: "Select",
    isStatic: true,
  },
  {
    key: "hasVideo",
    label: "Has Video",
    type: "select",
    options: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    placeholder: "Select",
    isStatic: true,
  },
];

export default function CategoryListingPage() {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | number | string[] | undefined>>({});
  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  
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
    { id: "categories", label: "Categories", href: "/categories" },
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
    const extraFieldsFilters: Record<string, string | string[] | number | boolean> = {};
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

  // Fetch ads from API
  const { data: adsResponse, isLoading } = useAds(apiFilters);

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
    return adsResponse.data.adds.map(transformAdToListingCard);
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
        const hasOptions = field.optionalArray && field.optionalArray.length > 0;
        return (
          !staticFilterKeys.includes(field.name.toLowerCase()) &&
          (hasOptions || field.type === "select" || field.type === "checkboxes")
        );
      })
      .map((field) => {
        const filterKey = `extraField_${field.name}`;
        
        // Create options from optionalArray if available
        const options = field.optionalArray?.map((value) => ({
          value: value.toLowerCase().replace(/\s+/g, "-"),
          label: value,
        })) || [];

        // If no optionalArray but it's a select/checkbox type, create options from unique values
        if (options.length === 0 && (field.type === "select" || field.type === "checkboxes")) {
          // We could collect unique values from all ads, but for now just use the field value
          if (Array.isArray(field.value)) {
            options.push(...field.value.map((v) => ({
              value: String(v).toLowerCase().replace(/\s+/g, "-"),
              label: String(v),
            })));
          }
        }

        return {
          key: filterKey,
          label: field.name.charAt(0).toUpperCase() + field.name.slice(1).replace(/([A-Z])/g, " $1"),
          type: field.type === "checkboxes" ? "multiselect" : "select" as const,
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
          placeholder={"Search"}
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
            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} for
            sale in Dubai ({totalAds})
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
          searchPlaceholder={`Search ${categoryName}...`}
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
            {currentPage === 1 && <CuratedCarsCollection />}
          </div>
        )}

        {/* No Results */}
        {!isLoading && ads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No ads found matching your criteria.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
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
