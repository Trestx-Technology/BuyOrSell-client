"use client";

import { Button } from "@/components/ui/button";
import HotDealsCarousel from "./_components/hot-deals-banners-carousel";
import { ChevronLeft, Search } from "lucide-react";
import { Typography } from "@/components/typography";
import { Input } from "@/components/ui/input";
import MobileHorizontalListViewCard from "../categories/_components/MobileHorizontalListViewCard";
import HorizontalListingCard from "../categories/_components/desktop-horizontal-list-card";
import HotDealsListingCard from "@/components/global/hot-deals-listing-card";
import AdCard from "../categories/_components/AdCard";
import SortAndViewControls, {
  ViewMode,
} from "../post-ad/_components/SortAndViewControls";
import { mockAds } from "@/constants/sample-listings";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
// Sort options
const sortOptions = [
  { value: "default", label: "Default" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
];

export default function HotDealsPage() {
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
    <>
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          Hot Deals
        </Typography>
      </div>
      <div className="bg-purple block md:hidden p-4">
        <div className="flex items-center gap-4">
          <Input
            leftIcon={<Search className="h-4 w-4" />}
            placeholder="Search for deals"
            className="bg-white border-gray-200"
          />
        </div>
      </div>
      <HotDealsCarousel />

      <div className="w-full max-w-[1080px] mx-auto px-4 lg:px-0 mt-8">
        <div className="mb-12 space-y-4">
          <Typography variant="md-medium" className="text-white">
            Browse Categories
          </Typography>
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <Button
              className="px-3"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
            <Button
              className="bg-transparent border-white border px-3 hover:border-none"
              icon={
                <Badge variant={"secondary"} className="font-bold">
                  247
                </Badge>
              }
              iconPosition="right"
            >
              Electronics
            </Button>
          </div>
        </div>

        {/* Favorites Section */}
        <div className=" rounded-xl md:p-0 shadow-sm md:shadow-none">
          <div className="flex items-center justify-end md:justify-between mb-6">
            <div className="hidden md:block">
              <Typography variant="3xl-semibold" className="text-white">
                Hot Deals
              </Typography>
              <Typography variant="sm-regular" className="text-white">
                Limited time offers you don&apos;t want to miss
              </Typography>
            </div>

            {/* Sort Dropdown */}
            <SortAndViewControls
              variant="dark"
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
              {sortedAds.slice(0, 15).map((ad, index) => {
                // Insert AdCard at the 4th position (index 3)
                if (index === 3) {
                  return (
                    <React.Fragment key={`ad-card-${index}`}>
                      {view === "grid" ? (
                        <AdCard className="min-h-[284px]" />
                      ) : (
                        <AdCard className="min-h-[120px]" />
                      )}
                    </React.Fragment>
                  );
                }

                // Transform the ad data to match HotDealsListingCard interface
                const transformedAd = {
                  id: ad.id,
                  title: ad.title,
                  price: ad.price,
                  originalPrice: ad.originalPrice,
                  discount: ad.discount,
                  currency: ad.currency || "AED",
                  location: ad.location,
                  images: ad.images,
                  specifications: {
                    transmission: ad.specifications.transmission,
                    fuelType: ad.specifications.fuelType,
                    mileage: ad.specifications.mileage,
                    year: ad.specifications.year,
                  },
                  postedTime: ad.postedTime,
                  views: ad.views || Math.floor(Math.random() * 1000) + 50,
                  isPremium: ad.isPremium || Math.random() > 0.5,
                  isFavorite: ad.isFavorite || Math.random() > 0.7,
                  discountText: ad.discount
                    ? `FLAT ${ad.discount}% OFF`
                    : undefined,
                  discountBadgeBg: "bg-[#FB9800]",
                  discountBadgeTextColor: "text-white",
                  showDiscountBadge: !!ad.discount,
                  seller: ad.seller,
                  type: ad.seller.type,
                  showTimer: true,
                  timerBg: "bg-black",
                  timerTextColor: "text-white",
                  endTime: new Date(
                    Date.now() + Math.random() * 24 * 60 * 60 * 1000
                  ), // Random end time within 24 hours
                };

                return (
                  <React.Fragment key={ad.id}>
                    {view === "grid" ? (
                      <HotDealsListingCard
                        {...transformedAd}
                        onFavorite={(id) => console.log("Favorited:", id)}
                        onShare={(id) => console.log("Shared:", id)}
                        onClick={(id) => console.log("Clicked:", id)}
                        className="border-none min-h-[284px]"
                      />
                    ) : (
                      <>
                        <HorizontalListingCard
                          {...transformedAd}
                          onFavorite={(id) => console.log("Favorited:", id)}
                          onShare={(id) => console.log("Shared:", id)}
                          onClick={(id) => console.log("Clicked:", id)}
                          className="hidden sm:block border-none"
                        />
                        <MobileHorizontalListViewCard
                          {...transformedAd}
                          onClick={(id) => console.log("Clicked:", id)}
                          className="block sm:hidden border-none"
                        />
                      </>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
