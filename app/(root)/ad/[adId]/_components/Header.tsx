"use client";

import React, { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Share2, Heart, ChevronLeft } from "lucide-react";
import AddToCollectionDialog from "@/app/(root)/favorites/_components/add-to-collection-dialog";
import { AD } from "@/interfaces/ad";
import { useGetMyCollections, useGetCollectionsByAd } from "@/hooks/useCollections";
import { addAdsToCollection, removeAdFromCollection } from "@/app/api/collections/collections.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionsQueries } from "@/app/api/collections/index";
import type { Collection as AddToCollectionDialogCollection } from "@/app/(root)/favorites/_components/add-to-collection-dialog";
import type { CollectionByAd } from "@/interfaces/collections.types";
import { useAuthStore } from "@/stores/authStore";
import { LoginRequiredDialog } from "@/components/auth/login-required-dialog";

interface HeaderProps {
  ad: AD;
}

const Header: React.FC<HeaderProps> = ({ ad }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Hooks automatically check authentication internally
  const { data: collectionsResponse } = useGetMyCollections();
  const { data: collectionsByAdResponse } = useGetCollectionsByAd(ad._id);

  // Get collection IDs that contain this ad
  const adCollectionIds = useMemo(() => {
    if (!collectionsByAdResponse?.data?.collections) return [];
    return collectionsByAdResponse.data.collections.map(
      (collection: CollectionByAd) => collection.collectionId
    );
  }, [collectionsByAdResponse]);

  // Check if ad is in any collection
  const isAdInCollection =
    collectionsByAdResponse?.data?.isAddedInCollection ?? false;

  // Add ad to collection mutation
  const addAdMutation = useMutation({
    mutationFn: ({ collectionId, adId }: { collectionId: string; adId: string }) =>
      addAdsToCollection(collectionId, { adIds: [adId] }),
    onSuccess: () => {
      // Invalidate collections to refresh the count and ad collections
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getMyCollections.Key,
      });
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getCollectionsByAd(ad._id).Key,
      });
      setIsOpen(false);
    },
  });

  // Remove ad from collection mutation
  const removeAdMutation = useMutation({
    mutationFn: ({ collectionId, adId }: { collectionId: string; adId: string }) =>
      removeAdFromCollection(collectionId, adId),
    onSuccess: () => {
      // Invalidate collections to refresh the count and ad collections
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getMyCollections.Key,
      });
      queryClient.invalidateQueries({
        queryKey: collectionsQueries.getCollectionsByAd(ad._id).Key,
      });
      setIsOpen(false);
    },
  });

  // Transform API collections to match AddToCollectionDialog format
  const transformedCollections: AddToCollectionDialogCollection[] = useMemo(() => {
    if (!collectionsResponse?.data) return [];
    
    return collectionsResponse.data.map((collection) => ({
      id: collection._id,
      name: collection.name,
      count: collection.count || 0,
      images: collection.images || [],
      isSelected: adCollectionIds.includes(collection._id),
    }));
  }, [collectionsResponse, adCollectionIds]);

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    // Implement share functionality
    console.log("Share clicked");
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      setIsLoginDialogOpen(true);
    } else {
      
      setIsOpen(true);
    }
  };

  const handleAddToCollection = async (adId: string, collectionId: string) => {
    try {
      const isInCollection = adCollectionIds.includes(collectionId);
      if (isInCollection) {
        // Remove from collection if already present
        await removeAdMutation.mutateAsync({ collectionId, adId });
      } else {
        // Add to collection if not present
        await addAdMutation.mutateAsync({ collectionId, adId });
      }
    } catch (error) {
      console.error("Error toggling ad in collection:", error);
    }
  };

  const handleCreateNewCollection = () => {
    // This will be handled by the CreateCollectionDialog
    // The dialog will open when the user clicks "Create new list"
  };

  return (
    <div className="flex items-center justify-between py-3 sm:mt-4 px-4 xl:px-0 relative">
      {/* Left side - Back button */}
      <button
        onClick={handleBack}
        className="py-0 text-purple hover:font-semibold transition-all flex items-center gap-2 cursor-pointer hover:scale-110"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Right side - Share and Save */}
      <div className="hidden sm:flex items-center gap-2 z-10 sm:gap-4">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent text-gray-600 hover:text-purple transition-all cursor-pointer hover:scale-110"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium sm:block hidden">Share</span>
        </button>

        {isAuthenticated ? (
          <AddToCollectionDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            adId={ad._id}
            adTitle={ad.title}
            adImage={ad.images?.[0] || "/car-image.jpg"}
            collections={transformedCollections}
            onAddToCollection={handleAddToCollection}
            onCreateNewCollection={handleCreateNewCollection}
          >
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent transition-all cursor-pointer hover:scale-110 ${
                isAdInCollection
                  ? "text-purple hover:text-purple"
                  : "text-gray-600 hover:text-purple"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${
                  isAdInCollection ? "fill-purple text-purple" : ""
                }`}
              />
              <span className="text-sm font-medium sm:block hidden">Save</span>
            </button>
          </AddToCollectionDialog>
        ) : (
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 bg-white border p-2 rounded-full sm:p-0 sm:rounded-none shadow sm:shadow-none sm:border-none sm:bg-transparent transition-all cursor-pointer hover:scale-110 ${
              isAdInCollection
                ? "text-purple hover:text-purple"
                : "text-gray-600 hover:text-purple"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                isAdInCollection ? "fill-purple text-purple" : ""
              }`}
            />
            <span className="text-sm font-medium sm:block hidden">Save</span>
          </button>
        )}
      </div>

      {/* Login Required Dialog */}
      <LoginRequiredDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
        redirectUrl={pathname}
        message="You need to be logged in to save ads to collections. Would you like to login?"
      />
    </div>
  );
};

export default Header;

