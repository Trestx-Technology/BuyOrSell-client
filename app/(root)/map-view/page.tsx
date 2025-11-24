"use client";

import React, { useState, useMemo } from "react";
import MapViewFilter, { MapViewFilters } from "./_components/map-view-filter";
import ProductsGrid from "./_components/products-grid";
import Map from "./_components/map";
import { sampleListings } from "@/constants/sample-listings";
import { cn } from "@/lib/utils";
import { HorizontalCarouselSlider } from "@/components/global/horizontal-carousel-slider";
import Navbar from "@/components/global/Navbar";
import { Footer } from "@/components/global/footer";

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
      <Navbar />
      {/* Filter Section */}
      <div className="w-full border mb-2">
        <MapViewFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Main Content */}
      <div className="flex items-start max-w-[1080px] justify-between mx-auto gap-4 xl:px-0 px-5 relative">
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
          items={sampleListings.slice(0, 10).map((item) => ({
            id: item.id,
            title: item.title,
            price: parseFloat(item.currentPrice.replace(/,/g, "")),
            originalPrice: item.originalPrice
              ? parseFloat(item.originalPrice.replace(/,/g, ""))
              : undefined,
            discount: item.discount
              ? typeof item.discount === "string"
                ? parseFloat(item.discount.replace("%", ""))
                : item.discount
              : undefined,
            location: item.location,
            images: [
              typeof item.image === "string" ? item.image : item.image.src,
            ],
            specifications: {
              transmission: item.transmission,
              fuelType: item.fuelType,
              mileage: item.mileage,
              year: parseInt(item.year),
            },
            postedTime: item.timeAgo.toString(),
            isFavorite: item.isFavorite,
            onFavorite: () => {},
          }))} // Show first 10 items
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
