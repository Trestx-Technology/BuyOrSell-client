"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Navigation, ZoomIn, ZoomOut } from "lucide-react";

export interface MapProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    position: { lat: number; lng: number };
    title: string;
    price?: string;
    image?: string;
  }>;
  onMarkerClick?: (markerId: string) => void;
  onMapClick?: (position: { lat: number; lng: number }) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function Map({
  className,
  center = { lat: 25.2048, lng: 55.2708 }, // Dubai coordinates
  zoom = 12,
  markers = [],
  onMarkerClick,
  onMapClick,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [googleMarkers, setGoogleMarkers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoading(false);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoading(false);
      script.onerror = () => {
        console.error("Failed to load Google Maps");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!window.google || !mapRef.current || isLoading) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(mapInstance);

    // Add click listener to map
    if (onMapClick) {
      mapInstance.addListener("click", (event: any) => {
        onMapClick({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });
      });
    }
  }, [center, zoom, isLoading, onMapClick]);

  // Update markers
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    googleMarkers.forEach((marker) => marker.setMap(null));

    // Create new markers
    const newMarkers = markers.map((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
        icon: {
          url:
            "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#8B31E1"/>
              <circle cx="20" cy="20" r="16" fill="white"/>
              <circle cx="20" cy="20" r="12" fill="#8B31E1"/>
              <text x="20" y="24" text-anchor="middle" fill="white" font-size="12" font-weight="bold">$</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(40, 40),
          anchor: new window.google.maps.Point(20, 20),
        },
      });

      // Add click listener
      if (onMarkerClick) {
        marker.addListener("click", () => {
          onMarkerClick(markerData.id);
        });
      }

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-[200px]">
            <h3 class="font-semibold text-sm mb-1">${markerData.title}</h3>
            ${markerData.price ? `<p class="text-green-600 font-medium">${markerData.price}</p>` : ""}
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setGoogleMarkers(newMarkers);
  }, [map, markers, onMarkerClick]);

  // Map controls
  const handleZoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const handleCenterMap = () => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        duration: 0.6,
      },
    },
  };

  const controlsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 22,
        duration: 0.5,
        delay: 0.2,
      },
    },
  };

  if (isLoading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "w-full h-full bg-gray-100 rounded-lg flex items-center justify-center",
          className
        )}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative w-full h-[600px] rounded-lg overflow-hidden",
        className
      )}
    >
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Controls */}
      <motion.div
        variants={controlsVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-4 right-4 flex flex-col gap-2"
      >
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleCenterMap}
          className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Center Map"
        >
          <Navigation className="w-5 h-5 text-gray-700" />
        </button>
      </motion.div>

      {/* Map Info */}
      <motion.div
        variants={controlsVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-2"
      >
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-purple-600" />
          <span>Dubai, UAE</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {markers.length} properties found
        </div>
      </motion.div>
    </motion.div>
  );
}
