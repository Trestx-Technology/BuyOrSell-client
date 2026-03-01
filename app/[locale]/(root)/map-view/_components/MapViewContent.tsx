"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { CommonFilters } from "@/components/common/common-filters";
import { FilterConfig } from "@/components/common/filter-control";
import ProductsGrid from "./products-grid";
import Map from "./map";
import { cn } from "@/lib/utils";
import { HorizontalCarouselSlider } from "@/components/global/horizontal-carousel-slider";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import { AdFilterPayload, ProductExtraFields } from "@/interfaces/ad";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";
import {
  useAds,
  useFilterAds,
  useInfiniteAds,
  useInfiniteFilterAds,
} from "@/hooks/useAds";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { InfiniteScrollContainer } from "@/components/global/infinite-scroll-container";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";
import { useUrlFilters } from "@/hooks/useUrlFilters";

const MAP_CENTER = { lat: 25.2048, lng: 55.2708 };
const MAP_ZOOM = 12;

export const MapViewContent = () => {
  const { t } = useLocale();
  const {
    query,
    extraFields: urlExtraFields,
    updateUrlParams,
    hasDynamicFilters,
  } = useUrlFilters();

  const category = query.category as string;
  const emirate = query.emirate as string;

  const [mapCenter] = useState(MAP_CENTER);
  const [mapZoom] = useState(MAP_ZOOM);

  // Sync state with URL. This ensures MapViewFilter reflects the current URL.
  const filters = useMemo(
    () => ({
      location: (query.location as string) || "",
      price: (query.price as string) || "",
      datePosted: (query.datePosted as string) || "",
      priceFrom: (query.priceFrom as string) || "",
      priceTo: (query.priceTo as string) || "",
      deal:
        query.deal === "true"
          ? true
          : query.deal === "false"
            ? false
            : undefined,
      fromDate: (query.fromDate as string) || "",
      toDate: (query.toDate as string) || "",
      isFeatured:
        query.isFeatured === "true"
          ? true
          : query.isFeatured === "false"
            ? false
            : undefined,
      hasVideo:
        query.hasVideo === "true"
          ? true
          : query.hasVideo === "false"
            ? false
            : undefined,
      showMap: query.showMap !== "false", // Default to true
      extraFields: urlExtraFields || {},
    }),
    [query, urlExtraFields],
  );

  const [mapGeoFilter, setMapGeoFilter] = useState<{
    coordinates: number[];
    distance: number;
  } | null>(null);

  const [selectedAreaMarkerIds, setSelectedAreaMarkerIds] = useState<string[]>(
    [],
  );
  const [selectedAreaPath, setSelectedAreaPath] = useState<
    { lat: number; lng: number }[] | null
  >(null);

  // Store extraFields in state so filters persist even when no ads are found
  const [savedExtraFields, setSavedExtraFields] = useState<ProductExtraFields>(
    [],
  );

  // Clear saved extraFields when category changes
  useEffect(() => {
    if (!category) {
      setSavedExtraFields([]);
    }
  }, [category]);

  const hasActiveFilters = useMemo(() => {
    const advancedFilters = [
      "price",
      "priceFrom",
      "priceTo",
      "deal",
      "datePosted",
      "fromDate",
      "toDate",
      "isFeatured",
      "hasVideo",
    ];
    const hasAdvancedUrlFilter = Object.keys(query).some((key) =>
      advancedFilters.includes(key),
    );
    const hasExtraFields = Object.keys(urlExtraFields).length > 0;

    return (
      hasAdvancedUrlFilter ||
      hasExtraFields ||
      !!mapGeoFilter ||
      (selectedAreaPath !== null && selectedAreaPath.length > 0)
    );
  }, [query, urlExtraFields, mapGeoFilter, selectedAreaPath]);

  // Transform filters to API payload format
  const filterPayload = useMemo((): AdFilterPayload => {
    const payload: AdFilterPayload = {};

    if (category) payload.category = category;
    if (emirate) payload.neighbourhood = emirate;
    if (filters.location) payload.city = filters.location;

    if (filters.priceFrom) payload.priceFrom = Number(filters.priceFrom);
    if (filters.priceTo) payload.priceTo = Number(filters.priceTo);

    if (!filters.priceFrom && !filters.priceTo && filters.price) {
      const priceRange = filters.price;
      if (priceRange.includes("Under")) {
        const match = priceRange.match(/(\d+)([KM])?/);
        if (match) {
          const val = parseInt(match[1]);
          const mult = match[2] === "M" ? 1000000 : 1000;
          payload.priceTo = val * mult;
        }
      } else if (priceRange.includes("+")) {
        const match = priceRange.match(/(\d+)([KM])?/);
        if (match) {
          const val = parseInt(match[1]);
          const mult = match[2] === "M" ? 1000000 : 1000;
          payload.priceFrom = val * mult;
        }
      } else if (priceRange.includes("-")) {
        const rangeParts = priceRange.split("-").map((s) => s.trim());
        if (rangeParts.length === 2) {
          const parsePart = (v: string) => {
            const m = v.match(/(\d+)([KM])?/);
            if (!m) return 0;
            const val = parseInt(m[1]);
            const mult = m[2] === "M" ? 1000000 : 1000;
            return val * mult;
          };
          payload.priceFrom = parsePart(rangeParts[0]);
          payload.priceTo = parsePart(rangeParts[1]);
        }
      }
    }

    if (filters.deal !== undefined) payload.deal = filters.deal;
    if (filters.isFeatured !== undefined)
      payload.isFeatured = filters.isFeatured;
    if (filters.hasVideo !== undefined) payload.hasVideo = filters.hasVideo;
    if (filters.fromDate)
      payload.fromDate = new Date(filters.fromDate).toISOString();
    if (filters.toDate) payload.toDate = new Date(filters.toDate).toISOString();

    if (filters.datePosted && !filters.fromDate && !filters.toDate) {
      const now = new Date();
      let fromDate: Date;
      switch (filters.datePosted) {
        case "Last 24 hours":
          fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "Last 7 days":
          fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "Last 30 days":
          fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "Last 3 months":
          fromDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          fromDate = new Date(0);
      }
      payload.fromDate = fromDate.toISOString();
      payload.toDate = now.toISOString();
    }

    if (filters.extraFields && Object.keys(filters.extraFields).length > 0)
      payload.extraFields = filters.extraFields;
    if (mapGeoFilter) {
      payload.coordinates = mapGeoFilter.coordinates;
      payload.distance = mapGeoFilter.distance;
    }

    return payload;
  }, [category, emirate, filters, mapGeoFilter]);

  const {
    data: filterAdsData,
    isLoading: isFilterLoading,
    fetchNextPage: fetchNextFilterPage,
    hasNextPage: hasNextFilterPage,
    isFetchingNextPage: isFetchingNextFilterPage,
  } = useInfiniteFilterAds(filterPayload, 20, { enabled: hasActiveFilters });

  const {
    data: regularAdsData,
    isLoading: isRegularLoading,
    fetchNextPage: fetchNextRegularPage,
    hasNextPage: hasNextRegularPage,
    isFetchingNextPage: isFetchingNextRegularPage,
  } = useInfiniteAds(
    hasActiveFilters
      ? undefined
      : {
          limit: 20,
          category: category || "",
          neighbourhood: ((emirate || query.neighbourhood) as string) || "",
          location: (query.location as string) || "",
        },
    { enabled: !hasActiveFilters },
  );

  const isLoading = hasActiveFilters ? isFilterLoading : isRegularLoading;
  const isFetchingNextPage = hasActiveFilters
    ? isFetchingNextFilterPage
    : isFetchingNextRegularPage;
  const hasNextPage = hasActiveFilters ? hasNextFilterPage : hasNextRegularPage;
  const onLoadMore = hasActiveFilters
    ? fetchNextFilterPage
    : fetchNextRegularPage;

  const rawAds = useMemo(() => {
    const data = hasActiveFilters ? filterAdsData : regularAdsData;
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data?.adds || page.adds || []);
  }, [hasActiveFilters, filterAdsData, regularAdsData]);

  const mapMarkers = useMemo(() => {
    return rawAds.map((ad) => {
      let lat = 25.2048,
        lng = 55.2708;
      const extractCoords = (data: any) => {
        if (
          data?.coordinates &&
          Array.isArray(data.coordinates) &&
          data.coordinates.length >= 2
        ) {
          const [lonC, latC] = data.coordinates;
          if (
            typeof lonC === "number" &&
            typeof latC === "number" &&
            !isNaN(lonC) &&
            !isNaN(latC)
          ) {
            lat = latC;
            lng = lonC;
          }
        }
      };
      extractCoords(ad.location);
      if (lat === 25.2048 && lng === 55.2708) extractCoords(ad.address);

      const locStr =
        typeof ad.location === "string"
          ? ad.location
          : ad.location?.address ||
            (ad.location?.city && ad.location?.state
              ? `${ad.location.city}, ${ad.location.state}`
              : ad.location?.city || ad.location?.state || "");

      return {
        id: ad._id,
        position: { lat, lng },
        title: ad.title,
        price: ad.price.toString(),
        image: ad.images?.[0],
        location: locStr,
      };
    });
  }, [rawAds]);

  const ads = useMemo(() => {
    if (selectedAreaMarkerIds.length > 0)
      return rawAds.filter((ad) => selectedAreaMarkerIds.includes(ad._id));
    return rawAds;
  }, [rawAds, selectedAreaMarkerIds]);

  const categoryExtraFields = useMemo(() => {
    if (category && rawAds.length > 0 && rawAds[0].extraFields)
      return normalizeExtraFieldsToArray(rawAds[0].extraFields);
    if (savedExtraFields.length > 0) return savedExtraFields;
    return [];
  }, [category, rawAds, savedExtraFields]);

  useEffect(() => {
    if (category && rawAds.length > 0 && rawAds[0].extraFields) {
      const normalized = normalizeExtraFieldsToArray(rawAds[0].extraFields);
      if (normalized.length > 0) setSavedExtraFields(normalized);
    }
  }, [category, rawAds]);

  const handleMarkerClick = useCallback(
    (id: string) => console.log("Marker clicked:", id),
    [],
  );
  const handleMapClick = useCallback(
    (pos: any) => console.log("Map clicked at:", pos),
    [],
  );

  const commonFiltersMap = useMemo(() => {
    return {
      price: filters.price,
      datePosted: filters.datePosted,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      deal:
        filters.deal === true ? "Yes" : filters.deal === false ? "No" : null,
      isFeatured:
        filters.isFeatured === true
          ? "Yes"
          : filters.isFeatured === false
            ? "No"
            : null,
      hasVideo:
        filters.hasVideo === true
          ? "Yes"
          : filters.hasVideo === false
            ? "No"
            : null,
      showMap: filters.showMap ? "true" : "false",
      ...(filters.extraFields || {}), // Spread extra fields so they're top-level in the filters object
    };
  }, [filters]);

  const staticFilters = useMemo<FilterConfig[]>(() => {
    const baseFilters: FilterConfig[] = [
      {
        key: "price",
        label: "Price range",
        type: "select",
        options: [
          { value: "Any", label: "Any" },
          { value: "Under 500K", label: "Under 500K" },
          { value: "500K - 1M", label: "500K - 1M" },
          { value: "1M - 2M", label: "1M - 2M" },
          { value: "2M - 5M", label: "2M - 5M" },
          { value: "5M+", label: "5M+" },
        ],
      },
      {
        key: "datePosted",
        label: "Date posted",
        type: "select",
        options: [
          { value: "Any", label: "Any" },
          { value: "Last 24 hours", label: "Last 24 hours" },
          { value: "Last 7 days", label: "Last 7 days" },
          { value: "Last 30 days", label: "Last 30 days" },
          { value: "Last 3 months", label: "Last 3 months" },
        ],
      },
      {
        key: "fromDate",
        label: "From Date",
        type: "calendar",
      },
      {
        key: "toDate",
        label: "To Date",
        type: "calendar",
      },
      {
        key: "deal",
        label: "Deal",
        type: "selectableTabs",
        options: [
          { value: "Yes", label: "Deal" },
          { value: "No", label: "No Deal" },
        ],
      },
      {
        key: "isFeatured",
        label: "Featured",
        type: "selectableTabs",
        options: [
          { value: "Yes", label: "Featured" },
          { value: "No", label: "Not Featured" },
        ],
      },
      {
        key: "hasVideo",
        label: "Video",
        type: "selectableTabs",
        options: [
          { value: "Yes", label: "Has Video" },
          { value: "No", label: "No Video" },
        ],
      },
      {
        key: "showMap",
        label: "View Layout",
        type: "selectableTabs",
        options: [
          { value: "true", label: "Map" },
          { value: "false", label: "Grid" },
        ],
      },
    ];

    const extraFilterConfigs = categoryExtraFields
      .filter(
        (field: any) =>
          field.optionalArray &&
          Array.isArray(field.optionalArray) &&
          field.optionalArray.length > 0 &&
          field.type !== "bool",
      )
      .map(
        (field: any) =>
          ({
            key: field.name,
            label: field.name,
            type:
              field.type === "dropdown"
                ? "select"
                : field.type === "checkboxes"
                  ? "multiselect"
                  : "select",
            options: (field.optionalArray as string[]).map((opt) => ({
              value: opt,
              label: opt,
            })),
          }) as FilterConfig,
      );

    return [...baseFilters, ...extraFilterConfigs];
  }, [categoryExtraFields]);

  const handleStaticFilterChange = useCallback(
    (key: string, value: any) => {
      if (["price", "datePosted", "fromDate", "toDate"].includes(key)) {
        updateUrlParams({ [key]: value !== "Any" && value ? value : null });
      } else if (["deal", "isFeatured", "hasVideo"].includes(key)) {
        updateUrlParams({
          [key]: value === "Yes" ? "true" : value === "No" ? "false" : null,
        });
      } else if (key === "showMap") {
        updateUrlParams({ [key]: value === "true" ? "true" : "false" });
      } else {
        // It's an extraField
        const newExtraFields = {
          ...(filters.extraFields || {}),
          [key]: value,
        };
        if (
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          value === "Any"
        ) {
          delete newExtraFields[key];
        }

        updateUrlParams({
          extraFields:
            Object.keys(newExtraFields).length > 0
              ? JSON.stringify(newExtraFields)
              : null,
        });
      }
    },
    [filters, updateUrlParams],
  );

  const handleClearFilters = useCallback(() => {
    updateUrlParams({
      price: null,
      datePosted: null,
      extraFields: null,
      priceFrom: null,
      priceTo: null,
      deal: null,
      fromDate: null,
      toDate: null,
      isFeatured: null,
      hasVideo: null,
      location: null,
      search: null,
    });
  }, [updateUrlParams]);

  const handleBoundsChange = useCallback((center: any, radius: number) => {
    setMapGeoFilter({
      coordinates: [center.lng, center.lat],
      distance: Math.round(radius),
    });
  }, []);
  const handleClearGeofence = useCallback(() => {
    setMapGeoFilter(null);
    setSelectedAreaMarkerIds([]);
    setSelectedAreaPath(null);
  }, []);
  const handleAreaSelect = useCallback(
    (markerIds: string[], polygonPath: any[]) => {
      setSelectedAreaMarkerIds(markerIds);
      setSelectedAreaPath(polygonPath);
    },
    [],
  );

  return (
    <GoogleMapsProvider>
      <section className="w-full flex flex-col relative h-full">
        <div className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 relative z-20 shadow-sm">
          <Container1080>
            <CommonFilters
              filters={commonFiltersMap}
              staticFilters={staticFilters}
              onStaticFilterChange={handleStaticFilterChange}
              onClearFilters={handleClearFilters}
              searchQuery={(query.search as string) || ""}
              onSearchChange={(q) => updateUrlParams({ search: q ? q : null })}
              locationQuery={filters.location}
              onLocationChange={(loc) =>
                updateUrlParams({ location: loc ? loc : null })
              }
              advancedExcludeKeys={[
                "price",
                "datePosted",
                "fromDate",
                "toDate",
                "deal",
                "isFeatured",
                "hasVideo",
                "showMap",
              ]}
            />
          </Container1080>
        </div>

        <InfiniteScrollContainer
          className="h-[calc(100vh-180px)] flex-1 overflow-y-auto"
          onLoadMore={async () => {
            if (hasNextPage && !isFetchingNextPage) {
              await onLoadMore();
            }
          }}
          hasMore={!!hasNextPage}
          isLoading={isFetchingNextPage}
        >
          <Container1080 className="flex items-start justify-between gap-4 relative p-2 h-auto min-h-full">
            <ProductsGrid
              ads={ads}
              isLoading={isLoading}
              title={t.mapView.title}
              showReturnButton={true}
              className={cn(filters.showMap && "max-w-md hidden md:flex")}
              gridClassName={cn(
                !filters.showMap && "md:grid-cols-3 lg:grid-cols-5",
              )}
            />

            {filters.showMap && (
              // <div className="flex-1 bg-red-500 flex-1 relative w-full h-full min-h-[500px]">
              <div className="sticky top-2 min-h-[500px] h-[calc(100vh-200px)] flex-1 w-full">
                <Map
                  markers={mapMarkers}
                  onMarkerClick={handleMarkerClick}
                  onMapClick={handleMapClick}
                  onBoundsChange={handleBoundsChange}
                  onAreaSelect={handleAreaSelect}
                  onClearGeofence={handleClearGeofence}
                  isGeofenceActive={!!mapGeoFilter}
                  initialPolygonPath={selectedAreaPath || undefined}
                  center={mapCenter}
                  zoom={mapZoom}
                  className="h-full w-full rounded-lg overflow-hidden"
                />
                {/* </div> */}
              </div>
            )}

            <HorizontalCarouselSlider
              items={ads.slice(0, 10).map((ad) => {
                const transformed = transformAdToListingCard(ad);
                return {
                  id: transformed.id,
                  title: transformed.title,
                  price: transformed.price,
                  originalPrice: transformed.originalPrice,
                  discount: transformed.discount,
                  location: transformed.location,
                  images: transformed.images,
                  extraFields: transformed.extraFields,
                  postedTime: transformed.postedTime,
                  onFavorite: () => {},
                };
              })}
              showNavigation={false}
              autoScroll={false}
              cardWidth={280}
              gap={16}
              showScrollbar={true}
              className="md:hidden"
            />
          </Container1080>
        </InfiniteScrollContainer>
      </section>
    </GoogleMapsProvider>
  );
};
