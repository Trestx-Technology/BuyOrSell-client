"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import CollectionCard from "./CollectionCard";
import { Typography } from "@/components/typography";

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
import { EditCollectionDialog } from "./EditCollectionDialog";
import { WarningConfirmationDialog } from "@/components/ui/warning-confirmation-dialog";
import { toast } from "sonner";
import { Collection } from "@/interfaces/collections.types";

export function FavoritesContent() {
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

  return (
    <Container1080>
      {/* Header */}
      <MobileStickyHeader title={t.favorites.myFavorites} />

      <div className="w-full">
        {/* Collections Section */}
        <div className="px-4 py-8">
          <Typography
            variant="body-large"
            className="text-gray-900 dark:text-white mb-3 font-semibold"
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 scrollbar-hide bg-white dark:bg-gray-900 md:bg-transparent border border-gray-100 dark:border-gray-800 md:border-none rounded-xl p-4 md:p-0 shadow-sm md:shadow-none">
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
      </div>
    </Container1080>
  );
}
