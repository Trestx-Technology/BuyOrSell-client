"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { useLocale } from "@/hooks/useLocale";
import { CreateCollectionDialog } from "./_components/CreateCollectionDialog";
import CollectionCard from "./_components/CollectionCard";

import { AD } from "@/interfaces/ad";
import {
  useGetMyCollections,
  useUpdateCollection,
  useDeleteCollection,
} from "@/hooks/useCollections";
import { useQueryClient } from "@tanstack/react-query";
import { collectionsQueries } from "@/app/api/collections/index";
import { Container1080 } from "@/components/layouts/container-1080";
import { MobileStickyHeader } from "@/components/global/mobile-sticky-header";
import { EditCollectionDialog } from "./_components/EditCollectionDialog";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import { toast } from "sonner";
import { Collection } from "@/interfaces/collections.types";

export default function FavoritesPage() {
  const { t } = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [collectionToEdit, setCollectionToEdit] = useState<Collection | null>(
    null
  );
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(
    null
  );
  const updateCollectionMutation = useUpdateCollection();
  const deleteCollectionMutation = useDeleteCollection();

  // Sort options
  // const sortOptions = [
  //   { value: "default", label: t.favorites.sort.default },
  //   { value: "newest", label: t.favorites.sort.newest },
  //   { value: "oldest", label: t.favorites.sort.oldest },
  //   { value: "price-asc", label: t.favorites.sort.priceLowToHigh },
  //   { value: "price-desc", label: t.favorites.sort.priceHighToLow },
  // ];
  // Fetch user's collections
  const { data: collectionsResponse, isLoading: isLoadingCollections } =
    useGetMyCollections();

  // Get collections from API response
  const collections = useMemo(() => {
    return collectionsResponse?.data || [];
  }, [collectionsResponse]);

  // Extract images for each collection: use collection.imageURL if available,
  // otherwise use collection.images if available,
  // otherwise extract first image from each ad in collection.ads
  const collectionsWithImages = useMemo(() => {
    return collections.map((collection) => {
      const collectionData = collection as unknown as Record<string, unknown>;

      // If collection has imageURL, use it
      if (
        collectionData.imageURL &&
        typeof collectionData.imageURL === "string"
      ) {
        return {
          ...collection,
          images: [collectionData.imageURL],
        };
      }

      // If collection has images array, use it
      if (collection.images && collection.images.length > 0) {
        return collection;
      }

      // Otherwise, extract first image from each ad
      const ads = (collectionData?.ads as AD[]) || [];

      const imagesFromAds: string[] = ads
        .map((ad) => ad.images?.[0])
        .filter((img): img is string => !!img);

      return {
        ...collection,
        images: imagesFromAds,
      };
    });
  }, [collections]);

  // For the favorites page, we show all collections
  // Individual collection items are shown on the collection detail page
  const allFavorites: AD[] = useMemo(() => {
    // If you want to show all ads from all collections, you would need to:
    // 1. Fetch each collection's details
    // 2. Aggregate all ads
    // For now, return empty array as collections are shown separately
    return [];
  }, []);

  const handleCollectionClick = useCallback(
    (collectionId: string) => {
      router.push(`/favorites/${collectionId}`);
    },
    [router]
  );

  const handleMoreOptions = useCallback((collectionId: string) => {
    // Show more options menu (edit, delete, etc.)
    console.log("More options for collection:", collectionId);
  }, []);

  const handleEditCollection = useCallback(
    (collectionId: string) => {
      const collection = collections.find((c) => c._id === collectionId);
      if (collection) {
        setCollectionToEdit(collection);
      }
    },
    [collections]
  );

  const handleDeleteCollection = useCallback((collectionId: string) => {
    setCollectionToDelete(collectionId);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!collectionToDelete) return;

    deleteCollectionMutation.mutate(collectionToDelete, {
      onSuccess: () => {
        toast.success("Collection deleted successfully");
        setCollectionToDelete(null);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete collection");
      },
    });
  }, [collectionToDelete, deleteCollectionMutation]);

  const handleCollectionCreated = useCallback(() => {
    // Refresh collections list
    queryClient.invalidateQueries({
      queryKey: collectionsQueries.getMyCollections.Key,
    });
  }, [queryClient]);

  const handleCollectionUpdated = useCallback(() => {
    // Refresh collections list
    queryClient.invalidateQueries({
      queryKey: collectionsQueries.getMyCollections.Key,
    });
    setCollectionToEdit(null);
  }, [queryClient]);

  // Filter and sort favorites
  // const filteredAds = useMemo(() => {
  //   return allFavorites.filter((ad: AD) => {
  //     if (
  //       searchQuery &&
  //       !ad.title?.toLowerCase().includes(searchQuery.toLowerCase())
  //     ) {
  //       return false;
  //     }
  //     return true;
  //   });
  // }, [allFavorites, searchQuery]);

  // const sortedAds = useMemo(() => {
  //   const ads = [...filteredAds];
  //   switch (sortBy) {
  //     case "newest":
  //       return ads.sort(
  //         (a, b) =>
  //           new Date(b.createdAt || 0).getTime() -
  //           new Date(a.createdAt || 0).getTime()
  //       );
  //     case "oldest":
  //       return ads.sort(
  //         (a, b) =>
  //           new Date(a.createdAt || 0).getTime() -
  //           new Date(b.createdAt || 0).getTime()
  //       );
  //     case "price-asc":
  //       return ads.sort((a, b) => (a.price || 0) - (b.price || 0));
  //     case "price-desc":
  //       return ads.sort((a, b) => (b.price || 0) - (a.price || 0));
  //     default:
  //       return ads;
  //   }
  // }, [filteredAds, sortBy]);

  const isLoading = isLoadingCollections;

  return (
    <Container1080>
      {/* Header */}
      <MobileStickyHeader title={t.favorites.myFavorites} />

      <div className="w-full">
        {/* Collections Section */}
        <div className="px-4 py-8">
          <Typography
            variant="body-large"
            className="text-gray-900 mb-3 font-semibold"
          >
            {t.favorites.list}
          </Typography>

          {isLoadingCollections ? (
            <div className="text-center py-8">
              <Typography variant="body-small" className="text-gray-500">
                {t.favorites.loadingCollections}
              </Typography>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 scrollbar-hide bg-white md:bg-transparent border md:border-none rounded-xl p-4 md:p-0 shadow-sm md:shadow-none">
              {collectionsWithImages.map((collection) => (
                <CollectionCard
                  key={collection._id}
                  id={collection._id}
                  name={collection.name}
                  count={collection.adIds?.length || 0}
                  images={collection.images || []}
                  onClick={handleCollectionClick}
                  onMoreOptions={handleMoreOptions}
                  onEdit={handleEditCollection}
                  onDelete={handleDeleteCollection}
                />
              ))}

              {/* Create new collection card */}
              <CreateCollectionDialog
                onCollectionCreated={handleCollectionCreated}
              >
                <CollectionCard
                  isCreateNew={true}
                  id="create-new"
                  name=""
                  count={0}
                  images={[]}
                />
              </CreateCollectionDialog>
            </div>
          )}
        </div>

        {/* Edit Collection Dialog */}
        <EditCollectionDialog
          open={collectionToEdit !== null}
          onOpenChange={(open) => !open && setCollectionToEdit(null)}
          collection={collectionToEdit}
          onCollectionUpdated={handleCollectionUpdated}
        />

        {/* Delete Confirmation Dialog */}
        <WarningConfirmationDialog
          open={collectionToDelete !== null}
          onOpenChange={(open) => !open && setCollectionToDelete(null)}
          title={t.common.delete || "Delete Collection"}
          description="Are you sure you want to delete this collection? This action cannot be undone."
          confirmText={t.common.delete || "Delete"}
          cancelText={t.common.cancel || "Cancel"}
          onConfirm={handleConfirmDelete}
          isLoading={deleteCollectionMutation.isPending}
          confirmVariant="danger"
        />

        {/* Favorites Section */}
        {/* <div className="bg-white md:bg-transparent border md:border-none rounded-xl p-4 md:p-0 shadow-sm md:shadow-none">
          <div className="flex flex-wrap items-start justify-between mb-6">
            <Typography
              variant="body-large"
              className="text-gray-900 font-semibold"
            >
              {t.favorites.favorites} ({sortedAds.length})
            </Typography>

            Sort Dropdown
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

          Search Input
          <div className="mb-4">
            <input
              type="text"
              placeholder={t.favorites.searchFavorites}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          Favorites Grid
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Typography variant="body-small" className="text-gray-500">
                  {t.favorites.loadingFavorites}
                </Typography>
              </div>
            ) : sortedAds.length > 0 ? (
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
                <Typography variant="body-small" className="text-gray-500">
                  {t.favorites.noFavoritesYet}
                </Typography>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </Container1080>
  );
}
