"use client";

import React, { useState, useCallback } from "react";
import { ResponsiveDialogDrawer } from "@/components/ui/responsive-dialog-drawer";
import Map from "@/app/[locale]/(root)/map-view/_components/map"; // Updated import
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";

interface LocationSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
  }) => void;
}

export function LocationSelectorDialog({
  open,
  onOpenChange,
  onLocationSelect,
}: LocationSelectorDialogProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    coordinates: { lat: number; lng: number };
  } | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const getAddressFromCoordinates = useCallback(
    async (lat: number, lng: number) => {
      try {
        if (!window.google || !window.google.maps) {
          console.warn("Google Maps not loaded yet");
          return "Unknown Location";
        }

        const geocoder = new window.google.maps.Geocoder();
        const result = await geocoder.geocode({ location: { lat, lng } });

        if (result.results && result.results.length > 0) {
          return result.results[0].formatted_address;
        }
        return "Unknown Location";
      } catch (err) {
        console.error("Geocoding error:", err);
        return "Unknown Location";
      }
    },
    []
  );

  const handleMapClick = async (position: { lat: number; lng: number }) => {
    setIsGeocoding(true);
    // Optimistically set coordinates with placeholder address
    setSelectedLocation({
      coordinates: position,
      address: "Loading address...",
    });

    try {
      const address = await getAddressFromCoordinates(position.lat, position.lng);
      setSelectedLocation({
        coordinates: position,
        address,
      });
    } catch (error) {
      toast.error("Failed to get address for this location");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onOpenChange(false);
    }
  };

  const markers = selectedLocation
    ? [
      {
        id: "selected",
        position: selectedLocation.coordinates,
        title: selectedLocation.address || "Selected Location",
      },
    ]
    : [];

  return (
    <ResponsiveDialogDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Select Location"
      description="Tap on the map to select a location to send."
      dialogContentClassName="sm:max-w-[700px] w-full"
      drawerContentClassName="h-[90dvh]"
    >
      <GoogleMapsProvider>

        <div className="flex flex-col h-full p-4 md:h-auto gap-4">
        <div className="flex-1 min-h-[400px] w-full relative rounded-lg overflow-hidden border border-gray-200">
          <Map
            className="w-full h-full min-h-[400px]"
            onMapClick={handleMapClick}
            markers={markers}
            center={selectedLocation?.coordinates} // Option to center on selection or keep default
            />
        </div>

        {selectedLocation && (
          <div className="text-sm text-gray-600 px-1">
            <span className="font-medium">Selected:</span> {selectedLocation.address}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedLocation || isGeocoding}
            className="bg-purple text-white hover:bg-purple/90"
            >
            {isGeocoding ? "Locating..." : "Send Location"}
          </Button>
        </div>
      </div>
      </GoogleMapsProvider>
    </ResponsiveDialogDrawer>
  );
}
