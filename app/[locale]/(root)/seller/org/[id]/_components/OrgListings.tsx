"use client";

import React, { useState, useMemo } from "react";
import { Typography } from "@/components/typography";
import SortAndViewControls, {
  ViewMode,
} from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import ListingCard from "@/components/features/listing-card/listing-card";
import HorizontalListingCard from "@/app/[locale]/(root)/(categories)/_components/horizontal-listing-card";
import { useAdsByUser } from "@/hooks/useAds";
import { Organization } from "@/interfaces/organization.types";
import { AD, AdLocation } from "@/interfaces/ad";
import { AlertCircle, PackageSearch, RefreshCw, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import { useLocale } from "@/hooks/useLocale";

interface OrgListingsProps {
  organizationId: string;
  organization: Organization;
}

// mapAdToCard is no longer needed as we use transformAdToListingCard utility

function ListingsSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-5">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-2">
          <div className="h-5 w-24 bg-gray-200 dark:bg-slate-800 rounded-md animate-pulse" />
          <div className="h-3.5 w-36 bg-gray-100 dark:bg-slate-900/50 rounded-md animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-28 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-gray-100 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
      </div>
      {/* Card grid skeleton — 8 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 animate-pulse">
            <div className="h-40 bg-gray-200 dark:bg-slate-800" />
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3.5 bg-gray-100 dark:bg-slate-900/50 rounded w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-2/5 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrgListings({ organizationId, organization }: OrgListingsProps) {
  const { locale } = useLocale();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortValue, setSortValue] = useState("newest");

  const { data: adsResponse, isLoading, error, refetch } = useAdsByUser(
    organizationId,
    { limit: 100, page: 1, status: "live" },
    { enabled: !!organizationId }
  );

  const orgAds = useMemo(() => {
    if (!adsResponse?.data) return [];
    if (Array.isArray(adsResponse.data)) return adsResponse.data as AD[];
    const d = adsResponse.data as any;
    if (d?.items && Array.isArray(d.items)) return d.items as AD[];
    if (d?.data && Array.isArray(d.data)) return d.data as AD[];
    if (d?.adds && Array.isArray(d.adds)) return d.adds as AD[];
    if (d?.ads && Array.isArray(d.ads)) return d.ads as AD[];
    return [];
  }, [adsResponse]);

  const sortedAds = useMemo(() => {
    const ads = [...orgAds];
    switch (sortValue) {
      case "newest": return ads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case "oldest": return ads.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case "price-asc": return ads.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc": return ads.sort((a, b) => (b.price || 0) - (a.price || 0));
      default: return ads;
    }
  }, [orgAds, sortValue]);

  const orgName = organization.tradeName || organization.legalName || "This organization";

  if (isLoading) return <ListingsSkeleton />;

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-10 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <div>
          <Typography variant="h3" className="text-base font-semibold text-dark-blue dark:text-white mb-1">
            Failed to load listings
          </Typography>
          <Typography variant="body" className="text-sm text-grey-blue dark:text-slate-400 max-w-xs">
            Something went wrong while fetching the listings. Please try again.
          </Typography>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          icon={<RefreshCw className="w-4 h-4" />}
          iconPosition="left"
          className="border-gray-200 dark:border-slate-800 text-dark-blue dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800"
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm p-5 transition-all">
      <div className="flex items-center justify-between mb-5">
        <div>
          <Typography variant="h3" className="text-base font-semibold text-dark-blue dark:text-white">
            Listings
          </Typography>
          <Typography variant="body" className="text-sm text-grey-blue dark:text-slate-400">
            {sortedAds.length} active {sortedAds.length === 1 ? "listing" : "listings"}
          </Typography>
        </div>
        {sortedAds.length > 0 && (
          <SortAndViewControls
            viewMode={viewMode}
            onViewChange={setViewMode}
            sortValue={sortValue}
            onSortChange={setSortValue}
            showViewToggle
          />
        )}
      </div>

      {sortedAds.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {sortedAds.map((ad) => {
            const cardProps = transformAdToListingCard(ad, locale as any);
            return viewMode === "grid" ? (
              <ListingCard 
                key={ad._id} 
                {...cardProps} 
              />
            ) : (
              <HorizontalListingCard 
                key={ad._id} 
                {...cardProps} 
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-gray-300 dark:text-slate-600" />
          </div>
          <div>
            <Typography variant="h3" className="text-base font-semibold text-dark-blue dark:text-white mb-1">
              No listings yet
            </Typography>
            <Typography variant="body" className="text-sm text-grey-blue dark:text-slate-400 max-w-xs">
              {orgName} hasn&apos;t posted any active listings yet. Check back soon.
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}
