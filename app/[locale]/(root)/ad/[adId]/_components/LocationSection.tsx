/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { AD } from "@/interfaces/ad";
import { useGoogleMaps } from "@/components/providers/google-maps-provider";

interface LocationSectionProps {
  ad: AD;
}

const LocationSection: React.FC<LocationSectionProps> = ({ ad }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setMap] = useState<any>(null);
  const [, setMarker] = useState<any>(null);
  const { isLoaded, error: scriptError } = useGoogleMaps();
  const isLoading = !isLoaded;
  const [error, setError] = useState<string | null>(null);
  const [, setMapTimeout] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (scriptError) {
      setError("Failed to load Google Maps");
    }
  }, [scriptError]);

  // Extract location data from ad
  const getLocationAddress = (): string => {
    if (typeof ad.location === "string") {
      return ad.location;
    }
    if (ad.location?.city) {
      return `${ad.location.area || ""} ${ad.location.city} ${
        ad.location.state || ""
      } ${ad.location.country || ""}`.trim();
    }
    if (ad.address?.city) {
      return `${ad.address.area || ""} ${ad.address.city} ${
        ad.address.state || ""
      } ${ad.address.country || ""}`.trim();
    }
    return "Location not specified";
  };

  const locationData = {
    address: getLocationAddress(),
    coordinates: {
      lat:
        typeof ad.location === "object" && ad.location?.coordinates
          ? ad.location.coordinates[1] || 25.1972
          : 25.1972,
      lng:
        typeof ad.location === "object" && ad.location?.coordinates
          ? ad.location.coordinates[0] || 55.2744
          : 55.2744,
    },
  };

  // Initialize map - only when not loading, Google Maps is available, and showMap is true
  useEffect(() => {
    console.log("Map init effect triggered:", {
      hasGoogle: !!window.google,
      hasMapRef: !!mapRef.current,
      isLoading,
      showMap,
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ? "Present" : "Missing",
    });

    if (!showMap) {
      console.log("Map not requested yet");
      return;
    }

    if (!window.google || !window.google.maps) {
      console.log("Google Maps not ready yet");
      return;
    }

    if (!mapRef.current) {
      console.log("Map ref not ready");
      return;
    }

    if (isLoading) {
      console.log("Still loading");
      return;
    }

    try {
      console.log("Initializing map...");
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: locationData.coordinates.lat,
          lng: locationData.coordinates.lng,
        },
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#1D2939" }],
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }],
          },
        ],
      });

      console.log("Map created successfully");
      setMap(mapInstance);

      // Add marker
      const markerInstance = new window.google.maps.Marker({
        position: {
          lat: locationData.coordinates.lat,
          lng: locationData.coordinates.lng,
        },
        map: mapInstance,
        title: locationData.address,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#8B31E1"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
        },
      });

      console.log("Marker created successfully");
      setMarker(markerInstance);
    } catch (err) {
      console.error("Map initialization error:", err);
      setError(
        `Failed to initialize map: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, showMap]); // Re-initialize when loading state or showMap changes

  const handleViewInMap = () => {
    setShowMap(true);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-[713px] bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Typography
          variant="h3"
          className="text-base font-semibold text-dark-blue mb-6"
        >
          Product Location
        </Typography>

        {/* Map Container */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
          <div className="w-full h-[390px] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-purple-600" />
          <span className="text-sm">{locationData.address}</span>
        </div>
      </div>
    );
  }

  // Show fallback map if Google Maps fails to load after timeout
  if (!window.google && !error) {
    return (
      <div className="w-full max-w-[713px] bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Typography
          variant="h3"
          className="text-base font-semibold text-dark-blue mb-6"
        >
          Product Location
        </Typography>

        {/* Map Container */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
          <div className="w-full h-[390px] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700">
                Interactive Map
              </p>
              <p className="text-sm text-gray-500">
                Tap to select exact location
              </p>
            </div>
          </div>
        </div>

        {/* Map Action Button */}
        <div className="relative -mt-12 mb-4">
          <div className="flex justify-center">
            <Button
              onClick={handleViewInMap}
              size="sm"
              className="bg-white text-purple-600 border border-gray-300 hover:bg-gray-50 flex items-center gap-2 shadow-md"
            >
              <MapPin className="h-4 w-4" />
              View in Map
            </Button>
          </div>
        </div>

        {/* Location Details */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-purple-600" />
          <span className="text-sm">{locationData.address}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[713px] bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Typography
          variant="h3"
          className="text-base font-semibold text-dark-blue mb-6"
        >
          Product Location
        </Typography>

        {/* Map Container */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
          <div className="w-full h-[390px] rounded-lg flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-red-500 mb-2 text-2xl">⚠️</div>
              <p className="text-sm text-red-600 mb-2">{error}</p>
              {!process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY && (
                <p className="text-xs text-gray-500">
                  Please set NEXT_PUBLIC_GOOGLE_MAP_KEY in your environment
                  variables
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-purple-600" />
          <span className="text-sm">{locationData.address}</span>
        </div>
      </div>
    );
  }

  // Show button initially, map only when clicked
  if (!showMap) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <Typography
          variant="h3"
          className="text-base font-semibold text-dark-blue mb-4"
        >
          Product Location
        </Typography>

        {/* Map Preview with Blur */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
          <div className="w-full h-[390px] rounded-lg flex items-center justify-center relative">
            {/* Blurred map background */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-sm"
              style={{
                backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${locationData.coordinates.lat},${locationData.coordinates.lng}&zoom=12&size=600x400&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY})`,
              }}
            />
            {/* Button overlay */}
            <div className="relative z-10">
              <Button
                onClick={handleViewInMap}
                size="default"
                icon={<MapPin className="size-4 -mr-2" />}
                iconPosition="left"
                className="bg-white text-purple-600 border border-gray-300 hover:bg-gray-50 flex items-center gap-2 shadow-md"
              >
                View in Map
              </Button>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="h-4 w-4 text-purple-600" />
          <span className="text-sm">{locationData.address}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <Typography
        variant="h3"
        className="text-base font-semibold text-dark-blue mb-4"
      >
        Product Location
      </Typography>

      {/* Map Container */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div
          ref={mapRef}
          className="w-full h-[390px] rounded-lg"
          style={{ minHeight: "390px" }}
        />
      </div>

      {/* Location Details */}
      <div className="flex items-center gap-2 text-gray-600 mt-4">
        <MapPin className="h-4 w-4 text-purple-600" />
        <span className="text-sm">{locationData.address}</span>
      </div>
    </div>
  );
};

// Extend Window interface for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

export default LocationSection;
