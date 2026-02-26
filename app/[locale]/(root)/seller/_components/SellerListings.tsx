"use client";

import React, { useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import SortAndViewControls from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import { ProductExtraFields, AD } from "@/interfaces/ad";
import ListingCard from "@/components/features/listing-card/listing-card";
import { useLocale } from "@/hooks/useLocale";
import { useAds } from "@/hooks/useAds";
import { Organization } from "@/interfaces/organization.types";
import { User } from "@/interfaces/user.types";

// Sort options for seller listings - will be translated in component
const getSortOptions = (t: any) => [
  { value: "default", label: t.common.sort.default || "Default" },
  { value: "newest", label: t.common.sort.newest || "Newest" },
  { value: "oldest", label: t.common.sort.oldest || "Oldest" },
  {
    value: "price-asc",
    label: t.common.sort.priceLowToHigh || "Price (Low to High)",
  },
  {
    value: "price-desc",
    label: t.common.sort.priceHighToLow || "Price (High to Low)",
  },
];

type ViewMode = "grid" | "list";

interface SellerListingsProps {
  sellerId: string;
  organization?: Organization;
  user?: User;
}

export default function SellerListings({
  sellerId,
  organization,
  user,
}: SellerListingsProps) {
  const { t } = useLocale();
  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("default");

  // Fetch ads for organization or user
  const {
    data: adsResponse,
    isLoading,
    error,
  } = useAds({
    userId: user?._id,
    organizationName: organization?.tradeName || organization?.legalName,
    limit: 100,
    page: 1,
  });

  // Extract ads from response
  const sellerAds = useMemo(() => {
    if (!adsResponse?.data) return [];

    // Handle different response structures
    if (Array.isArray(adsResponse.data)) {
      return adsResponse.data;
    }

    const data = adsResponse.data as any;

    // Handle response with items array (from API)
    if (data.items && Array.isArray(data.items)) {
      return data.items;
    }

    // Handle response with ads array
    if (data.ads && Array.isArray(data.ads)) {
      return data.ads;
    }

    // Handle response with adds array (legacy)
    if (data.adds && Array.isArray(data.adds)) {
      return data.adds;
    }

    return [];
  }, [adsResponse]);

  // Sort the ads
  const sortedAds = useMemo(() => {
    return [...sellerAds].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || b.postedTime || 0).getTime() -
            new Date(a.createdAt || a.postedTime || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || a.postedTime || 0).getTime() -
            new Date(b.createdAt || b.postedTime || 0).getTime()
          );
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        default:
          return 0; // Default order
      }
    });
  }, [sellerAds, sortBy]);

  // Get seller name for display
  const sellerName =
    organization?.tradeName ||
    organization?.legalName ||
    user?.firstName ||
    "seller";

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <Typography variant="body" className="text-red-500">
          Failed to load listings. Please try again later.
        </Typography>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      {/* Desktop Header Section */}
      <div className="flex items-center justify-between mb-6">
        <Typography
          variant="lg-black-inter"
          className="font-semibold text-dark-blue flex gap-1"
        >
          {t.seller.listings.adsPostedBy.replace("{sellerName}", sellerName)} (
          {sortedAds.length})
        </Typography>

        {/* Sort and View Controls */}
        {/* <SortAndViewControls
          sortOptions={getSortOptions(t)}
          sortValue={sortBy}
          onSortChange={setSortBy}
          viewMode={view}
          onViewChange={setView}
          showViewToggle={true}
          showFilterButton={false}
          size="fit"
          className="px-4 flex justify-end"
        /> */}
      </div>

      {/* Listings Grid */}
      <div
        className={`grid gap-4 ${
          view === "list"
            ? "grid-cols-1"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {sortedAds.map((ad: AD) => {
          // Transform extraFields to ProductExtraFields format
          const extraFields: ProductExtraFields = ad.extraFields
            ? Array.isArray(ad.extraFields)
              ? ad.extraFields
              : Object.entries(ad.extraFields).map(([name, value]) => ({
                  name,
                  type: typeof value === "number" ? "number" : "string",
                  value: value as string | number,
                }))
            : [];

          // Get AdLocation object from address or location
          const adLocation = (ad.address && typeof ad.address === "object")
            ? ad.address
            : (ad.location && typeof ad.location === "object")
              ? ad.location
              : { address: typeof ad.location === "string" ? ad.location : undefined };

          // Get seller info if available
          const sellerInfo = ad.organization
            ? {
                name: ad.organization.tradeName || ad.organization.legalName,
                firstName: ad.organization.contactName,
                type: "Agent" as const,
                isVerified: ad.organization.verified,
                image: ad.organization.logoUrl,
              }
            : ad.owner
            ? {
                name:
                  ad.owner.firstName && ad.owner.lastName
                    ? `${ad.owner.firstName} ${ad.owner.lastName}`
                    : ad.owner.firstName || ad.owner.name,
                firstName: ad.owner.firstName,
                lastName: ad.owner.lastName,
                type: "Individual" as const,
                isVerified: false,
                image: ad.owner.image,
              }
            : undefined;

          // Calculate discount info
          const extraFieldsObj = Array.isArray(ad.extraFields)
            ? ad.extraFields.reduce((acc, field) => {
              if (field && typeof field === "object" && "name" in field && "value" in field) {
                acc[(field as any).name] = (field as any).value;
                }
                return acc;
              }, {} as Record<string, any>)
            : (ad.extraFields as Record<string, any>) || {};

          let currentPrice = ad.price;
          let originalPrice: number | undefined = undefined;
          let discountPercentage: number | undefined = undefined;

          if (ad.discountedPrice !== null && ad.discountedPrice !== undefined && ad.discountedPrice < ad.price) {
            currentPrice = ad.discountedPrice;
            originalPrice = ad.price;
            discountPercentage = Math.round(((ad.price - ad.discountedPrice) / ad.price) * 100);
          } else {
            const discountedPercent = extraFieldsObj.discountedPercent ? Number(extraFieldsObj.discountedPercent) : undefined;
            if (discountedPercent && discountedPercent > 0 && ad.price) {
              originalPrice = Math.round(ad.price / (1 - discountedPercent / 100));
              currentPrice = ad.price;
              discountPercentage = Math.round(discountedPercent);
            }
          }

          return (
            <ListingCard
              key={ad._id}
              id={ad._id}
              title={ad.title}
              price={currentPrice}
              originalPrice={originalPrice}
              discount={discountPercentage}
              location={adLocation}
              images={ad.images || []}
              extraFields={extraFields}
              isExchange={ad.upForExchange || ad.isExchangable || false}
              postedTime={ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : ""}
              views={ad.views || 0}
              isPremium={ad.isFeatured || false}
              isAddedInCollection={ad.isAddedInCollection}
              seller={sellerInfo}
              className={view === "list" ? "flex-row" : ""}
            />

          );
        })}
      </div>

      {/* No Results */}
      {sortedAds.length === 0 && (
        <div className="text-center py-12">
          <Typography variant="lg-black-inter" className="text-gray-500">
            {t.seller.listings.noListingsFound}
          </Typography>
        </div>
      )}
    </div>
  );
}
