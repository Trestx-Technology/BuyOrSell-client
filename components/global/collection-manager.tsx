"use client";

import React, { useState, useCallback } from "react";
import { Heart, Plus, X, Check, ImageIcon, Loader2 } from "lucide-react";

/**
 * USAGE EXAMPLES:
 *
 * // Basic usage with an ad
 * <CollectionManager itemId="ad123" itemTitle="iPhone 15">
 *   <Button>Add to Favorites</Button>
 * </CollectionManager>
 *
 * // With custom success callback
 * <CollectionManager
 *   itemId="job456"
 *   itemType="job"
 *   onSuccess={() => toast.success("Added to collection!")}
 * >
 *   <HeartIcon />
 * </CollectionManager>
 *
 * // With item details for preview
 * <CollectionManager
 *   itemId="ad789"
 *   itemTitle="MacBook Pro"
 *   itemImage="/macbook.jpg"
 *   variant="drawer"
 * >
 *   <Button variant="outline">Save</Button>
 * </CollectionManager>
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";
import {
  useGetMyCollections,
  useAddAdsToCollection,
  useRemoveAdFromCollection,
} from "@/hooks/useCollections";
import { collectionsQueries } from "@/app/api/collections/index";
import { useQueryClient } from "@tanstack/react-query";
import { CreateCollectionDialog } from "@/app/[locale]/(root)/favorites/_components/CreateCollectionDialog";
import { useAuthStore } from "@/stores/authStore";
import { LoginRequiredDialog } from "@/components/auth/login-required-dialog";
import { usePathname, useSearchParams } from "next/navigation";
import { adQueries } from "@/app/api/ad";

export interface Collection {
  _id: string;
  name: string;
  count?: number;
  adIds?: string[]; // Array of ad IDs in this collection
  images?: string[];
  isSelected?: boolean;
}

export interface CollectionManagerProps {
  children: React.ReactNode;
  itemId: string;
  itemType?: "ad" | "job"; // For future extension
  itemTitle?: string;
  itemImage?: string;
  onSuccess?: () => void;
  variant?: "dialog" | "drawer" | "inline";
  className?: string;
}

/**
 * CollectionManager - A reusable component for managing item collections
 *
 * Features:
 * - Add items to existing collections
 * - Remove items from collections
 * - Create new collections
 * - Multiple display variants (dialog, drawer, inline)
 * - Fully localized
 */
export const CollectionManager: React.FC<CollectionManagerProps> = ({
  children,
  itemId,
  itemType = "ad",
  itemTitle,
  itemImage,
  onSuccess,
  variant = "dialog",
  className,
}) => {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Only fetch collections when dialog is open and user is authenticated
  const { data: collectionsResponse, isLoading: isLoadingCollections } =
    useGetMyCollections(undefined, {
      enabled: open && isAuthenticated,
    });

  const addToCollectionMutation = useAddAdsToCollection();
  const removeFromCollectionMutation = useRemoveAdFromCollection();

  const collections = collectionsResponse?.data || [];

  // Handle adding item to collection
  const handleAddToCollection = useCallback(
    async (collectionId: string) => {
      try {
        await addToCollectionMutation.mutateAsync({
          collectionId,
          payload: {
            adIds: [itemId], // API expects array of ad IDs
          },
        });

        // // Optimistically update the collection's adIds array
        // queryClient.setQueryData(
        //   [...collectionsQueries.getMyCollections.Key],
        //   (oldData: CollectionsListResponse | undefined) => {
        //     if (!oldData?.data) return oldData;
        //     return {
        //       ...oldData,
        //       data: oldData.data.map((collection) =>
        //         collection._id === collectionId
        //           ? {
        //               ...collection,
        //               adIds: [...(collection.adIds || []), itemId],
        //               count: (collection.count || 0) + 1,
        //             }
        //           : collection
        //       ),
        //     };
        //   }
        // );

        queryClient.invalidateQueries({
          queryKey: adQueries.ads.Key,
        });

        onSuccess?.();
        setOpen(false);
      } catch (error) {
        console.error("Error adding to collection:", error);
      }
    },
    [itemId, addToCollectionMutation, onSuccess, queryClient]
  );

  // Handle removing item from collection
  const handleRemoveFromCollection = useCallback(
    async (collectionId: string) => {
      try {
        await removeFromCollectionMutation.mutateAsync({
          collectionId,
          adId: itemId,
        });

        // // Optimistically update the collection's adIds array
        // queryClient.setQueryData(
        //   [...collectionsQueries.getMyCollections.Key],
        //   (oldData: CollectionsListResponse | undefined) => {
        //     if (!oldData?.data) return oldData;
        //     return {
        //       ...oldData,
        //       data: oldData.data.map((collection) =>
        //         collection._id === collectionId
        //           ? {
        //               ...collection,
        //               adIds: (collection.adIds || []).filter(
        //                 (id) => id !== itemId
        //               ),
        //               count: Math.max((collection.count || 0) - 1, 0),
        //             }
        //           : collection
        //       ),
        //     };
        //   }
        // );

        // Invalidate queries to ensure server state is synced
        queryClient.invalidateQueries({
          queryKey: adQueries.ads.Key,
        });

        onSuccess?.();
      } catch (error) {
        console.error("Error removing from collection:", error);
      }
    },
    [itemId, removeFromCollectionMutation, onSuccess, queryClient]
  );

  // Handle collection creation success
  const handleCollectionCreated = useCallback(() => {
    // Invalidate queries to update the UI
    queryClient.invalidateQueries({
      queryKey: collectionsQueries.getMyCollections.Key,
    });
    console.log("Collection created successfully");
  }, [queryClient]);

  // Check if item is in a specific collection by checking adIds array
  const isItemInCollection = useCallback(
    (collection: Collection) => {
      // Check if adId exists in the collection's adIds array
      return collection.adIds?.includes(itemId) ?? false;
    },
    [itemId]
  );

  const renderCollectionItem = (collection: Collection) => {
    const isInCollection = isItemInCollection(collection);
    const isLoading =
      addToCollectionMutation.isPending ||
      removeFromCollectionMutation.isPending;

    return (
      <div
        key={collection._id}
        className={`flex group items-center justify-between py-3 px-2 cursor-pointer transition-colors rounded-lg ${
          isInCollection
            ? "bg-purple-50 hover:bg-purple-100 border border-purple-200"
            : "hover:bg-purple-50"
        }`}
        onClick={() => {
          if (!isLoading) {
            if (isInCollection) {
              handleRemoveFromCollection(collection._id);
            } else {
              handleAddToCollection(collection._id);
            }
          }
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
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
              className={`truncate ${
                isInCollection
                  ? "text-purple"
                  : "text-dark-blue group-hover:text-purple"
              }`}
            >
              {collection.name}
            </Typography>
            <Typography
              variant="xs-regular"
              className={`${
                isInCollection
                  ? "text-purple/80"
                  : "text-grey-blue group-hover:text-purple"
              }`}
            >
              {collection.count ?? collection.adIds?.length ?? 0}{" "}
              {t.favorites.items}
            </Typography>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isInCollection
                ? "bg-purple text-white"
                : "bg-gray-300 group-hover:bg-purple/10"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isInCollection ? (
              <Check className="h-4 w-4 text-white" />
            ) : (
              <Plus
                className={`h-4 w-4 ${
                  isInCollection
                    ? "text-white"
                    : "text-gray-600 group-hover:text-purple"
                }`}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const content = (
    <div className="space-y-4">
      {/* Create New Collection */}
      <CreateCollectionDialog onCollectionCreated={handleCollectionCreated}>
        <div className="flex items-center gap-3 cursor-pointer transition-colors group p-3 rounded-lg hover:bg-purple-50">
          <div className="size-10 bg-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-all">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <Typography
            variant="body-small"
            className="font-medium text-dark-blue group-hover:text-purple"
          >
            {t.favorites ? t.favorites.myFavorites : "Create new list"}
          </Typography>
        </div>
      </CreateCollectionDialog>

      {/* Collections List */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {isLoadingCollections ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-purple" />
            <Typography variant="body-small" className="text-gray-500">
              {t.common?.loading || "Loading collections..."}
            </Typography>
          </div>
        ) : collections.length > 0 ? (
          collections.map(renderCollectionItem)
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-gray-400" />
            </div>
            <Typography variant="body-small" className="text-grey-blue mb-2">
              {t.favorites?.noFavoritesYet || "No collections found"}
            </Typography>
            <Typography variant="body-small" className="text-gray-400">
              {t.favorites?.startAddingItems ||
                "Create your first collection to get started"}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );

  // Handle trigger click - check authentication first and pass adId
  const handleTriggerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true);
    } else {
      // Open dialog with the current adId
      setOpen(true);
    }
  };

  // Get redirect URL for login - include pathname and search params
  const redirectUrl = React.useMemo(() => {
    const search = searchParams.toString();
    return search ? `${pathname}?${search}` : pathname;
  }, [pathname, searchParams]);

  // Clone children to add onClick handler
  const triggerElement = React.isValidElement(children) ? (
    React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        // Call original onClick if it exists
        if ((children as React.ReactElement<any>).props.onClick) {
          (children as React.ReactElement<any>).props.onClick(e);
        }
        handleTriggerClick(e);
      },
    })
  ) : (
    <div onClick={handleTriggerClick}>{children}</div>
  );

  if (variant === "dialog") {
    return (
      <>
        {triggerElement}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={`max-w-md w-[95%] overflow-y-auto max-h-[500px] rounded-lg ${className}`}
            showCloseButton={false}
          >
            <DialogHeader className="pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-dark-blue">
                  {t.favorites?.myFavorites || "Favorites"}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
        <LoginRequiredDialog
          open={isLoginDialogOpen}
          onOpenChange={setIsLoginDialogOpen}
          redirectUrl={redirectUrl}
          message="You need to be logged in to save items to collections. Would you like to login?"
        />
      </>
    );
  }

  // For other variants, you can implement drawer or inline versions
  return <div className={className}>{content}</div>;
};

export default CollectionManager;
