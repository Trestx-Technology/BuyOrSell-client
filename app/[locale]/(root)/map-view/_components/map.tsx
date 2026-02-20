"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { MapPin, Navigation, ZoomIn, ZoomOut, Square, Trash2 } from "lucide-react";
import { UI_ICONS } from "@/constants/icons";
import { useGoogleMaps } from "@/components/providers/google-maps-provider";

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
  onBoundsChange?: (center: { lat: number; lng: number }, radius: number) => void;
  onAreaSelect?: (markerIds: string[], polygonPath: { lat: number; lng: number }[]) => void;
  onClearGeofence?: () => void;
  initialPolygonPath?: { lat: number; lng: number }[];
  isGeofenceActive?: boolean;
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
  onBoundsChange,
  onAreaSelect,
  onClearGeofence,
  initialPolygonPath,
  isGeofenceActive,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [googleMarkers, setGoogleMarkers] = useState<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const { isLoaded } = useGoogleMaps();
  const { theme } = useTheme();
  const isLoading = !isLoaded;

  // Polygon drawing state
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawnPolygons, setDrawnPolygons] = useState<any[]>([]);
  const drawingManagerRef = useRef<any>(null);
  const markersRef = useRef(markers);

  // Keep markers ref in sync
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || map || !window.google?.maps?.Map) return;

    // Use default center if prop is undefined, but avoid dependency issues
    const initialCenter = center || { lat: 25.2048, lng: 55.2708 };

    const darkStyles = [
      { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
      { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
      { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
      { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
      { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
      { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
      { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
      { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
      { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
      { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
      { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
      { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
      { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
      { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
      { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
      { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
      { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
      { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
    ];

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom,
      styles: theme === "dark" ? darkStyles : [
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
      gestureHandling: "greedy",
    });

    setMap(mapInstance);
  }, [isLoaded, theme]); // Added theme to dependencies to redraw when theme changes

  // Initialize Drawing Manager
  useEffect(() => {
    if (!map || !window.google?.maps?.drawing?.DrawingManager) return;

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: false,
      polygonOptions: {
        fillColor: "#8b31e1",
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: "#8b31e1",
        clickable: true,
        editable: true,
        zIndex: 1,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    // Listen for polygon complete
    window.google.maps.event.addListener(
      drawingManager,
      "polygoncomplete",
      (polygon: any) => {
        // Disable drawing mode after polygon is drawn
        setIsDrawingMode(false);
        drawingManager.setDrawingMode(null);

        // Add the polygon to state
        setDrawnPolygons((prev) => [...prev, polygon]);

        // Get the path of the polygon
        const path = polygon.getPath();
        const polygonPath: { lat: number; lng: number }[] = [];
        for (let i = 0; i < path.getLength(); i++) {
          const point = path.getAt(i);
          polygonPath.push({ lat: point.lat(), lng: point.lng() });
        }

        // Calculate center and radius for backend search
        const bounds = new window.google.maps.LatLngBounds();
        for (let i = 0; i < path.getLength(); i++) bounds.extend(path.getAt(i));
        const center = bounds.getCenter();
        const ne = bounds.getNorthEast();
        const radius = window.google.maps.geometry.spherical.computeDistanceBetween(center, ne);

        // Find markers inside the polygon
        const markersInside = findMarkersInsidePolygon(polygon, markersRef.current);

        // Call the callback with marker IDs and polygon path
        if (onAreaSelect) {
          onAreaSelect(
            markersInside.map((m) => m.id),
            polygonPath
          );
        }

        // Trigger backend search for this area
        if (onBoundsChange) {
          onBoundsChange({ lat: center.lat(), lng: center.lng() }, radius);
        }

        // Add click listener to polygon for re-selection
        polygon.addListener("click", () => {
          const markersInside = findMarkersInsidePolygon(polygon, markersRef.current);
          if (onAreaSelect) {
            const path = polygon.getPath();
            const polygonPath: { lat: number; lng: number }[] = [];
            for (let i = 0; i < path.getLength(); i++) {
              const point = path.getAt(i);
              polygonPath.push({ lat: point.lat(), lng: point.lng() });
            }
            onAreaSelect(
              markersInside.map((m) => m.id),
              polygonPath
            );
          }
        });

        // Listen for path changes (when user edits the polygon)
        const pathChangedListener = () => {
          const markersInside = findMarkersInsidePolygon(polygon, markersRef.current);
          if (onAreaSelect) {
            const path = polygon.getPath();
            const polygonPath: { lat: number; lng: number }[] = [];
            for (let i = 0; i < path.getLength(); i++) {
              const point = path.getAt(i);
              polygonPath.push({ lat: point.lat(), lng: point.lng() });
            }
            onAreaSelect(
              markersInside.map((m) => m.id),
              polygonPath
            );
          }
        };

        polygon.getPath().addListener("set_at", pathChangedListener);
        polygon.getPath().addListener("insert_at", pathChangedListener);
        polygon.getPath().addListener("remove_at", pathChangedListener);
      }
    );

    // Listen for circle complete
    window.google.maps.event.addListener(
      drawingManager,
      "circlecomplete",
      (circle: any) => {
        setIsDrawingMode(false);
        drawingManager.setDrawingMode(null);

        const center = circle.getCenter();
        const radius = circle.getRadius();

        // Convert circle to a polygon for frontend persistence? 
        // For now, let's just trigger the search
        if (onBoundsChange) {
          onBoundsChange({ lat: center.lat(), lng: center.lng() }, radius);
        }

        // Remove the temporary circle overlay as we deal in payloads
        circle.setMap(null);
      }
    );

    return () => {
      if (drawingManager) {
        drawingManager.setMap(null);
      }
    };
  }, [map, onAreaSelect]);

  // Handle Initial Polygon Path / Polygon Persistence
  useEffect(() => {
    if (!map || !initialPolygonPath || initialPolygonPath.length === 0 || !window.google?.maps?.Polygon) return;

    // Check if this path is already drawn to avoid duplicates
    // (Simplistic check: just check first point)
    const isAlreadyDrawn = drawnPolygons.some(p => {
      const firstPoint = p.getPath().getAt(0);
      return firstPoint.lat() === initialPolygonPath[0].lat && firstPoint.lng() === initialPolygonPath[0].lng;
    });

    if (isAlreadyDrawn) return;

    const polygon = new window.google.maps.Polygon({
      paths: initialPolygonPath,
      fillColor: "#8b31e1",
      fillOpacity: 0.3,
      strokeWeight: 2,
      strokeColor: "#8b31e1",
      clickable: true,
      editable: true,
      zIndex: 1,
      map: map
    });

    setDrawnPolygons(prev => [...prev, polygon]);

    // Setup listeners for the new polygon
    const updateSelection = () => {
      const markersInside = findMarkersInsidePolygon(polygon, markersRef.current);
      if (onAreaSelect) {
        const path = polygon.getPath();
        const coords: { lat: number; lng: number }[] = [];
        for (let i = 0; i < path.getLength(); i++) {
          coords.push({ lat: path.getAt(i).lat(), lng: path.getAt(i).lng() });
        }
        onAreaSelect(markersInside.map(m => m.id), coords);
      }
    };

    polygon.addListener("click", updateSelection);
    polygon.getPath().addListener("set_at", updateSelection);
    polygon.getPath().addListener("insert_at", updateSelection);
    polygon.getPath().addListener("remove_at", updateSelection);
  }, [map, initialPolygonPath, onAreaSelect]);

  // Function to check if a point is inside a polygon
  const findMarkersInsidePolygon = (
    polygon: any,
    allMarkers: typeof markers
  ) => {
    if (!window.google?.maps?.geometry?.poly) return [];

    return allMarkers.filter((marker) => {
      const point = new window.google.maps.LatLng(
        marker.position.lat,
        marker.position.lng
      );
      return window.google.maps.geometry.poly.containsLocation(
        point,
        polygon
      );
    });
  };

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    if (!drawingManagerRef.current) return;

    const newDrawingMode = !isDrawingMode;
    setIsDrawingMode(newDrawingMode);

    if (newDrawingMode) {
      drawingManagerRef.current.setDrawingMode(
        window.google.maps.drawing.OverlayType.POLYGON
      );
    } else {
      drawingManagerRef.current.setDrawingMode(null);
    }
  };

  // Clear all polygons
  const clearPolygons = () => {
    drawnPolygons.forEach((polygon) => {
      polygon.setMap(null);
    });
    setDrawnPolygons([]);
    setHasMapMoved(false);
    if (onAreaSelect) {
      onAreaSelect([], []);
    }
    if (onClearGeofence) {
      onClearGeofence();
    }
  };

  // Handle center updates
  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);

  // Handle zoom updates
  useEffect(() => {
    if (map && zoom) {
      map.setZoom(zoom);
    }
  }, [map, zoom]);

  // Handle map click listener
  useEffect(() => {
    if (!map || !onMapClick) return;

    const listener = map.addListener("click", (event: any) => {
      onMapClick({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [map, onMapClick]);

  // Track if map has moved from initial view to show "Search this area" button
  const [hasMapMoved, setHasMapMoved] = useState(false);
  const initialLoadRef = useRef(true);

  // Sync markers ref
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  // Handle map idle event to detect movement
  useEffect(() => {
    if (!map) return;

    const listener = map.addListener("idle", () => {
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        return;
      }
      setHasMapMoved(true);
    });

    return () => {
      window.google.maps.event.removeListener(listener);
    };
  }, [map]);

  const handleManualSearch = () => {
    if (!map || !onBoundsChange || !window.google?.maps?.geometry?.spherical) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const currentCenter = bounds.getCenter();
    const ne = bounds.getNorthEast();
    const radius = window.google.maps.geometry.spherical.computeDistanceBetween(
      currentCenter,
      ne
    );

    onBoundsChange({ lat: currentCenter.lat(), lng: currentCenter.lng() }, radius);
    setHasMapMoved(false); // Hide the button after search
  };

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
          url: UI_ICONS.Map,
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
          ${hasImage
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
            ${safePrice
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
            ${safeLocation
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

      {/* Manual Search Button */}
      {hasMapMoved && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={handleManualSearch}
            className="bg-white text-purple-600 px-4 py-2 rounded-full shadow-xl border border-purple-100 font-medium text-sm flex items-center gap-2 hover:bg-purple-50 transition-all transform active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            Search in this area
          </button>
        </div>
      )}

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

        {/* Divider */}
        <div className="h-px bg-gray-200 my-1"></div>

        {/* Drawing Mode Toggle */}
        <button
          onClick={toggleDrawingMode}
          className={cn(
            "w-10 h-10 rounded-lg shadow-lg flex items-center justify-center transition-colors",
            isDrawingMode
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-white hover:bg-gray-50 text-gray-700"
          )}
          title={isDrawingMode ? "Stop Drawing" : "Draw Area"}
        >
          <Square className="w-5 h-5" />
        </button>

        {/* Clear Polygons */}
        {(drawnPolygons.length > 0 || isGeofenceActive) && (
          <button
            onClick={clearPolygons}
            className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-red-50 text-red-600 transition-colors"
            title="Clear Area Search"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
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
        {drawnPolygons.length > 0 && (
          <div className="text-xs text-purple-600 mt-1">
            {drawnPolygons.length} area{drawnPolygons.length > 1 ? "s" : ""} selected
          </div>
        )}
      </motion.div>

      {/* Drawing Instructions */}
      {isDrawingMode && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-4 bg-purple-600 text-white rounded-lg shadow-lg px-4 py-3 max-w-xs"
        >
          <p className="text-sm font-medium">Drawing Mode Active</p>
          <p className="text-xs mt-1 opacity-90">
            Click on the map to draw a polygon. Click the first point again to complete.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}