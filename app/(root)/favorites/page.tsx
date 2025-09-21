"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { mockAds } from "@/constants/sample-listings";
import { CreateCollectionDialog } from "./_components/CreateCollectionDialog";
import CollectionCard from "./_components/CollectionCard";
import SortAndViewControls, {
  ViewMode,
} from "../post-ad/_components/SortAndViewControls";
import MobileHorizontalListViewCard from "../categories/_components/MobileHorizontalListViewCard";
import HorizontalListingCard from "../categories/_components/desktop-horizontal-list-card";
import { cn } from "@/lib/utils";
import React from "react";
import ListingCard from "../categories/_components/ListingCard";

// Sort options
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

// Mock collections data
const mockCollections = [
  {
    id: "1",
    name: "Car Collection",
    count: 12,
    images: [mockAds[0].images[0], mockAds[0].images[0], mockAds[0].images[0]],
  },
  {
    id: "2",
    name: "Bedroom Designs",
    count: 8,
    images: [mockAds[1].images[0], mockAds[1].images[0], mockAds[1].images[0]],
  },
  {
    id: "3",
    name: "Modern Furniture",
    count: 11,
    images: [mockAds[1].images[0], mockAds[1].images[0], mockAds[1].images[0]],
  },
];

// Mock favorites data - using mockAds as favorites
const mockFavorites = mockAds.slice(0, 32);

export default function FavoritesPage() {
  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery] = useState("");
  const [filters] = useState({
    location: "",
    price: "",
    make: "",
    year: "",
    mileage: "",
  });

  const handleCollectionClick = (collectionId: string) => {
    // Navigate to collection detail page or open collection
    console.log("Clicked collection:", collectionId);
  };

  const handleMoreOptions = (collectionId: string) => {
    // Show more options menu
    console.log("More options for collection:", collectionId);
  };

  const filteredAds = mockAds.filter((ad) => {
    if (
      searchQuery &&
      !ad.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.location &&
      !ad.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }
    if (filters.year && ad.specifications.year?.toString() !== filters.year) {
      return false;
    }
    return true;
  });

  // Sort the filtered ads
  const sortedAds = [...filteredAds].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        // Sort by postedTime (assuming newer posts come first)
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
    <div className="w-full space-y-8 sm:py-4">
      {/* Header */}

      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          My Favorites
        </Typography>
      </div>

      <Button
        variant={"ghost"}
        icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
        iconPosition="center"
        className="hidden sm:flex text-purple text-sm w-32"
      >
        My Favorites
      </Button>

      <div className="w-full px-4 lg:px-0">
        {/* Collections Section */}
        <div className="mb-8">
          <Typography
            variant="body-large"
            className="text-gray-900 mb-3 font-semibold"
          >
            List
          </Typography>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 scrollbar-hide bg-white md:bg-transparent border md:border-none rounded-xl p-4 md:p-0 shadow-sm md:shadow-none">
            {mockCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                id={collection.id}
                name={collection.name}
                count={collection.count}
                images={collection?.images}
                onClick={handleCollectionClick}
                onMoreOptions={handleMoreOptions}
              />
            ))}

            {/* Create new collection card */}
            <CreateCollectionDialog>
              <CollectionCard
                isCreateNew={true}
                id="create-new"
                name=""
                count={0}
                images={[]}
              />
            </CreateCollectionDialog>
          </div>
        </div>

        {/* Favorites Section */}
        <div className="bg-white md:bg-transparent border md:border-none rounded-xl p-4 md:p-0 shadow-sm md:shadow-none">
          <div className="flex flex-wrap items-start justify-between mb-6">
            <Typography
              variant="body-large"
              className="text-gray-900 font-semibold"
            >
              Favorites ({mockFavorites.length})
            </Typography>

            {/* Sort Dropdown */}
            <SortAndViewControls
              sortOptions={sortOptions}
              sortValue={sortBy}
              onSortChange={setSortBy}
              viewMode={view}
              onViewChange={setView}
              showViewToggle={true}
              showFilterButton={false}
              size="fit"
              className="flex justify-end mb-4"
            />
          </div>

          {/* Favorites Grid */}
          <div className="space-y-6">
            <div
              className={cn(
                `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`,
                view === "list" && "flex flex-col"
              )}
            >
              {sortedAds.slice(0, 8).map((ad) => (
                <React.Fragment key={ad.id}>
                  {view === "grid" ? (
                    <ListingCard
                      {...ad}
                      isFavorite={true}
                      onShare={(id) => console.log("Shared:", id)}
                      onClick={(id) => console.log("Clicked:", id)}
                      className="min-h-[284px]"
                    />
                  ) : (
                    <>
                      <HorizontalListingCard
                        {...ad}
                        onFavorite={(id) => console.log("Favorited:", id)}
                        onShare={(id) => console.log("Shared:", id)}
                        onClick={(id) => console.log("Clicked:", id)}
                        className="hidden sm:block"
                      />
                      <MobileHorizontalListViewCard
                        {...ad}
                        onClick={(id) => console.log("Clicked:", id)}
                        className="block sm:hidden"
                      />
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
