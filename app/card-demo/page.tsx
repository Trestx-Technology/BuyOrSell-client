"use client";

import React, { useState } from "react";
import Card from "@/components/ui/card";
import { sampleListings, ListingItem } from "@/constants/sample-listings";

const CardDemoPage = () => {
  const [listings, setListings] = useState<ListingItem[]>(sampleListings);

  const handleFavoriteToggle = (id: string) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id
          ? { ...listing, isFavorite: !listing.isFavorite }
          : listing
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Card Component Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This demonstrates the new card component that matches the car
            listing design. Each card includes all the elements: price,
            discount, specifications, location, and favorite functionality.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              {...listing}
              onFavoriteToggle={handleFavoriteToggle}
              className="w-full"
            />
          ))}
        </div>

        {/* Features Showcase */}
        <div className="mt-16 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Card Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Visual Elements
              </h3>
              <ul className="space-y-1">
                <li>• High-quality image with favorite heart icon</li>
                <li>• Current price with optional original price</li>
                <li>• Discount badge when applicable</li>
                <li>• Location with map pin icon</li>
                <li>• Specification grid with icons</li>
                <li>• Time ago timestamp</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Interactive Features
              </h3>
              <ul className="space-y-1">
                <li>• Clickable favorite button</li>
                <li>• Hover effects and animations</li>
                <li>• Responsive design</li>
                <li>• Optional link functionality</li>
                <li>• Customizable styling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDemoPage;
