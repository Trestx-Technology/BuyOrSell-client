"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import AdsFilter, {
  FilterConfig,
} from "@/app/(root)/categories/_components/ads-filter";
import ListingCard from "@/app/(root)/categories/_components/ListingCard";
import CuratedCarsCollection from "@/app/(root)/categories/_components/CuratedCarsCollection";
import { Typography } from "@/components/typography";
import { Bell, ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SortAndViewControls, {
  ViewMode,
} from "@/app/(root)/post-ad/_components/SortAndViewControls";
import { mockAds } from "@/constants/sample-listings";
import { cn } from "@/lib/utils";
import HorizontalListingCard from "../_components/desktop-horizontal-list-card";
import MobileHorizontalListViewCard from "../_components/MobileHorizontalListViewCard";

// Sort options
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

// Filter configuration
const filterConfig: FilterConfig[] = [
  {
    key: "location",
    label: "Location",
    type: "select",
    options: [
      { value: "dubai", label: "Dubai" },
      { value: "abu-dhabi", label: "Abu Dhabi" },
      { value: "sharjah", label: "Sharjah" },
      { value: "ajman", label: "Ajman" },
      { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
      { value: "fujairah", label: "Fujairah" },
      { value: "umm-al-quwain", label: "Umm Al Quwain" },
    ],
    placeholder: "Dubai",
  },
  {
    key: "price",
    label: "Price",
    type: "select",
    options: [
      { value: "under-50k", label: "Under 50,000" },
      { value: "50k-100k", label: "50,000 - 100,000" },
      { value: "100k-200k", label: "100,000 - 200,000" },
      { value: "200k-500k", label: "200,000 - 500,000" },
      { value: "over-500k", label: "Over 500,000" },
    ],
    placeholder: "Select Price",
  },
  {
    key: "make",
    label: "Make & Model",
    type: "select",
    options: [
      { value: "toyota", label: "Toyota" },
      { value: "honda", label: "Honda" },
      { value: "bmw", label: "BMW" },
      { value: "mercedes", label: "Mercedes" },
      { value: "audi", label: "Audi" },
      { value: "nissan", label: "Nissan" },
      { value: "hyundai", label: "Hyundai" },
      { value: "kia", label: "Kia" },
      { value: "ford", label: "Ford" },
      { value: "chevrolet", label: "Chevrolet" },
    ],
    placeholder: "Choose",
  },
  {
    key: "year",
    label: "Built Year",
    type: "select",
    options: [
      { value: "2024", label: "2024" },
      { value: "2023", label: "2023" },
      { value: "2022", label: "2022" },
      { value: "2021", label: "2021" },
      { value: "2020", label: "2020" },
      { value: "2019", label: "2019" },
      { value: "2018", label: "2018" },
      { value: "2017", label: "2017" },
      { value: "2016", label: "2016" },
      { value: "2015", label: "2015" },
    ],
    placeholder: "Any Year",
  },
  {
    key: "mileage",
    label: "Kilometer",
    type: "select",
    options: [
      { value: "under-50k", label: "Under 50,000 km" },
      { value: "50k-100k", label: "50,000 - 100,000 km" },
      { value: "100k-200k", label: "100,000 - 200,000 km" },
      { value: "over-200k", label: "Over 200,000 km" },
    ],
    placeholder: "Any Mileage",
  },
];

export default function CategoryListingPage() {
  const params = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    price: "",
    make: "",
    year: "",
    mileage: "",
  });
  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("default");
  // Get category from URL params
  const slugSegments = Array.isArray(params.slug)
    ? params.slug
    : params.slug
    ? [params.slug]
    : [];

  const categoryName =
    slugSegments.at(-1)?.replace(/-/g, " ") || "Category";

  const formatLabel = (segment: string) =>
    segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const breadcrumbItems: BreadcrumbItem[] = [
    { id: "categories", label: "Categories", href: "/categories" },
    ...slugSegments.map((segment, index) => {
      const path = slugSegments.slice(0, index + 1).join("/");
      const href = `/categories/${path}`;

      return {
        id: path || `segment-${index}`,
        label: formatLabel(segment),
        href,
        isActive: index === slugSegments.length - 1,
      };
    }),
  ];

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      price: "",
      make: "",
      year: "",
      mileage: "",
    });
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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="w-full bg-purple sm:hidden p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            icon={<ChevronLeft />}
            iconPosition="left"
            className="bg-white text-purple w-8 rounded-full"
            size={"icon-sm"}
          />
          <Button
            icon={<Bell />}
            iconPosition="left"
            className="w-8 rounded-full"
            size={"icon-sm"}
          />
        </div>

        {/* Search Bar */}
        <Input
          leftIcon={<Search className="h-4 w-4" />}
          placeholder={"Search"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-gray-100 border-0"
        />
      </div>

      <div className="max-w-7xl mx-auto py-6">
        <div className="hidden sm:block mb-6 px-4">
          <Breadcrumbs
            items={breadcrumbItems}
            showSelectCategoryLink={false}
          />
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 px-4">
          <Typography variant="md-black-inter" className="font-semibold">
            {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} for
            sale in Dubai ({sortedAds.length})
          </Typography>

          <SortAndViewControls
            sortOptions={sortOptions}
            sortValue={sortBy}
            onSortChange={setSortBy}
            viewMode={view}
            onViewChange={setView}
            showViewToggle={true}
            showFilterButton={false}
            size="fit"
            className="hidden sm:flex"
          />
        </div>
        {/* Filters */}
        <AdsFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          config={filterConfig}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${categoryName}...`}
          className="mb-4"
        />

        <SortAndViewControls
          sortOptions={sortOptions}
          sortValue={sortBy}
          onSortChange={setSortBy}
          viewMode={view}
          onViewChange={setView}
          showViewToggle={true}
          showFilterButton={false}
          size="fit"
          className="px-4 flex justify-end mb-4 sm:hidden"
        />

        {/* Ads Grid/List */}
        <div className="space-y-6">
          <div
            className={cn(
              `px-4 lg:px-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`,
              view === "list" && "flex flex-col"
            )}
          >
            {sortedAds.slice(0, 8).map((ad) => (
              <React.Fragment key={ad.id}>
                {view === "grid" ? (
                  <ListingCard
                    {...ad}
                    onFavorite={(id) => console.log("Favorited:", id)}
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

          {/* Curated Cars Collection */}
          <CuratedCarsCollection />

          <div
            className={cn(
              `px-4 lg:px-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`,
              view === "list" && "flex flex-col"
            )}
          >
            {sortedAds.slice(0, 7).map((ad) => (
              <React.Fragment key={ad.id}>
                {view === "grid" ? (
                  <ListingCard
                    {...ad}
                    onFavorite={(id) => console.log("Favorited:", id)}
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

        {/* No Results */}
        {sortedAds.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No ads found matching your criteria.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
