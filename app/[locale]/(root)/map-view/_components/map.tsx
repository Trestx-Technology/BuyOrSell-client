/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Navigation, ZoomIn, ZoomOut } from "lucide-react";
import { ICONS } from "@/constants/icons";

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
    location?: string;
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
  const infoWindowsRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google?.maps?.Map) {
        setIsLoading(false);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Wait a bit to ensure maps API is fully initialized
        setTimeout(() => {
          if (window.google?.maps?.Map) {
            setIsLoading(false);
          } else {
            console.error("Google Maps API not fully loaded");
            setIsLoading(false);
          }
        }, 100);
      };
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
    if (!window.google?.maps?.Map || !mapRef.current || isLoading) return;

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
    if (!map || !window.google?.maps?.Marker) return;

    // Clear existing markers and info windows
    googleMarkers.forEach((marker) => marker.setMap(null));
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close());

    // Create new markers
    const newMarkers = markers.map((markerData) => {
      const pointerSvg = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.3 6 11.5 6 11.5s6-6.2 6-11.5c0-3.87-3.13-7-7-7z" fill="#F05A28"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      `;
      const pointerUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
        pointerSvg
      )}`;

      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
        icon: {
          url: pointerUrl,
          scaledSize: new window.google.maps.Size(28, 28),
          anchor: new window.google.maps.Point(14, 28),
        },
      });

      // Helper function to ensure image URL is valid
      const getImageUrl = (url: string | undefined): string => {
        if (!url || !url.trim()) return "";
        // If URL is already absolute, return as is
        if (url.startsWith("http://") || url.startsWith("https://")) {
          return url.trim();
        }
        // If relative URL, might need base URL (but typically should be absolute from API)
        return url.trim();
      };

      // Create styled info window content with image
      const imageUrl = getImageUrl(markerData.image);
      const hasImage = imageUrl !== "";

      // Escape HTML to prevent XSS
      const escapeHtml = (text: string) => {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
      };

      const safeTitle = escapeHtml(markerData.title || "");
      const safePrice = markerData.price ? escapeHtml(markerData.price) : "";
      const safeLocation = markerData.location
        ? escapeHtml(markerData.location)
        : "";

      const infoWindowContent = `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          max-width: 280px;
          padding: 0;
          margin: 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ">
          ${
            hasImage
              ? `
            <div style="
              width: 100%;
              height: 160px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              position: relative;
              overflow: hidden;
            ">
              <img 
                src="${imageUrl}" 
                alt="${safeTitle}"
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  display: block;
                "
                loading="lazy"
                onerror="
                  this.onerror=null;
                  this.style.display='none';
                  const parent = this.parentElement;
                  if (parent) {
                    parent.style.background='linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    parent.innerHTML='<svg width=\"48\" height=\"48\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" style=\"opacity: 0.5; margin: auto;\"><path d=\"M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z\" fill=\"white\"/></svg>';
                  }
                "
              />
            </div>
          `
              : `
            <div style="
              width: 100%;
              height: 120px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.5;">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="white"/>
              </svg>
            </div>
          `
          }
          <div style="padding: 12px; background: white;">
            <h3 style="
              font-size: 14px;
              font-weight: 600;
              color: #1f2937;
              margin: 0 0 8px 0;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            ">${safeTitle}</h3>
            ${
              safePrice
                ? `
              <div style="margin-bottom: 8px;">
                <span style="
                  font-size: 16px;
                  font-weight: 700;
                  color: #8b31e1;
                  display: inline-block;
                ">${safePrice}</span>
                <span style="
                  font-size: 12px;
                  color: #6b7280;
                  margin-left: 4px;
                ">AED</span>
              </div>
            `
                : ""
            }
            ${
              safeLocation
                ? `
              <div style="
                display: flex;
                align-items: center;
                gap: 4px;
                margin-top: 8px;
                padding-top: 8px;
                border-top: 1px solid #e5e7eb;
              ">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#6b7280"/>
                </svg>
                <span style="
                  font-size: 12px;
                  color: #6b7280;
                  line-height: 1.4;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                ">${safeLocation}</span>
              </div>
            `
                : ""
            }
          </div>
        </div>
      `;

      // Add info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 280,
      });

      // Add click listener that opens info window and calls onMarkerClick
      marker.addListener("click", () => {
        // Close all other info windows
        infoWindowsRef.current.forEach((iw) => iw.close());

        // Open this info window
        infoWindow.open(map, marker);

        // Call the marker click handler if provided
        if (onMarkerClick) {
          onMarkerClick(markerData.id);
        }
      });

      return { marker, infoWindow };
    });

    setGoogleMarkers(newMarkers.map((item) => item.marker));
    infoWindowsRef.current = newMarkers.map((item) => item.infoWindow);
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
