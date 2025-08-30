"use client";

import React, { useState, useMemo } from "react";
import MapViewFilter from "./_components/map-view-filter";
import ProductsGrid from "./_components/products-grid";
import Map from "./_components/map";
import { sampleListings } from "@/constants/sample-listings";

const MapView = () => {
  const [showMap] = useState(true);

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

  return (
    <section className="w-full">
      {/* Filter Section */}
      <div className="w-full border mb-2">
        <MapViewFilter />
      </div>

      {/* Main Content */}
      <div className="flex items-start max-w-[1080px] justify-between mx-auto gap-4 h-[calc(100vh-130px)]">
        {/* Products Grid */}

        <ProductsGrid
          products={sampleListings}
          title="Properties for sale in UAE"
          showReturnButton={true}
        />

        {/* Map Section */}
        {showMap && (
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
    </section>
  );
};

export default MapView;
