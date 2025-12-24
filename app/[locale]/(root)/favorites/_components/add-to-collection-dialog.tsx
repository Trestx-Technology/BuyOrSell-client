"use client";

import React from "react";
import { X, Plus, Heart, Check, ImageIcon } from "lucide-react";
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
import { mockAds } from "@/constants/sample-listings";
import { CreateCollectionDialog } from "@/app/(root)/favorites/_components/CreateCollectionDialog";

export interface Collection {
  id: string;
  name: string;
  count: number;
  images: string[];
  isSelected?: boolean;
}

export interface AddToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adId: string | null;
  adTitle?: string;
  adImage?: string;
  collections?: Collection[];
  onAddToCollection?: (adId: string, collectionId: string) => void;
  onCreateNewCollection?: () => void;
  className?: string;
  children?: React.ReactElement;
}

const dummyCollections: Collection[] = [
  {
    id: "1",
    name: "Collection 1",
    count: 10,
    images: [mockAds[0].images[0]],
  },
  {
    id: "2",
    name: "Collection 1",
    count: 10,
    images: [mockAds[1].images[1]],
  },
  {
    id: "3",
    name: "Collection 1",
    count: 10,
    images: [mockAds[2].images[0]],
  },
  {
    id: "4",
    name: "Collection 1",
    count: 10,
    images: [mockAds[3].images[0]],
  },
];

const AddToCollectionDialog: React.FC<AddToCollectionDialogProps> = ({
  open,
  onOpenChange,
  adId,
  collections = dummyCollections,
  onAddToCollection,
  onCreateNewCollection,
  className,
  children,
}) => {
  const handleCollectionSelect = (collectionId: string) => {
    // Immediately add the item to the selected collection
    if (adId) {
      onAddToCollection?.(adId, collectionId);
      onOpenChange(false);
    }
  };

  const handleCreateNew = () => {
    // Don't close the parent dialog - let CreateCollectionDialog open on top
    onCreateNewCollection?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        className={`max-w-md w-[95%] overflow-y-auto max-h-[450px] rounded-lg ${className}`}
        showCloseButton={false}
      >
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-dark-blue">
              Favorites
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Create New Collection - First Item */}
          <CreateCollectionDialog onCollectionCreated={handleCreateNew}>
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
          </CreateCollectionDialog>

          {/* Collections List */}
          <div className="space-y-0">
            {collections.length > 0 ? (
              collections.map((collection) => {
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
      </DialogContent>
    </Dialog>
  );
};

export default AddToCollectionDialog;
