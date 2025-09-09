/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Crosshair,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  Target,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    google: any;
  }
}

interface MapComponentProps {
  onLocationSelect?: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  initialLocation?: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  className?: string;
  height?: string;
  disabled?: boolean;
}

export const MapComponent = ({
  onLocationSelect,
  initialLocation,
  className,
  height = "400px",
  disabled = false,
}: MapComponentProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmirate, setSelectedEmirate] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [showMap, setShowMap] = useState(true);

  // Quick location options
  const quickLocations = [
    { name: "Dubai Marina", coordinates: { lat: 25.0772, lng: 55.1309 } },
    { name: "Downtown Dubai", coordinates: { lat: 25.1972, lng: 55.2744 } },
    { name: "Jumeirah", coordinates: { lat: 25.2048, lng: 55.2708 } },
  ];

  const emirates = [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
  ];

  const areas = [
    "Downtown",
    "Marina",
    "Jumeirah",
    "Business Bay",
    "DIFC",
    "Palm Jumeirah",
    "JBR",
  ];

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
        setError("Failed to load Google Maps");
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!window.google || !mapRef.current || isLoading) return;

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: initialLocation?.coordinates || {
          lat: 25.2048, // Dubai coordinates as default
          lng: 55.2708,
        },
        zoom: 13,
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

      // Add initial marker if location provided
      if (initialLocation) {
        const initialMarker = new window.google.maps.Marker({
          position: initialLocation.coordinates,
          map: mapInstance,
          title: initialLocation.address,
          draggable: !disabled,
        });
        setMarker(initialMarker);
      }

      // Add click listener for new markers
      if (!disabled) {
        mapInstance.addListener("click", (event: any) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Remove existing marker
            if (marker) {
              marker.setMap(null);
            }

            // Create new marker
            const newMarker = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              draggable: true,
              title: "Selected Location",
            });

            setMarker(newMarker);

            // Get address from coordinates
            getAddressFromCoordinates(lat, lng);
          }
        });
      }
    } catch (err) {
      setError("Failed to initialize map");
      console.error("Map initialization error:", err);
    }
  }, [initialLocation, disabled, isLoading]);

  // Handle marker drag
  useEffect(() => {
    if (marker && !disabled && window.google) {
      const dragListener = marker.addListener("dragend", () => {
        const position = marker.getPosition();
        if (position) {
          const lat = position.lat();
          const lng = position.lng();
          getAddressFromCoordinates(lat, lng);
        }
      });

      return () => {
        window.google.maps.event.removeListener(dragListener);
      };
    }
  }, [marker, disabled]);

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      if (!window.google) return;

      const geocoder = new window.google.maps.Geocoder();
      const result = await geocoder.geocode({ location: { lat, lng } });

      if (result.results && result.results.length > 0) {
        const address = result.results[0].formatted_address;

        if (onLocationSelect) {
          onLocationSelect({
            address,
            coordinates: { lat, lng },
          });
        }
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      setError("Failed to get address");
    }
  };

  const handleQuickLocation = (location: {
    name: string;
    coordinates: { lat: number; lng: number };
  }) => {
    if (map) {
      map.panTo(location.coordinates);
      map.setZoom(15);

      // Remove existing marker
      if (marker) {
        marker.setMap(null);
      }

      // Create new marker
      const newMarker = new window.google.maps.Marker({
        position: location.coordinates,
        map: map,
        draggable: true,
        title: location.name,
      });

      setMarker(newMarker);
      getAddressFromCoordinates(
        location.coordinates.lat,
        location.coordinates.lng
      );
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);

            // Remove existing marker
            if (marker) {
              marker.setMap(null);
            }

            // Create new marker
            const newMarker = new window.google.maps.Marker({
              position: { lat, lng },
              map: map,
              draggable: true,
              title: "Current Location",
            });

            setMarker(newMarker);
            getAddressFromCoordinates(lat, lng);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className={cn("w-full space-y-4", className)}>
        {/* Header */}
        <div className="flex items-end justify-between">
          <Label className="text-sm font-medium text-gray-700">
            Location
            {<span className="text-red-500 ml-1">*</span>}
          </Label>
          <Button
            variant="ghost"
            icon={<Map className="w-4 h-4" />}
            iconPosition="left"
            size="sm"
            disabled
            className="bg-gray-100"
          >
            Hide Map
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="space-y-3 border rounded-lg p-4">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input placeholder="Search location" disabled />
            </div>
            <div className="space-y-2">
              <Label>Emirate</Label>
              <Input placeholder="Search Emirate" disabled />
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <Input placeholder="Search Area" disabled />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              icon={<LocateFixed strokeWidth={1.25} className="-mr-2" />}
              iconPosition="left"
              disabled
              className="flex text-purple bg-purple/10 items-center"
            >
              Use Current Location
            </Button>
            <div className="flex gap-2 flex-wrap">
              {quickLocations.map((location) => (
                <Button
                  key={location.name}
                  variant="ghost"
                  size="sm"
                  disabled
                  className="bg-gray-100"
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("w-full space-y-4", className)}>
        {/* Header */}
        <div className="flex items-end justify-between">
          <Label className="text-sm font-medium text-gray-700">
            Location
            {<span className="text-red-500 ml-1">*</span>}
          </Label>
          <Button
            variant="ghost"
            icon={<Map className="w-4 h-4" />}
            iconPosition="left"
            size="sm"
            disabled
            className="bg-gray-100"
          >
            Hide Map
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="space-y-3 border rounded-lg p-4">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input placeholder="Search location" disabled />
            </div>
            <div className="space-y-2">
              <Label>Emirate</Label>
              <Input placeholder="Search Emirate" disabled />
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <Input placeholder="Search Area" disabled />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              icon={<LocateFixed strokeWidth={1.25} className="-mr-2" />}
              iconPosition="left"
              disabled
              className="flex text-purple bg-purple/10 items-center"
            >
              Use Current Location
            </Button>
            <div className="flex gap-2 flex-wrap">
              {quickLocations.map((location) => (
                <Button
                  key={location.name}
                  variant="ghost"
                  size="sm"
                  disabled
                  className="bg-gray-100"
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="w-full h-64 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header */}
      <div className="flex items-end justify-between">
        <Label className="text-sm font-medium text-gray-700">
          Location
          {<span className="text-red-500 ml-1">*</span>}
        </Label>
        <Button
          variant="ghost"
          icon={<Map className="w-4 h-4" />}
          iconPosition="left"
          size="sm"
          onClick={() => setShowMap(!showMap)}
          className="bg-gray-100"
        >
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        {/* Search and Filter Controls */}
        <div className="space-y-3 ">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Search location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Emirate</Label>
              <Input
                placeholder="Search Emirate"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <Input
                placeholder="Search Area"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              icon={<LocateFixed strokeWidth={1.25} className="-mr-2" />}
              iconPosition="left"
              onClick={handleUseCurrentLocation}
              className="flex text-purple bg-purple/10 items-center"
            >
              Use Current Location
            </Button>
            <div className="flex gap-2 flex-wrap">
              {quickLocations.map((location) => (
                <Button
                  key={location.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickLocation(location)}
                  className="bg-gray-100 hover:bg-purple-50 hover:border-purple-300"
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Map Container */}
        {showMap ? (
          <div
            ref={mapRef}
            className={cn(
              "w-full rounded-lg border border-gray-300 overflow-hidden",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{ height }}
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-medium text-gray-700">
                Interactive Map
              </p>
              <p className="text-sm text-gray-500">
                Tap to select exact location
              </p>
            </div>
          </div>
        )}

        {disabled && (
          <p className="text-xs text-gray-500 text-center">
            Map is disabled. Location cannot be changed.
          </p>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
