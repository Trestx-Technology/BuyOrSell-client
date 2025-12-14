"use client";

import React, { useMemo, useState } from "react";
import DrawerWrapper from "../../../../components/global/drawer-wrapper";
import { Typography } from "@/components/typography";
import { Plus, Heart, ImageIcon, Check } from "lucide-react";
import { Collection } from "./add-to-collection-dialog";
import NewCollectionDrawer from "./new-collection-drawer";
import { useGetMyCollections, useGetCollectionsByAd } from "@/hooks/useCollections";
import { addAdsToCollection, removeAdFromCollection } from "@/app/api/collections/collections.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionsQueries } from "@/app/api/collections/index";
import type { CollectionByAd } from "@/interfaces/collections.types";
import Image from "next/image";
import { useAuthStore } from "@/stores/authStore";
import { usePathname } from "next/navigation";
import { LoginRequiredDialog } from "@/components/auth/login-required-dialog";

export interface CollectionDrawerProps {
  trigger: React.ReactNode;
  className?: string;
  adId?: string | null;
  collections?: Collection[];
  onAddToCollection?: (adId: string, collectionId: string) => void;
}

const CollectionDrawer: React.FC<CollectionDrawerProps> = ({
  trigger,
  className,
  adId,
  collections: externalCollections,
  onAddToCollection: externalOnAddToCollection,
}) => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  
  // Track optimistic updates for immediate UI feedback
  // Tracks collections that have been toggled (added or removed)
  const [optimisticToggles, setOptimisticToggles] = useState<Map<string, boolean>>(new Map());

  // Hooks automatically check authentication internally
  const { data: collectionsResponse } = useGetMyCollections();
  const { data: collectionsByAdResponse } = useGetCollectionsByAd(adId || "");

  // Get collection IDs that contain this ad
  const adCollectionIds = useMemo(() => {
    if (!collectionsByAdResponse?.data?.collections || !adId) return [];
    return collectionsByAdResponse.data.collections.map(
      (collection: CollectionByAd) => collection.collectionId
    );
  }, [collectionsByAdResponse, adId]);
  
  // Combine API data with optimistic updates
  const effectiveCollectionIds = useMemo(() => {
    const baseIds = new Set(adCollectionIds);
    // Apply optimistic toggles
    optimisticToggles.forEach((shouldBeSelected, collectionId) => {
      if (shouldBeSelected) {
        baseIds.add(collectionId);
      } else {
        baseIds.delete(collectionId);
      }
    });
    return Array.from(baseIds);
  }, [adCollectionIds, optimisticToggles]);

  // Add ad to collection mutation
  const addAdMutation = useMutation({
    mutationFn: ({ collectionId, adId }: { collectionId: string; adId: string }) =>
      addAdsToCollection(collectionId, { adIds: [adId] }),
    onMutate: async ({ collectionId }) => {
      // Optimistic update - immediately show as selected
      setOptimisticToggles((prev) => {
        const next = new Map(prev);
        next.set(collectionId, true);
        return next;
      });
    },
    onSuccess: () => {
      // Clear optimistic update and refresh data
      setOptimisticToggles(new Map());
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getMyCollections.Key,
      });
      if (adId) {
        queryClient.invalidateQueries({
          queryKey: collectionsQueries.getCollectionsByAd(adId).Key,
        });
      }
    },
    onError: (_, { collectionId }) => {
      // Rollback optimistic update on error
      setOptimisticToggles((prev) => {
        const next = new Map(prev);
        next.delete(collectionId);
        return next;
      });
    },
  });

  // Remove ad from collection mutation
  const removeAdMutation = useMutation({
    mutationFn: ({ collectionId, adId }: { collectionId: string; adId: string }) =>
      removeAdFromCollection(collectionId, adId),
    onMutate: async ({ collectionId }) => {
      // Optimistic update - immediately show as not selected
      setOptimisticToggles((prev) => {
        const next = new Map(prev);
        next.set(collectionId, false);
        return next;
      });
    },
    onSuccess: () => {
      // Clear optimistic update and refresh data
      setOptimisticToggles(new Map());
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getMyCollections.Key,
      });
      if (adId) {
        queryClient.invalidateQueries({
          queryKey: collectionsQueries.getCollectionsByAd(adId).Key,
        });
      }
    },
    onError: (_, { collectionId }) => {
      // Rollback optimistic update on error
      setOptimisticToggles((prev) => {
        const next = new Map(prev);
        next.delete(collectionId);
        return next;
      });
    },
  });

  // Transform API collections to match Collection format
  const transformedCollections: Collection[] = useMemo(() => {
    // If external collections are provided, merge with isSelected state
    if (externalCollections) {
      return externalCollections.map((collection) => ({
        ...collection,
        isSelected: effectiveCollectionIds.includes(collection.id) || collection.isSelected,
      }));
    }
    
    if (!collectionsResponse?.data) return [];
    
    return collectionsResponse.data.map((collection) => ({
      id: collection._id,
      name: collection.name,
      count: collection.count || 0,
      images: collection.images || [],
      isSelected: effectiveCollectionIds.includes(collection._id),
    }));
  }, [collectionsResponse, effectiveCollectionIds, externalCollections]);

  const handleCollectionSelect = async (collectionId: string) => {
    if (!adId) {
      console.warn("Cannot add to collection: adId is not provided");
      return;
    }

    try {
      const isInCollection = effectiveCollectionIds.includes(collectionId);
      
      if (isInCollection) {
        // Remove from collection if already present
        await removeAdMutation.mutateAsync({ collectionId, adId });
      } else {
        // Add to collection if not present
        await addAdMutation.mutateAsync({ collectionId, adId });
      }
      
      // Call external handler if provided
      externalOnAddToCollection?.(adId, collectionId);
    } catch (error) {
      console.error("Error toggling ad in collection:", error);
    }
  };
  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      setIsLoginDialogOpen(true);
      return;
    }
  };

  // Only render drawer if authenticated, otherwise just show login dialog on click
  if (!isAuthenticated) {
    return (
      <>
        <div onClick={handleTriggerClick}>{trigger}</div>
        <LoginRequiredDialog
          open={isLoginDialogOpen}
          onOpenChange={setIsLoginDialogOpen}
          redirectUrl={pathname}
          message="You need to be logged in to save ads to collections. Would you like to login?"
        />
      </>
    );
  }

  return (
    <>
      <DrawerWrapper
        title="Favorites"
        trigger={trigger}
        direction="bottom"
        className={className}
      >
      <div className="space-y-4 p-4">
        {/* Create New Collection - First Item */}
        <NewCollectionDrawer
          trigger={
            <div className="flex items-center gap-3 cursor-pointer transition-colors group">
              <div className="size-10 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <Typography
                variant="body-small"
                className="font-medium text-dark-blue group-hover:text-purple"
              >
                Create new list
              </Typography>
            </div>
          }
          onCollectionCreated={() => {
            // Invalidate queries to refresh collections list
            queryClient.invalidateQueries({
              queryKey: collectionsQueries.getMyCollections.Key,
            });
            if (adId) {
              queryClient.invalidateQueries({
                queryKey: collectionsQueries.getCollectionsByAd(adId).Key,
              });
            }
          }}
        ></NewCollectionDrawer>

        {/* Collections List */}
        <div className="space-y-0">
          {transformedCollections.length > 0 ? (
            transformedCollections.map((collection) => {
              const isSelected = collection.isSelected;
              return (
                <div
                  key={collection.id}
                  onClick={() => handleCollectionSelect(collection.id)}
                  className={`flex group items-center justify-between py-1 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-purple-50 hover:bg-purple-100"
                      : "hover:bg-purple-50"
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-sm overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      {collection.images?.[0] ? (
                        <Image
                          src={collection.images[0]}
                          alt={collection.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography
                        variant="sm-semibold"
                        className={`${
                          isSelected
                            ? "text-purple"
                            : "text-dark-blue group-hover:text-purple"
                        }`}
                      >
                        {collection.name}
                      </Typography>
                      <Typography
                        variant="xs-regular"
                        className={`${
                          isSelected
                            ? "text-purple/80"
                            : "text-grey-blue group-hover:text-purple"
                        }`}
                      >
                        {collection.count} Favorites
                      </Typography>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-purple text-white"
                          : "bg-gray-300 group-hover:bg-purple/10"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <Plus
                          className={`h-4 w-4 ${
                            isSelected
                              ? "text-white"
                              : "text-gray-600 group-hover:text-purple"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-gray-400" />
              </div>
              <Typography variant="body-small" className="text-grey-blue">
                No collections found
              </Typography>
              <Typography variant="body-small" className="text-gray-400">
                Create your first collection to get started
              </Typography>
            </div>
          )}
        </div>
      </div>
    </DrawerWrapper>
    <LoginRequiredDialog
      open={isLoginDialogOpen}
      onOpenChange={setIsLoginDialogOpen}
      redirectUrl={pathname}
      message="You need to be logged in to save ads to collections. Would you like to login?"
    />
    </>
  );
};

export default CollectionDrawer;
