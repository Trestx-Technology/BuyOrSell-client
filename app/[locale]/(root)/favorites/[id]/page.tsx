"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MoreHorizontal, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { cn } from "@/lib/utils";
import React from "react";
import ListingCard from "@/components/global/listing-card";
import { ProductExtraFields, AD } from "@/interfaces/ad";
import { useGetCollectionById } from "@/hooks/useCollections";
import { transformAdToListingCard } from "@/utils/transform-ad-to-listing";
import SortAndViewControls, {
  ViewMode,
} from "@/app/[locale]/(root)/post-ad/_components/SortAndViewControls";
import Image from "next/image";
import HorizontalListingCard from "../../categories/_components/desktop-horizontal-list-card";
import MobileHorizontalListViewCard from "../../categories/_components/MobileHorizontalListViewCard";

// Sort options

export default function CollectionDetailPage() {
  const { t } = useLocale();
  const params = useParams();
  const router = useRouter();
  const collectionId = params.id as string;
  const [view, setView] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");

  const sortOptions = [
    { value: "default", label: t.favorites.sort.default },
    { value: "newest", label: t.favorites.sort.newest },
    { value: "oldest", label: t.favorites.sort.oldest },
    { value: "price-asc", label: t.favorites.sort.priceLowToHigh },
    { value: "price-desc", label: t.favorites.sort.priceHighToLow },
  ];
  // Fetch collection details by ID
  const {
    data: collectionResponse,
    isLoading,
    error,
  } = useGetCollectionById(collectionId);

  const collection = collectionResponse?.data;

  // Get ads from collection response
  // Note: The API might return ads in the collection response even if not in the TypeScript interface
  const collectionAds = useMemo(() => {
    if (!collectionResponse?.data) {
      return [];
    }
    // Check if the collection response includes ads (even if not in TypeScript interface)
    const collectionData = collectionResponse.data as unknown as Record<
      string,
      unknown
    >;
    // The API might return ads as an array or nested in the response
    return (
      (collectionData?.ads as AD[]) || (collectionData?.items as AD[]) || []
    );
  }, [collectionResponse]);

  // Filter and sort ads
  const filteredAds = useMemo(() => {
    return collectionAds.filter((ad: AD) => {
      if (
        searchQuery &&
        !ad.title?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [collectionAds, searchQuery]);

  const sortedAds = useMemo(() => {
    const ads = [...filteredAds];
    switch (sortBy) {
      case "newest":
        return ads.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
      case "oldest":
        return ads.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );
      case "price-asc":
        return ads.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price-desc":
        return ads.sort((a, b) => (b.price || 0) - (a.price || 0));
      default:
        return ads;
    }
  }, [filteredAds, sortBy]);

  if (isLoading) {
    return (
      <div className="w-full space-y-8 sm:py-4">
        <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
          <Button
            variant={"ghost"}
            icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
            iconPosition="center"
            size={"icon-sm"}
            className="absolute left-4 text-purple"
            onClick={() => router.back()}
          />
          <Typography variant="lg-semibold" className="text-dark-blue">
            {t.favorites.collection}
          </Typography>
        </div>
        <div className="text-center py-12">
          <Typography variant="body-small" className="text-gray-500">
            {t.favorites.loadingCollection}
          </Typography>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="w-full space-y-8 sm:py-4">
        <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
          <Button
            variant={"ghost"}
            icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
            iconPosition="center"
            size={"icon-sm"}
            className="absolute left-4 text-purple"
            onClick={() => router.back()}
          />
          <Typography variant="lg-semibold" className="text-dark-blue">
            {t.favorites.collection}
          </Typography>
        </div>
        <div className="text-center py-12">
          <Typography
            variant="body-large"
            className="text-gray-900 font-semibold mb-2"
          >
            {t.favorites.collectionNotFound}
          </Typography>
          <Typography variant="body-small" className="text-gray-500 mb-4">
            {t.favorites.collectionNotFoundDescription}
          </Typography>
          <Button onClick={() => router.push("/favorites")} variant="outline">
            {t.favorites.backToFavorites}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 sm:py-4">
      {/* Mobile Header */}
      <div className="flex justify-center sm:hidden border sticky top-0 bg-white z-10 py-4 shadow-sm">
        <Button
          variant={"ghost"}
          icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
          iconPosition="center"
          size={"icon-sm"}
          className="absolute left-4 text-purple"
          onClick={() => router.back()}
        />
        <Typography variant="lg-semibold" className="text-dark-blue">
          {collection.name}
        </Typography>
      </div>

      {/* Desktop Header */}
      <Button
        variant={"ghost"}
        icon={<ChevronLeft className="h-4 w-4 -mr-2" />}
        iconPosition="center"
        className="hidden sm:flex text-purple text-sm w-32"
        onClick={() => router.back()}
      >
        {collection.name}
      </Button>

      <div className="w-full px-4 lg:px-0">
        {/* Collection Header */}
        <div className="mb-8 bg-white md:bg-transparent border md:border-none rounded-xl p-4 md:p-0 shadow-sm md:shadow-none">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Typography
                variant="h2"
                className="text-gray-900 font-bold text-2xl mb-2"
              >
                {collection.name}
              </Typography>
              {collection.description && (
                <Typography variant="body-small" className="text-gray-600 mb-2">
                  {collection.description}
                </Typography>
              )}
              <Typography variant="body-small" className="text-gray-500">
                {t.favorites.itemsCount.replace(
                  "{{count}}",
                  (collection.count || sortedAds.length).toString()
                )}
                {collection.createdAt &&
                  ` • ${t.favorites.createdAt.replace(
                    "{{date}}",
                    new Date(collection.createdAt).toLocaleDateString()
                  )}`}
              </Typography>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => {
                // TODO: Implement more options (edit, delete, etc.)
                console.log("More options");
              }}
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Collection Cover Image */}
          {collection.images && collection.images.length > 0 && (
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden bg-gray-100 mb-4">
              <Image
                src={collection.images[0]}
                alt={collection.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          )}
        </div>

        {/* Collection Items Section */}
        <div className="bg-white md:bg-transparent border md:border-none rounded-xl p-4 md:p-0 shadow-sm md:shadow-none">
          <div className="flex flex-wrap items-start justify-between mb-6">
            <Typography
              variant="body-large"
              className="text-gray-900 font-semibold"
            >
              {t.favorites.items} ({sortedAds.length})
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
              className="flex justify-end mb-4"
            />
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder={t.favorites.searchItems}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Items Grid */}
          <div className="space-y-6">
            {sortedAds.length > 0 ? (
              <div
                className={cn(
                  `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3`,
                  view === "list" && "flex flex-col"
                )}
              >
                {sortedAds.map((ad: AD) => {
                  const listingCardProps = transformAdToListingCard(ad);

                  return (
                    <React.Fragment key={ad._id}>
                      {view === "grid" ? (
                        <ListingCard
                          {...listingCardProps}
                          isFavorite={true}
                          onShare={(id) => console.log("Shared:", id)}
                          onClick={(id) => router.push(`/ad/${id}`)}
                          className="min-h-[284px]"
                        />
                      ) : (
                        <>
                          <HorizontalListingCard
                            id={ad._id}
                            title={ad.title}
                            price={ad.price || 0}
                            location={
                              typeof ad.location === "string"
                                ? ad.location
                                : ad.location?.city ||
                                  ad.address?.city ||
                                  "Location not specified"
                            }
                            images={ad.images || []}
                            extraFields={ad.extraFields as ProductExtraFields}
                            postedTime={new Date(
                              ad.createdAt
                            ).toLocaleDateString()}
                            views={ad.views}
                            isFavorite={true}
                            onFavorite={(id) => console.log("Favorited:", id)}
                            onShare={(id) => console.log("Shared:", id)}
                            onClick={(id) => router.push(`/ad/${id}`)}
                            className="hidden sm:block"
                          />
                          <MobileHorizontalListViewCard
                            id={ad._id}
                            title={ad.title}
                            price={ad.price || 0}
                            location={
                              typeof ad.location === "string"
                                ? ad.location
                                : ad.location?.city ||
                                  ad.address?.city ||
                                  "Location not specified"
                            }
                            images={ad.images || []}
                            extraFields={ad.extraFields as ProductExtraFields}
                            postedTime={new Date(
                              ad.createdAt
                            ).toLocaleDateString()}
                            views={ad.views}
                            onClick={(id) => router.push(`/ad/${id}`)}
                            className="block sm:hidden"
                          />
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <Typography
                  variant="body-large"
                  className="text-gray-900 font-semibold mb-2"
                >
                  {t.favorites.noItemsInCollection}
                </Typography>
                <Typography variant="body-small" className="text-gray-500 mb-4">
                  {t.favorites.startAddingItems}
                </Typography>
                <Button
                  onClick={() => router.push("/favorites")}
                  variant="outline"
                >
                  {t.favorites.backToCollections}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
