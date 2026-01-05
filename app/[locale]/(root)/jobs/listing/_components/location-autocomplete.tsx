"use client";

import * as React from "react";
import { MapPin } from "lucide-react";
import { useEmirates } from "@/hooks/useLocations";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/hooks/useLocale";

interface LocationAutocompleteProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  className?: string;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Dubai",
  className,
}: LocationAutocompleteProps) {
  const { locale } = useLocale();
  const [debouncedQuery, setDebouncedQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const isTypingRef = React.useRef(false);
  const [syncValue, setSyncValue] = React.useState("");

  // Fetch emirates with search query from API
  const { data: filteredEmirates, isLoading: isLoadingEmirates } = useEmirates(
    debouncedQuery.trim() ? { search: debouncedQuery.trim() } : undefined
  );

  // Find the selected emirate to get the display name (check both filtered and potentially need all)
  const selectedEmirate = React.useMemo(() => {
    if (!filteredEmirates || !value) return null;
    return filteredEmirates.find((e) => e.emirate === value);
  }, [filteredEmirates, value]);

  // Use debounced value hook for input
  const [localQuery, setLocalQuery] = useDebouncedValue(
    syncValue,
    (value) => {
      setDebouncedQuery(value);
    },
    300
  );

  // Update sync value when external value changes (only if not typing)
  React.useEffect(() => {
    if (!isTypingRef.current) {
      if (selectedEmirate) {
        const displayName =
          locale === "ar"
            ? selectedEmirate.emirateAr || selectedEmirate.emirate
            : selectedEmirate.emirate;
        setSyncValue(displayName);
      } else if (value) {
        setSyncValue(value);
      } else {
        setSyncValue("");
      }
    }
  }, [value, selectedEmirate, locale]);

  const hasResults = filteredEmirates && filteredEmirates.length > 0;
  const shouldShowDropdown =
    isDropdownOpen &&
    localQuery.trim().length > 0 &&
    (isLoadingEmirates || hasResults || debouncedQuery.trim().length > 0);

  // Update dropdown visibility based on query and results
  React.useEffect(() => {
    if (localQuery.trim().length > 0 && !isTypingRef.current) {
      setIsDropdownOpen(true);
    }
  }, [localQuery]);

  // Close dropdown when clicking outside
  useOutsideClick(
    dropdownRef,
    (event) => {
      // Mark that we're not typing anymore
      isTypingRef.current = false;

      // Close the dropdown
      setIsDropdownOpen(false);

      // Restore input to selected emirate's display name (if selected) or value prop
      if (selectedEmirate) {
        const displayName =
          locale === "ar"
            ? selectedEmirate.emirateAr || selectedEmirate.emirate
            : selectedEmirate.emirate;
        setLocalQuery(displayName);
      } else if (value) {
        setLocalQuery(value);
      } else {
        setLocalQuery("");
      }

      setSelectedIndex(-1);
    },
    isDropdownOpen
  );

  const handleLocationSelect = (emirate: {
    emirate: string;
    emirateAr: string;
  }) => {
    // Get display name for the selected emirate
    const displayName =
      locale === "ar" ? emirate.emirateAr || emirate.emirate : emirate.emirate;

    // Mark that we're selecting (not typing)
    isTypingRef.current = false;

    // Update local query with display name
    setLocalQuery(displayName);
    // Update parent immediately with English name (for API)
    onChange(emirate.emirate);
    // Close dropdown after selection
    setIsDropdownOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (
        selectedIndex >= 0 &&
        filteredEmirates &&
        filteredEmirates[selectedIndex]
      ) {
        handleLocationSelect(filteredEmirates[selectedIndex]);
      } else {
        // If user presses Enter without selection, use current input value
        onChange(localQuery);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (filteredEmirates && filteredEmirates.length > 0) {
        setSelectedIndex((prev) =>
          prev < filteredEmirates.length - 1 ? prev + 1 : prev
        );
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (event.key === "Escape") {
      setIsDropdownOpen(false);
      setSelectedIndex(-1);
      // Close dropdown but keep input value
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isTypingRef.current = true;
    setLocalQuery(e.target.value);
    setIsDropdownOpen(true);
    setSelectedIndex(-1);
  };

  // Reset typing flag when dropdown closes
  React.useEffect(() => {
    if (!isDropdownOpen) {
      // Small delay to allow selection to process
      const timer = setTimeout(() => {
        isTypingRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isDropdownOpen]);

  const handleInputBlur = () => {
    // Small delay to allow click events to fire before closing
    setTimeout(() => {
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Input
        leftIcon={<MapPin className="h-4 w-4" />}
        placeholder={placeholder}
        value={localQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        className={className || "pl-10 bg-gray-100 border-0 flex-1"}
      />

      {shouldShowDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {isLoadingEmirates ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">Loading locations...</p>
            </div>
          ) : hasResults && filteredEmirates ? (
            <ul className="py-2">
              {filteredEmirates.map((emirate, index) => {
                const displayName =
                  locale === "ar"
                    ? emirate.emirateAr || emirate.emirate
                    : emirate.emirate;

                return (
                  <li
                    key={emirate.emirate}
                    className={`relative px-4 py-3 cursor-pointer transition-colors ${
                      selectedIndex === index
                        ? "bg-purple/10"
                        : "hover:bg-purple/10"
                    }`}
                    onClick={() => handleLocationSelect(emirate)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900">
                        {displayName}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : debouncedQuery.trim() ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">No locations found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for another emirate
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
