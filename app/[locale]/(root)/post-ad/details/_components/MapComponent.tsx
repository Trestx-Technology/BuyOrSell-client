/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LocateFixed, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchableDropdownInput } from "./SearchableDropdownInput";
import { useEmirates, useAreas } from "@/hooks/useLocations";
import { useLocale } from "@/hooks/useLocale";
import { useGoogleMaps } from "@/components/providers/google-maps-provider";

declare global {
  interface Window {
    google: any;
  }
}

interface MapComponentProps {
  onLocationSelect?: (location: {
    address: string;
    coordinates: { lat: number; lng: number };
    state?: string;
    country?: string;
    zipCode?: string;
    city?: string;
    street?: string;
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const markerRef = useRef<any>(null); // Use ref instead of state
  const mapInstanceRef = useRef<any>(null); // Use ref for map
  const { isLoaded, error: scriptError } = useGoogleMaps();
  const isLoading = !isLoaded;
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmirate, setSelectedEmirate] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [showMap, setShowMap] = useState(true);

  // Use location hooks
  const { data: emirates = [], isLoading: isLoadingEmirates } = useEmirates();
  const { data: areas = [], isLoading: isLoadingAreas } =
    useAreas(selectedEmirate);
  const { locale } = useLocale();

  useEffect(() => {
    if (scriptError) {
      setError("Failed to load Google Maps");
    }
  }, [scriptError]);

  // Store areas by emirate
  const [emirateAreas, setEmirateAreas] = useState<Record<string, string[]>>(
    {}
  );

  // Update emirateAreas when areas data changes
  useEffect(() => {
    if (selectedEmirate && areas.length > 0) {
      setEmirateAreas((prev) => ({
        ...prev,
        [selectedEmirate]: areas,
      }));
    }
  }, [selectedEmirate, areas]);

  const loadingLocations = isLoadingEmirates || isLoadingAreas;
  const [quickLocations, setQuickLocations] = useState<
    { name: string; coordinates: { lat: number; lng: number } }[]
  >([]);

  // Fetch popular quick locations dynamically using Geocoder (avoids deprecated PlacesService)
  const fetchQuickLocations = useCallback(async () => {
    if (!window.google || !window.google.maps?.Geocoder) return;

    try {
      const geocoder = new window.google.maps.Geocoder();

      // Popular locations to search for in UAE
      const popularSearchTerms = [
        "Dubai Marina",
        "Downtown Dubai",
        "Burj Khalifa",
        "Jumeirah Beach",
        "Palm Jumeirah",
        "Abu Dhabi Corniche",
        "Yas Island",
        "Sharjah City",
      ];

      const locationPromises = popularSearchTerms.map(
        (
          searchTerm
        ): Promise<{
          name: string;
          coordinates: { lat: number; lng: number };
        } | null> => {
          return new Promise((resolve) => {
            geocoder.geocode(
              { address: `${searchTerm}, UAE` },
              (geocodeResults: any[], geocodeStatus: string) => {
                if (
                  geocodeStatus === window.google.maps.GeocoderStatus.OK &&
                  geocodeResults &&
                  geocodeResults.length > 0
                ) {
                  const location = geocodeResults[0].geometry.location;
                  const formattedAddress = geocodeResults[0].formatted_address;

                  // Extract a cleaner name from the formatted address if available
                  const name =
                    formattedAddress?.split(",")[0]?.trim() || searchTerm;

                  resolve({
                    name,
                    coordinates: {
                      lat: location.lat(),
                      lng: location.lng(),
                    },
                  });
                } else {
                  resolve(null);
                }
              }
            );
          });
        }
      );

      const locations = await Promise.all(locationPromises);
      const validLocations = locations.filter(
        (
          loc
        ): loc is { name: string; coordinates: { lat: number; lng: number } } =>
          loc !== null
      );

      // Limit to 6-8 most popular locations, or use fallback if none found
      if (validLocations.length > 0) {
        setQuickLocations(validLocations.slice(0, 8));
      } else {
        // Fallback to default locations if API fails
        setQuickLocations([
          { name: "Dubai Marina", coordinates: { lat: 25.0772, lng: 55.1309 } },
          {
            name: "Downtown Dubai",
            coordinates: { lat: 25.1972, lng: 55.2744 },
          },
          { name: "Jumeirah", coordinates: { lat: 25.2048, lng: 55.2708 } },
        ]);
      }
    } catch (err) {
      console.error("Error fetching quick locations:", err);
      // Fallback to default locations
      setQuickLocations([
        { name: "Dubai Marina", coordinates: { lat: 25.0772, lng: 55.1309 } },
        {
          name: "Downtown Dubai",
          coordinates: { lat: 25.1972, lng: 55.2744 },
        },
        { name: "Jumeirah", coordinates: { lat: 25.2048, lng: 55.2708 } },
      ]);
    }
  }, []);

  // Get areas for selected emirate (from hook or cached)
  const availableAreas = selectedEmirate
    ? emirateAreas[selectedEmirate] || areas
    : [];

  // Convert to options format for SearchableDropdownInput
  const emirateOptions = emirates.map((emirate) => ({
    value: emirate.emirate, // Use English name as value for consistency
    label: locale === "ar" ? emirate.emirateAr : emirate.emirate, // Show localized label
  }));

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const areaOptions = availableAreas.map((area: any) => {
    const areaName = typeof area === 'object' ? area.area : area;
    const areaNameAr = typeof area === 'object' ? area.areaAr : area;
    return {
      value: areaName,
      label: locale === "ar" ? areaNameAr || areaName : areaName,
    };
  });

  // Helper function to extract address components from Google Maps address_components
  const extractAddressComponents = useCallback((addressComponents: any[]) => {
    const components: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    } = {};

    addressComponents.forEach((component: any) => {
      const types = component.types;

      // Street address
      if (types.includes("street_number")) {
        components.street = component.long_name;
      } else if (types.includes("route")) {
        components.street = components.street
          ? `${components.street} ${component.long_name}`
          : component.long_name;
      }

      // City
      if (types.includes("locality")) {
        components.city = component.long_name;
      } else if (types.includes("sublocality") && !components.city) {
        components.city = component.long_name;
      } else if (
        types.includes("administrative_area_level_2") &&
        !components.city
      ) {
        components.city = component.long_name;
      }

      // State/Province/Emirate
      if (types.includes("administrative_area_level_1")) {
        components.state = component.long_name;
      }

      // Country
      if (types.includes("country")) {
        components.country = component.long_name;
      }

      // Postal code
      if (types.includes("postal_code")) {
        components.zipCode = component.long_name;
      }
    });

    return components;
  }, []);

  // Get address from coordinates
  const getAddressFromCoordinates = useCallback(
    async (lat: number, lng: number) => {
      try {
        if (!window.google) return;

        const geocoder = new window.google.maps.Geocoder();
        const result = await geocoder.geocode({ location: { lat, lng } });

        if (result.results && result.results.length > 0) {
          const place = result.results[0];
          const address = place.formatted_address;
          const addressComponents = extractAddressComponents(
            place.address_components || []
          );

          if (onLocationSelect) {
            onLocationSelect({
              address,
              coordinates: { lat, lng },
              ...addressComponents,
            });
          }
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        setError("Failed to get address");
      }
    },
    [onLocationSelect, extractAddressComponents]
  );



  // Fetch quick locations when Google Maps is loaded (can work without map instance)
  useEffect(() => {
    if (!isLoading && window.google) {
      fetchQuickLocations();
    }
  }, [isLoading, fetchQuickLocations]);

  // Ensure autocomplete is initialized when input is ready
  useEffect(() => {
    // Check if all prerequisites are met
    const canInitialize =
      !isLoading &&
      window.google &&
      window.google.maps &&
      window.google.maps.places &&
      searchInputRef.current &&
      !autocompleteRef.current &&
      mapInstanceRef.current;

    if (!canInitialize) {
      return;
    }

    const initializeAutocomplete = () => {
      // Double-check conditions inside the timeout
      if (!searchInputRef.current || autocompleteRef.current) return;
      if (!window.google?.maps?.places?.Autocomplete) {
        console.warn("Places Autocomplete not available yet, retrying...");
        return;
      }

      try {
        const autocomplete = new window.google.maps.places.Autocomplete(
          searchInputRef.current,
          {
            componentRestrictions: { country: "ae" },
            fields: [
              "geometry",
              "formatted_address",
              "name",
              "address_components",
              "place_id",
            ],
            types: ["geocode", "establishment"],
          }
        );

        autocomplete.bindTo("bounds", mapInstanceRef.current);

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const map = mapInstanceRef.current;

          if (!place.geometry || !place.geometry.location || !map) {
            console.warn("No geometry found for the selected place");
            return;
          }

          const location = place.geometry.location;
          const lat = location.lat();
          const lng = location.lng();

          if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
          } else {
            map.setCenter({ lat, lng });
            map.setZoom(15);
          }

          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          const newMarker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            draggable: !disabled,
            title: place.name || place.formatted_address,
            animation: window.google.maps.Animation.DROP,
          });

          markerRef.current = newMarker;

          if (!disabled) {
            newMarker.addListener("dragend", () => {
              const position = newMarker.getPosition();
              if (position) {
                getAddressFromCoordinates(position.lat(), position.lng());
              }
            });
          }

          setSearchQuery(place.formatted_address || place.name || "");

          if (place.address_components) {
            const addressComponents = place.address_components;
            const extractedComponents =
              extractAddressComponents(addressComponents);

            const emirateComponent = addressComponents.find((component: any) =>
              component.types.includes("administrative_area_level_1")
            );
            if (emirateComponent) {
              setSelectedEmirate(emirateComponent.long_name);
            }

            const areaComponent =
              addressComponents.find((component: any) =>
                component.types.includes("locality")
              ) ||
              addressComponents.find((component: any) =>
                component.types.includes("sublocality")
              );
            if (areaComponent) {
              setSelectedArea(areaComponent.long_name);
            }

            if (onLocationSelect) {
              onLocationSelect({
                address: place.formatted_address || place.name || "",
                coordinates: { lat, lng },
                ...extractedComponents,
              });
            }
          } else {
            if (onLocationSelect) {
              onLocationSelect({
                address: place.formatted_address || place.name || "",
                coordinates: { lat, lng },
              });
            }
          }
        });

        autocompleteRef.current = autocomplete;
        console.log("Autocomplete initialized successfully");
      } catch (err) {
        console.error("Error initializing autocomplete:", err);
        // Retry after a delay if initialization fails
        setTimeout(() => {
          if (!autocompleteRef.current && searchInputRef.current) {
            initializeAutocomplete();
          }
        }, 500);
      }
    };

    // Try immediate initialization first
    initializeAutocomplete();

    // Also try after a short delay as fallback
    const timer = setTimeout(() => {
      if (!autocompleteRef.current && searchInputRef.current) {
        initializeAutocomplete();
      }
    }, 200);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(
          autocompleteRef.current
        );
        autocompleteRef.current = null;
      }
    };
  }, [
    isLoading,
    disabled,
    onLocationSelect,
    getAddressFromCoordinates,
    extractAddressComponents,
  ]);

  // Initialize map and autocomplete (FIXED - removed marker from dependencies)
  useEffect(() => {
    if (!window.google || !mapRef.current || isLoading) return;
    if (mapInstanceRef.current) return; // Prevent re-initialization

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: initialLocation?.coordinates || {
          lat: 25.2048,
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

      mapInstanceRef.current = mapInstance;

      // Initialize autocomplete directly when map is ready
      // This ensures autocomplete works on initial load
      setTimeout(() => {
        if (
          searchInputRef.current &&
          !autocompleteRef.current &&
          window.google?.maps?.places?.Autocomplete
        ) {
          try {
            const autocomplete = new window.google.maps.places.Autocomplete(
              searchInputRef.current,
              {
                componentRestrictions: { country: "ae" },
                fields: [
                  "geometry",
                  "formatted_address",
                  "name",
                  "address_components",
                  "place_id",
                ],
                types: ["geocode", "establishment"],
              }
            );

            autocomplete.bindTo("bounds", mapInstance);

            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              const map = mapInstanceRef.current;

              if (!place.geometry || !place.geometry.location || !map) {
                console.warn("No geometry found for the selected place");
                return;
              }

              const location = place.geometry.location;
              const lat = location.lat();
              const lng = location.lng();

              if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
              } else {
                map.setCenter({ lat, lng });
                map.setZoom(15);
              }

              if (markerRef.current) {
                markerRef.current.setMap(null);
              }

              const newMarker = new window.google.maps.Marker({
                position: { lat, lng },
                map: map,
                draggable: !disabled,
                title: place.name || place.formatted_address,
                animation: window.google.maps.Animation.DROP,
              });

              markerRef.current = newMarker;

              if (!disabled) {
                newMarker.addListener("dragend", () => {
                  const position = newMarker.getPosition();
                  if (position) {
                    getAddressFromCoordinates(position.lat(), position.lng());
                  }
                });
              }

              setSearchQuery(place.formatted_address || place.name || "");

              if (place.address_components) {
                const addressComponents = place.address_components;
                const extractedComponents =
                  extractAddressComponents(addressComponents);

                const emirateComponent = addressComponents.find(
                  (component: any) =>
                    component.types.includes("administrative_area_level_1")
                );
                if (emirateComponent) {
                  setSelectedEmirate(emirateComponent.long_name);
                }

                const areaComponent =
                  addressComponents.find((component: any) =>
                    component.types.includes("locality")
                  ) ||
                  addressComponents.find((component: any) =>
                    component.types.includes("sublocality")
                  );
                if (areaComponent) {
                  setSelectedArea(areaComponent.long_name);
                }

                if (onLocationSelect) {
                  onLocationSelect({
                    address: place.formatted_address || place.name || "",
                    coordinates: { lat, lng },
                    ...extractedComponents,
                  });
                }
              } else {
                if (onLocationSelect) {
                  onLocationSelect({
                    address: place.formatted_address || place.name || "",
                    coordinates: { lat, lng },
                  });
                }
              }
            });

            autocompleteRef.current = autocomplete;
            console.log("Autocomplete initialized from map initialization");
          } catch (err) {
            console.error("Error initializing autocomplete from map:", err);
          }
        }
      }, 100);

      // Add initial marker if location provided
      if (initialLocation) {
        const initialMarker = new window.google.maps.Marker({
          position: initialLocation.coordinates,
          map: mapInstance,
          title: initialLocation.address,
          draggable: !disabled,
        });
        markerRef.current = initialMarker;

        if (!disabled) {
          initialMarker.addListener("dragend", () => {
            const position = initialMarker.getPosition();
            if (position) {
              getAddressFromCoordinates(position.lat(), position.lng());
            }
          });
        }
      }

      // Add click listener for new markers
      if (!disabled) {
        mapInstance.addListener("click", (event: any) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Remove existing marker
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            // Create new marker
            const newMarker = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstance,
              draggable: true,
              title: "Selected Location",
            });

            markerRef.current = newMarker;

            // Add drag listener
            newMarker.addListener("dragend", () => {
              const position = newMarker.getPosition();
              if (position) {
                getAddressFromCoordinates(position.lat(), position.lng());
              }
            });

            getAddressFromCoordinates(lat, lng);
          }
        });
      }
    } catch (err) {
      setError("Failed to initialize map");
      console.error("Map initialization error:", err);
    }
  }, [
    initialLocation,
    disabled,
    isLoading,
    onLocationSelect,
    getAddressFromCoordinates,
    extractAddressComponents,
  ]);

  const handleQuickLocation = (location: {
    name: string;
    coordinates: { lat: number; lng: number };
  }) => {
    const map = mapInstanceRef.current;
    if (map) {
      map.panTo(location.coordinates);
      map.setZoom(15);

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }

      // Create new marker
      const newMarker = new window.google.maps.Marker({
        position: location.coordinates,
        map: map,
        draggable: !disabled,
        title: location.name,
      });

      markerRef.current = newMarker;

      if (!disabled) {
        newMarker.addListener("dragend", () => {
          const position = newMarker.getPosition();
          if (position) {
            getAddressFromCoordinates(position.lat(), position.lng());
          }
        });
      }

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
          const map = mapInstanceRef.current;

          if (map) {
            map.panTo({ lat, lng });
            map.setZoom(15);

            // Remove existing marker
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            // Create new marker
            const newMarker = new window.google.maps.Marker({
              position: { lat, lng },
              map: map,
              draggable: !disabled,
              title: "Current Location",
            });

            markerRef.current = newMarker;

            if (!disabled) {
              newMarker.addListener("dragend", () => {
                const position = newMarker.getPosition();
                if (position) {
                  getAddressFromCoordinates(position.lat(), position.lng());
                }
              });
            }

            getAddressFromCoordinates(lat, lng);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
          setError(
            "Failed to get current location. Please enable location services."
          );
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  const handleEmirateSelect = (value: string | string[]) => {
    const emirate = Array.isArray(value) ? value[0] : value;
    if (!emirate) return;
    setSelectedEmirate(emirate);
    setSelectedArea(""); // Reset area when emirate changes

    // Search for the emirate and update map
    const map = mapInstanceRef.current;
    if (map && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: `${emirate}, UAE` },
        (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            map.panTo({ lat, lng });
            map.setZoom(11);

            // Remove existing marker
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            // Create new marker
            const newMarker = new window.google.maps.Marker({
              position: { lat, lng },
              map: map,
              draggable: !disabled,
              title: emirate,
            });

            markerRef.current = newMarker;

            if (!disabled) {
              newMarker.addListener("dragend", () => {
                const position = newMarker.getPosition();
                if (position) {
                  getAddressFromCoordinates(position.lat(), position.lng());
                }
              });
            }

            getAddressFromCoordinates(lat, lng);
          }
        }
      );
    }
  };

  const handleAreaSelect = (value: string | string[]) => {
    const area = Array.isArray(value) ? value[0] : value;
    if (!area) return;
    setSelectedArea(area);

    // Search for the area and update map
    const map = mapInstanceRef.current;
    if (map && selectedEmirate && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: `${area}, ${selectedEmirate}, UAE` },
        (results: any[], status: string) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            map.panTo({ lat, lng });
            map.setZoom(14);

            // Remove existing marker
            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            // Create new marker
            const newMarker = new window.google.maps.Marker({
              position: { lat, lng },
              map: map,
              draggable: !disabled,
              title: area,
            });

            markerRef.current = newMarker;

            if (!disabled) {
              newMarker.addListener("dragend", () => {
                const position = newMarker.getPosition();
                if (position) {
                  getAddressFromCoordinates(position.lat(), position.lng());
                }
              });
            }

            getAddressFromCoordinates(lat, lng);
          }
        }
      );
    }
  };

  const handleToggleMap = () => {
    setShowMap((prev) => {
      const newValue = !prev;
      // Trigger map resize when showing map to ensure proper rendering
      if (newValue && mapInstanceRef.current && window.google) {
        setTimeout(() => {
          window.google.maps.event.trigger(mapInstanceRef.current, "resize");
          // Re-center map to current marker if exists
          if (markerRef.current) {
            const position = markerRef.current.getPosition();
            if (position) {
              mapInstanceRef.current.setCenter({
                lat: position.lat(),
                lng: position.lng(),
              });
            }
          }
        }, 100);
      }
      return newValue;
    });
  };

  if (isLoading) {
    return (
      <div className={cn("w-full space-y-4", className)}>
        <div className="flex items-end justify-between">
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

        <div className="space-y-3 border rounded-lg p-4">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input placeholder="Search location" disabled />
            </div>
            <div className="space-y-2">
              <Label>Emirate</Label>
              <Input placeholder="Select Emirate" disabled />
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <Input placeholder="Select Area" disabled />
            </div>
          </div>

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
              {quickLocations.slice(5).map((location) => (
                <Button
                  key={location.name}
                  variant="ghost"
                  size="sm"
                  disabled
                  className="bg-gray-100 truncate max-w-[100px]"
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

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
        <div className="flex items-end justify-end">
          <Button
            variant={showMap ? "primary" : "ghost"}
            icon={<Map className="w-4 h-4" />}
            iconPosition="left"
            size="sm"
            disabled
            className={cn("bg-gray-100", showMap && "bg-purple text-white")}
          >
            Hide Map
          </Button>
        </div>

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
      <div className="flex items-end justify-end">
        <Button
          variant="ghost"
          icon={<Map className="w-4 h-4" />}
          iconPosition="left"
          size="sm"
          onClick={handleToggleMap}
          className={cn(
            "bg-gray-100 hover:bg-gray-200",
            !showMap && "bg-purple text-white"
          )}
        >
          {showMap ? "Hide Map" : "Show Map"}
        </Button>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                ref={searchInputRef}
                placeholder="Search location (e.g., Dubai Marina, Abu Dhabi Corniche)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={disabled}
                onKeyDown={(e) => {
                  // Prevent form submission on Enter key
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label>Emirate</Label>
              <SearchableDropdownInput
                value={selectedEmirate}
                onChange={handleEmirateSelect}
                disabled={disabled || loadingLocations}
                options={emirateOptions}
                placeholder={loadingLocations ? "Loading..." : "Select Emirate"}
              />
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <SearchableDropdownInput
                value={selectedArea}
                onChange={handleAreaSelect}
                disabled={disabled || !selectedEmirate || loadingLocations}
                options={areaOptions}
                placeholder={
                  loadingLocations
                    ? "Loading areas..."
                    : !selectedEmirate
                    ? "Select an emirate first"
                    : "Select Area"
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              icon={<LocateFixed strokeWidth={1.25} className="-mr-2" />}
              iconPosition="left"
              onClick={handleUseCurrentLocation}
              disabled={disabled}
              className="flex text-purple bg-purple/10 items-center"
            >
              Use Current Location
            </Button>
            <div className="hidden md:flex gap-2 flex-wrap">
              {quickLocations.slice(0, 10).map((location) => (
                <Button
                  key={location.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickLocation(location)}
                  disabled={disabled}
                  className="bg-gray-100 hover:bg-purple-50 hover:border-purple-300 truncate"
                >
                  {location.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Map container - always in DOM to preserve map instance, visually hidden when showMap is false */}
        <div
          ref={mapRef}
          className={cn(
            "w-full rounded-lg border border-gray-300 overflow-hidden transition-all duration-300",
            showMap ? "block" : "hidden",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{ height: showMap ? height : undefined }}
        />

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
