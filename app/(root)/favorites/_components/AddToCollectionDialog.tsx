"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { mockAds } from "@/constants/sample-listings";

interface Collection {
  id: string;
  name: string;
  count: number;
  thumbnail: string;
}

interface AddToCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adId: string | null;
  collections: Collection[];
}

export function AddToCollectionDialog({
  open,
  onOpenChange,
  adId,
  collections,
}: AddToCollectionDialogProps) {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  const handleAddToCollection = () => {
    if (selectedCollection) {
      // Here you would typically make an API call to add the ad to the collection
      console.log(`Adding ad ${adId} to collection ${selectedCollection}`);
      onOpenChange(false);
      setSelectedCollection(null);
    }
  };

  const handleCreateNew = () => {
    onOpenChange(false);
    // This would trigger the create collection dialog
  };

  // Find the selected ad
  const selectedAd = mockAds.find((ad) => ad.id.toString() === adId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Favorites
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Collections List */}
          <div className="space-y-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCollection === collection.id
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded border overflow-hidden">
                    {typeof collection.thumbnail === "string" && (
                      <img
                        src={collection.thumbnail}
                        alt={collection.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <Typography
                      variant="body-sm"
                      className="font-semibold text-gray-900"
                    >
                      {collection.name}
                    </Typography>
                    <Typography variant="body-xs" className="text-gray-500">
                      {collection.count} Favorites
                    </Typography>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-1 h-6 w-6 rounded-full ${
                    selectedCollection === collection.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>

          {/* Create New Collection Option */}
          <div
            onClick={handleCreateNew}
            className="flex items-center gap-3 p-4 border-2 border-dashed border-purple-300 rounded-lg cursor-pointer hover:border-purple-400 transition-colors"
          >
            <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            <Typography
              variant="body-sm"
              className="font-medium text-purple-600"
            >
              Create new list
            </Typography>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddToCollection}
              disabled={!selectedCollection}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Add to Collection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
