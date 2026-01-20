"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface LocationMessageProps {
  latitude: number;
  longitude: number;
  address?: string;
  placeName?: string;
  timestamp?: string;
  showMap?: boolean;
}

export default function LocationMessage({
  latitude,
  longitude,
  address,
  placeName = "Shared Location",
  timestamp,
  showMap = true, // Default to true for better UX
}: LocationMessageProps) {
  const [isExpanded, setIsExpanded] = useState(showMap);

  // Get map image from server endpoint
  const mapImageUrl = `/api/map-image?lat=${latitude}&lng=${longitude}`;

  // Generate Google Maps link
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className="max-w-xs sm:max-w-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-zinc-800 hover:shadow-md transition-shadow">
        {/* Map Preview */}
        {isExpanded && (
          <div className="relative w-full h-32 sm:h-40 bg-gray-100 dark:bg-zinc-800 overflow-hidden">
            {/* Using Next.js Image for optimization, but handling the dynamic URL */}
            <Image
              src={mapImageUrl}
              alt="Location map"
              fill
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
        )}

        {/* Location Details */}
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                {placeName}
              </h3>
              {/* {address && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {address}
                </p>
              )}
              {timestamp && (
                <p className="text-[10px] text-gray-400 mt-2">
                  {timestamp}
                </p>
              )} */}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors"
            >
              {isExpanded ? "Hide Map" : "Show Map"}
            </button>
            <Link
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-5 whitespace-nowrap py-2 bg-purple text-white text-center text-xs font-medium rounded-lg hover:bg-purple/90 transition-colors"
            >
              View in Maps
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
