/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface LocationSectionProps {
  adId: string;
}

const LocationSection: React.FC<LocationSectionProps> = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [, setMap] = useState<any>(null);
  const [, setMarker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setMapTimeout] = useState(false);

  // Mock data - replace with actual API call
  const locationData = {
    address: "Business Bay, Dubai, UAE",
    coordinates: {
      lat: 25.1972,
      lng: 55.2744,
    },
  };

  // Load Google Maps script
  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log("Map loading timeout reached");
      setMapTimeout(true);
      setIsLoading(false);
    }, 10000); // 10 second timeout

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        console.log("Google Maps already loaded");
        clearTimeout(timeout);
        setIsLoading(false);
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="maps.googleapis.com"]'
      );
      if (existingScript) {
        console.log("Google Maps script already exists, waiting for load");
        existingScript.addEventListener("load", () => {
          console.log("Existing script loaded");
          clearTimeout(timeout);
          setIsLoading(false);
        });
        return;
      }

      console.log("Loading Google Maps script...");
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps script loaded successfully");
        clearTimeout(timeout);
        setIsLoading(false);
      };
      script.onerror = (err) => {
        console.error("Failed to load Google Maps:", err);
        clearTimeout(timeout);
        setError("Failed to load Google Maps. Please check your API key.");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => clearTimeout(timeout);
  }, []); // Empty dependency array - only run once

  // Initialize map - only when not loading and Google Maps is available
  useEffect(() => {
    console.log("Map init effect triggered:", {
      hasGoogle: !!window.google,
      hasMapRef: !!mapRef.current,
      isLoading,
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY ? "Present" : "Missing",
    });

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
        `Failed to initialize map: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }, [isLoading]); // Only depend on isLoading, not on coordinates/address to prevent re-renders

  const handleViewInMap = () => {
    // Open Google Maps in new tab
    const url = `https://www.google.com/maps?q=${locationData.coordinates.lat},${locationData.coordinates.lng}`;
    window.open(url, "_blank");
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

  return (
    <div className=" bg-white rounded-xl border border-gray-200 shadow-sm p-4">
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

        {/* Map Action Button */}
        {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={handleViewInMap}
            size="sm"
            className="bg-white text-purple-600 border border-gray-300 hover:bg-gray-50 flex items-center gap-2 shadow-md"
          >
            <MapPin className="h-4 w-4" />
            View in Map
          </Button>
        </div> */}
      </div>

      {/* Location Details */}
      {/* <div className="flex items-center gap-2 text-gray-600">
        <MapPin className="h-4 w-4 text-purple-600" />
        <span className="text-sm">{locationData.address}</span>
      </div> */}
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
