"use client";

import React, { useState } from "react";
import { Typography } from "@/components/typography";
import ListingCard from "@/app/(root)/categories/_components/ListingCard";
import { mockAds } from "@/constants/sample-listings";
import SortAndViewControls from "@/app/(root)/post-ad/_components/SortAndViewControls";

// Sort options for seller listings
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

type ViewMode = "grid" | "list";

interface SellerListingsProps {
  sellerId: string;
}

export default function SellerListings({ sellerId }: SellerListingsProps) {
  console.log("sellerId: ", sellerId);
  // Filter ads for this specific seller (in real app, this would come from API)
  const sellerAds = mockAds;
  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("default");

  // Sort the ads
  const sortedAds = [...sellerAds].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.postedTime).getTime() - new Date(a.postedTime).getTime()
        );
      case "oldest":
        return (
          new Date(a.postedTime).getTime() - new Date(b.postedTime).getTime()
        );
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0; // Default order
    }
  });

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      {/* Desktop Header Section */}
      <div className="flex items-center justify-between mb-6">
        <Typography
          variant="lg-black-inter"
          className="font-semibold text-dark-blue flex gap-1"
        >
          Ads post{" "}
          <span className="hidden md:block">by premium auto seller</span> (
          {sortedAds.length})
        </Typography>

        {/* Sort and View Controls */}
        <SortAndViewControls
          sortOptions={sortOptions}
          sortValue={sortBy}
          onSortChange={setSortBy}
          viewMode={view}
          onViewChange={setView}
          showViewToggle={true}
          showFilterButton={false}
          size="fit"
          className="px-4 flex justify-end"
        />
      </div>

      {/* Listings Grid */}
      <div
        className={`grid gap-4 ${
          view === "list"
            ? "grid-cols-1"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {sortedAds.map((ad) => (
          <ListingCard
            key={ad.id}
            {...ad}
            onFavorite={(id) => console.log("Favorited:", id)}
            onShare={(id) => console.log("Shared:", id)}
            onClick={(id) => console.log("Clicked:", id)}
            className={view === "list" ? "flex-row" : "min-h-[284px]"}
          />
        ))}
      </div>

      {/* No Results */}
      {sortedAds.length === 0 && (
        <div className="text-center py-12">
          <Typography variant="lg-black-inter" className="text-gray-500">
            No listings found for this seller.
          </Typography>
        </div>
      )}
    </div>
  );
}
