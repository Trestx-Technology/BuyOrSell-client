"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import MapViewFilter, { MapViewFilters } from "./map-view-filter";
import ProductsGrid from "./products-grid";
import Map from "./map";
import { cn } from "@/lib/utils";
import { HorizontalCarouselSlider } from "@/components/global/horizontal-carousel-slider";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import { AdFilterPayload, ProductExtraFields } from "@/interfaces/ad";
import { useLocale } from "@/hooks/useLocale";
import { Container1080 } from "@/components/layouts/container-1080";
import { useAds, useFilterAds } from "@/hooks/useAds";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
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
    (): MapViewFilters => ({
      location: (query.location as string) || "",
      price: (query.price as string) || "",
      datePosted: (query.datePosted as string) || "",
      priceFrom: (query.priceFrom as string) || "",
      priceTo: (query.priceTo as string) || "",
      deal:
        query.deal === "true" ? true : query.deal === "false" ? false : undefined,
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
    [query, urlExtraFields]
  );

  const [mapGeoFilter, setMapGeoFilter] = useState<{
    coordinates: number[];
    distance: number;
  } | null>(null);

  const [selectedAreaMarkerIds, setSelectedAreaMarkerIds] = useState<string[]>(
    []
  );
  const [selectedAreaPath, setSelectedAreaPath] = useState<
    { lat: number; lng: number }[] | null
  >(null);

  // Store extraFields in state so filters persist even when no ads are found
  const [savedExtraFields, setSavedExtraFields] = useState<ProductExtraFields>(
    []
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
      advancedFilters.includes(key)
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
    if (filters.toDate)
      payload.toDate = new Date(filters.toDate).toISOString();

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

  const { data: filterAdsData, isLoading: isFilterLoading } = useFilterAds(
    filterPayload,
    1,
    50,
    hasActiveFilters
  );
  const { data: regularAdsData, isLoading: isRegularLoading } = useAds(
    hasActiveFilters
      ? undefined
      : {
          limit: 50,
          page: 1,
          category: category || "",
        neighbourhood: (emirate || query.neighbourhood) as string || "",
        location: query.location as string || "",
      },
    { enabled: !hasActiveFilters }
  );

  const adsData = hasActiveFilters ? filterAdsData : regularAdsData;
  const isLoading = hasActiveFilters ? isFilterLoading : isRegularLoading;
  const rawAds = useMemo(
    () => adsData?.data?.adds || [],
    [adsData?.data?.adds]
  );

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
    []
  );
  const handleMapClick = useCallback(
    (pos: any) => console.log("Map clicked at:", pos),
    []
  );
  const handleFilterChange = useCallback(
    (f: MapViewFilters) => {
      const { extraFields, ...rest } = f;
      const updates: Record<string, any> = { ...rest };
      if (extraFields && Object.keys(extraFields).length > 0) {
        updates.extraFields = JSON.stringify(extraFields);
      } else {
        updates.extraFields = null;
      }
      updateUrlParams(updates);
    },
    [updateUrlParams]
  );
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
    []
  );

  return (
    <GoogleMapsProvider>
      <section className="w-full flex flex-col relative h-full">
        <div className="w-full border bg-white">
          <MapViewFilter
            filters={filters}
            extraFields={categoryExtraFields}
            onFilterChange={handleFilterChange}
          />
        </div>

        <Container1080 className="flex items-start justify-between gap-4 relative p-2 h-[calc(100vh-180px)] overflow-y-auto">
          <ProductsGrid
            ads={ads}
            isLoading={isLoading}
            title={t.mapView.title}
            showReturnButton={true}
            className={cn(filters.showMap && "max-w-md hidden md:flex")}
            gridClassName={cn(!filters.showMap && "md:grid-cols-3 lg:grid-cols-5")}
          />

          {filters.showMap && (
            <div className="flex-1 sticky top-4 h-full min-h-[500px]">
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
                className="h-full"
              />
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
                onFavorite: () => { },
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
      </section>
    </GoogleMapsProvider>
  );
};
