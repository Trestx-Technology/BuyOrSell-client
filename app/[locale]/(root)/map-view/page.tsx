"use client";

import React, { useState, useMemo, useEffect } from "react";
import MapViewFilter, { MapViewFilters } from "./_components/map-view-filter";
import ProductsGrid from "./_components/products-grid";
import Map from "./_components/map";
import { cn } from "@/lib/utils";
import { HorizontalCarouselSlider } from "@/components/global/horizontal-carousel-slider";
import Navbar from "@/components/global/Navbar";
import { Footer } from "@/components/global/footer";
import { useAds, useFilterAds } from "@/hooks/useAds";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { useSearchParams } from "next/navigation";
import { normalizeExtraFieldsToArray } from "@/utils/normalize-extra-fields";
import { AdFilterPayload, ProductExtraFields } from "@/interfaces/ad";

const MapView = () => {
  const { t } = useLocale();
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const emirate = searchParams.get("emirate");
  const [filters, setFilters] = useState<MapViewFilters>({
    location: "",
    price: "",
    datePosted: "",
    priceFrom: "",
    priceTo: "",
    deal: undefined,
    fromDate: "",
    toDate: "",
    isFeatured: undefined,
    hasVideo: undefined,
    showMap: true,
    extraFields: {},
  });

  // Store extraFields in state so filters persist even when no ads are found
  const [savedExtraFields, setSavedExtraFields] = useState<ProductExtraFields>([]);

  // Clear saved extraFields when category changes
  useEffect(() => {
    if (!category) {
      setSavedExtraFields([]);
    }
  }, [category]);

  // Transform filters to API payload format
  const filterPayload = useMemo((): AdFilterPayload => {
    const payload: AdFilterPayload = {
      // page: 1,
      // limit: 50,
    };

    // Basic filters
    if (category) payload.category = category;
    if (emirate) payload.neighbourhood = emirate;
    if (filters.location) payload.city = filters.location;
    
    // Price filters - use priceFrom/priceTo if provided, otherwise parse price range
    if (filters.priceFrom) {
      payload.priceFrom = Number(filters.priceFrom);
    }
    if (filters.priceTo) {
      payload.priceTo = Number(filters.priceTo);
    }
    
    // Handle preset price ranges if priceFrom/priceTo not set
    if (!filters.priceFrom && !filters.priceTo && filters.price) {
      // Parse preset price ranges (e.g., "Under 500K", "500K - 1M")
      const priceRange = filters.price;
      if (priceRange.includes("Under")) {
        const match = priceRange.match(/(\d+)/);
        if (match) {
          const value = parseInt(match[1]) * 1000; // Convert K to actual number
          payload.priceTo = value;
        }
      } else if (priceRange.includes("+")) {
        const match = priceRange.match(/(\d+)/);
        if (match) {
          const value = parseInt(match[1]) * 1000;
          payload.priceFrom = value;
        }
      } else if (priceRange.includes("-")) {
        const matches = priceRange.match(/(\d+)\s*[KM]?\s*-\s*(\d+)\s*[KM]?/);
        if (matches) {
          const from = parseInt(matches[1]) * (priceRange.includes("M") ? 1000000 : 1000);
          const to = parseInt(matches[2]) * (priceRange.includes("M") ? 1000000 : 1000);
          payload.priceFrom = from;
          payload.priceTo = to;
        }
      }
    }
    
    // Boolean filters
    if (filters.deal !== undefined) payload.deal = filters.deal;
    if (filters.isFeatured !== undefined) payload.isFeatured = filters.isFeatured;
    if (filters.hasVideo !== undefined) payload.hasVideo = filters.hasVideo;
    
    // Date filters
    if (filters.fromDate) {
      payload.fromDate = new Date(filters.fromDate).toISOString();
    }
    if (filters.toDate) {
      payload.toDate = new Date(filters.toDate).toISOString();
    }
    
    // Handle datePosted filter (convert to fromDate/toDate range)
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
          fromDate = new Date(0); // Beginning of time
      }
      
      payload.fromDate = fromDate.toISOString();
      payload.toDate = now.toISOString();
    }
    
    // ExtraFields filters
    if (filters.extraFields && Object.keys(filters.extraFields).length > 0) {
      payload.extraFields = filters.extraFields;
    }

    return payload;
  }, [category, emirate, filters]);

  // Check if any filters are selected (excluding showMap, category, and emirate)
  // Category and emirate are URL params, not user-selected filters
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.location ||
      filters.price ||
      filters.datePosted ||
      filters.priceFrom ||
      filters.priceTo ||
      filters.deal !== undefined ||
      filters.fromDate ||
      filters.toDate ||
      filters.isFeatured !== undefined ||
      filters.hasVideo !== undefined ||
      (filters.extraFields && Object.keys(filters.extraFields).length > 0)
    );
  }, [filters]);

  // Use filter API if filters are selected, otherwise use regular ads API
  const { data: filterAdsData, isLoading: isFilterLoading } = useFilterAds(
    filterPayload,
    1, // page
    50, // limit
    hasActiveFilters
  );
  
  const { data: regularAdsData, isLoading: isRegularLoading } = useAds(
    hasActiveFilters ? undefined : {
      limit: 50,
      page: 1,
      category: category || "",
      neighbourhood: emirate || "",
    }
  );

  // Use filter results if filters are active, otherwise use regular ads
  const adsData = hasActiveFilters ? filterAdsData : regularAdsData;
  const isLoading = hasActiveFilters ? isFilterLoading : isRegularLoading;

  const ads = useMemo(() => adsData?.data?.adds || [], [adsData?.data?.adds]);

  // Get extraFields from the first ad if category is selected
  // This gives us the field structure with optionalArray for filter options
  const categoryExtraFields = useMemo(() => {
    // Only get extraFields from first ad if category is selected and ads exist
    if (category && ads.length > 0 && ads[0].extraFields) {
      return normalizeExtraFieldsToArray(ads[0].extraFields);
    }
    // If no ads but we have saved extraFields, use those
    if (savedExtraFields.length > 0) {
      return savedExtraFields;
    }
    return [];
  }, [category, ads, savedExtraFields]);

  // Save extraFields to state when they're found (separate from useMemo to avoid re-render loop)
  useEffect(() => {
    if (category && ads.length > 0 && ads[0].extraFields) {
      const normalized = normalizeExtraFieldsToArray(ads[0].extraFields);
      if (normalized.length > 0) {
        setSavedExtraFields(normalized);
      }
    }
  }, [category, ads]);

  const mapMarkers = useMemo(() => {
    return ads.map((ad) => {
      // Default Dubai coordinates
      let lat = 25.2048;
      let lng = 55.2708;

      // Helper function to extract coordinates from AdLocation object
      const extractCoordinates = (locationData: typeof ad.location | typeof ad.address): void => {
        if (typeof locationData === "object" && locationData?.coordinates) {
          const coords = locationData.coordinates;
          
          // Check if coordinates is a valid number array (not null)
          if (Array.isArray(coords) && coords.length >= 2) {
            // GeoJSON format is [lng, lat]
            const [lngCoord, latCoord] = coords;
            
            // Validate that both are numbers and not NaN
            if (typeof lngCoord === "number" && typeof latCoord === "number" && 
                !isNaN(lngCoord) && !isNaN(latCoord)) {
              lat = latCoord;
              lng = lngCoord;
            }
          }
        }
      };

      // Check location field first, then address field
      extractCoordinates(ad.location);
      
      // If no coordinates found in location, check address field
      if (lat === 25.2048 && lng === 55.2708) {
        extractCoordinates(ad.address);
      }

      // Only use default coordinates if no valid coordinates found
      // Do NOT generate random coordinates to prevent markers from moving on refresh

      // Get location string for tooltip
      const locationString = typeof ad.location === "string" 
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
        location: locationString,
      };
    });
  }, [ads]);

  const handleMarkerClick = (markerId: string) => {
    console.log("Marker clicked:", markerId);
    // Here you could scroll to the corresponding listing or show details
  };

  const handleMapClick = (position: { lat: number; lng: number }) => {
    console.log("Map clicked at:", position);
    // Here you could add a new marker or perform other actions
  };

  const handleFilterChange = (filters: MapViewFilters) => {
    setFilters(filters);
  };

  return (
    <section className="w-full relative mb-2">
      <Navbar />
      {/* Filter Section */}
      <div className="w-full border mb-2">
        <MapViewFilter 
          extraFields={categoryExtraFields}
          onFilterChange={handleFilterChange} 
        />
      </div>

      {/* Main Content */}
      <div className="flex items-start max-w-[1080px] justify-between mx-auto gap-4 xl:px-0 px-5 relative">
        {/* Products Grid */}
        <ProductsGrid
          ads={ads}
          isLoading={isLoading}
          title={t.mapView.title}
          showReturnButton={true}
          className={cn(
            "w-full flex-shrink-0",
            filters.showMap && "max-w-sm hidden md:block md:overflow-y-auto"
          )}
          gridClassName={cn(
            "grid-cols-1 md:grid-cols-2",
            !filters.showMap && "md:grid-cols-5"
          )}
        />

        {/* Map Section */}
        {filters.showMap && (
          <div className="w-full sticky top-4 h-[calc(100vh-130px)]">
            <Map
              markers={mapMarkers}
              onMarkerClick={handleMarkerClick}
              onMapClick={handleMapClick}
              center={{ lat: 25.2048, lng: 55.2708 }}
              zoom={12}
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
              isFavorite: transformed.isFavorite || false,
              onFavorite: () => {},
            };
          })}
          showNavigation={false}
          autoScroll={false}
          autoScrollInterval={4000}
          cardWidth={280}
          gap={16}
          showScrollbar={true}
          className="md:hidden "
        />
      </div>
      <Footer />
      {/* Horizontal Carousel Slider at Bottom */}
    </section>
  );
};

export default MapView;
