"use client";

import React, { useState, useMemo } from "react";
import MapViewFilter, { MapViewFilters } from "./_components/map-view-filter";
import ProductsGrid from "./_components/products-grid";
import Map from "./_components/map";
import { sampleListings } from "@/constants/sample-listings";
import { cn } from "@/lib/utils";
import { HorizontalCarouselSlider } from "@/components/global/horizontal-carousel-slider";

const MapView = () => {
  const [filters, setFilters] = useState<MapViewFilters>({
    buyType: "Buy",
    location: "",
    propertyType: "Location",
    residential: "Residential",
    bedsBaths: "",
    price: "",
    area: "",
    showMap: true,
  });
  const mapMarkers = useMemo(() => {
    return sampleListings.map((listing) => ({
      id: listing.id,
      position: {
        // Generate random coordinates around Dubai for demo purposes
        lat: 25.2048 + (Math.random() - 0.5) * 0.1,
        lng: 55.2708 + (Math.random() - 0.5) * 0.1,
      },
      title: listing.title,
      price: listing.currentPrice,
      image: typeof listing.image === "string" ? listing.image : undefined,
    }));
  }, []);

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
      {/* Filter Section */}
      <div className="w-full border mb-2">
        <MapViewFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Main Content */}
      <div className="flex items-start max-w-[1080px] justify-between mx-auto gap-4 h-[calc(100vh-130px)] xl:px-0 px-5">
        {/* Products Grid */}

        <ProductsGrid
          products={sampleListings}
          title="Properties for sale in UAE"
          showReturnButton={true}
          className={cn(
            "w-full",
            filters.showMap && "max-w-sm hidden md:block"
          )}
          gridClassName={cn(
            "grid-cols-1 md:grid-cols-2",
            !filters.showMap && "md:grid-cols-5"
          )}
        />

        {/* Map Section */}
        {filters.showMap && (
          <div className="w-full sticky top-4 h-full">
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
      </div>

      {/* Horizontal Carousel Slider at Bottom */}
      <HorizontalCarouselSlider
        items={sampleListings.slice(0, 10)} // Show first 10 items
        showNavigation={false}
        autoScroll={false}
        autoScrollInterval={4000}
        cardWidth={280}
        gap={16}
        showScrollbar={true}
        className="md:hidden "
      />
    </section>
  );
};

export default MapView;
